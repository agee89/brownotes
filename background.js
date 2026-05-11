// Background service worker untuk mengelola global state
let globalEnabled = false;
const DRIVE_BACKUP_FILENAME = 'brownotes-sync.json';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

// Initialize state saat extension pertama kali diinstall
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Brow Notes: Extension installed');
  const result = await chrome.storage.local.get(['globalEnabled']);
  globalEnabled = result.globalEnabled ?? false;
  console.log('Brow Notes: Initial state:', globalEnabled);
  updateIcon(globalEnabled);
});

// Load state saat service worker dimulai
chrome.storage.local.get(['globalEnabled'], (result) => {
  globalEnabled = result.globalEnabled ?? false;
  console.log('Brow Notes: Service worker started, state:', globalEnabled);
  updateIcon(globalEnabled);
});

// Toggle drawer saat icon extension diklik
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Brow Notes: Icon clicked, current state:', globalEnabled);
  globalEnabled = !globalEnabled;
  console.log('Brow Notes: New state:', globalEnabled);
  
  // Simpan state ke storage
  await chrome.storage.local.set({ globalEnabled });
  
  // Update icon
  updateIcon(globalEnabled);
  
  // Kirim pesan ke semua tabs untuk toggle drawer
  const tabs = await chrome.tabs.query({});
  console.log('Brow Notes: Sending message to', tabs.length, 'tabs');
  
  for (const t of tabs) {
    // Skip chrome:// dan chrome-extension:// pages
    if (t.url && (t.url.startsWith('chrome://') || t.url.startsWith('chrome-extension://'))) {
      console.log('Brow Notes: Skipping chrome internal page:', t.id);
      continue;
    }
    
    try {
      await chrome.tabs.sendMessage(t.id, {
        action: 'toggleDrawer',
        enabled: globalEnabled
      });
      console.log('Brow Notes: Message sent successfully to tab', t.id);
    } catch (error) {
      // Content script belum ready, coba inject
      console.log('Brow Notes: Content script not ready in tab', t.id, '- trying to inject');
      
      try {
        // Inject content script secara manual
        await chrome.scripting.executeScript({
          target: { tabId: t.id },
          files: [
            'js/constants.js',
            'js/helpers/utils.js',
            'js/renderers/markdown-renderer.js',
            'js/renderers/print-styles.js',
            'js/helpers/drawer-helpers.js',
            'js/data/quotes.js',
            'js/storage/core.js',
            'js/storage/notes.js',
            'js/storage/labels.js',
            'js/storage/settings.js',
            'js/storage.js',
            'js/data/templates.js',
            'js/helpers/button-effects.js',
            'js/ui.js',
            'js/drawer.js',
            'js/views/home.js',
            'js/views/allnotes.js',
            'js/views/editor.js',
            'js/views/labels.js',
            'js/views/trash.js',
            'js/views/settings.js',
            'js/app.js'
          ]
        });
        
        console.log('Brow Notes: Content script injected to tab', t.id);
        
        // Tunggu sebentar lalu kirim message lagi
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(t.id, {
              action: 'toggleDrawer',
              enabled: globalEnabled
            });
            console.log('Brow Notes: Message sent after injection to tab', t.id);
          } catch (e) {
            console.log('Brow Notes: Still could not send message to tab', t.id);
          }
        }, 100);
      } catch (injectError) {
        console.log('Brow Notes: Could not inject to tab', t.id, injectError.message);
      }
    }
  }
});

// Update icon berdasarkan state
function updateIcon(enabled) {
  console.log('Brow Notes: Updating icon, enabled:', enabled);
  
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
    console.log('Brow Notes: Icon updated successfully');
  }).catch((error) => {
    console.error('Brow Notes: Error updating icon:', error);
  });
  
  chrome.action.setTitle({
    title: enabled ? 'Brow Notes (Aktif)' : 'Brow Notes (Nonaktif)'
  });
}

