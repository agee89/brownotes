// Button press effects utility
const ButtonEffects = {
  // Add press effect to buttons
  init() {
    // Delegate event for all buttons with press effect
    document.addEventListener('mousedown', (e) => {
      const button = e.target.closest('button, select, .bn-icon-toggle');
      if (!button) return;
      
      // Skip if button is disabled
      if (button.disabled) return;
      
      // Determine scale based on button type
      let scale = '0.98';
      if (button.classList.contains('bn-toolbar-button')) {
        scale = '0.94';
      } else if (button.id === 'bn-btn-drawer-ribbon' || 
                 button.id === 'bn-btn-transparency' || 
                 button.id === 'bn-btn-theme') {
        scale = '0.94';
      } else if (button.id === 'bn-btn-drawer-ribbon') {
        scale = '0.96';
      }
      
      button.style.transform = `scale(${scale})`;
    });
    
    document.addEventListener('mouseup', (e) => {
      const button = e.target.closest('button, select, .bn-icon-toggle');
      if (!button) return;
      button.style.transform = 'scale(1)';
    });
    
    document.addEventListener('mouseleave', (e) => {
      const button = e.target.closest('button, select, .bn-icon-toggle');
      if (!button) return;
      button.style.transform = 'scale(1)';
    }, true); // Use capture to catch all mouseleave events
  }
};
