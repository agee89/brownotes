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
    }
  },

  hideDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (drawer) {
      drawer.dataset.collapsed = 'true';
      drawer.style.transform = 'translateX(100%)';
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

  // Toggle transparent drawer mode
  setDrawerTransparent(enabled) {
    const drawer = this.get('bronotes-drawer');
    const button = this.get('bn-btn-transparency');
    const icon = this.get('bn-transparency-icon');
    if (!drawer) return;

    drawer.dataset.transparent = enabled ? 'true' : 'false';
    drawer.style.setProperty('background', enabled ? 'rgba(255, 255, 255, 0.38)' : '#ffffff', 'important');
    drawer.style.setProperty(
      'box-shadow',
      enabled ? 'none' : '-1px 0 0 #e0e0e0',
      'important'
    );

    if (button) {
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      button.style.opacity = enabled ? '1' : '0.72';
    }

    if (icon) {
      icon.src = chrome.runtime.getURL(enabled ? 'icons/eye-off.png' : 'icons/eye.png');
    }
  },

  // Switch view
  switchView(view) {
    // Hide all views
    ['home', 'allnotes', 'editor', 'labels', 'settings'].forEach(v => {
      const el = this.get(`bn-${v}-view`);
      if (el) el.style.display = 'none';
    });

    // Reset navigation
    ['home', 'allnotes', 'labels', 'settings'].forEach(nav => {
      const btn = this.get(`bn-nav-${nav}`);
      if (btn) {
        btn.style.color = '#9a9a9a';
        btn.style.borderBottom = '2px solid transparent';
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
                             view === 'settings' ? 'flex' : 'none';
    }

    // Highlight navigation
    const navBtn = this.get(`bn-nav-${view}`);
    if (navBtn) {
      navBtn.style.color = '#2a2a2a';
      navBtn.style.borderBottom = '2px solid #2a2a2a';
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
    if (!enabled) {
      this.setSaveStatus('empty');
    }
  },

  setSaveStatus(status) {
    const saveBtn = this.get('bn-btn-save');
    if (!saveBtn) return;

    const savedIcon = chrome.runtime.getURL('icons/saved.png');
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
  showModal({ title, message, input = false, defaultValue = '', confirmText = 'ok', cancelText = 'cancel', danger = false }) {
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
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        z-index: 10;
        background: rgba(255,255,255,0.72);
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
        background: #ffffff;
        border: 1px solid #e0e0e0;
        box-shadow: 0 12px 36px rgba(0,0,0,0.16);
        padding: 18px;
        box-sizing: border-box;
      `;

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.cssText = 'font-size: 13px; font-weight: 600; color: #2a2a2a; margin-bottom: 8px; letter-spacing: 0.5px;';
      modal.appendChild(titleEl);

      if (message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = 'font-size: 12px; line-height: 1.6; color: #6a6a6a; margin-bottom: 14px;';
        modal.appendChild(messageEl);
      }

      let inputEl = null;
      if (input) {
        inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = defaultValue;
        inputEl.style.cssText = `
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          background: transparent;
          color: #2a2a2a;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 16px;
        `;
        modal.appendChild(inputEl);
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
          color: #6a6a6a;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          font-size: 11px;
          font-family: inherit;
        `;
        cancelButton.addEventListener('click', () => close(input ? null : false));
        actions.appendChild(cancelButton);
      }

      const confirmButton = document.createElement('button');
      confirmButton.type = 'button';
      confirmButton.textContent = confirmText;
      confirmButton.style.cssText = `
        padding: 8px 12px;
        background: ${danger ? '#dc3545' : '#2a2a2a'};
        color: #ffffff;
        border: 1px solid ${danger ? '#dc3545' : '#2a2a2a'};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
      `;
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

  // Switch editor tab
  switchEditorTab(tab) {
    const editTab = this.get('bn-tab-edit');
    const previewTab = this.get('bn-tab-preview');
    const editorContainer = this.get('bn-editor-container');
    const previewContainer = this.get('bn-preview-container');

    if (tab === 'edit') {
      editTab.style.color = '#2a2a2a';
      editTab.style.borderBottom = '2px solid #2a2a2a';
      previewTab.style.color = '#9a9a9a';
      previewTab.style.borderBottom = '2px solid transparent';
      editorContainer.style.display = 'flex';
      previewContainer.style.display = 'none';
    } else {
      editTab.style.color = '#9a9a9a';
      editTab.style.borderBottom = '2px solid transparent';
      previewTab.style.color = '#2a2a2a';
      previewTab.style.borderBottom = '2px solid #2a2a2a';
      editorContainer.style.display = 'none';
      previewContainer.style.display = 'block';
    }
  },

  // Clear editor form
  clearEditor() {
    this.get('bn-note-title').value = '';
    this.get('bn-note-label').value = '';
    this.get('bn-editor').value = '';
    this.setFavoriteToggle(false);
    this.get('bn-btn-delete').style.display = 'none';
  },

  // Load note to editor
  loadNoteToEditor(note) {
    this.get('bn-note-title').value = note.title || '';
    this.get('bn-note-label').value = note.label || '';
    this.get('bn-editor').value = note.content || '';
    this.setFavoriteToggle(!!note.favorite);
    this.get('bn-btn-delete').style.display = 'block';
  },

  // Get editor values
  getEditorValues() {
    return {
      title: this.get('bn-note-title').value.trim(),
      label: this.get('bn-note-label').value.trim(),
      content: this.get('bn-editor').value.trim(),
      favorite: this.get('bn-note-favorite')?.dataset.active === 'true'
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
      icon.src = chrome.runtime.getURL(enabled ? 'icons/bookmarked.png' : 'icons/bookmark.png');
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
      icon.src = chrome.runtime.getURL(enabled ? 'icons/bookmarked.png' : 'icons/bookmark.png');
    }
  },

  // Update label suggestions
  updateLabelSuggestions(labels) {
    this.labelSuggestions = labels || [];
    this.renderLabelAutocomplete();
  },

  renderLabelAutocomplete() {
    const input = this.get('bn-note-label');
    const menu = this.get('bn-label-autocomplete');
    if (!input || !menu) return;

    const query = input.value.trim().toLowerCase();
    const matches = this.labelSuggestions
      .filter(label => label.toLowerCase().includes(query))
      .slice(0, 8);

    if (matches.length === 0 || document.activeElement !== input) {
      this.hideLabelAutocomplete();
      return;
    }

    if (this.labelSuggestionIndex >= matches.length) {
      this.labelSuggestionIndex = matches.length - 1;
    }

    menu.innerHTML = matches.map((label, index) =>
      `<button type="button" class="bn-label-option" data-label="${Utils.escapeHtml(label)}" style="width: 100%; padding: 8px 10px; background: ${index === this.labelSuggestionIndex ? '#f3f3f3' : 'transparent'}; color: #2a2a2a; border: none; cursor: pointer; display: block; text-align: left; font-size: 12px; font-family: inherit;">${Utils.escapeHtml(label)}</button>`
    ).join('');

    menu.style.display = 'block';
    menu.querySelectorAll('.bn-label-option').forEach(button => {
      button.addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.selectLabelSuggestion(button.dataset.label);
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
    const input = this.get('bn-note-label');
    const query = input.value.trim().toLowerCase();
    const matches = this.labelSuggestions
      .filter(label => label.toLowerCase().includes(query))
      .slice(0, 8);

    if (event.key === 'Escape') {
      this.hideLabelAutocomplete();
      return;
    }

    if (matches.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.labelSuggestionIndex = Math.min(this.labelSuggestionIndex + 1, matches.length - 1);
      this.renderLabelAutocomplete();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.labelSuggestionIndex = Math.max(this.labelSuggestionIndex - 1, 0);
      this.renderLabelAutocomplete();
    } else if (event.key === 'Enter' && this.labelSuggestionIndex >= 0) {
      event.preventDefault();
      this.selectLabelSuggestion(matches[this.labelSuggestionIndex]);
    }
  },

  selectLabelSuggestion(label) {
    const input = this.get('bn-note-label');
    if (!input) return;

    input.value = label;
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
