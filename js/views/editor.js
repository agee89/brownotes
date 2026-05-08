// Editor view controller
const EditorView = {
  currentNoteId: null,
  autoSaveTimeout: null,
  noteLinkSuggestionIndex: -1,
  noteLinkMatches: [],
  noteLinkRange: null,

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
    this.updateEditorSearch(false);
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
    const existingNote = this.currentNoteId ? await Storage.getNote(this.currentNoteId) : null;
    const availableLabels = await Storage.getLabels();
    const labelExists = !label || availableLabels.some(existingLabel => existingLabel.toLowerCase() === label.toLowerCase());
    const savedLabel = labelExists ? label : (existingNote?.label || '');

    if (label && !labelExists && !silent) {
      await UI.showAlert('Create this label from the label menu before saving it to a note.', 'label not created');
      return;
    }

    // Validation
    if (!title && !content) {
      if (!silent) await UI.showAlert('Please add a title or content', 'empty note');
      return;
    }

    const now = Date.now();

    UI.setSaveStatus('saving');

    if (this.currentNoteId) {
      // Update existing note
      await Storage.saveNote(this.currentNoteId, {
        ...existingNote,
        title,
        label: savedLabel,
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
        label: savedLabel,
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

  handleEditorInput() {
    this.handleInput();
    UI.updateEditorCount();
    this.updateEditorSearch(false);
    this.updateNoteLinkAutocomplete();
  },

  handleEditorKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.openEditorSearch();
      return;
    }

    this.handleNoteLinkAutocompleteKey(event);
  },

  applyMarkdownFormat(action) {
    const editor = UI.get('bn-editor');
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.slice(start, end);
    const formats = {
      bold: () => this.wrapSelection('**', '**', 'bold'),
      italic: () => this.wrapSelection('*', '*', 'italic'),
      strike: () => this.wrapSelection('~~', '~~', 'strikethrough'),
      link: () => this.insertLink(),
      image: () => this.insertImage(),
      code: () => selected.includes('\n')
        ? this.wrapSelection('```\n', '\n```', 'code')
        : this.wrapSelection('`', '`', 'code'),
      h1: () => this.prefixSelectedLines('# '),
      h2: () => this.prefixSelectedLines('## '),
      quote: () => this.prefixSelectedLines('> '),
      'bullet-list': () => this.prefixSelectedLines('- '),
      'number-list': () => this.prefixSelectedLines('', (line, index) => `${index + 1}. ${line}`),
      checklist: () => this.prefixSelectedLines('- [ ] '),
      table: () => this.insertBlock('| Column 1 | Column 2 |\n| --- | --- |\n|  |  |', 2, 10),
      line: () => this.insertBlock('\n---\n', 5, 5)
    };

    const formatter = formats[action];
    if (formatter) formatter();
  },

  wrapSelection(before, after, placeholder) {
    const editor = UI.get('bn-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.slice(start, end);
    const inner = selected || placeholder;
    const replacement = `${before}${inner}${after}`;

    this.replaceEditorSelection(replacement, start + before.length, start + before.length + inner.length);
  },

  insertLink() {
    const editor = UI.get('bn-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.slice(start, end) || 'link';
    const replacement = `[${selected}](url)`;
    this.replaceEditorSelection(replacement, start + 1, start + 1 + selected.length);
  },

  insertImage() {
    const editor = UI.get('bn-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.slice(start, end) || 'alt';
    const replacement = `![${selected}](url)`;
    this.replaceEditorSelection(replacement, start + 2, start + 2 + selected.length);
  },

  insertBlock(markdown, selectionOffsetStart = 0, selectionOffsetEnd = 0) {
    const editor = UI.get('bn-editor');
    const start = editor.selectionStart;
    const prefix = start > 0 && editor.value[start - 1] !== '\n' ? '\n' : '';
    const suffix = editor.value[start] && editor.value[start] !== '\n' ? '\n' : '';
    const replacement = `${prefix}${markdown}${suffix}`;
    const selectionStart = start + prefix.length + selectionOffsetStart;
    const selectionEnd = start + prefix.length + selectionOffsetEnd;
    this.replaceEditorSelection(replacement, selectionStart, selectionEnd);
  },

  prefixSelectedLines(prefix, mapper = null) {
    const editor = UI.get('bn-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIndex = value.indexOf('\n', end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n');
    const formatted = lines.map((line, index) => {
      if (!line && lines.length > 1) return line;
      return mapper ? mapper(line, index) : `${prefix}${line}`;
    }).join('\n');

    this.replaceEditorRange(lineStart, lineEnd, formatted, lineStart, lineStart + formatted.length);
  },

  replaceEditorSelection(replacement, selectionStart, selectionEnd) {
    const editor = UI.get('bn-editor');
    this.replaceEditorRange(editor.selectionStart, editor.selectionEnd, replacement, selectionStart, selectionEnd);
  },

  replaceEditorRange(start, end, replacement, selectionStart, selectionEnd) {
    const editor = UI.get('bn-editor');
    if (!editor) return;

    editor.value = `${editor.value.slice(0, start)}${replacement}${editor.value.slice(end)}`;
    editor.focus();
    editor.setSelectionRange(selectionStart, selectionEnd);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  },

  openEditorSearch() {
    const wrap = UI.get('bn-editor-search-wrap');
    const searchInput = UI.get('bn-editor-search');
    const editor = UI.get('bn-editor');
    if (!wrap || !searchInput || !editor) return;

    const selection = editor.value.slice(editor.selectionStart, editor.selectionEnd).trim();
    if (selection && !/\s/.test(selection)) {
      searchInput.value = selection;
    }

    wrap.style.display = 'flex';
    this.updateEditorSearch(false);
    searchInput.focus();
    searchInput.select();
  },

  closeEditorSearch() {
    const wrap = UI.get('bn-editor-search-wrap');
    const searchInput = UI.get('bn-editor-search');
    const editor = UI.get('bn-editor');

    if (wrap) wrap.style.display = 'none';
    if (searchInput) searchInput.value = '';
    this.updateEditorSearch(false);
    if (editor) editor.focus();
  },

  handleSearchKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeEditorSearch();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.findEditorSearchMatch(event.shiftKey ? -1 : 1);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      event.currentTarget.select();
    }
  },

  updateEditorSearch(selectFirstMatch = false) {
    const searchInput = UI.get('bn-editor-search');
    const count = UI.get('bn-editor-search-count');
    const editor = UI.get('bn-editor');
    if (!searchInput || !count || !editor) return;

    const term = searchInput.value;
    const matches = this.getEditorSearchMatches(term);
    const currentIndex = this.getCurrentSearchMatchIndex(matches);
    count.textContent = term ? `${currentIndex >= 0 ? currentIndex + 1 : 0}/${matches.length}` : '0/0';
    this.renderEditorSearchHighlights(matches, currentIndex);

    if (selectFirstMatch && matches.length) {
      this.findEditorSearchMatch(1, true);
    }
  },

  getEditorSearchMatches(term) {
    const editor = UI.get('bn-editor');
    if (!editor || !term) return [];

    const content = editor.value.toLowerCase();
    const query = term.toLowerCase();
    const matches = [];
    let index = content.indexOf(query);

    while (index !== -1) {
      matches.push(index);
      index = content.indexOf(query, index + query.length);
    }

    return matches;
  },

  getCurrentSearchMatchIndex(matches) {
    const editor = UI.get('bn-editor');
    const searchInput = UI.get('bn-editor-search');
    if (!editor || !searchInput || !matches.length) return -1;

    const currentStart = editor.selectionStart;
    const termLength = searchInput.value.length;
    return matches.findIndex(index => index === currentStart && editor.selectionEnd === index + termLength);
  },

  findEditorSearchMatch(direction = 1, fromSelectionStart = false) {
    const editor = UI.get('bn-editor');
    const searchInput = UI.get('bn-editor-search');
    const count = UI.get('bn-editor-search-count');
    if (!editor || !searchInput) return;

    const term = searchInput.value;
    const matches = this.getEditorSearchMatches(term);
    if (!term || !matches.length) {
      if (count) count.textContent = term ? '0/0' : '0/0';
      this.renderEditorSearchHighlights([], -1);
      return;
    }

    const cursor = direction > 0
      ? (fromSelectionStart ? editor.selectionStart : editor.selectionEnd)
      : editor.selectionStart - 1;
    const matchIndex = direction > 0
      ? matches.findIndex(index => index >= cursor)
      : this.findPreviousSearchMatchIndex(matches, cursor);
    const nextIndex = matchIndex === -1
      ? (direction > 0 ? 0 : matches.length - 1)
      : matchIndex;
    const start = matches[nextIndex];
    const end = start + term.length;

    editor.focus();
    editor.setSelectionRange(start, end);
    editor.scrollTop = this.getSearchScrollTop(editor, start);
    if (count) count.textContent = `${nextIndex + 1}/${matches.length}`;
    this.renderEditorSearchHighlights(matches, nextIndex);
    searchInput.focus();
  },

  renderEditorSearchHighlights(matches = [], currentIndex = -1) {
    const editor = UI.get('bn-editor');
    const searchInput = UI.get('bn-editor-search');
    const highlight = UI.get('bn-editor-highlight');
    if (!editor || !searchInput || !highlight) return;

    const content = editor.value || '';
    const termLength = searchInput.value.length;
    if (!matches.length || !termLength) {
      highlight.innerHTML = '';
      this.syncEditorSearchHighlight();
      return;
    }

    let cursor = 0;
    const parts = [];
    matches.forEach((start, index) => {
      const end = start + termLength;
      parts.push(Utils.escapeHtml(content.slice(cursor, start)));
      const className = index === currentIndex
        ? 'bn-search-highlight bn-search-highlight-current'
        : 'bn-search-highlight';
      parts.push(`<mark class="${className}">${Utils.escapeHtml(content.slice(start, end))}</mark>`);
      cursor = end;
    });
    parts.push(Utils.escapeHtml(content.slice(cursor)));
    highlight.innerHTML = parts.join('');
    this.syncEditorSearchHighlight();
  },

  syncEditorSearchHighlight() {
    const editor = UI.get('bn-editor');
    const highlight = UI.get('bn-editor-highlight');
    if (!editor || !highlight) return;

    highlight.scrollTop = editor.scrollTop;
    highlight.scrollLeft = editor.scrollLeft;
  },

  findPreviousSearchMatchIndex(matches, cursor) {
    for (let index = matches.length - 1; index >= 0; index--) {
      if (matches[index] <= cursor) return index;
    }
    return -1;
  },

  getSearchScrollTop(editor, selectionStart) {
    const beforeSelection = editor.value.slice(0, selectionStart);
    const lineCount = beforeSelection.split('\n').length - 1;
    const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 22;
    return Math.max(0, (lineCount * lineHeight) - (editor.clientHeight / 2));
  },

  async updateNoteLinkAutocomplete() {
    const trigger = this.getNoteLinkTrigger();
    if (!trigger) {
      this.hideNoteLinkAutocomplete();
      return;
    }

    const notes = await Storage.getNotes();
    const query = trigger.query.toLowerCase();
    const matches = Object.entries(notes)
      .filter(([id]) => id !== this.currentNoteId)
      .map(([id, note]) => ({
        id,
        title: note.title || 'untitled note',
        label: note.label || ''
      }))
      .filter(note => note.title.toLowerCase().includes(query))
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 8);

    if (!matches.length) {
      this.hideNoteLinkAutocomplete();
      return;
    }

    this.noteLinkRange = { start: trigger.start, end: trigger.end };
    this.noteLinkMatches = matches;
    if (this.noteLinkSuggestionIndex >= matches.length || this.noteLinkSuggestionIndex < 0) {
      this.noteLinkSuggestionIndex = 0;
    }
    this.renderNoteLinkAutocomplete();
  },

  getNoteLinkTrigger() {
    const editor = UI.get('bn-editor');
    if (!editor || document.activeElement !== editor) return null;

    const cursor = editor.selectionStart;
    if (cursor !== editor.selectionEnd) return null;

    const beforeCursor = editor.value.slice(0, cursor);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineBeforeCursor = beforeCursor.slice(lineStart);
    const atIndexInLine = lineBeforeCursor.lastIndexOf('@');
    if (atIndexInLine < 0) return null;

    const start = lineStart + atIndexInLine;
    const charBefore = start > 0 ? editor.value[start - 1] : '';
    if (charBefore && !/[\s([{]/.test(charBefore)) return null;

    const query = editor.value.slice(start + 1, cursor);
    if (/[\]()[\]{}<>]/.test(query)) return null;

    return { start, end: cursor, query };
  },

  renderNoteLinkAutocomplete() {
    const menu = UI.get('bn-note-link-autocomplete');
    if (!menu) return;

    const dark = UI.get('bronotes-drawer')?.dataset.theme === 'dark';
    menu.innerHTML = this.noteLinkMatches.map((note, index) => {
      const active = index === this.noteLinkSuggestionIndex;
      const background = active
        ? (dark ? 'rgba(255, 255, 255, 0.1)' : '#f3f3f3')
        : 'transparent';
      const label = note.label ? `<span style="display: block; margin-top: 2px; color: ${dark ? '#9f9f9f' : '#8a8a8a'}; font-size: 10px;">${Utils.escapeHtml(note.label)}</span>` : '';

      return `
        <button type="button" class="bn-note-link-option" data-note-id="${Utils.escapeHtml(note.id)}" style="width: 100%; padding: 9px 10px; background: ${background}; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; border: none; border-bottom: 1px solid ${dark ? '#303030' : '#f0f0f0'}; cursor: pointer; display: block; text-align: left; font-size: 12px; font-family: inherit;">
          <span style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${Utils.escapeHtml(note.title)}</span>
          ${label}
        </button>
      `;
    }).join('');

    menu.style.display = 'block';
    menu.querySelectorAll('.bn-note-link-option').forEach(button => {
      button.addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.selectNoteLinkSuggestion(button.dataset.noteId);
      });
    });
  },

  hideNoteLinkAutocomplete() {
    const menu = UI.get('bn-note-link-autocomplete');
    if (menu) menu.style.display = 'none';
    this.noteLinkSuggestionIndex = -1;
    this.noteLinkMatches = [];
    this.noteLinkRange = null;
  },

  handleNoteLinkAutocompleteKey(event) {
    const menu = UI.get('bn-note-link-autocomplete');
    const visible = menu && menu.style.display === 'block' && this.noteLinkMatches.length > 0;

    if (event.key === 'Escape' && visible) {
      event.preventDefault();
      this.hideNoteLinkAutocomplete();
      return;
    }

    if (!visible) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.noteLinkSuggestionIndex = Math.min(this.noteLinkSuggestionIndex + 1, this.noteLinkMatches.length - 1);
      this.renderNoteLinkAutocomplete();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.noteLinkSuggestionIndex = Math.max(this.noteLinkSuggestionIndex - 1, 0);
      this.renderNoteLinkAutocomplete();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = this.noteLinkMatches[this.noteLinkSuggestionIndex];
      if (selected) this.selectNoteLinkSuggestion(selected.id);
    }
  },

  selectNoteLinkSuggestion(noteId) {
    const editor = UI.get('bn-editor');
    const note = this.noteLinkMatches.find(match => match.id === noteId);
    if (!editor || !note || !this.noteLinkRange) return;

    const link = `[${this.escapeMarkdownLinkLabel(note.title)}](#${note.id})`;
    const before = editor.value.slice(0, this.noteLinkRange.start);
    const after = editor.value.slice(this.noteLinkRange.end);
    editor.value = `${before}${link}${after}`;

    const cursor = before.length + link.length;
    editor.focus();
    editor.setSelectionRange(cursor, cursor);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    this.hideNoteLinkAutocomplete();
  },

  escapeMarkdownLinkLabel(label) {
    return String(label || 'untitled note').replace(/([\\[\]])/g, '\\$1');
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
    previewContainer.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        const noteId = link.getAttribute('href').slice(1);
        const note = await Storage.getNote(noteId);
        if (!note) {
          await UI.showAlert('Linked note not found. The note may have been deleted or the ID is incorrect.', 'note link');
          return;
        }

        clearTimeout(this.autoSaveTimeout);
        await this.save(true);
        EditorView.open(noteId);
      });
    });

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
