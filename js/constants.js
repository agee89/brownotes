// Application constants and configuration
const Constants = {
  // Drawer configuration
  DRAWER: {
    WIDTH: 440,
    RIBBON_TOP: 88,
    RIBBON_WIDTH: 42,
    RIBBON_HEIGHT: 40,
    ANIMATION_DURATION: 250, // ms
    SHAKE_DURATION: 400 // ms
  },

  // Note configuration
  NOTES: {
    MAX_TITLE_LENGTH: 120,
    MAX_LABEL_LENGTH: 32,
    MAX_HISTORY_ENTRIES: 5,
    AUTO_SAVE_DELAY: 1000, // ms
    AUTO_SNAPSHOT_INTERVAL: 5 * 60 * 1000, // 5 minutes
    PREVIEW_LENGTH: 100, // characters
    TRASH_PREVIEW_LENGTH: 96 // characters
  },

  // Trash configuration
  TRASH: {
    RETENTION_DAYS: 30
  },

  // Search configuration
  SEARCH: {
    MAX_AUTOCOMPLETE_RESULTS: 8
  },

  // UI configuration
  UI: {
    MODAL_MAX_WIDTH: 360,
    TEMPLATE_GRID_COLUMNS: 2,
    TEMPLATE_GRID_MAX_HEIGHT: 360,
    LABEL_FILTER_DROPDOWN_MAX_HEIGHT: 188,
    HISTORY_MENU_MAX_HEIGHT: 188,
    HISTORY_MENU_MIN_WIDTH: 190
  },

  // Editor configuration
  EDITOR: {
    FONT_SIZE: 13,
    LINE_HEIGHT: 1.7,
    TAB_SIZE: 4,
    PADDING_HORIZONTAL: 24,
    PADDING_TOP: 12,
    PADDING_BOTTOM: 8
  },

  // Color palette for labels
  LABEL_COLORS: [
    '#8fb8ff', '#8fd8b8', '#f2c66d', '#f29c9c', '#c6a5ff', '#77c7d9',
    '#d6a06d', '#a8c26d', '#a3b8f5', '#b0d4ef', '#d4b8f5', '#f5b8cc',
    '#f5c9a8', '#f0e08a', '#a8e0d0', '#b8dca0', '#ddb8d4', '#a8e4f0',
    '#f0ddb0', '#ccb8e8', '#e8a898', '#c8b090', '#9ab888', '#b0be80',
    '#d4906a', '#80b8b8', '#d8c090', '#90a8c8', '#c8c080', '#c8a090',
    '#6dddb8', '#ffb38a', '#f080c0', '#50d0e8', '#f0d040', '#b070f0',
    '#f07070', '#90d840', '#60a8ff', '#f09860', '#40d4b8', '#8888f0'
  ],

  // Default label color (gray)
  DEFAULT_LABEL_COLOR: '#b8b8b8',

  // Storage keys
  STORAGE_KEYS: {
    NOTES: 'notes',
    TRASH_NOTES: 'trashNotes',
    NOTE_HISTORY: 'noteHistory',
    NICKNAME: 'nickname',
    LABELS: 'labels',
    LABEL_COLORS: 'labelColors',
    DRAWER_TRANSPARENT: 'drawerTransparent',
    DRAWER_THEME: 'drawerTheme',
    DRAWER_COLLAPSED: 'drawerCollapsed',
    OPEN_NOTES_IN: 'openNotesIn',
    AUTO_SAVE_DELAY: 'autoSaveDelay',
    AUTO_BACKUP_ENABLED: 'autoBackupEnabled',
    AUTO_BACKUP_DELAY: 'autoBackupDelay',
    MAX_HISTORY_ENTRIES: 'maxHistoryEntries',
    LAST_BACKUP_AT: 'lastBackupAt',
    DRIVE_SYNC: 'driveSync',
    LOCKED_LABEL_FILTER: 'lockedLabelFilter',
    GLOBAL_ENABLED: 'globalEnabled'
  },

  // Default values
  DEFAULTS: {
    NICKNAME: 'Brow',
    THEME: 'light',
    OPEN_NOTES_IN: 'edit',
    AUTO_SAVE_DELAY: 1000,
    AUTO_BACKUP_ENABLED: true,
    AUTO_BACKUP_DELAY: 45000,
    MAX_HISTORY_ENTRIES: 5
  },

  // Element IDs (commonly used)
  ELEMENTS: {
    DRAWER: 'bronotes-drawer',
    HOME_VIEW: 'bn-home-view',
    ALLNOTES_VIEW: 'bn-allnotes-view',
    EDITOR_VIEW: 'bn-editor-view',
    LABELS_VIEW: 'bn-labels-view',
    TRASH_VIEW: 'bn-trash-view',
    SETTINGS_VIEW: 'bn-settings-view',
    NOTES_LIST: 'bn-notes-list',
    EDITOR: 'bn-editor',
    NOTE_TITLE: 'bn-note-title',
    NOTE_LABEL: 'bn-note-label',
    SEARCH: 'bn-search',
    FILTER_LABEL: 'bn-filter-label',
    SORT: 'bn-sort'
  },

  // View names
  VIEWS: {
    HOME: 'home',
    ALLNOTES: 'allnotes',
    EDITOR: 'editor',
    LABELS: 'labels',
    TRASH: 'trash',
    SETTINGS: 'settings'
  },

  // Theme values
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },

  // Colors
  COLORS: {
    PRIMARY: '#2a2a2a',
    PRIMARY_LIGHT: '#6a6a6a',
    PRIMARY_LIGHTER: '#9a9a9a',
    BACKGROUND_LIGHT: '#ffffff',
    BACKGROUND_DARK: '#181818',
    BORDER_LIGHT: '#e8e8e8',
    BORDER_DARK: '#333333',
    DANGER: '#dc3545',
    WARNING: '#f0ad4e',
    SUCCESS: '#5cb85c'
  },

  // Icon sizes
  ICONS: {
    SMALL: 11,
    MEDIUM: 14,
    LARGE: 18,
    XLARGE: 24
  },

  // Z-index layers
  Z_INDEX: {
    DRAWER: 2147483647,
    RIBBON: 1,
    MODAL: 10,
    AUTOCOMPLETE: 5,
    HISTORY_MENU: 60,
    HISTORY_WRAP: 50
  }
};
