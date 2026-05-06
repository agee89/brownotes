# Bro Notes - Developer Guide

## 🚀 Quick Start

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension APIs

### Installation for Development
1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `bronotes` folder
6. Extension is now installed and ready for development

### Development Workflow
1. Make changes to code
2. Go to `chrome://extensions/`
3. Click reload icon on Bro Notes extension
4. Test changes in any tab
5. Check console for errors (F12 → Console)

## 📂 File Structure

```
bronotes/
├── content.js              # Entry point (loads modules)
├── background.js           # Service worker
├── manifest.json           # Extension config
│
├── js/                     # Modular code
│   ├── app.js             # Main controller
│   ├── storage.js         # Data layer
│   ├── ui.js              # UI helpers
│   ├── utils.js           # Utilities
│   ├── drawer.js          # HTML template
│   │
│   └── views/             # View controllers
│       ├── home.js
│       ├── allnotes.js
│       ├── editor.js
│       ├── labels.js
│       └── settings.js
│
└── icons/                 # Extension icons
```

## 🏗️ Architecture Overview

### Modular Design
The extension uses a **modular MVC architecture**:

- **Model** (`storage.js`): Data operations
- **View** (`views/*.js`): UI rendering
- **Controller** (`app.js`): Coordination

### Module Loading
Modules are loaded dynamically in sequence:
1. Core utilities (utils, storage, ui)
2. Drawer template
3. View controllers
4. Main app controller

### Why Modular?
- ✅ **Easy to debug**: Small, focused files
- ✅ **Easy to maintain**: Clear responsibilities
- ✅ **Easy to extend**: Add new views/features
- ✅ **Easy to test**: Independent modules

## 🔧 Common Development Tasks

### Add a New View

**1. Create view controller:**
```javascript
// js/views/myview.js
const MyView = {
  async load() {
    // Load data
    const data = await Storage.getSomeData();
    
    // Render UI
    this.render(data);
  },
  
  render(data) {
    const container = UI.get('bn-myview-container');
    container.innerHTML = `<div>${data}</div>`;
  }
};
```

**2. Add HTML to drawer:**
```javascript
// js/drawer.js
// Add to DrawerHTML string:
<div id="bn-myview-view" style="flex: 1; display: none;">
  <div id="bn-myview-container"></div>
</div>
```

**3. Add navigation:**
```javascript
// js/drawer.js - Add button to navigation:
<button id="bn-nav-myview">my view</button>

// js/app.js - Add to setupEventListeners:
UI.get('bn-nav-myview').onclick = () => this.switchView('myview');

// js/app.js - Add to switchView:
else if (view === 'myview') {
  MyView.load();
}
```

**4. Load module:**
```javascript
// content.js - Add to loadModules:
await loadScript('js/views/myview.js');
```

### Add Storage Method

```javascript
// js/storage.js
const Storage = {
  // ... existing methods
  
  async getMyData() {
    const result = await this.get(['mydata']);
    return result.mydata || {};
  },
  
  async saveMyData(data) {
    await this.set({ mydata: data });
  }
};
```

### Add Utility Function

```javascript
// js/utils.js
const Utils = {
  // ... existing methods
  
  myUtilityFunction(input) {
    // Do something
    return output;
  }
};
```

### Add UI Helper

```javascript
// js/ui.js
const UI = {
  // ... existing methods
  
  showNotification(message) {
    // Show notification
    alert(message);
  }
};
```

## 🐛 Debugging

### Console Logging
Each module logs its operations:
```javascript
console.log('Bro Notes: [Module] Action');
```

### Debug Checklist
1. Open DevTools (F12)
2. Check Console for errors
3. Check "Bro Notes:" logs
4. Inspect drawer element
5. Check Chrome Storage (Application → Storage)

### Common Issues

**Drawer not appearing:**
- Check if extension is enabled
- Check console for injection errors
- Verify `drawerInjected` is true

**Data not saving:**
- Check Storage API permissions in manifest
- Check console for storage errors
- Inspect Chrome Storage

**Events not working:**
- Check if event listeners are attached
- Verify element IDs match
- Check for JavaScript errors

**Modules not loading:**
- Check web_accessible_resources in manifest
- Check file paths in content.js
- Check console for loading errors

## 🧪 Testing

### Manual Testing
1. Install extension in Chrome
2. Click extension icon to open drawer
3. Test each view:
   - Home: Check welcome message and summary
   - All Notes: Create, search, filter, sort notes
   - Editor: Create, edit, save, delete notes
   - Labels: Add, rename, delete labels
   - Settings: Change nickname, export, import

### Test Checklist
- [ ] Drawer opens/closes
- [ ] Navigation works
- [ ] Create new note
- [ ] Edit existing note
- [ ] Delete note
- [ ] Add label to note
- [ ] Search notes
- [ ] Filter by label
- [ ] Sort notes
- [ ] Rename label
- [ ] Delete label
- [ ] Change nickname
- [ ] Export data
- [ ] Import data
- [ ] Auto-save works
- [ ] Preview works

### Browser Testing
Test in multiple browsers:
- [ ] Chrome
- [ ] Edge
- [ ] Brave
- [ ] Opera

## 📝 Code Style

### JavaScript
- Use `const` for constants, `let` for variables
- Use async/await instead of callbacks
- Use arrow functions for short functions
- Use template literals for strings
- Add comments for complex logic

### Naming
- **Modules**: PascalCase (`Storage`, `HomeView`)
- **Functions**: camelCase (`getNotes`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_NOTES`)
- **Element IDs**: kebab-case with prefix (`bn-note-title`)

### File Organization
- One module per file
- Group related functions
- Export single object per module
- Keep files under 200 lines

## 🚢 Building for Production

### Before Release
1. Test all features
2. Check console for errors
3. Test in multiple browsers
4. Update version in manifest.json
5. Update CHANGELOG.md
6. Create git tag

### Package Extension
1. Remove development files
2. Zip the extension folder
3. Upload to Chrome Web Store

### Files to Include
- manifest.json
- background.js
- content.js
- js/ folder
- icons/ folder
- README.md
- LICENSE

### Files to Exclude
- .git/
- .vscode/
- node_modules/
- *.log
- .DS_Store

## 🔐 Security

### Best Practices
- Never store sensitive data in plain text
- Validate all user input
- Sanitize HTML output (use `Utils.escapeHtml`)
- Use Content Security Policy
- Minimize permissions in manifest

### Storage Security
- All data stored locally (Chrome Storage)
- No data sent to external servers
- User controls export/import

## 📚 Resources

### Chrome Extension Docs
- [Getting Started](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

### JavaScript
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Contribution Guidelines
- Follow code style
- Add comments for complex logic
- Update documentation
- Test before submitting
- One feature per PR

## 📞 Support

### Getting Help
- Check ARCHITECTURE.md for design details
- Check DEVELOPER.md (this file) for how-tos
- Check console for error messages
- Open issue on GitHub

### Reporting Bugs
Include:
- Browser version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## 🎯 Roadmap

### Planned Features
- [ ] Markdown toolbar
- [ ] Note templates
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Note sharing
- [ ] Cloud sync
- [ ] Mobile support

### Ideas Welcome
Have an idea? Open an issue or submit a PR!

---

Happy coding! 🚀
