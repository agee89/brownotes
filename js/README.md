# JavaScript Modules

This directory contains all JavaScript modules for Brow Notes.

## 📁 Structure

```
js/
├── app.js           # Main application controller
├── storage.js       # Storage operations (Chrome Storage API)
├── ui.js            # UI manipulation helpers
├── utils.js         # Utility functions
├── drawer.js        # Drawer HTML template
│
└── views/           # View controllers (MVC pattern)
    ├── home.js      # Home view (welcome + summary)
    ├── allnotes.js  # All notes list view
    ├── editor.js    # Note editor view
    ├── labels.js    # Label management view
    └── settings.js  # Settings view
```

## 🔄 Loading Order

Modules are loaded in this sequence by `content.js`:

1. **Core Utilities**
   - `utils.js` - Utility functions
   - `storage.js` - Storage operations
   - `ui.js` - UI helpers

2. **Template**
   - `drawer.js` - HTML template

3. **View Controllers**
   - `views/home.js`
   - `views/allnotes.js`
   - `views/editor.js`
   - `views/labels.js`
   - `views/settings.js`

4. **Main Controller**
   - `app.js` - Initializes and coordinates everything

## 📝 Module Descriptions

### Core Modules

#### `app.js` (Main Controller)
**Purpose:** Main application controller that coordinates all modules

**Exports:** `App` object

**Key Methods:**
- `init()` - Initialize app and message listeners
- `injectDrawer()` - Inject drawer into page
- `setupEventListeners()` - Setup all event handlers
- `switchView(view)` - Switch between views

**Dependencies:** All other modules

---

#### `storage.js` (Data Layer)
**Purpose:** Handles all Chrome Storage operations

**Exports:** `Storage` object

**Key Methods:**
- `getNotes()` - Get all notes
- `saveNote(id, data)` - Save single note
- `deleteNote(id)` - Delete note
- `getLabels()` - Get unique labels
- `renameLabel(old, new)` - Rename label globally
- `deleteLabel(label)` - Delete label from all notes
- `exportData()` - Export all data
- `importData(data)` - Import data

**Dependencies:** None (uses Chrome Storage API)

---

#### `ui.js` (UI Helpers)
**Purpose:** DOM manipulation and UI state management

**Exports:** `UI` object

**Key Methods:**
- `get(id)` - Get element by ID
- `showDrawer()` / `hideDrawer()` - Drawer visibility
- `switchView(view)` - Switch between views
- `updateSaveButton(enabled)` - Update button state
- `switchEditorTab(tab)` - Switch edit/preview
- `clearEditor()` - Clear editor form
- `loadNoteToEditor(note)` - Load note to editor
- `getEditorValues()` - Get editor form values
- `updateLabelSuggestions(labels)` - Update datalist
- `updateLabelFilter(labels)` - Update filter dropdown

**Dependencies:** `Utils` (for escapeHtml)

---

#### `utils.js` (Utilities)
**Purpose:** Utility functions used across the app

**Exports:** `Utils` object

**Key Methods:**
- `generateId()` - Generate unique note IDs
- `formatDate(timestamp, format)` - Format dates
- `markdownToHtml(markdown)` - Convert markdown to HTML
- `escapeHtml(text)` - Escape HTML entities
- `downloadFile(content, filename)` - Download file
- `readFile(file)` - Read file as text

**Dependencies:** None (pure functions)

---

#### `drawer.js` (Template)
**Purpose:** Contains the HTML template for the drawer UI

**Exports:** `DrawerHTML` string

**Contains:**
- Complete drawer HTML structure
- Inline styles
- All view containers
- Navigation buttons

**Dependencies:** None (just HTML string)

---

### View Controllers

#### `views/home.js`
**Purpose:** Home view with welcome message and summary

**Exports:** `HomeView` object

**Key Methods:**
- `load()` - Load and render home view

**Dependencies:** `Storage`, `UI`, `Utils`

---

#### `views/allnotes.js`
**Purpose:** All notes list with search/filter/sort

**Exports:** `AllNotesView` object

**Key Methods:**
- `render()` - Render notes list with filters
- `renderList(notes)` - Render HTML for notes

**Dependencies:** `Storage`, `UI`, `Utils`

---

#### `views/editor.js`
**Purpose:** Note editor with title, label, content, preview

**Exports:** `EditorView` object

**Properties:**
- `currentNoteId` - Currently editing note ID
- `autoSaveTimeout` - Auto-save timer

**Key Methods:**
- `open(noteId)` - Open editor (null = new note)
- `save(silent)` - Save note
- `delete()` - Delete current note
- `updateSaveButton()` - Update save button state
- `handleInput()` - Handle input changes (auto-save)
- `renderPreview()` - Render markdown preview

**Dependencies:** `Storage`, `UI`, `Utils`, `App`

---

#### `views/labels.js`
**Purpose:** Label management (add, rename, delete)

**Exports:** `LabelsView` object

**Key Methods:**
- `load()` - Load labels list
- `renderList(labels)` - Render labels HTML
- `rename(oldLabel)` - Rename label
- `delete(label)` - Delete label
- `add()` - Add new label

**Global Functions:**
- `window.renameLabel(label)` - Called from onclick
- `window.deleteLabel(label)` - Called from onclick

**Dependencies:** `Storage`, `UI`, `Utils`

---

#### `views/settings.js`
**Purpose:** Settings management (nickname, export, import)

**Exports:** `SettingsView` object

**Key Methods:**
- `load()` - Load settings
- `save()` - Save nickname
- `export()` - Export all data to JSON
- `import(event)` - Import data from JSON file

**Dependencies:** `Storage`, `UI`, `Utils`, `HomeView`

---

## 🔗 Dependencies Graph

```
app.js
├── storage.js
├── ui.js
│   └── utils.js
├── drawer.js
└── views/
    ├── home.js
    │   ├── storage.js
    │   ├── ui.js
    │   └── utils.js
    ├── allnotes.js
    │   ├── storage.js
    │   ├── ui.js
    │   └── utils.js
    ├── editor.js
    │   ├── storage.js
    │   ├── ui.js
    │   ├── utils.js
    │   └── app.js
    ├── labels.js
    │   ├── storage.js
    │   ├── ui.js
    │   └── utils.js
    └── settings.js
        ├── storage.js
        ├── ui.js
        ├── utils.js
        └── home.js
```

## 🎯 Design Principles

### 1. Single Responsibility
Each module has one clear purpose.

### 2. Separation of Concerns
- Data (storage.js)
- UI (ui.js, views/*.js)
- Logic (app.js)
- Utilities (utils.js)

### 3. Dependency Injection
Modules don't create dependencies, they use existing ones.

### 4. Pure Functions
Utility functions have no side effects.

### 5. Async/Await
All async operations use async/await pattern.

## 📚 Further Reading

- See **ARCHITECTURE.md** for complete architecture documentation
- See **DEVELOPER.md** for development guide
- See **REFACTORING.md** for refactoring details

## 🐛 Debugging

Each module logs its operations:
```javascript
console.log('Brow Notes: [Module] Action');
```

Check console for module-specific logs to trace execution flow.

## 🧪 Testing

Each module can be tested independently:

```javascript
// Test storage
const notes = await Storage.getNotes();
console.log(notes);

// Test utils
const html = Utils.markdownToHtml('# Hello');
console.log(html);

// Test UI
UI.showDrawer();
```

## 🚀 Adding New Module

1. Create new file in `js/` or `js/views/`
2. Export object with methods
3. Add to `content.js` loading sequence
4. Add to `manifest.json` web_accessible_resources
5. Document in this README

---

**Questions?** Check the main documentation files in the root directory.
