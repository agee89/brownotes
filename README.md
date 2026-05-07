# Brow Notes

**Minimalist task-based note taking extension for Chrome**

Markdown notepad yang selalu tersedia di browser. Tulis catatan, pindah tab, catatan tetap sama sampai selesai.

> **v3.0.0 Update:** Complete refactoring to modular architecture! Same features, better code. [Read more →](REFACTORING_COMPLETE.md)

## ✨ Features

### Task-Based Workflow
- 📝 **Note Editor** - Title, label, dan markdown content
- 💾 **Auto-save** - Tersimpan otomatis setiap 1 detik
- 🏷️ **Labels** - Kategorisasi dengan label, rename/delete
- 🔍 **Search & Filter** - Cari catatan, filter by label
- 📅 **Sort** - Sort by created/updated date
- 👁️ **Preview** - Markdown preview mode

### Minimalist Design
- ⚪ **Pure White** - Clean #ffffff background
- 🔤 **Monospace Font** - Notepad-style typography
- 📏 **Minimal Borders** - Subtle, breathable layout
- 🎯 **4-Tab Navigation** - HOME | ALL NOTES | LABELS | SETTINGS
- 🎨 **Lowercase UI** - Casual, lightweight feel

### Privacy & Data
- 🔒 **Local-first** - Semua data di browser Anda
- 🚫 **No tracking** - Tidak membaca halaman web
- 📦 **Export/Import** - Backup sebagai JSON
- 🔐 **No server** - Tidak ada pengiriman data

## 🚀 Quick Start

### Installation

1. **Download Extension**
   ```
   Clone atau download repository ini
   ```

2. **Install di Chrome**
   ```
   1. Buka chrome://extensions/
   2. Enable "Developer mode"
   3. Klik "Load unpacked"
   4. Pilih folder bronotes/
   ```

3. **Start Using**
   ```
   Klik icon Brow Notes di toolbar
   Drawer akan slide-in dari kanan
   Mulai mencatat!
   ```

## 📖 How to Use

### Basic Workflow

```
1. HOME → Lihat welcome message dan summary
2. Klik "buat catatan" → Tulis note baru
3. ALL NOTES → Lihat semua catatan
4. Klik catatan → Edit catatan
5. LABELS → Kelola label (rename, delete)
6. SETTINGS → Atur nickname, export/import
```

### Navigation

- **HOME** - Welcome message dengan summary stats
- **ALL NOTES** - List semua catatan (clickable)
- **LABELS** - Manage labels (add, rename, delete)
- **SETTINGS** - Nickname, export, import

### Markdown Support

```markdown
# Heading 1
## Heading 2

**Bold** *Italic*

- Bullet list
1. Numbered list

`inline code`
```

## 🏗️ Architecture (v3.0.0)

### Modular Structure

```
bronotes/
├── content.js              # Entry point
├── background.js           # Service worker
├── manifest.json           # Extension config
│
├── js/                     # Modular JavaScript
│   ├── app.js             # Main controller
│   ├── storage.js         # Data layer (Model)
│   ├── ui.js              # UI helpers
│   ├── utils.js           # Utilities
│   ├── drawer.js          # HTML template
│   └── views/             # View controllers
│       ├── home.js        # Home view
│       ├── allnotes.js    # All notes list
│       ├── editor.js      # Note editor
│       ├── labels.js      # Label management
│       └── settings.js    # Settings
│
└── icons/                  # Extension icons
```

### MVC Pattern

- **Model** (`storage.js`) - Data operations
- **View** (`views/*.js`) - UI rendering
- **Controller** (`app.js`) - Coordination

### Why Modular?

- ✅ **Easy to maintain** - Small focused files (50-150 lines)
- ✅ **Easy to debug** - Clear module boundaries
- ✅ **Easy to extend** - Add new views/features easily
- ✅ **Easy to test** - Independent modules

**Read more:** [ARCHITECTURE.md](ARCHITECTURE.md)

## 📚 Documentation

**Complete documentation:** [docs/INDEX.md](docs/INDEX.md)

### Quick Links

#### For Users
- **[START_HERE.md](docs/guides/START_HERE.md)** - Getting started guide
- **[QUICK_FIX.md](docs/guides/QUICK_FIX.md)** - Troubleshooting guide
- **[PRIVACY.md](PRIVACY.md)** - Privacy policy

