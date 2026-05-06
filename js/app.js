// Main application controller
const App = {
  drawerInjected: false,
  currentView: 'home',

  // Initialize app
  init() {
    console.log('Bro Notes: Content script loaded');

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
    chrome.storage.local.get(['globalEnabled'], (result) => {
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
    UI.get('bn-nav-settings').onclick = () => this.switchView('settings');
    UI.get('bn-btn-close').onclick = async () => {
      UI.hideDrawer();
      await Storage.saveDrawerCollapsed(true);
    };
    UI.get('bn-btn-open-panel').onclick = async () => {
      UI.showDrawer();
      await Storage.saveDrawerCollapsed(false);
    };
    UI.get('bn-btn-transparency').onclick = async () => {
      const enabled = UI.get('bronotes-drawer').dataset.transparent !== 'true';
      UI.setDrawerTransparent(enabled);
      await Storage.saveDrawerTransparent(enabled);
    };

    // Home
    UI.get('bn-btn-new-note').onclick = () => EditorView.open(null);

    // All Notes
    UI.get('bn-fab-new').onclick = () => EditorView.open(null);
    UI.get('bn-search').oninput = () => AllNotesView.render();
    UI.get('bn-filter-label').onchange = () => AllNotesView.render();
    UI.get('bn-sort').onchange = () => AllNotesView.render();

    // Editor
    UI.get('bn-btn-back').onclick = () => this.switchView('allnotes');
    UI.get('bn-tab-edit').onclick = () => {
      UI.switchEditorTab('edit');
    };
    UI.get('bn-tab-preview').onclick = () => {
      UI.switchEditorTab('preview');
      EditorView.renderPreview();
    };
    UI.get('bn-btn-save').onclick = () => EditorView.save(false);
    UI.get('bn-btn-delete').onclick = () => EditorView.delete();

    // Editor input handlers
    UI.get('bn-note-title').oninput = () => EditorView.handleInput();
    UI.get('bn-note-label').oninput = () => {
      EditorView.handleInput();
      UI.renderLabelAutocomplete();
    };
    UI.get('bn-note-label').onfocus = () => UI.showLabelAutocomplete();
    UI.get('bn-note-label').onkeydown = (event) => UI.handleLabelAutocompleteKey(event);
    UI.get('bn-note-label').onblur = () => {
      setTimeout(() => UI.hideLabelAutocomplete(), 120);
    };
    UI.get('bn-editor').oninput = () => EditorView.handleInput();

    // Labels
    UI.get('bn-btn-add-label').onclick = () => LabelsView.add();

    // Settings
    UI.get('bn-nickname').onchange = () => SettingsView.save();
    UI.get('bn-btn-export').onclick = () => SettingsView.export();
    UI.get('bn-btn-import').onclick = () => UI.get('bn-import-file').click();
    UI.get('bn-import-file').onchange = (e) => SettingsView.import(e);

    Storage.getDrawerTransparent().then((enabled) => {
      UI.setDrawerTransparent(enabled);
    });
  },

  async restoreDrawerState() {
    const collapsed = await Storage.getDrawerCollapsed();
    if (collapsed) {
      UI.hideDrawer();
    } else {
      UI.showDrawer();
    }
  },

  // Switch between views
  switchView(view) {
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
    } else if (view === 'settings') {
      SettingsView.load();
    }
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
