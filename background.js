// Background service worker untuk mengelola global state
let globalEnabled = false;

// Initialize state saat extension pertama kali diinstall
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Bro Notes: Extension installed');
  const result = await chrome.storage.local.get(['globalEnabled']);
  globalEnabled = result.globalEnabled ?? false;
  console.log('Bro Notes: Initial state:', globalEnabled);
  updateIcon(globalEnabled);
});

// Load state saat service worker dimulai
chrome.storage.local.get(['globalEnabled'], (result) => {
  globalEnabled = result.globalEnabled ?? false;
  console.log('Bro Notes: Service worker started, state:', globalEnabled);
  updateIcon(globalEnabled);
});

// Toggle drawer saat icon extension diklik
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Bro Notes: Icon clicked, current state:', globalEnabled);
  globalEnabled = !globalEnabled;
  console.log('Bro Notes: New state:', globalEnabled);
  
  // Simpan state ke storage
  await chrome.storage.local.set({ globalEnabled });
  
  // Update icon
  updateIcon(globalEnabled);
  
  // Kirim pesan ke semua tabs untuk toggle drawer
  const tabs = await chrome.tabs.query({});
  console.log('Bro Notes: Sending message to', tabs.length, 'tabs');
  
  for (const t of tabs) {
    // Skip chrome:// dan chrome-extension:// pages
    if (t.url && (t.url.startsWith('chrome://') || t.url.startsWith('chrome-extension://'))) {
      console.log('Bro Notes: Skipping chrome internal page:', t.id);
      continue;
    }
    
    try {
      await chrome.tabs.sendMessage(t.id, {
        action: 'toggleDrawer',
        enabled: globalEnabled
      });
      console.log('Bro Notes: Message sent successfully to tab', t.id);
    } catch (error) {
      // Content script belum ready, coba inject
      console.log('Bro Notes: Content script not ready in tab', t.id, '- trying to inject');
      
      try {
        // Inject content script secara manual
        await chrome.scripting.executeScript({
          target: { tabId: t.id },
          files: [
            'js/utils.js',
            'js/quotes.js',
            'js/storage.js',
            'js/ui.js',
            'js/drawer.js',
            'js/views/home.js',
            'js/views/allnotes.js',
            'js/views/editor.js',
            'js/views/labels.js',
            'js/views/settings.js',
            'js/app.js'
          ]
        });
        
        console.log('Bro Notes: Content script injected to tab', t.id);
        
        // Tunggu sebentar lalu kirim message lagi
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(t.id, {
              action: 'toggleDrawer',
              enabled: globalEnabled
            });
            console.log('Bro Notes: Message sent after injection to tab', t.id);
          } catch (e) {
            console.log('Bro Notes: Still could not send message to tab', t.id);
          }
        }, 100);
      } catch (injectError) {
        console.log('Bro Notes: Could not inject to tab', t.id, injectError.message);
      }
    }
  }
});

// Update icon berdasarkan state
function updateIcon(enabled) {
  console.log('Bro Notes: Updating icon, enabled:', enabled);
  
  // Set badge untuk visual feedback
  chrome.action.setBadgeText({
    text: enabled ? 'ON' : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? '#28a745' : '#dc3545'
  });
  
  const iconPath = enabled ? 'icons/icon' : 'icons/icon-disabled';
  
  chrome.action.setIcon({
    path: {
      16: `${iconPath}16.png`,
      32: `${iconPath}32.png`,
      48: `${iconPath}48.png`,
      128: `${iconPath}128.png`
    }
  }).then(() => {
    console.log('Bro Notes: Icon updated successfully');
  }).catch((error) => {
    console.error('Bro Notes: Error updating icon:', error);
  });
  
  chrome.action.setTitle({
    title: enabled ? 'Bro Notes (Aktif)' : 'Bro Notes (Nonaktif)'
  });
}

// Listen untuk pesan dari content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getGlobalState') {
    sendResponse({ enabled: globalEnabled });
  }
  return true;
});
