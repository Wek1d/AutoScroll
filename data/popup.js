document.addEventListener('DOMContentLoaded', function() {
  // Dark mode sync
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.toggle('dark-mode', isDark);

  // Get elements
  const speedSlider = document.querySelector('.slider');
  const iconOptions = document.querySelectorAll('.icon-option');
  const accelerationToggle = document.getElementById('acceleration');
  const edgeScrollToggle = document.getElementById('edgeScroll');
  const testBtn = document.querySelector('.btn');
  const resetBtn = document.querySelector('.btn.secondary');

  // Load SVG previews
  function loadPreviews() {
    ['both', 'horizontal', 'vertical'].forEach(icon => {
      const modernPreview = document.querySelector('.modern-preview');
      const classicPreview = document.querySelector('.classic-preview');
      
      const modernImg = document.createElement('img');
      modernImg.src = `images/origin/${icon}.svg`;
      modernPreview.appendChild(modernImg);
      
      const classicImg = document.createElement('img');
      classicImg.src = `images/origin/${icon}-alt.svg`;
      classicPreview.appendChild(classicImg);
    });
  }
  loadPreviews();

  // Load saved settings
  chrome.storage.local.get({
    moveSpeed: 10,
    iconStyle: 'modern',
    acceleration: true,
    edgeScroll: false
  }, function(data) {
    // Fix: Now slider value matches labels (1 = slower, 50 = faster)
    speedSlider.value = data.moveSpeed; 
    
    // Update icon selection
    document.querySelector(`[data-style="${data.iconStyle}"]`)
      .classList.add('selected');
    
    // Load other settings
    accelerationToggle.checked = data.acceleration;
    edgeScrollToggle.checked = data.edgeScroll;
  });

  // Save settings
  speedSlider.addEventListener('input', function() {
    // Now saving direct value (1 = slower, 50 = faster)
    chrome.storage.local.set({ moveSpeed: Number(this.value) });
  });

  // Icon style selector
  iconOptions.forEach(option => {
    option.addEventListener('click', function() {
      iconOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      chrome.storage.local.set({ 
        iconStyle: this.dataset.style 
      });
    });
  });

  // Additional settings
  accelerationToggle.addEventListener('change', function() {
    chrome.storage.local.set({ acceleration: this.checked });
  });

  edgeScrollToggle.addEventListener('change', function() {
    chrome.storage.local.set({ edgeScroll: this.checked });
  });

  // Test button
  testBtn.addEventListener('click', function() {
    alert('Middle-click or Ctrl+Left-click anywhere to test AutoScroll!');
  });

  // Reset button  
  resetBtn.addEventListener('click', function() {
    if (confirm('Reset all settings to default?')) {
      chrome.storage.local.set({
        moveSpeed: 10,
        iconStyle: 'modern',
        acceleration: true,
        edgeScroll: false
      }, function() {
        speedSlider.value = 10;
        iconOptions.forEach(opt => opt.classList.remove('selected'));
        document.querySelector('[data-style="modern"]').classList.add('selected');
        accelerationToggle.checked = true;
        edgeScrollToggle.checked = false;
      });
    }
  });
});