// Listen untuk pesan dari content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getGlobalState') {
    sendResponse({ enabled: globalEnabled });
    return true;
  }

  if (request.action === 'googleDriveBackup') {
    handleGoogleDriveBackup(request.data, request.interactive !== false)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (request.action === 'googleDriveRestore') {
    handleGoogleDriveRestore()
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (request.action === 'googleDriveDisconnect') {
    handleGoogleDriveDisconnect()
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return true;
});

function getGoogleAuthToken(interactive = true) {
  return new Promise((resolve, reject) => {
    if (!chrome.identity?.getAuthToken) {
      reject(new Error('Chrome identity API is not available.'));
      return;
    }

    chrome.identity.getAuthToken({ interactive }, (token) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }

      if (!token) {
        reject(new Error('Google authorization was cancelled.'));
        return;
      }

      resolve(token);
    });
  });
}

async function fetchGoogleDrive(path, options = {}) {
  const token = await getGoogleAuthToken(options.interactive !== false);
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    await removeCachedToken(token);
  }

  if (!response.ok) {
    const message = await readGoogleError(response);
    throw new Error(message);
  }

  return response;
}

async function readGoogleError(response) {
  try {
    const body = await response.json();
    return body?.error?.message || `Google Drive request failed (${response.status})`;
  } catch (error) {
    return `Google Drive request failed (${response.status})`;
  }
}

function removeCachedToken(token) {
  return new Promise((resolve) => {
    if (!token || !chrome.identity?.removeCachedAuthToken) {
      resolve();
      return;
    }

    chrome.identity.removeCachedAuthToken({ token }, () => resolve());
  });
}

async function findDriveBackupFile(interactive = true) {
  const query = encodeURIComponent(`name='${DRIVE_BACKUP_FILENAME}' and trashed=false`);
  const fields = encodeURIComponent('files(id,name,modifiedTime,size)');
  const response = await fetchGoogleDrive(`${DRIVE_API_BASE}/files?q=${query}&spaces=appDataFolder&fields=${fields}`, { interactive });
  const result = await response.json();
  return result.files?.[0] || null;
}

function createDriveMultipartBody(metadata, data) {
  const boundary = `brownotes_${Date.now()}`;
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(data, null, 2),
    `--${boundary}--`
  ].join('\r\n');

  return { boundary, body };
}

async function uploadDriveBackup(data, interactive = true) {
  const existingFile = await findDriveBackupFile(interactive);
  const metadata = existingFile
    ? { name: DRIVE_BACKUP_FILENAME }
    : { name: DRIVE_BACKUP_FILENAME, parents: ['appDataFolder'] };
  const { boundary, body } = createDriveMultipartBody(metadata, {
    ...data,
    driveSyncedAt: new Date().toISOString()
  });
  const method = existingFile ? 'PATCH' : 'POST';
  const url = existingFile
    ? `${DRIVE_UPLOAD_BASE}/files/${existingFile.id}?uploadType=multipart&fields=id,modifiedTime,size`
    : `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,modifiedTime,size`;

  const response = await fetchGoogleDrive(url, {
    method,
    interactive,
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body
  });

  return response.json();
}

async function handleGoogleDriveBackup(data, interactive = true) {
  if (!data?.notes) {
    throw new Error('No notes data to back up.');
  }

  const file = await uploadDriveBackup(data, interactive);
  return {
    ok: true,
    fileId: file.id,
    modifiedTime: file.modifiedTime || null,
    size: file.size || null
  };
}

async function handleGoogleDriveRestore() {
  const file = await findDriveBackupFile();
  if (!file?.id) {
    throw new Error('No Google Drive backup found.');
  }

  const response = await fetchGoogleDrive(`${DRIVE_API_BASE}/files/${file.id}?alt=media`);
  const data = await response.json();
  return {
    ok: true,
    data,
    fileId: file.id,
    modifiedTime: file.modifiedTime || null,
    size: file.size || null
  };
}

async function handleGoogleDriveDisconnect() {
  try {
    const token = await getGoogleAuthToken(false);
    await removeCachedToken(token);
  } catch (error) {
    // It is already effectively disconnected if no cached token exists.
  }

  return { ok: true };
}
