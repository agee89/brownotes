// Editor view controller
const EditorView = {
  currentNoteId: null,
  autoSaveTimeout: null,
  historyVersions: [],
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
    await this.refreshHistoryDropdown();
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
    const clearsExistingContent = this.isClearingExistingContent(existingNote, content);

    if (label && !labelExists && !silent) {
      await UI.showAlert('Create this label from the label menu before saving it to a note.', 'label not created');
      return;
    }

    if (clearsExistingContent) {
      await Storage.addNoteHistory(this.currentNoteId, existingNote, 'before-empty');
      await this.refreshHistoryDropdown();

      if (silent) {
        UI.setSaveStatus('dirty');
        return;
      }

      const confirmed = await UI.showConfirm('This will save the note with empty content. Continue?', 'clear note content', {
        confirmText: 'save empty',
        danger: true
      });
      if (!confirmed) return;
    }

    // Validation
    if (!title && !content) {
      if (!silent) await UI.showAlert('Please add a title or content', 'empty note');
      return;
    }

    const now = Date.now();

    UI.setSaveStatus('saving');

    if (this.currentNoteId) {
      await Storage.addNoteHistory(this.currentNoteId, existingNote, silent ? 'autosave' : 'manual');
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

    await this.refreshHistoryDropdown();
    UI.showSaveFeedback();
  },

  isClearingExistingContent(existingNote, nextContent) {
    return !!existingNote?.content?.trim() && !String(nextContent || '').trim();
  },

  async refreshHistoryDropdown() {
    this.historyVersions = this.currentNoteId ? await Storage.getNoteHistory(this.currentNoteId) : [];
    UI.updateHistoryDropdown(this.historyVersions);
  },

  async restoreHistoryVersion(index) {
    if (!this.currentNoteId || !this.historyVersions[index]) return;

    const version = this.historyVersions[index];
    const current = UI.getEditorValues();
    await Storage.addNoteHistory(this.currentNoteId, current, 'before-restore');

    UI.get('bn-note-title').value = version.title || '';
    UI.get('bn-note-label').value = version.label || '';
    UI.get('bn-editor').value = version.content || '';
    UI.setFavoriteToggle(!!version.favorite);
    UI.setKingToggle(!!version.king);
    UI.setPinnedToggle(!!version.pinned);
    UI.updateEditorCount();
    UI.updateTitleCharacterCount();
    UI.updateLabelCharacterCount();
    this.updateSaveButton();
    this.updateEditorSearch(false);
    UI.hideHistoryDropdown();
    await this.refreshHistoryDropdown();
    this.handleInput();
  },

  async showTemplatePicker() {
    if (typeof NoteTemplates === 'undefined') return;

    const drawer = UI.get('bronotes-drawer');
    if (!drawer) return;

    const existingModal = UI.get('bn-modal-overlay');
    if (existingModal) existingModal.remove();

    const dark = drawer.dataset.theme === 'dark';
    const overlay = document.createElement('div');
    overlay.id = 'bn-modal-overlay';
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 10;
      background: ${dark ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.72)'};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      backdrop-filter: blur(2px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      width: 100%;
      max-width: 380px;
      background: ${dark ? '#202020' : '#ffffff'};
      border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
      box-shadow: 0 12px 36px ${dark ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0.16)'};
      padding: 18px;
      box-sizing: border-box;
    `;
    modal.style.setProperty('background', dark ? '#202020' : '#ffffff', 'important');
    modal.style.setProperty('border-color', dark ? '#3a3a3a' : '#e0e0e0', 'important');

    const title = document.createElement('div');
    title.textContent = 'templates';
    title.style.cssText = `font-size: 13px; font-weight: 600; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; margin-bottom: 12px; letter-spacing: 0.5px;`;
    title.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
    modal.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'bn-template-grid';
    NoteTemplates.items.forEach(template => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bn-template-card';
      button.dataset.templateId = template.id;
      button.innerHTML = `<span class="bn-template-name">${Utils.escapeHtml(template.name)}</span><span class="bn-template-category">${Utils.escapeHtml(template.category)}</span>`;
      grid.appendChild(button);
    });
    modal.appendChild(grid);

    const actions = document.createElement('div');
    actions.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 14px;';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'cancel';
    cancel.style.cssText = `
      padding: 8px 12px;
      background: transparent;
      color: ${dark ? '#c7c7c7' : '#6a6a6a'};
      border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
      cursor: pointer;
      font-size: 11px;
      font-family: inherit;
    `;
    cancel.addEventListener('click', () => overlay.remove());
    actions.appendChild(cancel);
    modal.appendChild(actions);

    grid.addEventListener('click', async (event) => {
      const card = event.target.closest('[data-template-id]');
      if (!card) return;

      overlay.remove();
      await this.applyTemplate(card.dataset.templateId);
    });

    overlay.appendChild(modal);
    drawer.appendChild(overlay);
  },

  async applyTemplate(templateId) {
    const template = NoteTemplates.items.find(item => item.id === templateId);
    if (!template) return;

    const current = UI.getEditorValues();
    if (current.title || current.content) {
      const confirmed = await UI.showConfirm('Replace the current editor content with this template?', 'apply template', {
        confirmText: 'apply'
      });
      if (!confirmed) return;
    }

    const rendered = await NoteTemplates.render(template.content);
    const parsed = NoteTemplates.splitTitle(rendered);
    UI.get('bn-note-title').value = parsed.title.slice(0, Storage.maxTitleLength);
    UI.get('bn-editor').value = parsed.content;
    UI.updateTitleCharacterCount();
    UI.updateEditorCount();
    this.updateEditorSearch(false);
    this.handleInput();
    UI.get('bn-editor').focus({ preventScroll: true });
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

  printNote() {
    const { title, content } = UI.getEditorValues();
    if (!title && !content) return;

    this.renderPreview();

    const displayTitle = title || 'Untitled Note';
    const safeTitle = Utils.escapeHtml(displayTitle);
    const renderedContent = content
      ? Utils.markdownToHtml(content)
      : '<p style="margin: 12px 0; color: #777777;">empty note</p>';
    const printFrame = document.createElement('iframe');

    printFrame.setAttribute('aria-hidden', 'true');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '1px';
    printFrame.style.height = '1px';
    printFrame.style.border = '0';
    printFrame.style.opacity = '0';
    printFrame.style.pointerEvents = 'none';

    const cleanup = () => {
      setTimeout(() => printFrame.remove(), 250);
    };

    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
    printDocument.open();
    printDocument.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeTitle}</title>
  <style>
    @page {
      margin: 0;
      size: A4 portrait;
    }
    * { box-sizing: border-box; text-shadow: none !important; }
    html {
      background: #ffffff;
    }
    body {
      background: #ffffff;
      color: #1b1b1b;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Mono", "Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 13.5pt;
      font-weight: 400;
      line-height: 1.58;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    main {
      margin: 0;
      max-width: none;
      min-height: 100vh;
      padding: 16mm 18mm 18mm 18mm;
      width: 100%;
    }
    h1.bn-print-title {
      color: #111111;
      font-size: 27pt;
      font-weight: 750;
      letter-spacing: 0;
      line-height: 1.18;
      margin: 0 0 34px 0 !important;
      padding: 0 0 14px 0 !important;
      border-bottom: 1px solid #d8d8d8;
    }
    h1:not(.bn-print-title),
    h2,
    h3 {
      color: #151515;
      font-weight: 720;
      letter-spacing: 0;
      line-height: 1.24;
      margin: 34px 0 14px 0 !important;
      page-break-after: avoid;
    }
    h1:not(.bn-print-title) { font-size: 22pt; }
    h2 { font-size: 18pt; }
    h3 { font-size: 15.5pt; }
    p {
      line-height: 1.58 !important;
      margin: 0 0 18px 0 !important;
      orphans: 3;
      widows: 3;
    }
    p + p {
      margin-top: 4px !important;
    }
    p + h1,
    p + h2,
    p + h3,
    ul + h1,
    ul + h2,
    ul + h3,
    ol + h1,
    ol + h2,
    ol + h3,
    blockquote + h1,
    blockquote + h2,
    blockquote + h3,
    table + h1,
    table + h2,
    table + h3,
    .bn-code-block + h1,
    .bn-code-block + h2,
    .bn-code-block + h3 {
      margin-top: 40px !important;
    }
    a {
      color: #111111;
      text-decoration: underline;
      text-decoration-thickness: 0.08em;
      text-underline-offset: 0.14em;
    }
    ul,
    ol {
      margin: 12px 0 22px 0 !important;
      padding-left: 28px !important;
    }
    li {
      line-height: 1.55 !important;
      margin: 7px 0 !important;
    }
    li > span {
      line-height: 1.55 !important;
    }
    img {
      display: block;
      margin: 24px 0 !important;
      max-width: 100%;
      page-break-inside: avoid;
    }
    table {
      border-collapse: collapse;
      font-size: 12.5pt;
      line-height: 1.45;
      margin: 24px 0 !important;
      page-break-inside: avoid;
      width: 100%;
    }
    th, td {
      border: 1px solid #d2d2d2;
      padding: 9px 11px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f4f4f4;
      color: #111111;
      font-weight: 700;
    }
    blockquote {
      border-left: 4px solid #bdbdbd;
      color: #3f3f3f;
      font-size: 13pt;
      font-style: italic;
      line-height: 1.56;
      margin: 24px 0 !important;
      padding: 6px 0 6px 18px !important;
      page-break-inside: avoid;
    }
    code {
      background: #f3f3f3 !important;
      color: #202020 !important;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Mono", "Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace !important;
      font-size: 0.92em;
      text-shadow: none !important;
    }
    .bn-code-block {
      margin: 26px 0 !important;
      page-break-inside: avoid;
      position: relative;
    }
    .bn-code-block pre {
      background: #f7f7f7 !important;
      border: 1px solid #d8d8d8 !important;
      color: #202020 !important;
      font-size: 11.5pt;
      line-height: 1.48;
      margin: 0 !important;
      overflow: visible;
      padding: 16px 17px !important;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .bn-copy-code { display: none !important; }
  </style>
</head>
<body>
  <main>
    <h1 class="bn-print-title">${safeTitle}</h1>
    ${renderedContent}
  </main>
</body>
</html>`);
    printDocument.close();

    const printWindow = printFrame.contentWindow;
    printWindow.addEventListener('afterprint', cleanup, { once: true });

    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        console.error('Brow Notes: Error printing note:', error);
        cleanup();
      }
    }, 50);
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
      'code-block': () => this.wrapSelection('```\n', '\n```', 'code'),
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

    const scrollTop = editor.scrollTop;
    const scrollLeft = editor.scrollLeft;
    editor.value = `${editor.value.slice(0, start)}${replacement}${editor.value.slice(end)}`;
    editor.focus({ preventScroll: true });
    editor.setSelectionRange(selectionStart, selectionEnd);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.scrollTop = scrollTop;
    editor.scrollLeft = scrollLeft;
    this.syncEditorSearchHighlight();
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
