# Bro Notes - Architecture Documentation

## 📁 Project Structure

```
bronotes/
├── manifest.json           # Chrome extension manifest
├── background.js           # Service worker for extension state
├── content.js             # Main entry point (loads all modules)
│
├── js/                    # Modular JavaScript files
│   ├── storage.js         # Storage operations (Chrome Storage API)
│   ├── utils.js           # Utility functions (date, markdown, etc.)
│   ├── ui.js              # UI manipulation helpers
│   ├── drawer.js          # Drawer HTML template
│   ├── app.js             # Main application controller
│   │
│   └── views/             # View controllers (MVC pattern)
│       ├── home.js        # Home view (welcome + summary)
│       ├── allnotes.js    # All notes list view
│       ├── editor.js      # Note editor view
│       ├── labels.js      # Label management view
│       └── settings.js    # Settings view
│
├── icons/                 # Extension icons
└── docs/                  # Documentation files
```

## 🏗️ Architecture Pattern

### MVC (Model-View-Controller)

**Model**: `js/storage.js`
- Handles all data operations
- Abstracts Chrome Storage API
- Provides async/await interface

**View**: `js/views/*.js`
- Each view is a separate module
- Responsible for rendering and user interactions
- Uses `UI` module for DOM manipulation

**Controller**: `js/app.js`
- Main application controller
- Manages view switching
- Coordinates between views and storage

## 📦 Module Descriptions

### Core Modules

#### `storage.js`
Handles all Chrome Storage operations with Promise-based API.

**Key Functions:**
- `getNotes()` - Get all notes
- `saveNote(id, data)` - Save single note
- `deleteNote(id)` - Delete note
- `getLabels()` - Get unique labels
- `renameLabel(old, new)` - Rename label globally
- `exportData()` / `importData()` - Data export/import

#### `utils.js`
Utility functions used across the app.

**Key Functions:**
- `generateId()` - Generate unique note IDs
- `formatDate(timestamp)` - Format dates
- `markdownToHtml(text)` - Convert markdown to HTML
- `downloadFile()` / `readFile()` - File operations

#### `ui.js`
DOM manipulation and UI state management.

**Key Functions:**
- `get(id)` - Get element by ID
- `showDrawer()` / `hideDrawer()` - Drawer visibility
- `switchView(view)` - Switch between views
- `updateSaveButton(enabled)` - Update button state
- `switchEditorTab(tab)` - Switch edit/preview

#### `drawer.js`
Contains the HTML template for the drawer UI.

**Exports:**
- `DrawerHTML` - Complete drawer HTML string

### View Controllers

#### `home.js` - HomeView
Displays welcome message and summary statistics.

**Methods:**
- `load()` - Load and render home view

#### `allnotes.js` - AllNotesView
Displays list of all notes with search/filter/sort.

**Methods:**
- `render()` - Render notes list with filters
- `renderList(notes)` - Render HTML for notes

#### `editor.js` - EditorView
Note editor with title, label, content, and preview.

**Methods:**
- `open(noteId)` - Open editor for note (null = new)
- `save(silent)` - Save note (silent = no feedback)
- `delete()` - Delete current note
- `updateSaveButton()` - Update save button state
- `handleInput()` - Handle input changes (auto-save)
- `renderPreview()` - Render markdown preview

**Properties:**
- `currentNoteId` - Currently editing note ID
- `autoSaveTimeout` - Auto-save timer

#### `labels.js` - LabelsView
Label management (add, rename, delete).

**Methods:**
- `load()` - Load labels list
- `renderList(labels)` - Render labels HTML
- `rename(oldLabel)` - Rename label
- `delete(label)` - Delete label
- `add()` - Add new label

**Global Functions:**
- `window.renameLabel()` - Called from onclick
- `window.deleteLabel()` - Called from onclick

#### `settings.js` - SettingsView
Settings management (nickname, export, import).

**Methods:**
- `load()` - Load settings
- `save()` - Save nickname
- `export()` - Export all data to JSON
- `import(event)` - Import data from JSON file

### Main Controller

#### `app.js` - App
Main application controller that coordinates everything.

