// Bro Notes - Modular Content Script
// This is the main entry point that loads all modules

// Load all modules in order
(function() {
  'use strict';

  // Create script loader helper
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(src);
      script.onload = resolve;
      script.onerror = reject;
      (document.head || document.documentElement).appendChild(script);
    });
  }

  // Load all modules in sequence
  async function loadModules() {
    try {
      // Core utilities
      await loadScript('js/utils.js');
      await loadScript('js/storage.js');
      await loadScript('js/ui.js');
      
      // Drawer template
      await loadScript('js/drawer.js');
      
      // View controllers
      await loadScript('js/views/home.js');
      await loadScript('js/views/allnotes.js');
      await loadScript('js/views/editor.js');
      await loadScript('js/views/labels.js');
      await loadScript('js/views/settings.js');
      
      // Main app controller (must be last)
      await loadScript('js/app.js');
      
      console.log('Bro Notes: All modules loaded successfully');
    } catch (error) {
      console.error('Bro Notes: Error loading modules:', error);
    }
  }

  // Start loading modules
  loadModules();
})();
