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
    const { title, content } = UI.getEditorValues();
    UI.setSaveStatus(title || content ? 'saved' : 'empty');
    
    console.log('EditorView.open completed');
  },

  updateSaveButton() {
    const { title, content } = UI.getEditorValues();
    const hasContent = !!(title || content);
    UI.updateSaveButton(hasContent);
    UI.setSaveStatus(hasContent ? 'dirty' : 'empty');
  },

  async save(silent = false) {
    const { title, label, content, favorite, king, pinned } = UI.getEditorValues();

    // Validation
    if (!title && !content) {
      if (!silent) await UI.showAlert('Please add a title or content', 'empty note');
      return;
    }

    const now = Date.now();

    UI.setSaveStatus('saving');

    if (this.currentNoteId) {
      // Update existing note
      const existingNote = await Storage.getNote(this.currentNoteId);
      await Storage.saveNote(this.currentNoteId, {
        ...existingNote,
        title,
        label,
        content,
        favorite,
        king,
        pinned,
        updatedAt: now
      });
    } else {
      // Create new note
      const id = Utils.generateId();
      await Storage.saveNote(id, {
        title,
        label,
        content,
        favorite,
        king,
        pinned,
        createdAt: now,
        updatedAt: now
      });
      this.currentNoteId = id;
      UI.get('bn-btn-delete').style.display = 'block';
    }

    UI.showSaveFeedback();
  },

  async exportMarkdown() {
    const { title, content } = UI.getEditorValues();
    if (!title && !content) return;

    if (!this.currentNoteId) {
      clearTimeout(this.autoSaveTimeout);
      await this.save(true);
    }

    const displayTitle = title || 'Untitled Note';
    const filenameBase = Utils.slugifyFilename(displayTitle, 'untitled-note');
    const uniqueId = Utils.shortExportId(this.currentNoteId);
    const filename = `${filenameBase}_${uniqueId}.md`;
    const markdown = title ? `# ${title}\n\n${content}` : content;

    Utils.downloadFile(markdown, filename, 'text/markdown;charset=utf-8');
  },

  async delete() {
    if (!this.currentNoteId) return;
    
    const confirmed = await UI.showConfirm('Move this note to trash?', 'delete note', {
      confirmText: 'move',
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

  toggleFavorite() {
    const favoriteButton = UI.get('bn-note-favorite');
    const active = favoriteButton?.dataset.active !== 'true';
    UI.setFavoriteToggle(active);
    this.handleInput();
  },

  async toggleKing() {
    const kingButton = UI.get('bn-note-king');
    const active = kingButton?.dataset.active !== 'true';

    if (active) {
      const notes = await Storage.getNotes();
      const existingKing = Object.entries(notes).find(([id, note]) => {
        return id !== this.currentNoteId && !!note.king;
      });

      if (existingKing) {
        const [, note] = existingKing;
        const existingTitle = note.title || 'untitled note';
        const confirmed = await UI.showConfirm(
          `Only one note can be King Note. This will remove King status from "${existingTitle}" and make this note the new King Note.`,
          'replace king note',
          {
            confirmText: 'replace',
            cancelText: 'cancel'
          }
        );

        if (!confirmed) return;
      }
    }

    UI.setKingToggle(active);
    this.handleInput();
  },

  togglePinned() {
    const pinnedButton = UI.get('bn-note-pinned');
    const active = pinnedButton?.dataset.active !== 'true';
    UI.setPinnedToggle(active);
    this.handleInput();
  },

  renderPreview() {
    const content = UI.get('bn-editor').value;
    const previewContainer = UI.get('bn-preview-container');
    previewContainer.innerHTML = Utils.markdownToHtml(content);
    previewContainer.querySelectorAll('.bn-copy-code').forEach(button => {
      button.addEventListener('click', async () => {
        const code = button.parentElement.querySelector('code')?.textContent || '';
        await navigator.clipboard.writeText(code);

        const originalText = button.textContent;
        button.textContent = 'copied';
        setTimeout(() => {
          button.textContent = originalText;
        }, 900);
      });
    });
  }
};