**Methods:**
- `init()` - Initialize app and listeners
- `injectDrawer()` - Inject drawer into page
- `setupEventListeners()` - Setup all event handlers
- `switchView(view)` - Switch between views

**Properties:**
- `drawerInjected` - Whether drawer is injected
- `currentView` - Current active view

**Global Functions:**
- `window.openNoteById(id)` - Open note from onclick

## 🔄 Data Flow

### Opening a Note
```
User clicks note in list
  → window.openNoteById(id) called
  → EditorView.open(id)
  → Storage.getNote(id)
  → UI.loadNoteToEditor(note)
  → UI.switchEditorTab('edit')
```

### Saving a Note
```
User types in editor
  → EditorView.handleInput()
  → EditorView.updateSaveButton()
  → Auto-save after 1s
  → EditorView.save(true)
  → Storage.saveNote(id, data)
```

### Switching Views
```
User clicks navigation
  → App.switchView('allnotes')
  → UI.switchView('allnotes')
  → AllNotesView.render()
  → Storage.getNotes()
  → AllNotesView.renderList(notes)
```

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**
- Storage logic separated from UI logic
- Each view is independent
- Easy to understand and modify

### 2. **Maintainability**
- Small, focused files (50-150 lines each)
- Clear responsibilities
- Easy to find and fix bugs

### 3. **Testability**
- Each module can be tested independently
- Mock storage for testing views
- Mock UI for testing controllers

### 4. **Scalability**
- Easy to add new views
- Easy to add new features
- Easy to refactor individual modules

### 5. **Debugging**
- Clear error messages with module names
- Easy to trace execution flow
- Console logs show which module is active

## 🐛 Debugging Guide

### Enable Debug Logging
Each module logs its operations:
```javascript
console.log('Bro Notes: [Module] Action');
```

### Common Debug Points

**Storage Issues:**
- Check `storage.js` console logs
- Inspect Chrome Storage: DevTools → Application → Storage

**UI Issues:**
- Check `ui.js` and view controller logs
- Inspect element in DevTools
- Check if drawer is injected

**Event Issues:**
- Check `app.js` setupEventListeners
- Verify onclick handlers are attached
- Check for JavaScript errors in console

### Debug Checklist
1. ✅ Is drawer injected? Check for `#bronotes-drawer`
2. ✅ Are modules loaded? Check console for "All modules loaded"
3. ✅ Are event listeners attached? Check `app.js` logs
4. ✅ Is data in storage? Check Application → Storage
5. ✅ Are there JS errors? Check Console tab

## 🔧 Adding New Features

### Add New View
1. Create `js/views/newview.js`
2. Export `NewView` object with `load()` method
3. Add HTML to `drawer.js`
4. Add navigation button
5. Add to `app.js` switchView
6. Load in `content.js`

### Add New Storage Method
1. Add method to `Storage` object in `storage.js`
2. Use async/await pattern
3. Return Promise
4. Add error handling

### Add New Utility
1. Add function to `Utils` object in `utils.js`
2. Make it pure (no side effects)
3. Document parameters and return value

## 📝 Code Style Guide

### Naming Conventions
- **Modules**: PascalCase (e.g., `Storage`, `HomeView`)
- **Functions**: camelCase (e.g., `getNotes`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DrawerHTML`)
- **Private vars**: camelCase with underscore prefix (e.g., `_cache`)

### Async/Await
Always use async/await instead of callbacks:
```javascript
// ✅ Good
async function loadData() {
  const notes = await Storage.getNotes();
  return notes;
}

// ❌ Bad
function loadData(callback) {
  Storage.getNotes().then(callback);
}
```

### Error Handling
Always handle errors:
```javascript
try {
  await Storage.saveNote(id, data);
} catch (error) {
  console.error('Error saving note:', error);
  alert('Failed to save note');
}
```

## 🚀 Performance Considerations

### Lazy Loading
Modules are loaded on-demand when drawer is first opened.

### Debouncing
Auto-save uses 1-second debounce to avoid excessive writes.

### Efficient Rendering
Only re-render changed views, not entire drawer.

### Storage Optimization
- Use single storage key for all notes
- Batch updates when possible
- Avoid unnecessary reads

## 📚 Further Reading

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
