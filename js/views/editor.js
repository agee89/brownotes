// Editor view controller
const EditorView = {
  currentNoteId: null,
  autoSaveTimeout: null,

  async open(noteId) {
    console.log('EditorView.open called with noteId:', noteId);
    this.currentNoteId = noteId;

    // Switch to editor view using App.switchView to properly update state
    console.log('Switching to editor view...');
    App.switchView('editor');

    // Load note or clear for new
    if (noteId) {
      console.log('Loading note:', noteId);
      const note = await Storage.getNote(noteId);
      if (note) {
        console.log('Note loaded:', note);
        UI.loadNoteToEditor(note);
      } else {
        console.error('Note not found:', noteId);
      }
    } else {
      console.log('Creating new note');
      UI.clearEditor();
    }

    // Update label suggestions
    const labels = await Storage.getLabels();
    UI.updateLabelSuggestions(labels);

    // Switch to edit tab
    UI.switchEditorTab('edit');
    
    // Update save button state
    this.updateSaveButton();
    
    console.log('EditorView.open completed');
  },

  updateSaveButton() {
    const { title, content } = UI.getEditorValues();
    UI.updateSaveButton(title || content);
  },

  async save(silent = false) {
    const { title, label, content } = UI.getEditorValues();

    // Validation
    if (!title && !content) {
      if (!silent) await UI.showAlert('Please add a title or content', 'empty note');
      return;
    }

    const now = Date.now();

    if (this.currentNoteId) {
      // Update existing note
      const existingNote = await Storage.getNote(this.currentNoteId);
      await Storage.saveNote(this.currentNoteId, {
        ...existingNote,
        title,
        label,
        content,
        updatedAt: now
      });
    } else {
      // Create new note
      const id = Utils.generateId();
      await Storage.saveNote(id, {
        title,
        label,
        content,
        createdAt: now,
        updatedAt: now
      });
      this.currentNoteId = id;
      UI.get('bn-btn-delete').style.display = 'block';
    }

    if (!silent) {
      UI.showSaveFeedback();
    }
  },

  async delete() {
    if (!this.currentNoteId) return;
    
    const confirmed = await UI.showConfirm('Delete this note?', 'delete note', {
      confirmText: 'delete',
      danger: true
    });
    if (!confirmed) return;

    await Storage.deleteNote(this.currentNoteId);
    this.currentNoteId = null;
    App.switchView('allnotes');
  },

  handleInput() {
    this.updateSaveButton();
    
    // Auto-save after 1 second of inactivity
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.save(true);
    }, 1000);
  },

  renderPreview() {
    const content = UI.get('bn-editor').value;
    const previewContainer = UI.get('bn-preview-container');
    previewContainer.innerHTML = Utils.markdownToHtml(content);
  }
};
