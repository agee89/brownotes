# Changelog

All notable changes to Brow Notes will be documented in this file.

## [3.0.0] - 2024-01-XX (Current Version - Refactored)

### 🎨 UI Improvements
- ✅ **Active scale effect** - All clickable elements scale to 0.98 on click
- ✅ **Better feedback** - Visual confirmation for all interactions
- ✅ **Smooth transitions** - 0.1s ease for professional feel

### 🐛 Bug Fixes
- ✅ **Fixed module loading** - Changed from dynamic loading to manifest loading
- ✅ **Drawer now appears** - All modules load correctly in order
- ✅ **Fixed horizontal overflow** - Added box-sizing: border-box to all inputs and buttons
- ✅ **No horizontal scroll** - Settings and other views now fit properly
- ✅ **Fixed note click in All Notes** - Removed redundant view switching code in EditorView.open()
- ✅ **More reliable** - Using standard Chrome Extension pattern

### 🏗️ Major Refactoring - Modular Architecture
- ✅ **Complete Code Refactoring** - Dari monolithic ke modular architecture
- ✅ **MVC Pattern** - Model-View-Controller untuk better separation of concerns
- ✅ **8 Separate Modules** - Easy to maintain, debug, and extend
- ✅ **Improved Debugging** - Clear module boundaries and error tracking
- ✅ **Better Performance** - Lazy loading and optimized rendering

### 📁 New File Structure
```
js/
├── app.js           # Main controller
├── storage.js       # Data layer (Model)
├── ui.js            # UI helpers
├── utils.js         # Utilities
├── drawer.js        # HTML template
└── views/           # View controllers
    ├── home.js
    ├── allnotes.js
    ├── editor.js
    ├── labels.js
    └── settings.js
```

### 📚 New Documentation
- ✅ **ARCHITECTURE.md** - Complete architecture documentation
- ✅ **DEVELOPER.md** - Developer guide with examples
- ✅ Detailed module descriptions
- ✅ Data flow diagrams
- ✅ Debugging guide
- ✅ Code style guide

### 🎯 Benefits
- **Maintainability**: Small focused files (50-150 lines each)
- **Debuggability**: Clear error messages with module names
- **Testability**: Each module can be tested independently
- **Scalability**: Easy to add new views and features
- **Readability**: Clear responsibilities and structure

### Technical Improvements
- Promise-based Storage API
- Async/await throughout
- Better error handling
- Consistent naming conventions
- Improved code comments

### No Feature Changes
All features from v2.0.0 remain the same:
- 4-tab navigation (HOME | ALL NOTES | LABELS | SETTINGS)
- Note editor with title and label
- Markdown support with preview
- Label management
- Search, filter, sort
- Export/import
- Auto-save

---

## [2.0.0] - 2024-01-XX

### Major Changes - Task-Based Note Taking
- ✅ **Single Active Note** - Satu catatan aktif yang sama di semua tab
- ✅ **Auto-save** - Otomatis tersimpan setiap 1 detik
- ✅ **Done Button** - Pindahkan catatan selesai ke History
- ✅ **Label/Tags** - Kategorisasi catatan dengan label
- ✅ **History with Search** - Cari dan filter catatan selesai
- ✅ **Sort by Date** - Sort by Created/Updated date
- ✅ **Bottom Navigation** - Home | Search | Settings

### Design - Minimalist Notepad Style
- ✅ **Pure White Background** - Clean #ffffff
- ✅ **Monospace Font** - SF Mono, Monaco, Roboto Mono
- ✅ **Minimal Borders** - Subtle lines only
- ✅ **Lowercase UI** - Casual, lightweight feel
- ✅ **Dot Status Indicator** - Green/orange dot for save status
- ✅ **Clean Spacing** - Breathable layout

### Features
- ✅ **Home View** - Active note editor dengan label
- ✅ **Search View** - History dengan filter by label & sort by date
- ✅ **Settings View** - Theme, Export, Import, Privacy info
- ✅ **Edit/Preview Toggle** - Switch antara edit dan preview mode
- ✅ **Markdown Support** - Headings, bold, italic, lists, code, links
- ✅ **Export/Import JSON** - Backup dan restore semua data

### Workflow
```
1. Tulis catatan di Home → Auto-save
2. Pindah tab → Catatan tetap sama
3. Selesai → Klik "done" → Masuk History
4. Catatan baru → Mulai lagi di Home
```

### Technical
- Chrome Manifest V3
- Service worker untuk global state
- Content script dengan inline styles
- Local storage only (privacy-first)

---

## [1.0.0] - 2024-01-XX (MVP Release - Deprecated)

### Added
- ✅ Global ON/OFF toggle melalui icon extension
- ✅ Drawer slide-in dari samping (kiri atau kanan)
- ✅ Drawer muncul di setiap tab saat mode aktif
- ✅ Markdown editor sebagai mode default
- ✅ Preview mode untuk melihat hasil render HTML
- ✅ Auto-save lokal dengan debounce
- ✅ Satu catatan utama/global
- ✅ Export backup JSON
- ✅ Import backup JSON dengan validasi
- ✅ Status penyimpanan (Saved, Saving..., Error)
- ✅ Basic settings (drawer position, theme, default mode)
- ✅ Opsi menutup drawer sementara di tab aktif
- ✅ Opsi mematikan extension secara global
- ✅ Privacy statement di settings
- ✅ Clear all data dengan konfirmasi

### Security
- ✅ Preview HTML disanitasi untuk mencegah XSS
- ✅ Import JSON divalidasi sebelum restore
- ✅ Extension tidak membaca isi halaman web
- ✅ Semua data disimpan lokal, tidak ada pengiriman ke server

---

## [Unreleased]

### Planned for v2.1
- [ ] Keyboard shortcuts (Ctrl+Shift+N untuk toggle)
- [ ] Delete note dari history
- [ ] Edit note dari history
- [ ] Restore note dari history ke active
- [ ] Dark mode improvements
- [ ] Better markdown renderer (tables, strikethrough)

### Planned for v2.2
- [ ] Multiple active notes dengan tabs
- [ ] Pin important notes
- [ ] Archive notes
- [ ] Color-coded labels
- [ ] Quick label selection
- [ ] Note templates

### Planned for v3.0
- [ ] Optional cloud sync (encrypted)
- [ ] Multi-device support
- [ ] Collaborative features
- [ ] Advanced search (full-text)
- [ ] Export to Markdown files
- [ ] Integration dengan Notion, Obsidian

---

## Version Format

Format: [MAJOR.MINOR.PATCH]

- **MAJOR**: Breaking changes atau perubahan arsitektur besar
- **MINOR**: Fitur baru yang backward compatible
- **PATCH**: Bug fixes dan improvements kecil

## Categories

- **Added**: Fitur baru
- **Changed**: Perubahan pada fitur existing
- **Deprecated**: Fitur yang akan dihapus di versi mendatang
- **Removed**: Fitur yang dihapus
- **Fixed**: Bug fixes
- **Security**: Security fixes atau improvements
- **Technical**: Perubahan teknis yang tidak terlihat user