#### For Developers
- **[QUICK_REFERENCE.md](docs/development/QUICK_REFERENCE.md)** - Quick reference (start here!)
- **[ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** - Complete architecture guide
- **[DEVELOPER.md](docs/development/DEVELOPER.md)** - Developer guide with examples
- **[js/README.md](js/README.md)** - Module documentation

#### Project Info
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Project overview
- **[TODO.md](TODO.md)** - Future plans

## 🔧 Development

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic JavaScript knowledge
- Understanding of Chrome Extension APIs

### Setup
```bash
1. Clone repository
2. Load unpacked in Chrome (chrome://extensions/)
3. Make changes to code
4. Reload extension
5. Test in browser
```

### Adding Features

See [DEVELOPER.md](DEVELOPER.md) for detailed guide.

Quick example:
```javascript
// 1. Create view controller
// js/views/myview.js
const MyView = {
  async load() {
    const data = await Storage.getData();
    this.render(data);
  }
};

// 2. Add HTML to js/drawer.js
// 3. Add navigation in js/app.js
// 4. Load in content.js
```

## 🐛 Debugging

Each module logs with prefix:
```
Brow Notes: [Module] Action
```

Check console (F12) for errors and logs.

**Debug checklist:**
1. Check if drawer is injected
2. Check if modules loaded
3. Check console for errors
4. Check Chrome Storage (DevTools → Application)

**Read more:** [ARCHITECTURE.md](ARCHITECTURE.md#debugging-guide)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Drawer opens/closes
- [ ] Navigation works (4 tabs)
- [ ] Create note with title and label
- [ ] Edit existing note
- [ ] Delete note
- [ ] Search notes
- [ ] Filter by label
- [ ] Sort notes
- [ ] Add/rename/delete labels
- [ ] Change nickname
- [ ] Export data
- [ ] Import data
- [ ] Auto-save works
- [ ] Preview works

### Browser Testing
- [ ] Chrome
- [ ] Edge
- [ ] Brave
- [ ] Opera

## 📦 Tech Stack

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, ES6+
- **Chrome Storage API** - Local storage
- **Content Scripts** - Inject drawer
- **Service Worker** - Background tasks
- **MVC Architecture** - Modular design pattern

## 🔒 Privacy

- ✅ All data stored locally (Chrome Storage)
- ✅ No external servers
- ✅ No analytics or tracking
- ✅ Does not read webpage content
- ✅ User controls all data (export/import)
- ✅ Open source, auditable

[Read full privacy policy](PRIVACY.md)

## 🐛 Troubleshooting

### Drawer tidak muncul?
- Pastikan extension aktif (badge "ON")
- Refresh halaman setelah mengaktifkan
- Check console for errors
- Beberapa halaman Chrome internal tidak didukung

### Catatan tidak tersimpan?
- Check console for storage errors
- Check Chrome Storage (DevTools → Application)
- Pastikan browser storage tidak penuh

### Module tidak load?
- Check console for "All modules loaded successfully"
- Check web_accessible_resources in manifest
- Reload extension

## 📝 Roadmap

### v3.1 (Next)
- [ ] Keyboard shortcuts (Ctrl+Shift+N)
- [ ] Dark mode toggle
- [ ] Note templates
- [ ] Markdown toolbar
- [ ] Unit tests

### v3.2 (Future)
- [ ] Multiple active notes with tabs
- [ ] Pin important notes
- [ ] Color-coded labels
- [ ] Advanced search (full-text)
- [ ] Export to Markdown files

### v4.0 (Long-term)
- [ ] Optional cloud sync (encrypted)
- [ ] Multi-device support
- [ ] Collaborative features
- [ ] Mobile support
- [ ] Integration dengan Notion/Obsidian

## 🤝 Contributing

Contributions welcome!

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🎯 Version History

- **v3.0.0** (Current) - Modular architecture refactoring
- **v2.0.0** - Task-based note taking with labels
- **v1.0.0** - MVP release (deprecated)

See [CHANGELOG.md](CHANGELOG.md) for details.

## 🌟 What's New in v3.0.0

### Complete Refactoring
- ✅ Modular MVC architecture
- ✅ 13 separate modules (was 1 monolithic file)
- ✅ Better maintainability and debugging
- ✅ Comprehensive documentation
- ✅ **No breaking changes** - all features work the same!

**Benefits:**
- Small focused files (50-150 lines each)
- Clear module boundaries
- Easy to add features
- Easy to debug with module logs
- Easy to test independently

**Read more:** [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)

## 📖 Quick Links

| Document | Purpose |
|----------|---------|
| [docs/INDEX.md](docs/INDEX.md) | Complete documentation index |
| [docs/development/QUICK_REFERENCE.md](docs/development/QUICK_REFERENCE.md) | Quick lookup for developers |
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | Architecture deep dive |
| [docs/development/DEVELOPER.md](docs/development/DEVELOPER.md) | How to add features |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [js/README.md](js/README.md) | Module documentation |

## 💡 Tips

- **For users:** Just click the icon and start typing!
- **For developers:** Start with [docs/development/QUICK_REFERENCE.md](docs/development/QUICK_REFERENCE.md)
- **For debugging:** Check console logs with "Brow Notes:" prefix
- **For contributing:** Read [docs/development/DEVELOPER.md](docs/development/DEVELOPER.md) first
- **Need help?** Check [docs/guides/QUICK_FIX.md](docs/guides/QUICK_FIX.md)

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🙏 Credits

Built with focus on:
- Privacy-first approach
- Local-first data storage
- Minimalist design
- Task-based workflow
- Clean modular architecture

---

**Brow Notes** - Your lightweight notepad in the browser 📝

**Version:** 3.0.0 | **Status:** ✅ Stable | **License:** MIT

[Changelog](CHANGELOG.md) | [Privacy](PRIVACY.md) | [Documentation](docs/INDEX.md) | [Developer Guide](docs/development/DEVELOPER.md)
