// Settings and preferences
const StorageSettings = {
  async getNickname() {
    const result = await StorageCore.get([Constants.STORAGE_KEYS.NICKNAME]);
    return result.nickname || Constants.DEFAULTS.NICKNAME;
  },

  async saveNickname(nickname) {
    await StorageCore.set({ nickname });
  },

  async getDrawerTransparent() {
    const result = await StorageCore.get(['drawerTransparent']);
    return !!result.drawerTransparent;
  },

  async saveDrawerTransparent(enabled) {
    await StorageCore.set({ drawerTransparent: enabled });
  },

  async getDrawerTheme() {
    const result = await StorageCore.get([Constants.STORAGE_KEYS.DRAWER_THEME]);
    return result.drawerTheme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT;
  },

  async saveDrawerTheme(theme) {
    await StorageCore.set({ drawerTheme: theme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT });
  },

  async getPreferences() {
    const result = await StorageCore.get([
      Constants.STORAGE_KEYS.OPEN_NOTES_IN,
      Constants.STORAGE_KEYS.AUTO_SAVE_DELAY,
      Constants.STORAGE_KEYS.MAX_HISTORY_ENTRIES,
      Constants.STORAGE_KEYS.DRAWER_THEME
    ]);

    return {
      openNotesIn: result.openNotesIn === 'preview' ? 'preview' : Constants.DEFAULTS.OPEN_NOTES_IN,
      autoSaveDelay: this.clampNumber(result.autoSaveDelay, 500, 5000, Constants.DEFAULTS.AUTO_SAVE_DELAY),
      maxHistoryEntries: this.clampNumber(result.maxHistoryEntries, 3, 20, Constants.DEFAULTS.MAX_HISTORY_ENTRIES),
      drawerTheme: result.drawerTheme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT
    };
  },

  async savePreferences(preferences) {
    const nextPreferences = {
      openNotesIn: preferences?.openNotesIn === 'preview' ? 'preview' : 'edit',
      autoSaveDelay: this.clampNumber(preferences?.autoSaveDelay, 500, 5000, Constants.DEFAULTS.AUTO_SAVE_DELAY),
      maxHistoryEntries: this.clampNumber(preferences?.maxHistoryEntries, 3, 20, Constants.DEFAULTS.MAX_HISTORY_ENTRIES),
      drawerTheme: preferences?.drawerTheme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT
    };

    await StorageCore.set({
      openNotesIn: nextPreferences.openNotesIn,
      autoSaveDelay: nextPreferences.autoSaveDelay,
      maxHistoryEntries: nextPreferences.maxHistoryEntries,
      drawerTheme: nextPreferences.drawerTheme
    });

    return nextPreferences;
  },

  async getOpenNotesIn() {
    const preferences = await this.getPreferences();
    return preferences.openNotesIn;
  },

  async getAutoSaveDelay() {
    const preferences = await this.getPreferences();
    return preferences.autoSaveDelay;
  },

  async getMaxHistoryEntries() {
    const preferences = await this.getPreferences();
    return preferences.maxHistoryEntries;
  },

  clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  },

  async getDrawerCollapsed() {
    const result = await StorageCore.get(['drawerCollapsed']);
    return !!result.drawerCollapsed;
  },

  async saveDrawerCollapsed(enabled) {
    await StorageCore.set({ drawerCollapsed: enabled });
  },

  async getLastBackupAt() {
    const result = await StorageCore.get(['lastBackupAt']);
    return result.lastBackupAt || null;
  },

  async saveLastBackupAt(lastBackupAt) {
    await StorageCore.set({ lastBackupAt });
  },

  async getLockedLabelFilter() {
    const result = await StorageCore.get(['lockedLabelFilter']);
    return result.lockedLabelFilter || { locked: false, value: '' };
  },

  async saveLockedLabelFilter(lockedLabelFilter) {
    await StorageCore.set({
      lockedLabelFilter: {
        locked: !!lockedLabelFilter?.locked,
        value: String(lockedLabelFilter?.value || '')
      }
    });
  },

  async exportData() {
    const notes = await StorageNotes.getNotes();
    const trashNotes = await StorageNotes.getTrashNotes();
    const result = await StorageCore.get(['noteHistory']);
    const nickname = await this.getNickname();
    const labels = await StorageLabels.getManualLabels();
    const labelColors = await StorageLabels.getLabelColors();
    const exportedAt = new Date().toISOString();
    return {
      notes,
      trashNotes,
      noteHistory: result.noteHistory || {},
      nickname,
      labels,
      labelColors,
      preferences: await this.getPreferences(),
      exportedAt
    };
  },

  async importData(data) {
    const notes = data.notes || {};
    let kingFound = false;

    Object.keys(notes).forEach(id => {
      if (!notes[id]?.king) return;
      if (kingFound) {
        notes[id].king = false;
      } else {
        kingFound = true;
      }
    });

    await StorageCore.set({
      notes,
      trashNotes: data.trashNotes || {},
      noteHistory: data.noteHistory || {},
      nickname: data.nickname || Constants.DEFAULTS.NICKNAME,
      labels: data.labels || [],
      labelColors: data.labelColors || {},
      ...(data.preferences ? {
        openNotesIn: data.preferences.openNotesIn === 'preview' ? 'preview' : 'edit',
        autoSaveDelay: this.clampNumber(data.preferences.autoSaveDelay, 500, 5000, Constants.DEFAULTS.AUTO_SAVE_DELAY),
        maxHistoryEntries: this.clampNumber(data.preferences.maxHistoryEntries, 3, 20, Constants.DEFAULTS.MAX_HISTORY_ENTRIES),
        drawerTheme: data.preferences.drawerTheme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT
      } : {})
    });
  }
};
