// Settings view controller
const SettingsView = {
  async load() {
    const nickname = await Storage.getNickname();
    UI.get('bn-nickname').value = nickname;
  },

  async save() {
    const nickname = UI.get('bn-nickname').value.trim() || 'bro';
    await Storage.saveNickname(nickname);
    await UI.showAlert('Settings saved!', 'saved');
  },

  async export() {
    const data = await Storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const filename = `bronotes-export-${Date.now()}.json`;
    Utils.downloadFile(json, filename);
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
