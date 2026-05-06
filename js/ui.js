// UI module - handles DOM manipulation and rendering
const UI = {
  // Get element by ID
  get(id) {
    return document.getElementById(id);
  },

  // Show/hide drawer
  showDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (drawer) drawer.style.transform = 'translateX(0)';
  },

  hideDrawer() {
    const drawer = this.get('bronotes-drawer');
    if (drawer) drawer.style.transform = 'translateX(100%)';
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
    }
  },

  // Update save button state
  updateSaveButton(enabled) {
    const saveBtn = this.get('bn-btn-save');
    if (!saveBtn) return;

    saveBtn.disabled = !enabled;
    saveBtn.style.opacity = enabled ? '1' : '0.5';
    saveBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  },

  // Show save feedback
  showSaveFeedback() {
    const saveBtn = this.get('bn-btn-save');
    if (!saveBtn) return;

    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'saved!';
    setTimeout(() => {
      saveBtn.textContent = originalText;
    }, 1000);
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
    this.get('bn-btn-delete').style.display = 'none';
  },

  // Load note to editor
  loadNoteToEditor(note) {
    this.get('bn-note-title').value = note.title || '';
    this.get('bn-note-label').value = note.label || '';
    this.get('bn-editor').value = note.content || '';
    this.get('bn-btn-delete').style.display = 'block';
  },

  // Get editor values
  getEditorValues() {
    return {
      title: this.get('bn-note-title').value.trim(),
      label: this.get('bn-note-label').value.trim(),
      content: this.get('bn-editor').value.trim()
    };
  },

  // Update label suggestions datalist
  updateLabelSuggestions(labels) {
    const datalist = this.get('bn-label-suggestions');
    if (!datalist) return;

    datalist.innerHTML = labels.map(label => 
      `<option value="${Utils.escapeHtml(label)}">`
    ).join('');
  },

  // Update label filter dropdown
  updateLabelFilter(labels, currentValue = '') {
    const filterSelect = this.get('bn-filter-label');
    if (!filterSelect) return;

    filterSelect.innerHTML = '<option value="">all labels</option>' +
      labels.map(label => 
        `<option value="${Utils.escapeHtml(label)}">${Utils.escapeHtml(label)}</option>`
      ).join('');
    
    filterSelect.value = currentValue;
  }
};
