// Settings view controller
const SettingsView = {
  autoBackupTimeout: null,

  async load() {
    const nickname = await Storage.getNickname();
    UI.get('bn-nickname').value = nickname;
    await this.loadDriveStatus();
    
    // Load version from manifest
    this.loadVersion();
  },

  loadVersion() {
    const versionElement = UI.get('bn-app-version');
    if (!versionElement) return;
    
    try {
      const manifest = chrome.runtime.getManifest();
      versionElement.textContent = `v${manifest.version}`;
    } catch (error) {
      console.warn('Brow Notes: Could not load version from manifest', error);
    }
  },

  async save() {
    const nickname = UI.get('bn-nickname').value.trim() || 'Brow';
    await Storage.saveNickname(nickname);
    await UI.showAlert('Settings saved!', 'saved');
  },

  async showPreferences() {
    const current = await Storage.getPreferences();
    const saved = await UI.showPreferencesModal(current);
    if (!saved) return;

    const preferences = await Storage.savePreferences(saved);
    UI.setDrawerTheme(preferences.drawerTheme);
    EditorView.preferences = {
      ...EditorView.preferences,
      openNotesIn: preferences.openNotesIn,
      autoSaveDelay: preferences.autoSaveDelay,
      autoBackupEnabled: preferences.autoBackupEnabled,
      autoBackupDelay: preferences.autoBackupDelay
    };
    await UI.showAlert('Preferences saved.', 'saved');
  },

  async export() {
    const data = await Storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const filename = `bronotes-export-${Date.now()}.json`;
    Utils.downloadFile(json, filename);
    await Storage.saveLastBackupAt(data.exportedAt);
  },

  async import(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const content = await Utils.readFile(file);
      const data = JSON.parse(content);

      if (!data.notes) {
        await UI.showAlert('Invalid file format', 'import failed');
        return;
      }

      const confirmed = await UI.showConfirm('This will replace all existing notes. Continue?', 'import notes', {
        confirmText: 'import',
        danger: true
      });
      if (!confirmed) return;

      await Storage.importData(data);
      await UI.showAlert('Import successful!', 'import complete');
      
      // Reload views
      await HomeView.load();
      await this.load();
    } catch (error) {
      await UI.showAlert('Error reading file: ' + error.message, 'import failed');
    }

    // Reset file input
    event.target.value = '';
  },

  async loadDriveStatus() {
    const statusElement = UI.get('bn-drive-status');
    if (!statusElement) return;

    const driveSync = await Storage.getDriveSync();
    if (!driveSync.lastSyncedAt) {
      statusElement.textContent = [
        driveSync.pendingSince ? `backup pending since ${Utils.formatDate(driveSync.pendingSince, 'datetime')}` : 'not synced yet',
        driveSync.lastError ? `last error: ${driveSync.lastError}` : null
      ].filter(Boolean).join(' · ');
      return;
    }

    const sizeLabel = this.formatDriveSize(driveSync.size);
    statusElement.textContent = [
      `last synced ${Utils.formatDate(driveSync.lastSyncedAt, 'datetime')}`,
      sizeLabel ? `file size ${sizeLabel}` : null,
      driveSync.pendingSince ? 'backup pending' : null,
      driveSync.lastError ? `last error: ${driveSync.lastError}` : null
    ].filter(Boolean).join(' · ');
  },

  formatDriveSize(size) {
    const bytes = Number(size);
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  },

  sendDriveMessage(message) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }

          if (!response?.ok) {
            reject(new Error(response?.error || 'Google Drive sync failed'));
            return;
          }

          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  setDriveButtonsLoading(loading) {
    ['bn-btn-drive-backup', 'bn-btn-drive-restore', 'bn-btn-drive-disconnect'].forEach((id) => {
      const button = UI.get(id);
      if (!button) return;
      button.disabled = loading;
      button.style.opacity = loading ? '0.55' : '1';
      button.style.cursor = loading ? 'not-allowed' : 'pointer';
    });
  },

  async backupToDrive() {
    this.setDriveButtonsLoading(true);
    try {
      const data = await Storage.exportData();
      const response = await this.sendDriveMessage({
        action: 'googleDriveBackup',
        data
      });
      const syncedAt = new Date().toISOString();

      await Storage.saveDriveSync({
        fileId: response.fileId,
        lastSyncedAt: syncedAt,
        remoteModifiedTime: response.modifiedTime || null,
        size: response.size || null,
        pendingSince: null,
        lastError: null
      });
      await Storage.saveLastBackupAt(syncedAt);
      await this.loadDriveStatus();
      await UI.showAlert('Backup to Google Drive complete.', 'drive synced');
    } catch (error) {
      await UI.showAlert(error.message, 'drive backup failed');
    } finally {
      this.setDriveButtonsLoading(false);
    }
  },

  async restoreFromDrive() {
    const confirmed = await UI.showConfirm('This will replace all local notes with the Google Drive backup. Continue?', 'restore from drive', {
      confirmText: 'restore',
      danger: true
    });
    if (!confirmed) return;

    this.setDriveButtonsLoading(true);
    try {
      const response = await this.sendDriveMessage({ action: 'googleDriveRestore' });
      if (!response.data?.notes) {
        await UI.showAlert('Google Drive backup format is invalid.', 'restore failed');
        return;
      }

      await Storage.importData(response.data);
      const syncedAt = new Date().toISOString();
      await Storage.saveDriveSync({
        fileId: response.fileId,
        lastSyncedAt: syncedAt,
        remoteModifiedTime: response.modifiedTime || null,
        size: response.size || null,
        pendingSince: null,
        lastError: null
      });
      await this.loadDriveStatus();
      await UI.showAlert('Restore from Google Drive complete.', 'drive restored');
      await HomeView.load();
      await this.load();
    } catch (error) {
      await UI.showAlert(error.message, 'drive restore failed');
    } finally {
      this.setDriveButtonsLoading(false);
    }
  },

  async disconnectDrive() {
    this.setDriveButtonsLoading(true);
    try {
      await this.sendDriveMessage({ action: 'googleDriveDisconnect' });
      await Storage.clearDriveSync();
      await this.loadDriveStatus();
      await UI.showAlert('Google Drive disconnected.', 'drive disconnected');
    } catch (error) {
      await UI.showAlert(error.message, 'drive disconnect failed');
    } finally {
      this.setDriveButtonsLoading(false);
    }
  },

  async scheduleAutoBackup(reason = 'change') {
    clearTimeout(this.autoBackupTimeout);

    const preferences = await Storage.getPreferences();
    if (!preferences.autoBackupEnabled) return;

    const driveSync = await Storage.getDriveSync();
    const pendingSince = driveSync.pendingSince || new Date().toISOString();
    await Storage.saveDriveSync({
      ...driveSync,
      pendingSince,
      lastError: null
    });
    await this.loadDriveStatus();

    this.autoBackupTimeout = setTimeout(() => {
      this.runAutoBackup(reason);
    }, preferences.autoBackupDelay || Constants.DEFAULTS.AUTO_BACKUP_DELAY);
  },

  async runAutoBackup(reason = 'change') {
    try {
      const data = await Storage.exportData();
      const response = await this.sendDriveMessage({
        action: 'googleDriveBackup',
        data: {
          ...data,
          autoBackupReason: reason
        },
        interactive: false
      });
      const syncedAt = new Date().toISOString();

      await Storage.saveDriveSync({
        fileId: response.fileId,
        lastSyncedAt: syncedAt,
        remoteModifiedTime: response.modifiedTime || null,
        size: response.size || null,
        pendingSince: null,
        lastError: null
      });
      await Storage.saveLastBackupAt(syncedAt);
    } catch (error) {
      const driveSync = await Storage.getDriveSync();
      await Storage.saveDriveSync({
        ...driveSync,
        lastError: error.message || 'Auto backup failed'
      });
    } finally {
      await this.loadDriveStatus();
    }
  }
};
