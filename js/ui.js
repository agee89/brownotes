// UI module - handles DOM manipulation and rendering
const UI = {
  labelSuggestions: [],
  labelSuggestionIndex: -1,

  // Get element by ID
  get(id) {
    return document.getElementById(id);
  },

  // Show/hide drawer
  showDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (drawer) {
      drawer.dataset.collapsed = 'false';
      drawer.style.transform = 'translateX(0)';
      this.updateDrawerRibbon(false);
    }
  },

  hideDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (drawer) {
      drawer.dataset.collapsed = 'true';
      drawer.style.transform = 'translateX(100%)';
      this.updateDrawerRibbon(true);
    }
  },

  toggleDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (!drawer) return;

    if (drawer.dataset.collapsed === 'true') {
      this.showDrawer();
    } else {
      this.hideDrawer();
    }
  },

  updateDrawerRibbon(collapsed) {
    const button = this.get('bn-btn-drawer-ribbon');
    const icon = this.get('bn-drawer-ribbon-icon');
    const isCollapsed = !!collapsed;
    const label = isCollapsed ? 'open panel' : 'close panel';

    if (button) {
      button.title = label;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    }

    if (icon) {
      icon.src = Utils.assetUrl(isCollapsed ? 'icons/panel-left-close.png' : 'icons/panel-right-close.png');
    }
  },

  // Toggle transparent drawer mode
  setDrawerTransparent(enabled) {
    const drawer = this.get('bronotes-drawer');
    const button = this.get('bn-btn-transparency');
    const icon = this.get('bn-transparency-icon');
    if (!drawer) return;

    const dark = drawer.dataset.theme === 'dark';
    drawer.dataset.transparent = enabled ? 'true' : 'false';
    drawer.style.setProperty(
      'background',
      enabled ? (dark ? 'rgba(20, 20, 20, 0.52)' : 'rgba(255, 255, 255, 0.38)') : (dark ? '#181818' : '#ffffff'),
      'important'
    );
    drawer.style.setProperty(
      'box-shadow',
      enabled ? 'none' : (dark ? '-1px 0 0 #303030' : '-1px 0 0 #e0e0e0'),
      'important'
    );

    if (button) {
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      button.style.opacity = enabled ? '1' : '0.72';
    }

    if (icon) {
      icon.src = Utils.assetUrl(enabled ? 'icons/eye-off.png' : 'icons/eye.png');
    }
  },

  // Toggle light/dark drawer theme
  setDrawerTheme(theme) {
    const drawer = this.get('bronotes-drawer');
    const button = this.get('bn-btn-theme');
    const icon = this.get('bn-theme-icon');
    if (!drawer) return;

    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const dark = nextTheme === 'dark';
    drawer.dataset.theme = nextTheme;

    if (button) {
      const label = dark ? 'switch to light mode' : 'switch to dark mode';
      button.title = label;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      button.style.opacity = dark ? '1' : '0.72';
    }

    if (icon) {
      icon.src = Utils.assetUrl(dark ? 'icons/light.png' : 'icons/dark.png');
    }

    this.setDrawerTransparent(drawer.dataset.transparent === 'true');
    if (typeof App !== 'undefined' && App.currentView) {
      this.switchView(App.currentView);
    }
  },

  // Switch view
  switchView(view) {
    const drawer = this.get('bronotes-drawer');
    const dark = drawer?.dataset.theme === 'dark';
    const activeColor = dark ? '#ffffff' : '#2a2a2a';

    // Hide all views
    ['home', 'allnotes', 'editor', 'labels', 'trash', 'settings'].forEach(v => {
      const el = this.get(`bn-${v}-view`);
      if (el) el.style.display = 'none';
    });

    // Reset navigation
    ['home', 'allnotes', 'labels', 'trash', 'settings'].forEach(nav => {
      const btn = this.get(`bn-nav-${nav}`);
      if (btn) {
        btn.style.color = '#9a9a9a';
        btn.style.setProperty('border-bottom', '2px solid transparent', 'important');
        const icon = btn.querySelector('img');
        if (icon) icon.style.opacity = '0.45';
      }
    });

    // Show selected view
    const viewEl = this.get(`bn-${view}-view`);
    if (viewEl) {
      viewEl.style.display = view === 'home' ? 'flex' : 
                             view === 'allnotes' ? 'flex' : 
                             view === 'editor' ? 'flex' : 
                             view === 'labels' ? 'flex' : 
                             view === 'trash' ? 'flex' : 
                             view === 'settings' ? 'flex' : 'none';
    }

    // Highlight navigation
    const navBtn = this.get(`bn-nav-${view}`);
    if (navBtn) {
      navBtn.style.color = activeColor;
      navBtn.style.setProperty('border-bottom', `2px solid ${activeColor}`, 'important');
      const icon = navBtn.querySelector('img');
      if (icon) icon.style.opacity = '1';
    }
  },

  // Update save button state
  updateSaveButton(enabled) {
    const saveBtn = this.get('bn-btn-save');
    if (!saveBtn) return;

    saveBtn.disabled = !enabled;
    saveBtn.style.opacity = enabled ? '1' : '0.5';
    saveBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    this.updateExportMdButton(enabled);
    if (!enabled) {
      this.setSaveStatus('empty');
    }
  },

  updateExportMdButton(enabled) {
    const exportBtn = this.get('bn-btn-export-md');
    if (!exportBtn) return;

    exportBtn.disabled = !enabled;
    exportBtn.style.opacity = enabled ? '1' : '0.45';
    exportBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    exportBtn.style.color = enabled ? '#2a2a2a' : '#9a9a9a';
    exportBtn.setAttribute('aria-disabled', String(!enabled));
  },

  updateEditorCount() {
    const counter = this.get('bn-editor-count');
    const editor = this.get('bn-editor');
    if (!counter || !editor) return;

    const content = editor.value || '';
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    counter.textContent = `${words} ${words === 1 ? 'word' : 'words'} / ${chars} ${chars === 1 ? 'char' : 'chars'}`;
  },

  setSaveStatus(status) {
    const saveBtn = this.get('bn-btn-save');
    if (!saveBtn) return;

    const savedIcon = Utils.assetUrl('icons/saved.png');
    const states = {
      empty: {
        html: 'save',
        opacity: '0.5',
        cursor: 'not-allowed',
        disabled: true
      },
      dirty: {
        html: 'save',
        opacity: '1',
        cursor: 'pointer',
        disabled: false
      },
      saved: {
        html: `<img src="${savedIcon}" alt="" style="width: 13px; height: 13px; display: block; pointer-events: none;" /><span>saved</span>`,
        opacity: '0.78',
        cursor: 'default',
        disabled: false
      },
      saving: {
        html: 'saving...',
        opacity: '0.78',
        cursor: 'progress',
        disabled: true
      }
    };

    const state = states[status] || states.dirty;
    saveBtn.innerHTML = state.html;
    saveBtn.style.opacity = state.opacity;
    saveBtn.style.cursor = state.cursor;
    saveBtn.disabled = state.disabled;
  },

  // Show save feedback
  showSaveFeedback() {
    this.setSaveStatus('saved');
  },

  // In-drawer modal dialog
  showModal({ title, message, input = false, defaultValue = '', confirmText = 'ok', cancelText = 'cancel', danger = false, inputMaxLength = null, inputCounter = false }) {
    return new Promise((resolve) => {
      const drawer = this.get('bronotes-drawer');
      if (!drawer) {
        resolve(input ? defaultValue : true);
        return;
      }

      const existingModal = this.get('bn-modal-overlay');
      if (existingModal) existingModal.remove();

      const overlay = document.createElement('div');
      overlay.id = 'bn-modal-overlay';
      const dark = drawer.dataset.theme === 'dark';
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
        max-width: 360px;
        background: ${dark ? '#202020' : '#ffffff'};
        border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
        box-shadow: 0 12px 36px ${dark ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0.16)'};
        padding: 18px;
        box-sizing: border-box;
      `;
      modal.style.setProperty('background', dark ? '#202020' : '#ffffff', 'important');
      modal.style.setProperty('border-color', dark ? '#3a3a3a' : '#e0e0e0', 'important');

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.cssText = `font-size: 13px; font-weight: 600; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; margin-bottom: 8px; letter-spacing: 0.5px;`;
      titleEl.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
      modal.appendChild(titleEl);

      if (message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `font-size: 12px; line-height: 1.6; color: ${dark ? '#c7c7c7' : '#6a6a6a'}; margin-bottom: 14px;`;
        messageEl.style.setProperty('color', dark ? '#c7c7c7' : '#6a6a6a', 'important');
        modal.appendChild(messageEl);
      }

      let inputEl = null;
      let inputCounterEl = null;
      if (input) {
        inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = defaultValue;
        if (inputMaxLength) inputEl.maxLength = inputMaxLength;
        inputEl.style.cssText = `
          width: 100%;
          padding: 10px 12px;
          border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
          background: ${dark ? '#181818' : 'transparent'};
          color: ${dark ? '#f1f1f1' : '#2a2a2a'};
          font-size: 12px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          margin-bottom: ${inputCounter ? '6px' : '16px'};
        `;
        inputEl.style.setProperty('background', dark ? '#181818' : 'transparent', 'important');
        inputEl.style.setProperty('border-color', dark ? '#3a3a3a' : '#e0e0e0', 'important');
        inputEl.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
        modal.appendChild(inputEl);

        if (inputCounter && inputMaxLength) {
          inputCounterEl = document.createElement('div');
          inputCounterEl.style.cssText = `font-size: 10px; line-height: 1.4; text-align: right; margin-bottom: 14px; color: ${dark ? '#9f9f9f' : '#9a9a9a'};`;
          inputCounterEl.style.setProperty('color', dark ? '#9f9f9f' : '#9a9a9a', 'important');
          const updateInputCounter = () => {
            const length = inputEl.value.length;
            inputCounterEl.textContent = `${length}/${inputMaxLength}`;
            inputCounterEl.style.setProperty('color', length >= inputMaxLength ? '#dc3545' : (dark ? '#9f9f9f' : '#9a9a9a'), 'important');
          };
          inputEl.addEventListener('input', updateInputCounter);
          updateInputCounter();
          modal.appendChild(inputCounterEl);
        }
      }

      const actions = document.createElement('div');
      actions.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

      const close = (value) => {
        overlay.remove();
        resolve(value);
      };

      if (cancelText) {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = cancelText;
        cancelButton.style.cssText = `
          padding: 8px 12px;
          background: transparent;
          color: ${dark ? '#d8d8d8' : '#6a6a6a'};
          border: 1px solid ${dark ? '#555555' : '#e0e0e0'};
          cursor: pointer;
          font-size: 11px;
          font-family: inherit;
        `;
        cancelButton.style.setProperty('background', 'transparent', 'important');
        cancelButton.style.setProperty('border-color', dark ? '#555555' : '#e0e0e0', 'important');
        cancelButton.style.setProperty('color', dark ? '#d8d8d8' : '#6a6a6a', 'important');
        cancelButton.addEventListener('click', () => close(input ? null : false));
        actions.appendChild(cancelButton);
      }

      const confirmButton = document.createElement('button');
      confirmButton.type = 'button';
      confirmButton.textContent = confirmText;
      confirmButton.style.cssText = `
        padding: 8px 12px;
        background: ${danger ? '#dc3545' : (dark ? '#f1f1f1' : '#2a2a2a')};
        color: ${danger ? '#ffffff' : (dark ? '#181818' : '#ffffff')};
        border: 1px solid ${danger ? '#dc3545' : (dark ? '#f1f1f1' : '#2a2a2a')};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
      `;
      confirmButton.style.setProperty('background', danger ? '#dc3545' : (dark ? '#f1f1f1' : '#2a2a2a'), 'important');
      confirmButton.style.setProperty('border-color', danger ? '#dc3545' : (dark ? '#f1f1f1' : '#2a2a2a'), 'important');
      confirmButton.style.setProperty('color', danger ? '#ffffff' : (dark ? '#181818' : '#ffffff'), 'important');
      confirmButton.addEventListener('click', () => close(input ? inputEl.value : true));
      actions.appendChild(confirmButton);

      modal.appendChild(actions);
      overlay.appendChild(modal);
      drawer.appendChild(overlay);

      overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close(input ? null : false);
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          close(input ? inputEl.value : true);
        }
      });

      requestAnimationFrame(() => {
        (inputEl || confirmButton).focus();
        if (inputEl) inputEl.select();
      });
    });
  },

  showAlert(message, title = 'notice') {
    return this.showModal({ title, message, confirmText: 'ok', cancelText: '' });
  },

  showConfirm(message, title = 'confirm', options = {}) {
    return this.showModal({
      title,
      message,
      confirmText: options.confirmText || 'ok',
      cancelText: options.cancelText || 'cancel',
      danger: options.danger || false
    });
  },

  showPrompt(message, defaultValue = '', title = 'input') {
    return this.showModal({
      title,
      message,
      input: true,
      defaultValue,
      confirmText: 'save',
      cancelText: 'cancel'
    });
  },

  showLimitedPrompt(message, defaultValue = '', title = 'input', maxLength = 32) {
    return this.showModal({
      title,
      message,
      input: true,
      defaultValue,
      confirmText: 'save',
      cancelText: 'cancel',
      inputMaxLength: maxLength,
      inputCounter: true
    });
  },

  // Switch editor tab
  switchEditorTab(tab) {
    const editTab = this.get('bn-tab-edit');
    const previewTab = this.get('bn-tab-preview');
    const editorContainer = this.get('bn-editor-container');
    const previewContainer = this.get('bn-preview-container');
    const editorToolbar = this.get('bn-editor-toolbar');

    if (tab === 'edit') {
      editTab.style.color = '#2a2a2a';
      editTab.style.borderBottom = '2px solid #2a2a2a';
      previewTab.style.color = '#9a9a9a';
      previewTab.style.borderBottom = '2px solid transparent';
      if (editorToolbar) editorToolbar.style.display = 'flex';
      editorContainer.style.display = 'flex';
      previewContainer.style.display = 'none';
    } else {
      editTab.style.color = '#9a9a9a';
      editTab.style.borderBottom = '2px solid transparent';
      previewTab.style.color = '#2a2a2a';
      previewTab.style.borderBottom = '2px solid #2a2a2a';
      if (editorToolbar) editorToolbar.style.display = 'none';
      editorContainer.style.display = 'none';
      previewContainer.style.display = 'block';
    }
  },

  // Clear editor form
  clearEditor() {
    this.get('bn-note-title').value = '';
    this.get('bn-note-label').value = '';
    this.get('bn-editor').value = '';
    this.updateEditorCount();
    this.updateTitleCharacterCount();
    this.updateLabelCharacterCount();
    this.setFavoriteToggle(false);
    this.setKingToggle(false);
    this.setPinnedToggle(false);
    this.get('bn-btn-delete').style.display = 'none';
  },

  // Load note to editor
  loadNoteToEditor(note) {
    this.get('bn-note-title').value = note.title || '';
    this.get('bn-note-label').value = note.label || '';
    this.get('bn-editor').value = note.content || '';
    this.updateEditorCount();
    this.updateTitleCharacterCount();
    this.updateLabelCharacterCount();
    this.setFavoriteToggle(!!note.favorite);
    this.setKingToggle(!!note.king);
    this.setPinnedToggle(!!note.pinned);
    this.get('bn-btn-delete').style.display = 'block';
  },

  // Get editor values
  getEditorValues() {
    return {
      title: this.get('bn-note-title').value.trim().slice(0, Storage.maxTitleLength),
      label: Storage.normalizeLabel(this.get('bn-note-label').value),
      content: this.get('bn-editor').value.trim(),
      favorite: this.get('bn-note-favorite')?.dataset.active === 'true',
      king: this.get('bn-note-king')?.dataset.active === 'true',
      pinned: this.get('bn-note-pinned')?.dataset.active === 'true'
    };
  },

  setFavoriteToggle(active) {
    const button = this.get('bn-note-favorite');
    if (!button) return;

    const enabled = !!active;
    const icon = button.querySelector('img');
    button.dataset.active = String(enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'remove favorite' : 'favorite note';
    button.setAttribute('aria-label', button.title);
    if (icon) {
      icon.src = Utils.assetUrl(enabled ? 'icons/bookmarked.png' : 'icons/bookmark.png');
    }
  },

  setKingToggle(active) {
    const button = this.get('bn-note-king');
    if (!button) return;

    const enabled = !!active;
    const icon = button.querySelector('img');
    button.dataset.active = String(enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'remove king note' : 'make king note';
    button.setAttribute('aria-label', button.title);
    if (icon) {
      icon.src = Utils.assetUrl(enabled ? 'icons/crowned.png' : 'icons/crown.png');
    }
  },

  setPinnedToggle(active) {
    const button = this.get('bn-note-pinned');
    if (!button) return;

    const enabled = !!active;
    const icon = button.querySelector('img');
    button.dataset.active = String(enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'unpin note' : 'pin note';
    button.setAttribute('aria-label', button.title);
    if (icon) {
      icon.src = Utils.assetUrl(enabled ? 'icons/pinned.png' : 'icons/pin.png');
    }
  },

  setFavoriteFilter(active) {
    const button = this.get('bn-filter-favorite');
    if (!button) return;

    const enabled = !!active;
    const icon = button.querySelector('img');
    button.dataset.active = String(enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'show all notes' : 'show favorite notes';
    button.setAttribute('aria-label', button.title);
    if (icon) {
      icon.src = Utils.assetUrl(enabled ? 'icons/bookmarked.png' : 'icons/bookmark.png');
    }
  },

  setLabelFilterLock(locked) {
    const button = this.get('bn-filter-label-lock');
    const icon = this.get('bn-filter-label-lock-icon');
    if (!button || !icon) return;

    const enabled = !!locked;
    button.dataset.active = String(enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'unlock label filter' : 'lock label filter';
    button.setAttribute('aria-label', button.title);
    button.style.opacity = enabled ? '1' : '0.72';
    icon.src = Utils.assetUrl(enabled ? 'icons/locked.png' : 'icons/unlocked.png');
  },

  // Update label suggestions
  updateLabelSuggestions(labels) {
    this.labelSuggestions = labels || [];
    this.renderLabelAutocomplete();
  },

  getLabelInputValue() {
    return Storage.normalizeLabel(this.get('bn-note-label')?.value || '');
  },

  updateLabelCharacterCount() {
    const input = this.get('bn-note-label');
    const counter = this.get('bn-note-label-count');
    if (!input || !counter) return;

    const length = input.value.length;
    counter.textContent = `${length}/${Storage.maxLabelLength}`;
    counter.style.color = length >= Storage.maxLabelLength ? '#dc3545' : '#9a9a9a';
  },

  updateTitleCharacterCount() {
    const input = this.get('bn-note-title');
    const counter = this.get('bn-note-title-count');
    if (!input || !counter) return;

    const length = input.value.length;
    counter.textContent = `${length}/${Storage.maxTitleLength}`;
    counter.style.color = length >= Storage.maxTitleLength ? '#dc3545' : '#9a9a9a';
  },

  getLabelMenuItems() {
    const query = this.getLabelInputValue();
    const lowerQuery = query.toLowerCase();
    const matches = this.labelSuggestions
      .filter(label => label.toLowerCase().includes(lowerQuery))
      .slice(0, 8)
      .map(label => ({ type: 'select', label }));
    const exactMatch = this.labelSuggestions.some(label => label.toLowerCase() === lowerQuery);

    if (query && !exactMatch) {
      matches.push({ type: 'create', label: query });
    }

    return matches;
  },

  renderLabelAutocomplete() {
    const input = this.get('bn-note-label');
    const menu = this.get('bn-label-autocomplete');
    if (!input || !menu) return;

    if (input.value !== Storage.normalizeLabel(input.value)) {
      input.value = Storage.normalizeLabel(input.value);
    }
    this.updateLabelCharacterCount();

    const items = this.getLabelMenuItems();

    if (items.length === 0 || document.activeElement !== input) {
      this.hideLabelAutocomplete();
      return;
    }

    if (this.labelSuggestionIndex >= items.length) {
      this.labelSuggestionIndex = items.length - 1;
    }

    menu.innerHTML = items.map((item, index) =>
      `<button type="button" class="bn-label-option" data-action="${item.type}" data-label="${Utils.escapeHtml(item.label)}" style="width: 100%; padding: 8px 10px; background: ${index === this.labelSuggestionIndex ? '#f3f3f3' : 'transparent'}; color: #2a2a2a; border: none; cursor: pointer; display: block; text-align: left; font-size: 12px; font-family: inherit;">${item.type === 'create' ? `+ create label "${Utils.escapeHtml(item.label)}"` : Utils.escapeHtml(item.label)}</button>`
    ).join('');

    menu.style.display = 'block';
    menu.querySelectorAll('.bn-label-option').forEach(button => {
      button.addEventListener('mousedown', (event) => {
        event.preventDefault();
        if (button.dataset.action === 'create') {
          this.createLabelFromInput(button.dataset.label);
        } else {
          this.selectLabelSuggestion(button.dataset.label);
        }
      });
    });
  },

  showLabelAutocomplete() {
    this.labelSuggestionIndex = -1;
    this.renderLabelAutocomplete();
  },

  hideLabelAutocomplete() {
    const menu = this.get('bn-label-autocomplete');
    if (menu) menu.style.display = 'none';
    this.labelSuggestionIndex = -1;
  },

  handleLabelAutocompleteKey(event) {
    const items = this.getLabelMenuItems();

    if (event.key === 'Escape') {
      this.hideLabelAutocomplete();
      return;
    }

    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.labelSuggestionIndex = Math.min(this.labelSuggestionIndex + 1, items.length - 1);
      this.renderLabelAutocomplete();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.labelSuggestionIndex = Math.max(this.labelSuggestionIndex - 1, 0);
      this.renderLabelAutocomplete();
    } else if (event.key === 'Enter' && this.labelSuggestionIndex >= 0) {
      event.preventDefault();
      const item = items[this.labelSuggestionIndex];
      if (item.type === 'create') {
        this.createLabelFromInput(item.label);
      } else {
        this.selectLabelSuggestion(item.label);
      }
    }
  },

  async createLabelFromInput(label) {
    const normalized = Storage.normalizeLabel(label);
    if (!normalized) return;

    this.hideLabelAutocomplete();
    const confirmed = await this.showConfirm(`Create label "${normalized}"?`, 'create label', {
      confirmText: 'create',
      cancelText: 'cancel'
    });
    if (!confirmed) return;

    const createdLabel = await Storage.addLabel(normalized);
    const labels = await Storage.getLabels();
    this.updateLabelSuggestions(labels);
    this.selectLabelSuggestion(createdLabel || normalized);
  },

  selectLabelSuggestion(label) {
    const input = this.get('bn-note-label');
    if (!input) return;

    input.value = label;
    this.updateLabelCharacterCount();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    this.hideLabelAutocomplete();
    input.focus();
  },

  // Update label filter dropdown
  updateLabelFilter(labels, currentValue = '') {
    const filterSelect = this.get('bn-filter-label');
    if (!filterSelect) return;

    filterSelect.innerHTML = '<option value="">all labels</option><option value="__NO_LABEL__">no label</option>' +
      labels.map(label => 
        `<option value="${Utils.escapeHtml(label)}">${Utils.escapeHtml(label)}</option>`
      ).join('');
    
    filterSelect.value = currentValue;
  }
};
