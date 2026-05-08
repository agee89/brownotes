// Storage module - handles all chrome.storage operations
const Storage = {
  contextWarningShown: false,
  contextInvalidated: false,

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

  // Get manually created labels
  async getManualLabels() {
    const result = await this.get(['labels']);
    return result.labels || [];
  },

  // Save manually created labels
  async saveManualLabels(labels) {
    await this.set({ labels: Array.from(new Set(labels)).sort() });
  },

  // Get all unique labels
  async getLabels() {
    const notes = await this.getNotes();
    const manualLabels = await this.getManualLabels();
    const labels = new Set(manualLabels);
    Object.values(notes).forEach(note => {
      if (note.label) labels.add(note.label);
    });
    return Array.from(labels).sort();
  },

  // Add manual label
  async addLabel(label) {
    const labels = await this.getManualLabels();
    labels.push(label);
    await this.saveManualLabels(labels);
  },

  // Rename label across all notes
  async renameLabel(oldLabel, newLabel) {
    const notes = await this.getNotes();
    const manualLabels = await this.getManualLabels();
    Object.keys(notes).forEach(id => {
      if (notes[id].label === oldLabel) {
        notes[id].label = newLabel;
      }
    });
    await this.saveNotes(notes);
    await this.saveManualLabels(manualLabels.map(label => label === oldLabel ? newLabel : label));
  },

  // Delete label from all notes
  async deleteLabel(label) {
    const notes = await this.getNotes();
    const manualLabels = await this.getManualLabels();
    Object.keys(notes).forEach(id => {
      if (notes[id].label === label) {
        notes[id].label = '';
      }
    });
    await this.saveNotes(notes);
    await this.saveManualLabels(manualLabels.filter(existingLabel => existingLabel !== label));
  },

  // Export all data
  async exportData() {
    const notes = await this.getNotes();
    const trashNotes = await this.getTrashNotes();
    const nickname = await this.getNickname();
    const labels = await this.getManualLabels();
    const exportedAt = new Date().toISOString();
    return {
      notes,
      trashNotes,
      nickname,
      labels,
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
      labels: data.labels || []
    });
  }
};
