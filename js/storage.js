// Storage module - handles all chrome.storage operations
const Storage = {
  contextWarningShown: false,
  contextInvalidated: false,
  maxTitleLength: 120,
  maxLabelLength: 32,
  labelColorPalette: [
    '#8fb8ff', '#8fd8b8', '#f2c66d', '#f29c9c', '#c6a5ff', '#77c7d9',
    '#d6a06d', '#a8c26d', '#a3b8f5', '#b0d4ef', '#d4b8f5', '#f5b8cc',
    '#f5c9a8', '#f0e08a', '#a8e0d0', '#b8dca0', '#ddb8d4', '#a8e4f0',
    '#f0ddb0', '#ccb8e8', '#e8a898', '#c8b090', '#9ab888', '#b0be80',
    '#d4906a', '#80b8b8', '#d8c090', '#90a8c8', '#c8c080', '#c8a090',
    '#6dddb8', '#ffb38a', '#f080c0', '#50d0e8', '#f0d040', '#b070f0',
    '#f07070', '#90d840', '#60a8ff', '#f09860', '#40d4b8', '#8888f0'
  ],

  isContextAvailable() {
    try {
      const available = typeof chrome !== 'undefined' &&
        !!chrome.runtime?.id &&
        !!chrome.storage?.local;

      if (!available) {
        this.warnContextInvalidated();
      }

      return available;
    } catch (error) {
      this.warnContextInvalidated(error);
      return false;
    }
  },

  warnContextInvalidated(error) {
    this.contextInvalidated = true;
    if (this.contextWarningShown) return;
    this.contextWarningShown = true;
    console.warn('Brow Notes: Extension context invalidated. Reload this page to reconnect the extension.', error);
  },

  hasContextIssue() {
    return this.contextInvalidated || !this.isContextAvailable();
  },

  getLastError() {
    try {
      return chrome.runtime?.lastError || null;
    } catch (error) {
      return error;
    }
  },

  // Get data from storage
  get(keys) {
    return new Promise((resolve) => {
      if (!this.isContextAvailable()) {
        resolve({});
        return;
      }

      try {
        chrome.storage.local.get(keys, (result) => {
          const error = this.getLastError();
          if (error) {
            this.warnContextInvalidated(error);
            resolve({});
            return;
          }

          resolve(result || {});
        });
      } catch (error) {
        this.warnContextInvalidated(error);
        resolve({});
      }
    });
  },

  // Set data to storage
  set(data) {
    return new Promise((resolve) => {
      if (!this.isContextAvailable()) {
        resolve(false);
        return;
      }

      try {
        chrome.storage.local.set(data, () => {
          const error = this.getLastError();
          if (error) {
            this.warnContextInvalidated(error);
            resolve(false);
            return;
          }

          resolve(true);
        });
      } catch (error) {
        this.warnContextInvalidated(error);
        resolve(false);
      }
    });
  },

  // Get all notes
  async getNotes() {
    const result = await this.get(['notes']);
    return result.notes || {};
  },

  // Save notes
  async saveNotes(notes) {
    await this.set({ notes });
  },

  // Get single note
  async getNote(noteId) {
    const notes = await this.getNotes();
    return notes[noteId];
  },

  // Save single note
  async saveNote(noteId, noteData) {
    const notes = await this.getNotes();
    if (noteData.king) {
      Object.keys(notes).forEach(id => {
        if (id !== noteId && notes[id]?.king) {
          notes[id].king = false;
        }
      });
    }
    notes[noteId] = noteData;
    await this.saveNotes(notes);
  },

  // Delete note
  async deleteNote(noteId) {
    const notes = await this.getNotes();
    const trashNotes = await this.getTrashNotes();
    const note = notes[noteId];
    if (!note) return;

    trashNotes[noteId] = {
      ...note,
      deletedAt: Date.now()
    };

    delete notes[noteId];
    await this.set({ notes, trashNotes });
  },

  // Get deleted notes
  async getTrashNotes() {
    const result = await this.get(['trashNotes']);
    return result.trashNotes || {};
  },

  // Save deleted notes
  async saveTrashNotes(trashNotes) {
    await this.set({ trashNotes });
  },

  // Restore deleted note
  async restoreNote(noteId) {
    const notes = await this.getNotes();
    const trashNotes = await this.getTrashNotes();
    const note = trashNotes[noteId];
    if (!note) return;

    const { deletedAt, ...restoredNote } = note;
    notes[noteId] = {
      ...restoredNote,
      updatedAt: Date.now()
    };

    delete trashNotes[noteId];
    await this.set({ notes, trashNotes });
  },

  // Permanently delete trashed note
  async deleteTrashNote(noteId) {
    const trashNotes = await this.getTrashNotes();
    delete trashNotes[noteId];
    await this.saveTrashNotes(trashNotes);
  },

  // Empty trash
  async emptyTrash() {
    await this.saveTrashNotes({});
  },

  // Get nickname
  async getNickname() {
    const result = await this.get(['nickname']);
    return result.nickname || 'Brow';
  },

  // Save nickname
  async saveNickname(nickname) {
    await this.set({ nickname });
  },

  // Get drawer transparency preference
  async getDrawerTransparent() {
    const result = await this.get(['drawerTransparent']);
    return !!result.drawerTransparent;
  },

  // Save drawer transparency preference
  async saveDrawerTransparent(enabled) {
    await this.set({ drawerTransparent: enabled });
  },

  // Get drawer theme preference
  async getDrawerTheme() {
    const result = await this.get(['drawerTheme']);
    return result.drawerTheme === 'dark' ? 'dark' : 'light';
  },

  // Save drawer theme preference
  async saveDrawerTheme(theme) {
    await this.set({ drawerTheme: theme === 'dark' ? 'dark' : 'light' });
  },

  // Get drawer collapsed preference
  async getDrawerCollapsed() {
    const result = await this.get(['drawerCollapsed']);
    return !!result.drawerCollapsed;
  },

  // Save drawer collapsed preference
  async saveDrawerCollapsed(enabled) {
    await this.set({ drawerCollapsed: enabled });
  },

  // Get last backup timestamp
  async getLastBackupAt() {
    const result = await this.get(['lastBackupAt']);
    return result.lastBackupAt || null;
  },

  // Save last backup timestamp
  async saveLastBackupAt(lastBackupAt) {
    await this.set({ lastBackupAt });
  },

  async getLockedLabelFilter() {
    const result = await this.get(['lockedLabelFilter']);
    return result.lockedLabelFilter || { locked: false, value: '' };
  },

  async saveLockedLabelFilter(lockedLabelFilter) {
    await this.set({
      lockedLabelFilter: {
        locked: !!lockedLabelFilter?.locked,
        value: String(lockedLabelFilter?.value || '')
      }
    });
  },

  // Get manually created labels
  async getManualLabels() {
    const result = await this.get(['labels']);
    return result.labels || [];
  },

  // Save manually created labels
  async saveManualLabels(labels) {
    const normalizedLabels = labels
      .map(label => this.normalizeLabel(label))
      .filter(Boolean);
    await this.set({ labels: Array.from(new Set(normalizedLabels)).sort() });
  },

  normalizeLabel(label) {
    return String(label || '').replace(/\s+/g, ' ').trim().slice(0, this.maxLabelLength);
  },

  isDuplicateLabel(label, labels, ignoredLabel = '') {
    const normalized = this.normalizeLabel(label).toLowerCase();
    const ignored = this.normalizeLabel(ignoredLabel).toLowerCase();
    return labels.some(existingLabel => {
      const existing = this.normalizeLabel(existingLabel).toLowerCase();
      return existing === normalized && existing !== ignored;
    });
  },

  // Get label color map
  async getLabelColors() {
    const result = await this.get(['labelColors']);
    return result.labelColors || {};
  },

  // Get a calm fallback color for labels without a stored color
  getDefaultLabelColor(label) {
    const text = String(label || '');
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return this.labelColorPalette[Math.abs(hash) % this.labelColorPalette.length];
  },

  getResolvedLabelColor(label, labelColors = {}) {
    if (!label) return '#b8b8b8';
    return labelColors[label] || '';
  },

  // Save one label color
  async saveLabelColor(label, color) {
    const labelColors = await this.getLabelColors();
    labelColors[label] = color;
    await this.set({ labelColors });
  },

  // Remove stored label color
  async resetLabelColor(label) {
    const labelColors = await this.getLabelColors();
    delete labelColors[label];
    await this.set({ labelColors });
  },

  // Get all unique labels
  async getLabels() {
    return this.getManualLabels();
  },

  // Add manual label
  async addLabel(label) {
    const normalized = this.normalizeLabel(label);
    if (!normalized) return '';
    const labels = await this.getManualLabels();
    if (this.isDuplicateLabel(normalized, labels)) return normalized;
    labels.push(normalized);
    await this.saveManualLabels(labels);
    return normalized;
  },

  // Rename label across all notes
  async renameLabel(oldLabel, newLabel) {
    const normalizedOldLabel = this.normalizeLabel(oldLabel);
    const normalizedNewLabel = this.normalizeLabel(newLabel);
    if (!normalizedOldLabel || !normalizedNewLabel) return '';
    const notes = await this.getNotes();
    const manualLabels = await this.getManualLabels();
    const labelColors = await this.getLabelColors();
    if (this.isDuplicateLabel(normalizedNewLabel, manualLabels, normalizedOldLabel)) return '';
    Object.keys(notes).forEach(id => {
      if (notes[id].label === normalizedOldLabel) {
        notes[id].label = normalizedNewLabel;
      }
    });
    if (labelColors[normalizedOldLabel] && !labelColors[normalizedNewLabel]) {
      labelColors[normalizedNewLabel] = labelColors[normalizedOldLabel];
    }
    delete labelColors[normalizedOldLabel];
    await this.saveNotes(notes);
    await this.set({
      labels: Array.from(new Set(manualLabels.map(label => label === normalizedOldLabel ? normalizedNewLabel : label))).sort(),
      labelColors
    });
    return normalizedNewLabel;
  },

  // Delete label from all notes
  async deleteLabel(label) {
    const notes = await this.getNotes();
    const manualLabels = await this.getManualLabels();
    const labelColors = await this.getLabelColors();
    Object.keys(notes).forEach(id => {
      if (notes[id].label === label) {
        notes[id].label = '';
      }
    });
    delete labelColors[label];
    await this.saveNotes(notes);
    await this.set({
      labels: manualLabels.filter(existingLabel => existingLabel !== label),
      labelColors
    });
  },

  // Export all data
  async exportData() {
    const notes = await this.getNotes();
    const trashNotes = await this.getTrashNotes();
    const nickname = await this.getNickname();
    const labels = await this.getManualLabels();
    const labelColors = await this.getLabelColors();
    const exportedAt = new Date().toISOString();
    return {
      notes,
      trashNotes,
      nickname,
      labels,
      labelColors,
      exportedAt
    };
  },

  // Import data
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

    await this.set({
      notes,
      trashNotes: data.trashNotes || {},
      nickname: data.nickname || 'Brow',
      labels: data.labels || [],
      labelColors: data.labelColors || {}
    });
  }
};
