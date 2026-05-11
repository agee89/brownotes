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
      drawer.classList.remove('animate-drawer-shake');
      void drawer.offsetWidth;
      drawer.classList.add('animate-drawer-shake');
      drawer.addEventListener('animationend', () => {
        drawer.classList.remove('animate-drawer-shake');
      }, { once: true });
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
      icon.src = Utils.assetUrl(isCollapsed ? 'icons/slide-in.svg' : 'icons/slide-out.svg');
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
      icon.src = Utils.assetUrl(enabled ? 'icons/eye-off.svg' : 'icons/eye.svg');
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
      icon.src = Utils.assetUrl(dark ? 'icons/light.svg' : 'icons/dark.svg');
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
    this.updatePrintButton(enabled);
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

  updatePrintButton(enabled) {
    const printBtn = this.get('bn-btn-print-note');
    if (!printBtn) return;

    printBtn.disabled = !enabled;
    printBtn.style.opacity = enabled ? '1' : '0.45';
    printBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    printBtn.style.color = enabled ? '#2a2a2a' : '#9a9a9a';
    printBtn.setAttribute('aria-disabled', String(!enabled));
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

  updateHistoryDropdown(history = []) {
    const button = this.get('bn-history-button');
    const menu = this.get('bn-history-menu');
    if (!button || !menu) return;

    const versions = Array.isArray(history) ? history : [];
    button.disabled = versions.length === 0;
    button.textContent = versions.length ? `version ${this.formatHistoryVersionTime(versions[0].snapshotAt)} ▾` : 'version --.-- ▾';
    button.setAttribute('aria-disabled', String(versions.length === 0));

    if (!versions.length) {
      menu.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      menu.innerHTML = '';
      return;
    }

    menu.innerHTML = versions.map((item, index) => {
      const preview = Utils.escapeHtml((item.title || item.content || 'untitled note').replace(/\s+/g, ' ').slice(0, 64));
      const time = Utils.escapeHtml(this.formatHistoryVersionTime(item.snapshotAt));
      const relative = Utils.escapeHtml(this.formatHistoryRelativeTime(item.snapshotAt));
      return `<button class="bn-history-option" type="button" data-history-index="${index}"><span class="bn-history-time">version ${time}</span><span class="bn-history-preview">${relative} · ${preview}</span></button>`;
    }).join('');
  },

  toggleHistoryDropdown() {
    const button = this.get('bn-history-button');
    const menu = this.get('bn-history-menu');
    if (!button || !menu || button.disabled) return;

    const open = menu.style.display === 'block';
    menu.style.display = open ? 'none' : 'block';
    button.setAttribute('aria-expanded', open ? 'false' : 'true');
  },

  hideHistoryDropdown() {
    const button = this.get('bn-history-button');
    const menu = this.get('bn-history-menu');
    if (!button || !menu) return;

    menu.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');
  },

  formatHistoryVersionTime(timestamp) {
    const date = new Date(timestamp || Date.now());
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
  },

  formatHistoryRelativeTime(timestamp) {
    const date = new Date(timestamp || Date.now());
    const diff = Date.now() - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();

    if (diff < minute) return 'just now';
    if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
    if (sameDay) return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (diff < 2 * day) {
      return `Yesterday ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  setContextCaptureButtonState(enabled) {
    const button = this.get('bn-btn-context');
    if (!button) return;

    button.disabled = !enabled;
    button.setAttribute('aria-disabled', String(!enabled));
    button.title = enabled ? 'capture page context' : 'page context unavailable';
    button.setAttribute('aria-label', button.title);
  },

  showContextCaptureModal(context) {
    return new Promise((resolve) => {
      const drawer = this.get('bronotes-drawer');
      if (!drawer) {
        resolve(false);
        return;
      }

      const existingModal = this.get('bn-modal-overlay');
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
        padding: 18px;
        box-sizing: border-box;
        backdrop-filter: blur(2px);
      `;

      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.style.cssText = `
        width: 100%;
        max-width: 380px;
        background: ${dark ? '#202020' : '#ffffff'};
        border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
        box-shadow: 0 12px 32px ${dark ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0.14)'};
        padding: 16px;
        box-sizing: border-box;
      `;
      modal.style.setProperty('background', dark ? '#202020' : '#ffffff', 'important');

      const title = document.createElement('div');
      title.textContent = 'web reference';
      title.style.cssText = `font-size: 13px; font-weight: 650; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; margin-bottom: 12px; letter-spacing: 0.4px;`;
      title.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
      modal.appendChild(title);

      const list = document.createElement('div');
      list.style.cssText = `border-top: 1px solid ${dark ? '#333333' : '#eeeeee'};`;
      const rows = [
        ['Title', context.title || 'Untitled page'],
        ['URL', context.url],
        ['Description', context.description || 'No description detected']
      ];

      rows.forEach(([label, value]) => {
        const row = document.createElement('div');
        row.style.cssText = `display: grid; grid-template-columns: 78px minmax(0, 1fr); gap: 10px; padding: 9px 0; border-bottom: 1px solid ${dark ? '#333333' : '#eeeeee'};`;

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = `font-size: 10px; color: ${dark ? '#9f9f9f' : '#7a7a7a'}; line-height: 1.45;`;

        const valueEl = document.createElement('div');
        valueEl.textContent = value;
        valueEl.style.cssText = `font-size: 11px; color: ${dark ? '#e8e8e8' : '#2a2a2a'}; line-height: 1.45; overflow-wrap: anywhere;`;
        valueEl.style.setProperty('color', dark ? '#e8e8e8' : '#2a2a2a', 'important');

        row.appendChild(labelEl);
        row.appendChild(valueEl);
        list.appendChild(row);
      });
      modal.appendChild(list);

      const actions = document.createElement('div');
      actions.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end; margin-top: 13px;';
      const close = (value) => {
        overlay.remove();
        resolve(value);
      };

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'cancel';
      cancelButton.style.cssText = `
        min-width: 68px;
        padding: 7px 12px;
        background: transparent;
        color: ${dark ? '#d8d8d8' : '#6a6a6a'};
        border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
        letter-spacing: 0.3px;
      `;
      cancelButton.onclick = () => close(false);

      const insertButton = document.createElement('button');
      insertButton.type = 'button';
      insertButton.textContent = 'insert';
      insertButton.style.cssText = `
        min-width: 68px;
        padding: 7px 12px;
        background: ${dark ? '#f1f1f1' : '#2a2a2a'};
        color: ${dark ? '#181818' : '#ffffff'};
        border: 1px solid ${dark ? '#f1f1f1' : '#2a2a2a'};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
        letter-spacing: 0.3px;
      `;
      insertButton.onclick = () => close(true);

      actions.appendChild(cancelButton);
      actions.appendChild(insertButton);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      drawer.appendChild(overlay);

      overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close(false);
        }
      });
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close(false);
      });
      insertButton.focus();
    });
  },

  showPreferencesModal(preferences) {
    return new Promise((resolve) => {
      const drawer = this.get('bronotes-drawer');
      if (!drawer) {
        resolve(null);
        return;
      }

      const existingModal = this.get('bn-modal-overlay');
      if (existingModal) existingModal.remove();

      const dark = drawer.dataset.theme === 'dark';
      const state = {
        openNotesIn: preferences?.openNotesIn === 'preview' ? 'preview' : 'edit',
        autoSaveDelay: Number(preferences?.autoSaveDelay) || Constants.DEFAULTS.AUTO_SAVE_DELAY,
        autoBackupEnabled: preferences?.autoBackupEnabled !== false,
        autoBackupDelay: Number(preferences?.autoBackupDelay) || Constants.DEFAULTS.AUTO_BACKUP_DELAY,
        maxHistoryEntries: Number(preferences?.maxHistoryEntries) || Constants.DEFAULTS.MAX_HISTORY_ENTRIES,
        drawerTheme: preferences?.drawerTheme === Constants.THEMES.DARK ? Constants.THEMES.DARK : Constants.THEMES.LIGHT
      };

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
        padding: 16px;
        box-sizing: border-box;
        backdrop-filter: blur(2px);
      `;

      const modal = document.createElement('div');
      modal.className = 'bn-preference-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'bn-preference-modal-title');
      modal.style.cssText = `
        width: 100%;
        max-width: 390px;
        background: ${dark ? '#202020' : '#ffffff'};
        border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
        box-shadow: 0 12px 32px ${dark ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0.14)'};
        padding: 16px 18px 14px 18px;
        box-sizing: border-box;
      `;
      modal.style.setProperty('background', dark ? '#202020' : '#ffffff', 'important');
      modal.style.setProperty('border-color', dark ? '#3a3a3a' : '#e0e0e0', 'important');

      const titleEl = document.createElement('div');
      titleEl.id = 'bn-preference-modal-title';
      titleEl.textContent = 'preferences';
      titleEl.style.cssText = `font-size: 13px; font-weight: 650; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; margin-bottom: 12px; letter-spacing: 0.4px;`;
      titleEl.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
      modal.appendChild(titleEl);

      const createChoice = (label, value, group, update) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'bn-preference-choice';
        button.textContent = label;
        button.dataset.value = value;
        button.onclick = () => {
          state[group] = value;
          update();
        };
        return button;
      };

      const createRow = (title, description) => {
        const row = document.createElement('div');
        row.className = 'bn-preference-row';
        const copy = document.createElement('div');
        const rowTitle = document.createElement('div');
        rowTitle.className = 'bn-preference-row-title';
        rowTitle.textContent = title;
        const rowDesc = document.createElement('div');
        rowDesc.className = 'bn-preference-row-desc';
        rowDesc.textContent = description;
        copy.appendChild(rowTitle);
        copy.appendChild(rowDesc);
        row.appendChild(copy);
        return row;
      };

      const openRow = createRow('Open Notes In', 'Default tab when opening a note');
      const openSegment = document.createElement('div');
      openSegment.className = 'bn-preference-segment';
      const openChoices = [
        createChoice('Edit Mode', 'edit', 'openNotesIn', updateOpenChoices),
        createChoice('Preview Mode', 'preview', 'openNotesIn', updateOpenChoices)
      ];
      function updateOpenChoices() {
        openChoices.forEach(button => {
          button.dataset.active = String(button.dataset.value === state.openNotesIn);
        });
      }
      openChoices.forEach(button => openSegment.appendChild(button));
      openRow.appendChild(openSegment);
      modal.appendChild(openRow);

      const delayRow = createRow('Auto-save Delay', 'Time before auto-saving changes (milliseconds)');
      const delayWrap = document.createElement('div');
      delayWrap.className = 'bn-preference-range';
      const delayRange = document.createElement('input');
      delayRange.type = 'range';
      delayRange.min = '500';
      delayRange.max = '5000';
      delayRange.step = '100';
      const delayNumber = document.createElement('input');
      delayNumber.type = 'number';
      delayNumber.min = '500';
      delayNumber.max = '5000';
      delayNumber.step = '100';
      delayNumber.className = 'bn-preference-number';
      delayWrap.appendChild(delayRange);
      delayWrap.appendChild(delayNumber);
      delayRow.appendChild(delayWrap);
      modal.appendChild(delayRow);

      const backupRow = createRow('Auto Backup', 'Back up saved changes to Google Drive');
      const backupSegment = document.createElement('div');
      backupSegment.className = 'bn-preference-segment';
      const backupChoices = [
        createChoice('On', 'true', 'autoBackupEnabled', updateBackupChoices),
        createChoice('Off', 'false', 'autoBackupEnabled', updateBackupChoices)
      ];
      backupChoices.forEach(button => {
        button.onclick = () => {
          state.autoBackupEnabled = button.dataset.value === 'true';
          updateBackupChoices();
          updateBackupDelayState();
        };
      });
      function updateBackupChoices() {
        backupChoices.forEach(button => {
          button.dataset.active = String((button.dataset.value === 'true') === state.autoBackupEnabled);
        });
      }
      backupChoices.forEach(button => backupSegment.appendChild(button));
      backupRow.appendChild(backupSegment);
      modal.appendChild(backupRow);

      const backupDelayRow = createRow('Backup Delay', 'Idle time before automatic Google Drive backup (seconds)');
      const backupDelayWrap = document.createElement('div');
      backupDelayWrap.className = 'bn-preference-range';
      const backupDelayRange = document.createElement('input');
      backupDelayRange.type = 'range';
      backupDelayRange.min = '15';
      backupDelayRange.max = '300';
      backupDelayRange.step = '15';
      const backupDelayNumber = document.createElement('input');
      backupDelayNumber.type = 'number';
      backupDelayNumber.min = '15';
      backupDelayNumber.max = '300';
      backupDelayNumber.step = '15';
      backupDelayNumber.className = 'bn-preference-number';
      backupDelayWrap.appendChild(backupDelayRange);
      backupDelayWrap.appendChild(backupDelayNumber);
      backupDelayRow.appendChild(backupDelayWrap);
      modal.appendChild(backupDelayRow);

      const historyRow = createRow('Max History Entries', 'Maximum number of version history to keep');
      const historyWrap = document.createElement('div');
      historyWrap.className = 'bn-preference-range';
      const historyRange = document.createElement('input');
      historyRange.type = 'range';
      historyRange.min = '3';
      historyRange.max = '20';
      historyRange.step = '1';
      const historyNumber = document.createElement('input');
      historyNumber.type = 'number';
      historyNumber.min = '3';
      historyNumber.max = '20';
      historyNumber.step = '1';
      historyNumber.className = 'bn-preference-number';
      historyWrap.appendChild(historyRange);
      historyWrap.appendChild(historyNumber);
      historyRow.appendChild(historyWrap);
      modal.appendChild(historyRow);

      const themeRow = createRow('Default Theme', 'Visual theme for the drawer');
      const themeSegment = document.createElement('div');
      themeSegment.className = 'bn-preference-segment';
      const themeChoices = [
        createChoice('Light Mode', Constants.THEMES.LIGHT, 'drawerTheme', updateThemeChoices),
        createChoice('Dark Mode', Constants.THEMES.DARK, 'drawerTheme', updateThemeChoices)
      ];
      function updateThemeChoices() {
        themeChoices.forEach(button => {
          button.dataset.active = String(button.dataset.value === state.drawerTheme);
        });
      }
      themeChoices.forEach(button => themeSegment.appendChild(button));
      themeRow.appendChild(themeSegment);
      modal.appendChild(themeRow);

      const clamp = (value, min, max, fallback) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.min(max, Math.max(min, Math.round(number)));
      };
      const syncDelay = (value) => {
        state.autoSaveDelay = clamp(value, 500, 5000, Constants.DEFAULTS.AUTO_SAVE_DELAY);
        delayRange.value = String(state.autoSaveDelay);
        delayNumber.value = String(state.autoSaveDelay);
      };
      const syncBackupDelay = (value) => {
        state.autoBackupDelay = clamp(Number(value) * 1000, 15000, 300000, Constants.DEFAULTS.AUTO_BACKUP_DELAY);
        const seconds = String(Math.round(state.autoBackupDelay / 1000));
        backupDelayRange.value = seconds;
        backupDelayNumber.value = seconds;
      };
      const updateBackupDelayState = () => {
        backupDelayRange.disabled = !state.autoBackupEnabled;
        backupDelayNumber.disabled = !state.autoBackupEnabled;
        backupDelayWrap.style.opacity = state.autoBackupEnabled ? '1' : '0.48';
      };
      const syncHistory = (value) => {
        state.maxHistoryEntries = clamp(value, 3, 20, Constants.DEFAULTS.MAX_HISTORY_ENTRIES);
        historyRange.value = String(state.maxHistoryEntries);
        historyNumber.value = String(state.maxHistoryEntries);
      };

      delayRange.oninput = () => syncDelay(delayRange.value);
      delayNumber.oninput = () => syncDelay(delayNumber.value);
      backupDelayRange.oninput = () => syncBackupDelay(backupDelayRange.value);
      backupDelayNumber.oninput = () => syncBackupDelay(backupDelayNumber.value);
      historyRange.oninput = () => syncHistory(historyRange.value);
      historyNumber.oninput = () => syncHistory(historyNumber.value);

      const actions = document.createElement('div');
      actions.style.cssText = `display: flex; gap: 8px; justify-content: flex-end; margin-top: 13px; padding-top: 12px; border-top: 1px solid ${dark ? '#333333' : '#eeeeee'};`;

      const close = (value) => {
        overlay.remove();
        resolve(value);
      };

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'cancel';
      cancelButton.style.cssText = `
        min-width: 68px;
        padding: 7px 12px;
        background: transparent;
        color: ${dark ? '#d8d8d8' : '#6a6a6a'};
        border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
        letter-spacing: 0.3px;
      `;
      cancelButton.onclick = () => close(null);
      actions.appendChild(cancelButton);

      const saveButton = document.createElement('button');
      saveButton.type = 'button';
      saveButton.textContent = 'save';
      saveButton.style.cssText = `
        min-width: 68px;
        padding: 7px 12px;
        background: ${dark ? '#f1f1f1' : '#2a2a2a'};
        color: ${dark ? '#181818' : '#ffffff'};
        border: 1px solid ${dark ? '#f1f1f1' : '#2a2a2a'};
        cursor: pointer;
        font-size: 11px;
        font-family: inherit;
        letter-spacing: 0.3px;
      `;
      saveButton.onclick = () => close({ ...state });
      actions.appendChild(saveButton);
      modal.appendChild(actions);

      overlay.appendChild(modal);
      drawer.appendChild(overlay);

      overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close(null);
        }
      });
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close(null);
      });

      updateOpenChoices();
      updateThemeChoices();
      updateBackupChoices();
      syncDelay(state.autoSaveDelay);
      syncBackupDelay(state.autoBackupDelay / 1000);
      updateBackupDelayState();
      syncHistory(state.maxHistoryEntries);
      saveButton.focus();
    });
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
    const exportBtn = this.get('bn-btn-export-md');
    const printBtn = this.get('bn-btn-print-note');

    if (tab === 'edit') {
      editTab.style.color = '#2a2a2a';
      editTab.style.borderBottom = '2px solid #2a2a2a';
      previewTab.style.color = '#9a9a9a';
      previewTab.style.borderBottom = '2px solid transparent';
      if (editorToolbar) editorToolbar.style.display = 'flex';
      if (exportBtn) exportBtn.style.display = 'inline-flex';
      if (printBtn) printBtn.style.display = 'none';
      editorContainer.style.display = 'flex';
      previewContainer.style.display = 'none';
    } else {
      editTab.style.color = '#9a9a9a';
      editTab.style.borderBottom = '2px solid transparent';
      previewTab.style.color = '#2a2a2a';
      previewTab.style.borderBottom = '2px solid #2a2a2a';
      if (editorToolbar) editorToolbar.style.display = 'none';
      if (exportBtn) exportBtn.style.display = 'none';
      if (printBtn) printBtn.style.display = 'inline-flex';
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
      icon.src = Utils.assetUrl(enabled ? 'icons/bookmarked.svg' : 'icons/bookmark.svg');
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
      icon.src = Utils.assetUrl(enabled ? 'icons/crowned.svg' : 'icons/crown.svg');
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
      icon.src = Utils.assetUrl(enabled ? 'icons/pinned.svg' : 'icons/pin.svg');
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
      icon.src = Utils.assetUrl(enabled ? 'icons/bookmarked.svg' : 'icons/bookmark.svg');
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
    icon.src = Utils.assetUrl(enabled ? 'icons/locked.svg' : 'icons/unlocked.svg');
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
      .slice(0, Constants.SEARCH.MAX_AUTOCOMPLETE_RESULTS)
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
  },

  // Set action button mode (export/print visibility)
  setActionButtonMode(mode) {
    const exportBtn = this.get('bn-btn-export-md');
    const printBtn = this.get('bn-btn-print-note');
    
    if (!exportBtn || !printBtn) return;
    
    if (mode === 'write') {
      exportBtn.style.display = 'inline-flex';
      printBtn.style.display = 'none';
    } else if (mode === 'preview') {
      exportBtn.style.display = 'none';
      printBtn.style.display = 'inline-flex';
    }
  }
};
