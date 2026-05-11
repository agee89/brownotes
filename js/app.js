// Main application controller
const App = {
  drawerInjected: false,
  currentView: 'home',

  // Initialize app
  init() {
    console.log('Brow Notes: Content script loaded');

    // Initialize button effects
    ButtonEffects.init();

    // Message listener
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleDrawer') {
        if (request.enabled) {
          if (!this.drawerInjected) this.injectDrawer();
          this.restoreDrawerState();
        } else {
          UI.hideDrawer();
        }
      }
      sendResponse({ success: true });
      return true;
    });

    // Check initial state
    Storage.get(['globalEnabled']).then((result) => {
      if (result.globalEnabled) {
        this.injectDrawer();
        this.restoreDrawerState();
      }
    });
  },

  // Inject drawer into page
  injectDrawer() {
    if (this.drawerInjected) return;

    const drawer = document.createElement('div');
    drawer.id = 'bronotes-drawer';
    drawer.dataset.collapsed = 'true';
    drawer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      right: 0 !important;
      width: 440px !important;
      height: 100vh !important;
      background: #ffffff !important;
      color: #2a2a2a !important;
      z-index: 2147483647 !important;
      box-shadow: -1px 0 0 #e0e0e0 !important;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace !important;
      display: flex !important;
      flex-direction: column !important;
      transform: translateX(100%) !important;
      transition: transform 0.25s ease !important;
    `;

    drawer.innerHTML = DrawerHTML;
    document.body.appendChild(drawer);
    this.drawerInjected = true;

    this.setupEventListeners();
    this.switchView('home');
  },

  // Setup all event listeners
  setupEventListeners() {
    // Navigation
    UI.get('bn-nav-home').onclick = () => this.switchView('home');
    UI.get('bn-nav-allnotes').onclick = () => this.switchView('allnotes');
    UI.get('bn-nav-labels').onclick = () => this.switchView('labels');
    UI.get('bn-nav-trash').onclick = () => this.switchView('trash');
    UI.get('bn-nav-settings').onclick = () => this.switchView('settings');
    UI.get('bn-btn-drawer-ribbon').onclick = async () => {
      const drawer = UI.get('bronotes-drawer');
      const collapsed = drawer?.dataset.collapsed === 'true';

      if (collapsed) {
        UI.showDrawer();
      } else {
        if (this.currentView === 'editor' && !(await EditorView.confirmDiscardUnsavedNewDraft())) return;
        UI.hideDrawer();
      }

      await Storage.saveDrawerCollapsed(!collapsed);
    };
    UI.get('bn-btn-transparency').onclick = async () => {
      const enabled = UI.get('bronotes-drawer').dataset.transparent !== 'true';
      UI.setDrawerTransparent(enabled);
      await Storage.saveDrawerTransparent(enabled);
    };
    UI.get('bn-btn-theme').onclick = async () => {
      const theme = UI.get('bronotes-drawer').dataset.theme === 'dark' ? 'light' : 'dark';
      UI.setDrawerTheme(theme);
      await Storage.saveDrawerTheme(theme);
    };

    // Home
    UI.get('bn-btn-new-note').onclick = () => EditorView.open(null);

    // All Notes
    UI.get('bn-fab-new').onclick = () => EditorView.open(null);
    UI.get('bn-search').oninput = () => AllNotesView.render();
    UI.get('bn-filter-label').onchange = () => AllNotesView.handleLabelFilterChange();
    UI.get('bn-sort').onchange = () => AllNotesView.render();
    UI.get('bn-filter-favorite').onclick = () => AllNotesView.toggleFavoriteFilter();
    UI.get('bn-filter-label-lock').onclick = () => AllNotesView.toggleLabelFilterLock();
    UI.get('bn-filter-reset').onclick = () => AllNotesView.resetFilters();

    // Editor
    UI.get('bn-btn-back').onclick = () => this.switchView('allnotes');
    UI.get('bn-tab-edit').onclick = () => {
      UI.switchEditorTab('edit');
    };
    UI.get('bn-tab-preview').onclick = () => {
      UI.switchEditorTab('preview');
      EditorView.renderPreview();
    };
    UI.get('bn-btn-export-md').onclick = () => EditorView.exportMarkdown();
    UI.get('bn-btn-print-note').onclick = () => EditorView.printNote();
    UI.get('bn-btn-context').onclick = () => EditorView.captureContext();
    UI.get('bn-btn-save').onclick = () => EditorView.save(false);
    UI.get('bn-btn-delete').onclick = () => EditorView.delete();
    UI.get('bn-note-favorite').onclick = () => EditorView.toggleFavorite();
    UI.get('bn-note-king').onclick = () => EditorView.toggleKing();
    UI.get('bn-note-pinned').onclick = () => EditorView.togglePinned();

    // Editor input handlers
    UI.get('bn-note-title').oninput = () => {
      UI.updateTitleCharacterCount();
      EditorView.handleInput();
    };
    UI.get('bn-note-label').oninput = () => {
      UI.updateLabelCharacterCount();
      EditorView.handleInput();
      UI.renderLabelAutocomplete();
    };
    UI.get('bn-note-label').onfocus = () => UI.showLabelAutocomplete();
    UI.get('bn-note-label').onkeydown = (event) => UI.handleLabelAutocompleteKey(event);
    UI.get('bn-note-label').onblur = () => {
      setTimeout(() => UI.hideLabelAutocomplete(), 120);
    };
    UI.get('bn-editor').oninput = () => EditorView.handleEditorInput();
    UI.get('bn-editor').onkeydown = (event) => EditorView.handleEditorKeydown(event);
    UI.get('bn-editor').onscroll = () => EditorView.syncEditorSearchHighlight();
    UI.get('bn-editor').onblur = () => {
      setTimeout(() => EditorView.hideNoteLinkAutocomplete(), 120);
    };
    UI.get('bn-editor-search').oninput = () => EditorView.updateEditorSearch(true);
    UI.get('bn-editor-search').onkeydown = (event) => EditorView.handleSearchKeydown(event);
    UI.get('bn-btn-template').onclick = () => EditorView.showTemplatePicker();
    UI.get('bn-history-button').onclick = (event) => {
      event.stopPropagation();
      UI.toggleHistoryDropdown();
    };
    UI.get('bn-history-menu').onclick = (event) => {
      event.stopPropagation();
      const option = event.target.closest('[data-history-index]');
      if (!option) return;
      EditorView.restoreHistoryVersion(Number(option.dataset.historyIndex));
    };
    UI.get('bn-history-menu').onwheel = (event) => {
      event.stopPropagation();
    };
    document.addEventListener('click', (event) => {
      if (!event.target.closest('#bn-history-wrap')) {
        UI.hideHistoryDropdown();
      }
    });
    document.querySelectorAll('#bn-editor-toolbar [data-md-action]').forEach(button => {
      button.onclick = () => EditorView.applyMarkdownFormat(button.dataset.mdAction);
    });

    // Labels
    UI.get('bn-btn-add-label').onclick = () => LabelsView.add();

    // Trash
    UI.get('bn-btn-empty-trash').onclick = () => TrashView.empty();

    // Settings
    UI.get('bn-nickname').onchange = () => SettingsView.save();
    UI.get('bn-btn-preferences').onclick = () => SettingsView.showPreferences();
    UI.get('bn-btn-export').onclick = () => SettingsView.export();
    UI.get('bn-btn-import').onclick = () => UI.get('bn-import-file').click();
    UI.get('bn-import-file').onchange = (e) => SettingsView.import(e);

    Storage.getDrawerTransparent().then((enabled) => {
      UI.setDrawerTransparent(enabled);
    });
    Storage.getDrawerTheme().then((theme) => {
      UI.setDrawerTheme(theme);
    });

    window.addEventListener('beforeunload', (event) => {
      if (!EditorView.hasUnsavedNewDraft()) return;
      event.preventDefault();
      event.returnValue = '';
    });
  },

  async restoreDrawerState() {
    const collapsed = await Storage.getDrawerCollapsed();
    if (collapsed) {
      UI.hideDrawer();
    } else {
      UI.showDrawer();
    }

    this.refreshCurrentView();
  },

  refreshCurrentView() {
    if (!this.drawerInjected) return;

    if (this.currentView === 'home') {
      HomeView.load();
    } else if (this.currentView === 'allnotes') {
      AllNotesView.render();
    } else if (this.currentView === 'labels') {
      LabelsView.load();
    } else if (this.currentView === 'trash') {
      TrashView.load();
    } else if (this.currentView === 'settings') {
      SettingsView.load();
    }
  },

  // Switch between views
  async switchView(view) {
    if (view !== 'editor' && this.currentView === 'editor') {
      const canLeave = await EditorView.confirmDiscardUnsavedNewDraft();
      if (!canLeave) return false;
    }

    this.currentView = view;
    UI.switchView(view);

    // Load view content
    if (view === 'home') {
      HomeView.load();
    } else if (view === 'allnotes') {
      AllNotesView.render();
    } else if (view === 'editor') {
      // Editor view is handled by EditorView.open() directly
      // Don't reload content here to avoid overwriting
    } else if (view === 'labels') {
      LabelsView.load();
    } else if (view === 'trash') {
      TrashView.load();
    } else if (view === 'settings') {
      SettingsView.load();
    }
    return true;
  }
};

// Global function for opening notes (called from onclick in HTML)
window.openNoteById = (noteId) => {
  console.log('openNoteById called with:', noteId);
  try {
    EditorView.open(noteId);
  } catch (error) {
    console.error('Error opening note:', error);
  }
};

// Initialize app when script loads
App.init();
