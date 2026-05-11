// Storage module - unified interface for all storage operations
const Storage = {
  // Expose core methods
  get: (...args) => StorageCore.get(...args),
  set: (...args) => StorageCore.set(...args),
  hasContextIssue: () => StorageCore.hasContextIssue(),
  
  // Legacy properties for backward compatibility
  maxTitleLength: Constants.NOTES.MAX_TITLE_LENGTH,
  maxLabelLength: Constants.NOTES.MAX_LABEL_LENGTH,
  maxNoteHistoryEntries: Constants.NOTES.MAX_HISTORY_ENTRIES,
  noteHistoryAutoSnapshotInterval: Constants.NOTES.AUTO_SNAPSHOT_INTERVAL,
  labelColorPalette: Constants.LABEL_COLORS,

  // Notes operations
  getNotes: (...args) => StorageNotes.getNotes(...args),
  saveNotes: (...args) => StorageNotes.saveNotes(...args),
  getNote: (...args) => StorageNotes.getNote(...args),
  saveNote: (...args) => StorageNotes.saveNote(...args),
  getNoteHistory: (...args) => StorageNotes.getNoteHistory(...args),
  addNoteHistory: (...args) => StorageNotes.addNoteHistory(...args),
  deleteNote: (...args) => StorageNotes.deleteNote(...args),
  getTrashNotes: (...args) => StorageNotes.getTrashNotes(...args),
  saveTrashNotes: (...args) => StorageNotes.saveTrashNotes(...args),
  restoreNote: (...args) => StorageNotes.restoreNote(...args),
  deleteTrashNote: (...args) => StorageNotes.deleteTrashNote(...args),
  emptyTrash: (...args) => StorageNotes.emptyTrash(...args),

  // Labels operations
  normalizeLabel: (...args) => StorageLabels.normalizeLabel(...args),
  isDuplicateLabel: (...args) => StorageLabels.isDuplicateLabel(...args),
  getManualLabels: (...args) => StorageLabels.getManualLabels(...args),
  saveManualLabels: (...args) => StorageLabels.saveManualLabels(...args),
  getLabels: (...args) => StorageLabels.getLabels(...args),
  addLabel: (...args) => StorageLabels.addLabel(...args),
  renameLabel: (...args) => StorageLabels.renameLabel(...args),
  deleteLabel: (...args) => StorageLabels.deleteLabel(...args),
  getLabelColors: (...args) => StorageLabels.getLabelColors(...args),
  getDefaultLabelColor: (...args) => StorageLabels.getDefaultLabelColor(...args),
  getResolvedLabelColor: (...args) => StorageLabels.getResolvedLabelColor(...args),
  saveLabelColor: (...args) => StorageLabels.saveLabelColor(...args),
  resetLabelColor: (...args) => StorageLabels.resetLabelColor(...args),

  // Settings operations
  getNickname: (...args) => StorageSettings.getNickname(...args),
  saveNickname: (...args) => StorageSettings.saveNickname(...args),
  getDrawerTransparent: (...args) => StorageSettings.getDrawerTransparent(...args),
  saveDrawerTransparent: (...args) => StorageSettings.saveDrawerTransparent(...args),
  getDrawerTheme: (...args) => StorageSettings.getDrawerTheme(...args),
  saveDrawerTheme: (...args) => StorageSettings.saveDrawerTheme(...args),
  getPreferences: (...args) => StorageSettings.getPreferences(...args),
  savePreferences: (...args) => StorageSettings.savePreferences(...args),
  getOpenNotesIn: (...args) => StorageSettings.getOpenNotesIn(...args),
  getAutoSaveDelay: (...args) => StorageSettings.getAutoSaveDelay(...args),
  getMaxHistoryEntries: (...args) => StorageSettings.getMaxHistoryEntries(...args),
  getDrawerCollapsed: (...args) => StorageSettings.getDrawerCollapsed(...args),
  saveDrawerCollapsed: (...args) => StorageSettings.saveDrawerCollapsed(...args),
  getLastBackupAt: (...args) => StorageSettings.getLastBackupAt(...args),
  saveLastBackupAt: (...args) => StorageSettings.saveLastBackupAt(...args),
  getLockedLabelFilter: (...args) => StorageSettings.getLockedLabelFilter(...args),
  saveLockedLabelFilter: (...args) => StorageSettings.saveLockedLabelFilter(...args),
  exportData: (...args) => StorageSettings.exportData(...args),
  importData: (...args) => StorageSettings.importData(...args)
};
