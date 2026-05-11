// Settings view controller
const SettingsView = {
  async load() {
    const nickname = await Storage.getNickname();
    UI.get('bn-nickname').value = nickname;
    
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
      autoSaveDelay: preferences.autoSaveDelay
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
  }
};
