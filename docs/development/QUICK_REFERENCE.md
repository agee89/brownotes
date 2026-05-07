# 🚀 Quick Reference

Quick guide untuk developer yang ingin cepat memahami struktur Brow Notes.

## 📂 File Structure (Simplified)

```
bronotes/
├── content.js              # Entry point
├── background.js           # Service worker
├── manifest.json           # Extension config
│
├── js/                     # All JavaScript modules
│   ├── app.js             # Main controller
│   ├── storage.js         # Data operations
│   ├── ui.js              # UI helpers
│   ├── utils.js           # Utilities
│   ├── drawer.js          # HTML template
│   └── views/             # View controllers
│       ├── home.js
│       ├── allnotes.js
│       ├── editor.js
│       ├── labels.js
│       └── settings.js
│
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # Architecture details
    ├── DEVELOPER.md        # Developer guide
    ├── REFACTORING.md      # Refactoring summary
    └── QUICK_REFERENCE.md  # This file
```

## 🎯 Where to Look

### "I want to understand the architecture"
→ Read **ARCHITECTURE.md**

### "I want to add a feature"
→ Read **DEVELOPER.md**

### "I want to understand the refactoring"
→ Read **REFACTORING.md**

### "I want to fix a bug"
→ Check console logs, find module name, open that file

### "I want to add a new view"
→ See **DEVELOPER.md** → "Add a New View"

### "I want to add storage method"
→ Edit `js/storage.js`

### "I want to change UI"
→ Edit `js/drawer.js` (HTML) or `js/ui.js` (logic)

## 🔍 Finding Code

| What | Where |
|------|-------|
| Data operations | `js/storage.js` |
| UI rendering | `js/views/*.js` |
| UI helpers | `js/ui.js` |
| Utilities | `js/utils.js` |
| HTML template | `js/drawer.js` |
| Event handlers | `js/app.js` → `setupEventListeners()` |
| View switching | `js/app.js` → `switchView()` |
| Home view | `js/views/home.js` |
| Notes list | `js/views/allnotes.js` |
| Editor | `js/views/editor.js` |
| Labels | `js/views/labels.js` |
| Settings | `js/views/settings.js` |

## 🐛 Debugging Flow

1. **See error in console**
   - Look for "Brow Notes: [Module]" prefix
   - Open that module file

2. **Feature not working**
   - Check if drawer is injected
   - Check if event listener is attached
   - Check console for errors

3. **Data not saving**
   - Check `storage.js` logs
   - Check Chrome Storage (DevTools → Application)

4. **UI not updating**
   - Check view controller logs
   - Check if view is loaded
   - Check element IDs match

## 📝 Common Tasks

### Add New View
1. Create `js/views/myview.js`
2. Add HTML to `js/drawer.js`
3. Add nav button to `js/drawer.js`
4. Add event listener in `js/app.js`
5. Add to `switchView()` in `js/app.js`
6. Load in `content.js`

### Add Storage Method
```javascript
// js/storage.js
async getMyData() {
  const result = await this.get(['mydata']);
  return result.mydata || {};
}
```

### Add Utility Function
```javascript
// js/utils.js
myFunction(input) {
  return output;
}
```

### Add UI Helper
```javascript
// js/ui.js
myHelper() {
  // Do something with DOM
}
```

## 🔄 Data Flow Examples

### Opening a Note
```
User clicks note
  → window.openNoteById(id)
  → EditorView.open(id)
  → Storage.getNote(id)
  → UI.loadNoteToEditor(note)
```

### Saving a Note
```
User types
  → EditorView.handleInput()
  → Auto-save after 1s
  → EditorView.save(true)
  → Storage.saveNote(id, data)
```

### Switching Views
```
User clicks nav
  → App.switchView('allnotes')
  → UI.switchView('allnotes')
  → AllNotesView.render()
```

## 🎨 Code Style

### Naming
- Modules: `PascalCase` (Storage, HomeView)
- Functions: `camelCase` (getNotes, formatDate)
- Constants: `UPPER_SNAKE_CASE` (MAX_NOTES)
- IDs: `kebab-case` with prefix (bn-note-title)

### Async
Always use async/await:
```javascript
// ✅ Good
async function load() {
  const data = await Storage.getNotes();
}

// ❌ Bad
function load() {
  Storage.getNotes().then(data => {});
}
```

### Exports
One object per module:
```javascript
const MyModule = {
  method1() {},
  method2() {}
};
```

## 🧪 Testing Checklist

- [ ] Drawer opens/closes
- [ ] Navigation works
- [ ] Create note
- [ ] Edit note
- [ ] Delete note
- [ ] Search notes
- [ ] Filter by label
- [ ] Sort notes
- [ ] Add label
- [ ] Rename label
- [ ] Delete label
- [ ] Change nickname
- [ ] Export data
- [ ] Import data
- [ ] Auto-save works
- [ ] Preview works

## 📦 Module Dependencies

```
utils.js          (no dependencies)
  ↓
storage.js        (uses Chrome API)
  ↓
ui.js             (uses utils)
  ↓
drawer.js         (just HTML)
  ↓
views/*.js        (use storage, ui, utils)
  ↓
app.js            (uses all modules)
```

## 🚀 Quick Start

1. Clone repo
2. Open `chrome://extensions/`
3. Enable Developer mode
4. Load unpacked → select folder
5. Click extension icon
6. Start coding!

## 📞 Need Help?

| Question | Answer |
|----------|--------|
| How does it work? | Read ARCHITECTURE.md |
| How to add feature? | Read DEVELOPER.md |
| Why refactored? | Read REFACTORING.md |
| Where is X? | Check this file |
| Bug? | Check console logs |

## 🎯 Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `content.js` | Entry point | ~40 |
| `js/app.js` | Main controller | ~120 |
| `js/storage.js` | Data layer | ~100 |
| `js/ui.js` | UI helpers | ~100 |
| `js/utils.js` | Utilities | ~80 |
| `js/drawer.js` | HTML template | ~100 |
| `js/views/*.js` | View controllers | ~50-150 each |

**Total:** ~800 lines (was 1000+ in single file)

## 💡 Tips

1. **Start with app.js** - Understand the flow
2. **Check console logs** - Every module logs actions
3. **Use DevTools** - Inspect elements and storage
4. **Read view files** - They're small and focused
5. **Test incrementally** - Test after each change

## 🔗 Links

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

---

**Remember:** Small files, clear names, easy debugging! 🎉
