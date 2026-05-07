// Storage module - handles all chrome.storage operations
const Storage = {
  // Get data from storage
  get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },

  // Set data to storage
  set(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
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
    notes[noteId] = noteData;
    await this.saveNotes(notes);
  },

  // Delete note
  async deleteNote(noteId) {
    const notes = await this.getNotes();
    delete notes[noteId];
    await this.saveNotes(notes);
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
    const nickname = await this.getNickname();
    const labels = await this.getManualLabels();
    const exportedAt = new Date().toISOString();
    return {
      notes,
      nickname,
      labels,
      exportedAt
    };
  },

  // Import data
  async importData(data) {
    await this.set({
      notes: data.notes || {},
      nickname: data.nickname || 'Brow',
      labels: data.labels || []
    });
  }
};
