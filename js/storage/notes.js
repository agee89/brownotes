// Note operations
const StorageNotes = {
  async getNotes() {
    const result = await StorageCore.get(['notes']);
    return result.notes || {};
  },

  async saveNotes(notes) {
    await StorageCore.set({ notes });
  },

  async getNote(noteId) {
    const notes = await this.getNotes();
    return notes[noteId];
  },

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

  async getNoteHistory(noteId) {
    const result = await StorageCore.get(['noteHistory']);
    const noteHistory = result.noteHistory || {};
    return Array.isArray(noteHistory[noteId]) ? noteHistory[noteId] : [];
  },

  async addNoteHistory(noteId, noteData, reason = 'autosave') {
    if (!noteId || !noteData) return [];

    const content = String(noteData.content || '').trim();
    const title = String(noteData.title || '').trim();
    if (!title && !content) return this.getNoteHistory(noteId);

    const result = await StorageCore.get(['noteHistory']);
    const noteHistory = result.noteHistory || {};
    const history = Array.isArray(noteHistory[noteId]) ? noteHistory[noteId] : [];
    const latest = history[0];
    const now = Date.now();
    const throttleAutosave = reason === 'autosave' &&
      latest?.snapshotAt &&
      now - latest.snapshotAt < Constants.NOTES.AUTO_SNAPSHOT_INTERVAL;

    if (latest && latest.title === title && latest.content === content && latest.label === (noteData.label || '')) {
      return history;
    }

    if (throttleAutosave) {
      return history;
    }

    const maxHistoryEntries = await StorageSettings.getMaxHistoryEntries();
    noteHistory[noteId] = [{
      title,
      label: noteData.label || '',
      content,
      favorite: !!noteData.favorite,
      king: !!noteData.king,
      pinned: !!noteData.pinned,
      snapshotAt: now,
      reason
    }, ...history].slice(0, maxHistoryEntries);

    await StorageCore.set({ noteHistory });
    return noteHistory[noteId];
  },

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
    await StorageCore.set({ notes, trashNotes });
  },

  async getTrashNotes() {
    const result = await StorageCore.get(['trashNotes']);
    return result.trashNotes || {};
  },

  async saveTrashNotes(trashNotes) {
    await StorageCore.set({ trashNotes });
  },

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
    await StorageCore.set({ notes, trashNotes });
  },

  async deleteTrashNote(noteId) {
    const trashNotes = await this.getTrashNotes();
    delete trashNotes[noteId];
    await this.saveTrashNotes(trashNotes);
  },

  async emptyTrash() {
    await this.saveTrashNotes({});
  }
};
