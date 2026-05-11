# Brow Notes

**Minimalist markdown note-taking extension for Chrome with advanced features**

Markdown notepad yang selalu tersedia di browser. Tulis catatan, pindah tab, catatan tetap sama sampai selesai.

> **v3.0.0 Update:** Complete refactoring to modular architecture! Same features, better code. [Read more →](REFACTORING_COMPLETE.md)

---

## ✨ Features

### 📝 Core Note-Taking
- **Rich Markdown Editor** - Full markdown support with live preview
  - Textarea-based editor with monospace font
  - Font: Consolas, Monaco, 'Courier New', monospace
  - Font size: 13px (Constants.EDITOR.FONT_SIZE)
  - Line height: 1.7 (Constants.EDITOR.LINE_HEIGHT)
  - Tab size: 4 spaces (Constants.EDITOR.TAB_SIZE)
  - Padding: 24px horizontal, 12px top, 8px bottom
  - Syntax highlighting in preview mode
  - Real-time markdown rendering
  - Supports all standard markdown syntax
- **Auto-save** - Saves automatically after typing stops
  - Default delay: 1000ms (1 second) after last keystroke
  - Configurable range: 500-5000ms (0.5-5 seconds)
  - Preference key: 'autoSaveDelay'
  - Only triggers for existing notes (not new unsaved drafts)
  - Debounced (timer resets on each keystroke)
  - Silent save (no confirmation dialog)
  - Creates auto-snapshot if > 5 minutes since last snapshot
  - Visual feedback: "saving..." → "saved" with checkmark icon
- **Dual Mode** - Edit mode and Preview mode with tab switching
  - Two tabs: "Edit" and "Preview"
  - Tab switching preserves content (no data loss)
  - Edit mode: Raw markdown textarea
  - Preview mode: Rendered HTML with styling
  - Preview uses custom markdown renderer (Utils.markdownToHtml)
  - Tab state not persisted (always opens in configured default)
  - Keyboard shortcut: None (click only)
- **Character Counter** - Real-time word and character count
  - Format: "X words / Y chars" (e.g., "42 words / 256 chars")
  - Singular/plural: "1 word" vs "2 words", "1 char" vs "2 chars"
  - Updates on every keystroke (input event)
  - Counts words by splitting on whitespace (\s+)
  - Counts characters including spaces and newlines
  - Displayed below editor textarea
  - Font size: 11px, color: #9a9a9a
  - Position: Bottom right of editor
- **Title & Label** - Organize notes with titles and labels
  - **Title field**:
    - Max length: 120 characters (Constants.NOTES.MAX_TITLE_LENGTH)
    - Character counter: "X/120" (red when at limit)
    - Single-line input (no line breaks)
    - Optional (can save without title → shows "untitled" in list)
    - Font size: 13px, font-weight: 600
  - **Label field**:
    - Max length: 32 characters (Constants.NOTES.MAX_LABEL_LENGTH)
    - Character counter: "X/32" (red when at limit)
    - Single-line input (no line breaks)
    - Optional (can save without label → shows "no label" in list)
    - Autocomplete dropdown (max 8 suggestions)
    - Case-insensitive matching
    - Must create label in Labels view before using (validation on save)
- **Note Templates** - 12 built-in templates
  - Template picker modal (grid layout, 2 columns)
  - Categories: work, personal, planning, development, learning, thinking, review, capture, research
  - Templates include: Meeting Notes, Daily Journal, Todo List, Code Snippet, Bug Report, Project Planning, Learning Notes, Brainstorming, Book/Article Notes, Weekly Review, Quick Note, Research Notes
  - Variable substitution: {{date}}, {{time}}, {{datetime}}, {{nickname}}, {{week}}
  - Confirmation if editor has content ("Replace current content?")
  - Auto-extracts title from first H1 heading
  - Focuses editor after applying template
- **Export to Markdown** - Download notes as `.md` files
  - Filename format: `{slugified-title}_{short-id}.md` (e.g., "my-note_a1b2c3.md")
  - Short ID: First 6 characters of note ID
  - Slugification: Lowercase, spaces to hyphens, special chars removed
  - Fallback filename: "untitled-note_{id}.md"
  - Content format: `# Title\n\n{content}` (title as H1 if present)
  - MIME type: text/markdown;charset=utf-8
  - Auto-saves note before export if unsaved
  - Download via blob URL and temporary anchor element
- **Print Notes** - Print formatted notes directly from browser
  - Opens browser print dialog
  - Custom print stylesheet (PrintStyles.get())
  - Renders markdown to HTML before printing
  - Uses hidden iframe for print preview
  - Iframe size: 1px × 1px (invisible)
  - Cleanup after print (250ms delay)
  - Print title as H1 heading
  - Preserves markdown formatting (headings, lists, code blocks, etc.)
  - Page margins: 20mm all sides
  - Font: System default (serif for body, monospace for code)

### 🎨 Markdown Toolbar
Complete markdown formatting toolbar with 15 buttons:
- **Bold** (`data-md-action="bold"`)
  - Wraps selection with `**text**`
  - Placeholder: "bold" if no selection
  - Keyboard: None (click only)
  - Selection preserved after insertion
- **Italic** (`data-md-action="italic"`)
  - Wraps selection with `*text*`
  - Placeholder: "italic" if no selection
  - Single asterisk syntax (not underscore)
- **Strikethrough** (`data-md-action="strike"`)
  - Wraps selection with `~~text~~`
  - Placeholder: "strikethrough" if no selection
  - Double tilde syntax
- **Link** (`data-md-action="link"`)
  - Inserts `[text](url)` format
  - If selection exists: `[selection](url)`
  - If no selection: `[link](url)` with "link" as placeholder
  - Cursor positioned to select link text after insertion
- **Image** (`data-md-action="image"`)
  - Inserts `![alt](url)` format
  - If selection exists: `![selection](url)`
  - If no selection: `![alt](url)` with "alt" as placeholder
  - Cursor positioned to select alt text after insertion
- **Inline Code** (`data-md-action="code"`)
  - Wraps selection with `` `text` `` (single backticks)
  - If selection contains newlines: Converts to code block (triple backticks)
  - Placeholder: "code" if no selection
- **Code Block** (`data-md-action="code-block"`)
  - Wraps selection with ` ```\ntext\n``` ` (triple backticks with newlines)
  - Always creates multi-line code block
  - Placeholder: "code" if no selection
  - Adds newlines before/after for proper spacing
- **Heading 1** (`data-md-action="h1"`)
  - Prefixes selected lines with `# `
  - Line-based formatting (applies to entire lines)
  - Multiple lines: Each line gets `# ` prefix
  - Empty lines preserved (not prefixed)
- **Heading 2** (`data-md-action="h2"`)
  - Prefixes selected lines with `## `
  - Line-based formatting (applies to entire lines)
  - Multiple lines: Each line gets `## ` prefix
- **Blockquote** (`data-md-action="quote"`)
  - Prefixes selected lines with `> `
  - Line-based formatting (applies to entire lines)
  - Multiple lines: Each line gets `> ` prefix
- **Bullet List** (`data-md-action="bullet-list"`)
  - Prefixes selected lines with `- `
  - Line-based formatting (applies to entire lines)
  - Multiple lines: Each line gets `- ` prefix
- **Numbered List** (`data-md-action="number-list"`)
  - Prefixes selected lines with `1. `, `2. `, `3. `, etc.
  - Line-based formatting with auto-incrementing numbers
  - Multiple lines: Each line gets sequential number
  - Custom mapper function: `(line, index) => ${index + 1}. ${line}`
- **Checklist** (`data-md-action="checklist"`)
  - Prefixes selected lines with `- [ ] `
  - Line-based formatting (applies to entire lines)
  - Creates unchecked checkboxes (space inside brackets)
- **Table** (`data-md-action="table"`)
  - Inserts 2-column table template:
    ```
    | Column 1 | Column 2 |
    | --- | --- |
    |  |  |
    ```
  - Cursor positioned at first cell (offset: 2 chars from start, 10 chars selection)
  - Adds newlines before/after for proper spacing
  - Fixed 2-column layout (not configurable)
- **Horizontal Line** (`data-md-action="line"`)
  - Inserts `\n---\n` (three hyphens with newlines)
  - Adds newlines before/after for proper spacing
  - Cursor positioned after the line (offset: 5 chars)
- **Toolbar Styling**:
  - Button size: 28px × 28px (Constants.UI.TOOLBAR_BUTTON_SIZE if defined, else inline)
  - Icon size: 12px × 12px
  - Padding: 8px per button
  - Gap: No gap (buttons adjacent)
  - Border: None on buttons, 1px solid #f0f0f0 on toolbar bottom
  - Hover: rgba(42, 42, 42, 0.05) background (light mode)
  - Dark mode hover: rgba(255, 255, 255, 0.08) background
  - Icon filter: invert(1) in dark mode, opacity: 0.78
  - Toolbar height: ~44px (auto-sized by button height + padding)
- **Selection Behavior**:
  - Preserves scroll position after insertion
  - Preserves cursor position (or sets new selection)
  - Triggers input event (updates character counter, auto-save timer)
  - Syncs editor search highlights if search is active
- **Line-based Formatting Rules**:
  - Expands selection to include full lines (from last `\n` before start to next `\n` after end)
  - Empty lines in multi-line selection are preserved (not prefixed)
  - Single-line selection: Applies to that line only
  - Cursor positioned at start of formatted block after insertion

### 🔍 Advanced Search & Filter
- **Full-text Search** - Search across title, content, and labels in real-time
  - Case-insensitive matching
  - Instant results as you type
  - Searches all note fields simultaneously
  - No minimum character requirement
- **In-editor Search** - Ctrl+F to search within note with live highlighting
  - Shows match counter (e.g., "3/15" = match 3 of 15 total)
  - Navigate with Enter (next match) and Shift+Enter (previous match)
  - Current match highlighted in different color (yellow background for current, lighter yellow for others)
  - Auto-scrolls to match position (centers match in viewport)
  - Escape to close search
  - Preserves search term when reopening
  - Highlights update in real-time as you edit
  - Case-insensitive search
- **Label Filter** - Filter notes by specific label
  - Dropdown with all available labels
  - Shows "all labels" option (empty value = show all)
  - Special "__NO_LABEL__" filter for unlabeled notes
  - Label count displayed next to each label
  - Dropdown max height: 188px with scroll
- **Favorite Filter** - Toggle to show only bookmarked notes
  - Icon button with active/inactive state (bookmark icon)
  - Persists across filter changes
  - Combines with other filters (AND logic)
  - Visual indicator when active (opacity: 1 vs 0.72)
- **Label Filter Lock** 🔒 - Lock current label filter across sessions
  - Click lock icon to toggle locked/unlocked state
  - Locked filter persists even after closing drawer and browser restart
  - Icon changes: unlocked.svg ↔ locked.svg
  - Prevents accidental filter changes
  - Stored in Chrome Storage (key: 'lockedLabelFilter')
  - Lock state and value saved together: `{ locked: boolean, value: string }`
  - When locked, dropdown changes automatically update locked value
  - Reset Filters button does NOT clear locked filter (by design)
- **Sort Options** (4 modes): 
  - **Latest** (updated-desc) - Last modified timestamp, newest first (default)
  - **Oldest** (updated-asc) - Last modified timestamp, oldest first
  - **Newest** (created-desc) - Creation timestamp, newest first
  - **First** (created-asc) - Creation timestamp, oldest first
  - King notes ALWAYS appear first (regardless of sort)
  - Pinned notes appear second (after king, before regular notes)
  - Sort order: King → Pinned → Regular (sorted by selected mode)
- **Reset Filters** - One-click to clear search, label filter, and favorite filter
  - Clears search input (sets to empty string)
  - Clears label filter dropdown (sets to "all labels")
  - Disables favorite filter (sets active to false)
  - Does NOT reset locked label filter (by design - must manually unlock first)
  - Does NOT reset sort order (sort persists)

### 🏷️ Label Management
- **Create Labels** - Add custom labels for categorization
  - Max label length: 32 characters (enforced with character counter)
  - Case-sensitive storage, case-insensitive matching
  - Duplicate prevention (case-insensitive check)
  - Instant validation feedback
- **Rename Labels** - Rename labels (updates all notes automatically)
  - Updates all notes with old label to new label
  - Preserves label colors during rename
  - Atomic operation (all or nothing)
  - Confirmation dialog before rename
- **Delete Labels** - Remove labels (removes from all notes)
  - Removes label from all notes that use it
  - Deletes custom color assignment
  - Confirmation dialog with danger styling
  - Shows note count before deletion
- **Label Colors** - 42-color palette for visual organization
  - **Color Palette** (42 colors):
    - Blues: #8fb8ff, #a3b8f5, #b0d4ef, #77c7d9, #a8e4f0, #60a8ff, #90a8c8
    - Greens: #8fd8b8, #a8c26d, #a8e0d0, #b8dca0, #9ab888, #b0be80, #6dddb8, #90d840, #40d4b8
    - Yellows/Oranges: #f2c66d, #d6a06d, #f5c9a8, #f0e08a, #f0ddb0, #f0d040, #f09860, #d4906a, #d8c090, #c8c080, #ffb38a
    - Reds/Pinks: #f29c9c, #f5b8cc, #ddb8d4, #e8a898, #f080c0, #f07070
    - Purples: #c6a5ff, #d4b8f5, #ccb8e8, #b070f0, #8888f0
    - Grays/Browns: #c8b090, #c8a090, #80b8b8
  - **Default Color**: #b8b8b8 (medium gray) - used when no custom color set
  - Color picker modal with grid layout (7 columns × 6 rows)
  - Visual preview of color on label dot (8px × 8px circle)
  - Reset button to remove custom color (reverts to default gray)
  - Colors stored in Chrome Storage (key: 'labelColors', format: `{ labelName: colorHex }`)
- **Label Autocomplete** - Smart label suggestions while typing in editor
  - Triggers on label input field focus
  - Fuzzy matching against existing labels
  - Keyboard navigation (Arrow Up/Down, Enter to select, Escape to close)
  - Max 8 suggestions shown
  - Case-insensitive matching
  - Shows label color dot next to suggestion
- **Label Counter** - See note count per label in Labels view
  - Real-time count of notes using each label
  - Format: "labelname (X)" where X is count
  - Updates immediately after note changes
  - Excludes trashed notes from count
- **Locked Labels** 🔒 - Lock labels to prevent accidental deletion
  - Lock icon next to label name
  - Locked labels cannot be deleted (button disabled)
  - Locked labels can still be renamed
  - Lock state persists across sessions
  - Stored in Chrome Storage
- **No Label Filter** - Filter notes without labels
  - Special filter value: "__NO_LABEL__"
  - Shows only notes with empty/null label field
  - Useful for finding unorganized notes
  - Combines with search and favorite filters

### ⭐ Note Organization
- **Favorite Notes** ⭐ - Bookmark important notes
  - Bookmark icon toggle in editor (icons/bookmark.svg vs icons/bookmarked.svg)
  - Visual indicator in note list (11px × 11px bookmark icon, opacity: 0.72)
  - Filter by favorites (favorite-only toggle button)
  - Favorite state stored in note object: `favorite: boolean`
  - Persists across sessions
  - No limit on number of favorites
- **Pin Notes** 📌 - Pin notes to top of list
  - Pin icon toggle in editor (icons/pin.svg vs icons/pinned.svg)
  - Pinned notes appear below king note, above regular notes
  - Visual indicator in note list (11px × 11px pin icon, opacity: 0.72)
  - Pin state stored in note object: `pinned: boolean`
  - Multiple notes can be pinned
  - Pinned notes maintain sort order among themselves
  - Persists across sessions
- **King Note** 👑 - Mark one note as "king" (highlighted with crown icon)
  - **Only ONE king note allowed** - setting a new king automatically removes previous king
  - Crown icon in editor toggle (icons/crown.svg vs icons/crowned.svg)
  - King note ALWAYS appears first in list (regardless of sort, filters, or pinned status)
  - **Special highlighting**:
    - Light mode: Background #fffbed (pale yellow), hover #fff8d9, border rgba(220, 174, 26, 0.18)
    - Dark mode: Background rgba(255, 207, 64, 0.09), hover rgba(255, 207, 64, 0.14), border rgba(255, 207, 64, 0.22)
    - Transparent mode: Slightly more opaque backgrounds
  - King state stored in note object: `king: boolean`
  - Atomic king assignment (enforced in saveNote function)
  - Persists across sessions
  - Visual crown icon not shown in list (only background highlight)
- **Note Preview** - See content preview in list view
  - First 100 characters of content (configurable: Constants.NOTES.PREVIEW_LENGTH)
  - Ellipsis (...) added if content exceeds preview length
  - Preserves line breaks as spaces
  - Displayed below title in note card
  - Font size: 12px, color: #6a6a6a, line-height: 1.5
- **Label Dots** - Visual label indicators with colors
  - 8px × 8px colored circle
  - Appears before label text in note list
  - Uses custom label color or default gray (#b8b8b8)
  - Box shadow: 0 0 0 1px rgba(0,0,0,0.08) for definition
  - Only shown if note has a label
- **Timestamps** - Created and modified dates
  - **Created timestamp**: `createdAt` (Unix timestamp in milliseconds)
  - **Modified timestamp**: `updatedAt` (Unix timestamp in milliseconds)
  - Display format: "X day ago", "X hours ago", "X min ago", or full date
  - Shown in note list with calendar icon (11px × 11px, opacity: 0.55)
  - Format function: Utils.formatDate() with 'long' mode
  - Updates automatically on every save
  - Used for sorting (Latest/Oldest/Newest/First modes)

### 📜 Version History
- **Auto-snapshots** - Automatic version history every 5 minutes
  - Interval: 5 minutes (300,000ms) - configurable via Constants.NOTES.AUTO_SNAPSHOT_INTERVAL
  - Throttling: Won't create snapshot if last snapshot was < 5 minutes ago
  - Triggered on auto-save (silent save after typing delay)
  - Only creates snapshot if content actually changed
  - Skips empty notes (no title and no content)
  - Reason tag: 'autosave'
- **Manual Snapshots** - Save versions before major edits
  - Triggered on explicit save button click
  - Always creates snapshot (no throttling)
  - Reason tag: 'manual'
  - Special snapshots: 'before-empty' (before clearing content), 'before-restore' (before restoring old version)
- **History Dropdown** - Browse and restore previous versions
  - Button shows current version time: "version HH.MM ▾"
  - Dropdown max height: 188px with scroll (Constants.UI.HISTORY_MENU_MAX_HEIGHT)
  - Min width: 190px (Constants.UI.HISTORY_MENU_MIN_WIDTH)
  - Z-index: 60 (above other UI elements)
  - Disabled when no history (button shows "version --.-- ▾")
  - Click outside to close
  - Keyboard: Escape to close
- **Timestamp Display** - See when each version was saved
  - Format: "version HH.MM" (24-hour format with dot separator, e.g., "version 14.30")
  - Relative time: "just now", "X min ago", "X hours ago", "Yesterday HH:MM", or full date
  - Locale: Indonesian (id-ID) for time formatting
  - Timezone: Local browser timezone
- **Preview Snippets** - Quick preview of each version
  - Shows first 64 characters of title or content
  - Format: "relative time · preview text"
  - Truncated with ellipsis if longer
  - Whitespace normalized (multiple spaces → single space)
  - Helps identify which version to restore
- **Max History Entries** - Configurable limit (default: 5, range: 3-20)
  - Default: 5 versions (Constants.DEFAULTS.MAX_HISTORY_ENTRIES)
  - Configurable range: 3-20 versions
  - Preference key: 'maxHistoryEntries'
  - Older versions automatically deleted when limit exceeded
  - FIFO (First In, First Out) - oldest versions dropped first
- **Restore Functionality** - One-click restore to previous version
  - Creates 'before-restore' snapshot of current state before restoring
  - Restores: title, label, content, favorite, king, pinned states
  - Updates character counters and save button state
  - Closes dropdown after restore
  - Refreshes history dropdown to show new snapshot
  - Triggers auto-save timer
- **Storage Format** - Stored per note in Chrome Storage
  - Storage key: 'noteHistory'
  - Format: `{ noteId: [{ title, label, content, favorite, king, pinned, snapshotAt, reason }, ...] }`
  - Each snapshot includes full note state (not diffs)
  - Snapshots sorted newest first (index 0 = most recent)

### 🗑️ Trash Management
- **Soft Delete** - Notes moved to trash (not permanently deleted)
  - Delete button in editor (confirmation required)
  - Confirmation dialog: "Move this note to trash?" with danger styling
  - Note moved to separate trash storage (key: 'trashNotes')
  - Original note data preserved completely
  - Adds `deletedAt` timestamp (Unix milliseconds)
  - Removes from main notes storage atomically
- **Trash Retention** - Auto-delete after 30 days
  - Default retention: 30 days (Constants.TRASH.RETENTION_DAYS)
  - Configurable in future versions
  - Automatic cleanup on trash view load
  - Compares `deletedAt` timestamp with current time
  - Permanently deletes notes older than retention period
  - No recovery after retention period expires
- **Restore Notes** - Recover deleted notes from trash
  - Restore button in trash view (per note)
  - Removes `deletedAt` timestamp
  - Moves note back to main notes storage
  - Updates `updatedAt` to current time
  - Preserves all original data: title, content, label, favorite, king, pinned, createdAt
  - Atomic operation (all or nothing)
  - Confirmation dialog before restore
- **Permanent Delete** - Delete forever from trash
  - Delete button in trash view (per note)
  - Confirmation dialog: "Permanently delete this note? This cannot be undone." with danger styling
  - Removes from trash storage completely
  - No recovery possible after permanent deletion
  - Does NOT affect note history (history remains until overwritten)
- **Empty Trash** - Clear all trash at once
  - Button at top of trash view
  - Confirmation dialog: "Empty trash? All X notes will be permanently deleted." with danger styling
  - Shows count of notes to be deleted
  - Deletes all notes in trash storage
  - Atomic operation (all or nothing)
  - No recovery possible after emptying
- **Trash Preview** - See deleted note previews
  - First 96 characters of content (Constants.NOTES.TRASH_PREVIEW_LENGTH)
  - Ellipsis (...) added if content exceeds preview length
  - Shows title, label, preview, and deletion date
  - Deletion date format: "Deleted X days ago" or full date
  - Visual styling: muted colors, strikethrough title (optional)
  - Empty state message if no trashed notes

### 🌐 Web Context Capture
- **Capture Page Info** - Save current page title, URL, and description
  - Button in editor toolbar (context icon)
  - Detects if page context is available (http/https/file protocols only)
  - Button disabled on unsupported pages (chrome://, about:, etc.)
  - Modal preview before inserting
  - Shows: Title, URL, Description fields
  - Grid layout: 78px label column, flexible value column
- **Auto-detection** - Detects Open Graph and Twitter Card metadata
  - **Detection priority**:
    1. Open Graph title (`og:title` meta property)
    2. Twitter Card title (`twitter:title` meta name)
    3. Document title (`document.title`)
    4. URL as fallback
  - **Description detection**:
    1. Standard meta description (`description` meta name)
    2. Open Graph description (`og:description` meta property)
    3. Twitter Card description (`twitter:description` meta name)
    4. Empty string if none found
  - Meta tag selectors: `meta[name="..."]` and `meta[property="..."]`
  - Trims whitespace from all detected values
- **Formatted Reference** - Inserts as markdown reference block
  - Format:
    ```
    ### Web Reference
    
    - Title: [Page Title](URL)
    - URL: https://example.com
    - Description: Page description text
    - Captured: Jan 15, 2024, 14:30
    ```
  - Markdown escaping:
    - Link text: Escapes `\`, `[`, `]` with backslash
    - URL: Escapes `)` as `%29` (URL encoding)
    - Description: Escapes markdown special chars: `` \ ` * _ { } [ ] ( ) # + - . ! | > ``
    - Whitespace normalized (multiple spaces → single space)
  - Inserts at cursor position
  - Adds newlines before/after for proper spacing
  - Switches to Edit tab automatically after insert
- **Timestamp** - Records when context was captured
  - Format: "MMM DD, YYYY, HH:MM" (e.g., "Jan 15, 2024, 14:30")
  - Uses Utils.formatDate() with 'datetime' mode
  - Locale: English (en-US) for month names
  - Timezone: Local browser timezone
  - Included in "Captured:" line of reference block

### 🔗 Note Linking
- **@-mention Autocomplete** - Type `@` to link to other notes
  - Trigger: Type `@` character in editor
  - Must be preceded by whitespace, `(`, `[`, `{`, or start of line
  - Query: Text after `@` until cursor (e.g., `@meet` searches for "meet")
  - Invalid characters in query: `]`, `)`, `[`, `{`, `<`, `>` (closes autocomplete)
  - Autocomplete menu appears below cursor
  - Max results: 8 notes (Constants.SEARCH.MAX_AUTOCOMPLETE_RESULTS)
- **Smart Search** - Fuzzy search for note titles
  - Case-insensitive matching
  - Searches note titles only (not content or labels)
  - Partial match (substring search)
  - Excludes current note from results
  - Sorts results alphabetically by title
  - Shows "untitled note" for notes without titles
- **Keyboard Navigation** - Arrow keys to navigate suggestions
  - **Arrow Down**: Move to next suggestion (wraps to first)
  - **Arrow Up**: Move to previous suggestion (wraps to last)
  - **Enter**: Select highlighted suggestion and insert link
  - **Escape**: Close autocomplete menu
  - **Tab**: Close autocomplete (no selection)
  - Visual highlight: Active suggestion has different background color
    - Light mode: #f3f3f3 (active) vs transparent (inactive)
    - Dark mode: rgba(255, 255, 255, 0.1) (active) vs transparent (inactive)
- **Label Display** - See note labels in autocomplete
  - Label shown below title in suggestion
  - Font size: 10px
  - Color: #9f9f9f (dark mode) or #8a8a8a (light mode)
  - Format: Plain text label name
  - Empty if note has no label
- **Link Insertion** - Inserts markdown link to note
  - Format: `[Note Title](bronotes://note/{noteId})`
  - Replaces `@query` text with link
  - Preserves cursor position after link
  - Closes autocomplete menu after insertion
  - Link is clickable in preview mode (opens note in editor)
  - Custom protocol: `bronotes://note/` (handled by extension)

### 🎯 User Interface
- **Slide-in Drawer** - Drawer slides in from right side
  - Width: 440px (Constants.DRAWER.WIDTH)
  - Height: 100vh (full viewport height)
  - Position: Fixed, right: 0, top: 0
  - Z-index: 2147483647 (Constants.Z_INDEX.DRAWER) - highest possible to appear above all page content
  - Animation: translateX(100%) → translateX(0) over 250ms (Constants.DRAWER.ANIMATION_DURATION)
  - Easing: ease-out
  - Shake animation on open: 400ms duration (Constants.DRAWER.SHAKE_DURATION)
- **Collapsible** - Hide/show drawer with ribbon button
  - Ribbon button: 42px × 40px (Constants.DRAWER.RIBBON_WIDTH × RIBBON_HEIGHT)
  - Position: Fixed, right: 0, top: 88px (Constants.DRAWER.RIBBON_TOP)
  - Icon: slide-in.svg (collapsed) or slide-out.svg (expanded)
  - Collapse state persists across sessions (key: 'drawerCollapsed')
  - Collapsed: translateX(100%) - drawer hidden off-screen
  - Expanded: translateX(0) - drawer visible
  - Click ribbon to toggle
- **5 Views**: Home, All Notes, Editor, Labels, Trash, Settings
  - Navigation tabs at top of drawer
  - Active tab: Border-bottom 2px solid (color matches theme)
  - Inactive tabs: Border-bottom 2px solid transparent
  - Icon opacity: 1 (active) vs 0.45 (inactive)
  - Text color: theme primary (active) vs #9a9a9a (inactive)
  - View switching: display: none (hidden) vs display: flex/block (visible)
  - Current view stored in App.currentView (not persisted)
- **Transparency Mode** - Semi-transparent drawer overlay
  - Toggle button in header (eye icon)
  - **Light mode transparent**: rgba(255, 255, 255, 0.38) - 38% opaque white
  - **Dark mode transparent**: rgba(20, 20, 20, 0.52) - 52% opaque black
  - **Light mode opaque**: #ffffff - solid white
  - **Dark mode opaque**: #181818 - solid dark gray
  - Backdrop-filter: blur(2px) when transparent (not supported in all browsers)
  - Box-shadow removed when transparent
  - State persists across sessions (key: 'drawerTransparent')
  - Icon: eye.svg (opaque) or eye-off.svg (transparent)
- **Dark Mode** - Full dark theme support
  - Toggle button in header (theme icon)
  - **Light theme colors**:
    - Background: #ffffff
    - Text: #2a2a2a
    - Border: #e0e0e0
    - Secondary text: #6a6a6a
    - Tertiary text: #9a9a9a
  - **Dark theme colors**:
    - Background: #181818
    - Text: #f1f1f1
    - Border: #333333
    - Secondary text: #c7c7c7
    - Tertiary text: #9f9f9f
  - Theme stored in preferences (key: 'drawerTheme', values: 'light' or 'dark')
  - Default: 'light' (Constants.DEFAULTS.THEME)
  - Icon: dark.svg (light mode) or light.svg (dark mode)
  - Applies to all views, modals, and UI elements
- **Responsive Design** - Clean, minimal, breathable layout
  - Fixed width: 440px (not responsive to viewport width)
  - Scrollable content areas (overflow-y: auto)
  - Flexible height: Adapts to viewport height
  - Touch-friendly: 44px minimum touch target size for buttons
  - Keyboard accessible: Tab navigation, Enter/Space activation
  - ARIA labels and roles for screen readers
- **Monospace Font** - Notepad-style typography
  - Font family: Consolas, Monaco, 'Courier New', monospace
  - Editor font size: 13px
  - UI font size: 11-13px (varies by element)
  - Line height: 1.7 (editor), 1.4-1.6 (UI)
  - Letter spacing: 0.3-0.5px (headings and buttons)
- **Smooth Animations** - Polished transitions and feedback
  - Drawer slide: 250ms ease-out
  - Drawer shake: 400ms ease-in-out
  - Button press: scale(0.98) on mousedown, scale(1) on mouseup
  - Hover transitions: 150ms ease (background, opacity, transform)
  - Modal fade: backdrop-filter blur(2px)
  - Tab switching: Instant (no animation)
  - Save feedback: Opacity transition 200ms

### 🏠 Home View
- **Welcome Message** - Personalized greeting with nickname
  - Format: "Hello, {nickname}!" (e.g., "Hello, Brow!")
  - Default nickname: "Brow" (Constants.DEFAULTS.NICKNAME)
  - Configurable in Settings view
  - Font size: 18px, font-weight: 700
  - Color: theme primary (#2a2a2a light, #f1f1f1 dark)
- **Summary Stats**: 
  - **Total notes count**: Count of all notes (excludes trash)
    - Format: "X notes" (singular: "1 note")
    - Includes all notes regardless of label or favorite status
  - **Total labels count**: Count of unique labels
    - Format: "X labels" (singular: "1 label")
    - Only counts labels that exist in Labels view (not labels on notes)
  - **Favorite notes count**: Count of favorited notes
    - Format: "X favorites" (singular: "1 favorite")
    - Only counts notes with `favorite: true`
  - **Last note modified date**: Most recent `updatedAt` timestamp
    - Format: "Last note: X days ago" or full date
    - Shows "Never" if no notes exist
    - Uses Utils.formatDate() with 'long' mode
  - **Last backup date**: Last export timestamp
    - Format: "Last backup: X days ago" or full date
    - Shows "Never" if never exported
    - Stored in key: 'lastBackupAt' (Unix timestamp)
    - Updated automatically on export
  - Stats displayed in grid layout (2 columns)
  - Font size: 12px, line-height: 1.6
  - Icon size: 14px × 14px, opacity: 0.55
- **Daily Quote** - Inspirational quotes about note-taking
  - 100+ quotes from famous people (Quotes.items.length = 100+)
  - Random quote selected on each home view load
  - Quote format: "{text}" — {author}
  - Source attribution included (if available)
  - Font size: 13px (quote), 11px (author)
  - Font style: italic (quote), normal (author)
  - Color: #6a6a6a (light mode), #c7c7c7 (dark mode)
  - Quotes about: note-taking, writing, journaling, memory, learning
  - Authors include: Seneca, Marcus Aurelius, Leonardo da Vinci, Virginia Woolf, etc.
- **Quick Actions** - New note button
  - Button text: "New Note" or "+ New Note"
  - Opens editor with empty note (no noteId)
  - Clears any existing editor content
  - Confirms discard if unsaved draft exists
  - Button styling: Primary button (theme colors)
  - Keyboard accessible: Tab to focus, Enter/Space to activate

### ⚙️ Settings & Preferences
- **Nickname** - Customize your display name
  - Max length: 50 characters (no hard limit, but recommended)
  - Default: "Brow" (Constants.DEFAULTS.NICKNAME)
  - Used in: Home view greeting, template variables ({{nickname}})
  - Storage key: 'nickname'
  - Input validation: Trims whitespace
  - Empty nickname reverts to default
- **Preferences** - Configurable behavior settings
  - **Open Notes In** - Default tab when opening a note
    - Options: "Edit Mode" (default) or "Preview Mode"
    - Storage key: 'openNotesIn'
    - Values: 'edit' or 'preview'
    - Default: 'edit' (Constants.DEFAULTS.OPEN_NOTES_IN)
    - Applies to: Clicking notes in All Notes view, opening from search
    - Does NOT apply to: New notes (always open in edit mode)
  - **Auto-save Delay** - Time before auto-saving changes
    - Range: 500-5000ms (0.5-5 seconds)
    - Default: 1000ms (1 second) (Constants.DEFAULTS.AUTO_SAVE_DELAY)
    - Step: 100ms increments
    - Storage key: 'autoSaveDelay'
    - UI: Range slider + number input (synchronized)
    - Validation: Clamped to min/max, rounded to nearest 100ms
    - Applies to: Auto-save timer in editor (debounced)
  - **Max History Entries** - Maximum version history to keep
    - Range: 3-20 versions
    - Default: 5 versions (Constants.DEFAULTS.MAX_HISTORY_ENTRIES)
    - Step: 1 version increments
    - Storage key: 'maxHistoryEntries'
    - UI: Range slider + number input (synchronized)
    - Validation: Clamped to min/max, rounded to integer
    - Applies to: Version history dropdown, auto-snapshot limit
    - Older versions deleted when limit exceeded (FIFO)
  - **Drawer Theme** - Visual theme for the drawer
    - Options: "Light Mode" (default) or "Dark Mode"
    - Storage key: 'drawerTheme'
    - Values: 'light' or 'dark' (Constants.THEMES.LIGHT / DARK)
    - Default: 'light' (Constants.DEFAULTS.THEME)
    - Applies to: All views, modals, buttons, text colors
    - Separate from transparency mode (can be combined)
  - Preferences modal: Grid layout, segmented controls for choices, range sliders for numbers
  - Save button: Saves all preferences atomically
  - Cancel button: Discards changes and closes modal
- **Export Data** - Backup all notes as JSON
  - Exports: notes, trashNotes, noteHistory, nickname, labels, labelColors, preferences
  - Filename format: `bronotes-backup-{YYYY-MM-DD}.json` (e.g., "bronotes-backup-2024-01-15.json")
  - JSON format: Pretty-printed with 2-space indentation
  - Includes metadata: exportedAt timestamp (ISO 8601 format)
  - MIME type: application/json;charset=utf-8
  - Download via blob URL and temporary anchor element
  - Updates lastBackupAt timestamp after export
  - File size: Varies (typically 10KB-1MB depending on note count)
- **Import Data** - Restore notes from JSON backup
  - File input: Accepts .json files only
  - Validation: Checks JSON structure before import
  - Overwrites existing data (confirmation required)
  - Confirmation dialog: "Import data? This will replace all existing notes, labels, and settings."
  - Imports: notes, trashNotes, noteHistory, nickname, labels, labelColors, preferences
  - King note validation: Ensures only one king note (removes extras)
  - Preference validation: Clamps values to valid ranges
  - Error handling: Shows alert if import fails (invalid JSON, missing fields, etc.)
  - Atomic operation: All or nothing (rollback on error)
- **Privacy Panel** - Local-first data storage notice
  - Text: "All data stored locally in your browser. No external servers. No tracking."
  - Link to full privacy policy (PRIVACY.md)
  - Font size: 11px, color: #9a9a9a
  - Icon: lock icon (11px × 11px)
- **Version Display** - Shows current extension version
  - Format: "Version X.Y.Z" (e.g., "Version 3.0.0")
  - Loaded from manifest.json via chrome.runtime.getManifest()
  - Font size: 11px, color: #9a9a9a
  - Non-interactive (display only)
- **Developer Credit** - Link to developer GitHub
  - Text: "Crafted with care by @gafurmog"
  - Link: https://github.com/gafurmog
  - Opens in new tab (target="_blank")
  - Font size: 11px
  - Icon: GitHub logo or profile picture (optional)
  - Horizontal layout with logo circle

### 🔒 Privacy & Data
- **Local-first** - All data stored in browser (Chrome Storage API)
- **No Tracking** - Zero analytics or tracking
- **No Server** - No data sent to external servers
- **Offline-ready** - Works completely offline
- **Export/Import** - Full data portability
- **Open Source** - Auditable code

### 🎨 Customization
- **Label Colors** - 42-color palette for visual organization
  - Color picker modal: 380px max width, 7 columns × 6 rows grid
  - Grid gap: 8px between color swatches
  - Swatch size: 32px × 32px clickable area
  - Color preview: 8px × 8px circle on label dot
  - Modal z-index: 10 (above drawer content)
  - Modal backdrop: rgba(0,0,0,0.58) dark, rgba(255,255,255,0.72) light
  - Reset button: Removes custom color, reverts to default #b8b8b8
  - Storage: Chrome Storage key 'labelColors', format: `{ labelName: hexColor }`
  - Instant preview: Color updates immediately on selection
- **Theme Toggle** - Light/Dark mode with instant switching
  - Toggle button: eye icon (light.svg / dark.svg)
  - Button position: Header, right side (before transparency toggle)
  - Button size: 28px × 28px
  - Icon size: 14px × 14px
  - Opacity: 1 (active theme) vs 0.72 (inactive)
  - Transition: 150ms ease for all color changes
  - Applies to: All views, modals, buttons, text, borders, backgrounds
  - Storage: Chrome Storage key 'drawerTheme', values: 'light' or 'dark'
  - Default: 'light' (Constants.DEFAULTS.THEME)
- **Transparency Toggle** - Semi-transparent overlay mode
  - Toggle button: eye-off icon (eye.svg / eye-off.svg)
  - Button position: Header, right side (after theme toggle)
  - Light mode transparent: rgba(255, 255, 255, 0.38) - 38% opaque
  - Dark mode transparent: rgba(20, 20, 20, 0.52) - 52% opaque
  - Backdrop-filter: blur(2px) when transparent (not supported in all browsers)
  - Box-shadow: Removed when transparent, restored when opaque
  - Storage: Chrome Storage key 'drawerTransparent', boolean
  - Combines with theme: Can have transparent light or transparent dark
- **Configurable Auto-save** - Adjust delay with dual controls
  - Range slider: 500-5000ms, step 100ms
  - Number input: Synchronized with slider, same range/step
  - Slider width: 100% of preference row
  - Number input width: 80px, right-aligned
  - Validation: Clamped to min/max, rounded to nearest 100ms
  - Default: 1000ms (1 second)
  - Storage: Chrome Storage key 'autoSaveDelay'
  - Applies immediately: No restart required
  - Visual feedback: Input border highlights on change
- **Configurable History** - Max versions with dual controls
  - Range slider: 3-20 versions, step 1
  - Number input: Synchronized with slider, same range/step
  - Slider width: 100% of preference row
  - Number input width: 80px, right-aligned
  - Validation: Clamped to min/max, rounded to integer
  - Default: 5 versions
  - Storage: Chrome Storage key 'maxHistoryEntries'
  - FIFO deletion: Oldest versions dropped when limit exceeded
  - Applies to existing notes: Trims history on next save
- **Preferences Modal** - Centralized settings dialog
  - Modal width: 390px max width
  - Modal padding: 16px horizontal, 18px top, 14px bottom
  - Modal z-index: 10 (above drawer content)
  - Segmented controls: 2-button groups for binary choices
  - Button active state: data-active="true" attribute
  - Active button: Solid background (theme primary color)
  - Inactive button: Transparent background, border only
  - Range controls: Slider + number input, synchronized
  - Save button: Saves all preferences atomically (all or nothing)
  - Cancel button: Discards all changes, closes modal
  - Keyboard: Escape to cancel, Enter to save (when focused)

### 🚀 Performance
- **Modular Architecture** - 24 separate modules for maintainability
  - Total lines: ~5,800 across all modules
  - Smallest module: 30 lines (storage/core.js)
  - Largest module: ~1,000 lines (drawer.js HTML template)
  - Average module size: ~240 lines
  - Module load time: <50ms total (all modules)
  - Memory footprint: ~2-5MB (varies with note count)
- **Lazy Loading** - Views loaded on demand (not implemented yet, planned for v3.1)
  - Current: All modules loaded on page load
  - Future: Load view controllers only when accessed
  - Estimated savings: 30-40% initial load time
- **Efficient Storage** - Optimized Chrome Storage usage
  - Storage API: chrome.storage.local (unlimited quota with permission)
  - Storage format: JSON serialization
  - Typical storage size: 10KB-1MB (depends on note count and history)
  - Storage quota: Unlimited (with "storage" permission)
  - Read operations: Cached in memory (no repeated reads)
  - Write operations: Debounced (auto-save delay prevents excessive writes)
  - Batch operations: Multiple notes saved atomically
  - Storage keys: 11 total (notes, trashNotes, noteHistory, nickname, labels, labelColors, drawerTransparent, drawerTheme, drawerCollapsed, openNotesIn, autoSaveDelay, maxHistoryEntries, lastBackupAt, lockedLabelFilter, globalEnabled)
- **Fast Search** - Instant full-text search with optimizations
  - Search algorithm: Case-insensitive substring matching
  - Search fields: title, content, label (all fields searched simultaneously)
  - Search complexity: O(n*m) where n=note count, m=average note length
  - Typical search time: <10ms for 100 notes, <50ms for 1000 notes
  - No indexing: Direct string matching (fast enough for typical use)
  - Debouncing: None (instant results as you type)
  - Result limit: None (all matches shown)
  - Highlight: Not implemented in list view (only in-editor search)
- **Smooth Animations** - 60fps transitions with hardware acceleration
  - Drawer slide: 250ms ease-out, translateX transform (GPU-accelerated)
  - Drawer shake: 400ms ease-in-out, custom keyframe animation
  - Button press: scale(0.98) on mousedown, scale(1) on mouseup, 100ms duration
  - Hover transitions: 150ms ease for background, opacity, transform
  - Modal fade: backdrop-filter blur(2px), 200ms transition
  - Tab switching: Instant (no animation, display: none/flex toggle)
  - Save feedback: Opacity transition 200ms
  - Scroll: Smooth scroll behavior (CSS scroll-behavior: smooth)
  - Animation performance: Uses transform and opacity (GPU-accelerated properties)
  - No layout thrashing: Batch DOM reads/writes, use requestAnimationFrame
- **Memory Management** - Efficient memory usage
  - No memory leaks: Event listeners cleaned up on view switch
  - No global pollution: All code in modules or IIFE
  - Garbage collection: Unused notes/history eligible for GC
  - DOM nodes: Reused where possible (e.g., note list items)
  - Image assets: Loaded via chrome.runtime.getURL (cached by browser)
  - String operations: Minimal string concatenation, use template literals
- **Code Optimization** - Best practices for performance
  - No jQuery: Vanilla JavaScript (no framework overhead)
  - No bundler: Direct script loading (no build step)
  - Minification: Not applied (source code loaded directly)
  - Tree shaking: Not applicable (no bundler)
  - Code splitting: Manual (24 separate modules)
  - Async operations: Promises and async/await (no callbacks)
  - Event delegation: Used where appropriate (e.g., toolbar buttons)
  - Debouncing: Auto-save, search (prevents excessive operations)

---

## 📖 How to Use

### Basic Workflow

```
1. Click extension icon → Drawer slides in
2. HOME → See welcome message and summary
3. Click "New Note" → Open editor
4. Write title, label, and markdown content
5. Auto-saves every 1 second
6. ALL NOTES → See all your notes
7. Click any note → Edit it
8. LABELS → Manage labels (add, rename, delete, color)
9. TRASH → Recover or permanently delete notes
10. SETTINGS → Export/import data, change nickname
```

### Navigation

- **HOME** - Welcome screen with stats and daily quote
- **ALL NOTES** - List of all notes with search/filter
- **EDITOR** - Write and edit notes (Edit/Preview tabs)
- **LABELS** - Manage labels and colors
- **TRASH** - Deleted notes (30-day retention)
- **SETTINGS** - Preferences, export/import, about

### Keyboard Shortcuts

Complete list of keyboard shortcuts across the application:

| Context | Shortcut | Action | Notes |
|---------|----------|--------|-------|
| **Editor** | Ctrl+F (or Cmd+F) | Open in-editor search | Opens search bar below editor |
| | Tab | Insert 4 spaces | Configurable via Constants.EDITOR.TAB_SIZE |
| **In-Editor Search** | Enter | Next match | Wraps to first match at end |
| | Shift+Enter | Previous match | Wraps to last match at start |
| | Escape | Close search | Returns focus to editor |
| | Ctrl+F (or Cmd+F) | Select search input | Re-focuses and selects search term |
| **@-mention Autocomplete** | @ | Trigger autocomplete | Must be preceded by whitespace or start of line |
| | Arrow Down | Next suggestion | Wraps to first suggestion |
| | Arrow Up | Previous suggestion | Wraps to last suggestion |
| | Enter | Select suggestion | Inserts link and closes autocomplete |
| | Escape | Close autocomplete | Returns focus to editor |
| | Tab | Close autocomplete | Returns focus to editor (no selection) |
| **Label Autocomplete** | Arrow Down | Next suggestion | In label input field |
| | Arrow Up | Previous suggestion | In label input field |
| | Enter | Select suggestion | Fills label input |
| | Escape | Close autocomplete | Returns focus to label input |
| **History Dropdown** | Escape | Close dropdown | Returns focus to editor |
| | Click outside | Close dropdown | Automatic close on outside click |
| **Modals** | Escape | Cancel/Close | Closes modal without saving |
| | Enter | Confirm/Save | Confirms action or saves input |
| **General** | Click extension icon | Toggle drawer | Opens/closes drawer |
| | Click ribbon button | Toggle drawer | Opens/closes drawer from page |

**Note:** No global keyboard shortcuts are implemented (e.g., Ctrl+Shift+N for new note). This is planned for v3.1.

### Markdown Support

```markdown
# Heading 1
## Heading 2

**Bold** *Italic* ~~Strikethrough~~

- Bullet list
1. Numbered list
- [ ] Checklist

`inline code`

```
code block
```

[Link](url)
![Image](url)

> Blockquote

| Table | Header |
| --- | --- |
| Cell | Cell |

---
```

### Note Templates

12 built-in templates available:
1. **Meeting Notes** - Agenda, discussion, action items
2. **Daily Journal** - Morning goals, reflections
3. **Todo List** - Priority-based task list
4. **Code Snippet** - Code with usage examples
5. **Bug Report** - Structured bug documentation
6. **Project Planning** - Objectives, milestones, risks
7. **Learning Notes** - Key concepts, examples, practice
8. **Brainstorming** - Ideas with pros/cons
9. **Book/Article Notes** - Summary, takeaways, quotes
10. **Weekly Review** - Goals, progress, reflections
11. **Quick Note** - Minimal quick capture
12. **Research Notes** - Findings, analysis, references

### Web Context Capture

1. Open a webpage you want to reference
2. Open Brow Notes editor
3. Click "Capture Context" button
4. Review page title, URL, description
5. Click "Insert" to add formatted reference

### Version History

1. Open any note in editor
2. Click "version" dropdown button
3. See list of saved versions with timestamps
4. Click any version to restore it
5. Current version auto-saved before restore

### Label Colors

1. Go to LABELS view
2. Click colored square next to label name
3. Choose from 42-color palette
4. Click "Reset" to remove custom color
5. Colors appear as dots in note list

---

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
│   ├── constants.js       # Configuration constants
│   ├── storage.js         # Unified storage interface
│   ├── ui.js              # UI helpers & DOM manipulation
│   ├── drawer.js          # HTML template
│   │
│   ├── helpers/           # Helper functions
│   │   ├── utils.js       # Utilities (ID gen, date format, etc.)
│   │   ├── button-effects.js  # Button press effects
│   │   └── drawer-helpers.js  # Drawer HTML builders
│   │
│   ├── renderers/         # Rendering logic
│   │   ├── markdown-renderer.js  # Markdown to HTML
│   │   └── print-styles.js       # Print CSS
│   │
│   ├── data/              # Static data
│   │   ├── quotes.js      # 100+ inspirational quotes
│   │   └── templates.js   # 12 note templates
│   │
│   ├── storage/           # Storage modules
│   │   ├── core.js        # Chrome Storage wrapper
│   │   ├── notes.js       # Note CRUD operations
│   │   ├── labels.js      # Label management
│   │   └── settings.js    # Settings & preferences
│   │
│   └── views/             # View controllers
│       ├── home.js        # Home view
│       ├── allnotes.js    # All notes list
│       ├── editor.js      # Note editor
│       ├── labels.js      # Label management
│       ├── trash.js       # Trash view
│       └── settings.js    # Settings view
│
└── icons/                  # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    ├── icon128.png
    └── toolbar/           # Markdown toolbar icons
        ├── bold.svg
        ├── italic.svg
        ├── code.svg
        └── ... (15 icons)
```

### MVC Pattern

- **Model** (`storage/*.js`) - Data operations
- **View** (`views/*.js`) - UI rendering
- **Controller** (`app.js`) - Coordination

### Module Responsibilities

| Module | Responsibility | Lines |
|--------|---------------|-------|
| `app.js` | Main controller, event listeners, view switching | ~250 |
| `ui.js` | DOM manipulation, modals, alerts, UI helpers | ~800 |
| `storage.js` | Unified storage interface | ~50 |
| `storage/core.js` | Chrome Storage API wrapper | ~30 |
| `storage/notes.js` | Note CRUD, history, trash | ~200 |
| `storage/labels.js` | Label CRUD, colors | ~100 |
| `storage/settings.js` | Settings, export/import | ~100 |
| `views/home.js` | Home view rendering | ~60 |
| `views/allnotes.js` | Note list, search, filter, sort | ~300 |
| `views/editor.js` | Editor, markdown toolbar, templates | ~900 |
| `views/labels.js` | Label management UI | ~200 |
| `views/trash.js` | Trash management UI | ~150 |
| `views/settings.js` | Settings UI | ~100 |
| `helpers/utils.js` | Utilities (ID, date, markdown, file) | ~80 |
| `helpers/button-effects.js` | Button press effects | ~40 |
| `helpers/drawer-helpers.js` | Drawer HTML builders | ~150 |
| `renderers/markdown-renderer.js` | Markdown to HTML | ~200 |
| `renderers/print-styles.js` | Print CSS | ~100 |
| `data/quotes.js` | 100+ quotes | ~400 |
| `data/templates.js` | 12 templates | ~500 |
| `constants.js` | Configuration constants | ~150 |
| `drawer.js` | HTML template | ~1000 |

**Total:** ~5,800 lines across 24 modules

### Configuration Constants

All configuration values are centralized in `js/constants.js`:

| Category | Constant | Value | Description |
|----------|----------|-------|-------------|
| **DRAWER** | WIDTH | 440 | Drawer width in pixels |
| | RIBBON_TOP | 88 | Ribbon button top position in pixels |
| | RIBBON_WIDTH | 42 | Ribbon button width in pixels |
| | RIBBON_HEIGHT | 40 | Ribbon button height in pixels |
| | ANIMATION_DURATION | 250 | Drawer slide animation duration in ms |
| | SHAKE_DURATION | 400 | Drawer shake animation duration in ms |
| **NOTES** | MAX_TITLE_LENGTH | 120 | Maximum title length in characters |
| | MAX_LABEL_LENGTH | 32 | Maximum label length in characters |
| | MAX_HISTORY_ENTRIES | 5 | Default max version history entries |
| | AUTO_SAVE_DELAY | 1000 | Default auto-save delay in ms |
| | AUTO_SNAPSHOT_INTERVAL | 300000 | Auto-snapshot interval (5 minutes) in ms |
| | PREVIEW_LENGTH | 100 | Note preview length in characters |
| | TRASH_PREVIEW_LENGTH | 96 | Trash preview length in characters |
| **TRASH** | RETENTION_DAYS | 30 | Trash retention period in days |
| **SEARCH** | MAX_AUTOCOMPLETE_RESULTS | 8 | Max @-mention autocomplete results |
| **UI** | MODAL_MAX_WIDTH | 360 | Modal max width in pixels |
| | TEMPLATE_GRID_COLUMNS | 2 | Template picker grid columns |
| | TEMPLATE_GRID_MAX_HEIGHT | 360 | Template picker max height in pixels |
| | LABEL_FILTER_DROPDOWN_MAX_HEIGHT | 188 | Label filter dropdown max height in pixels |
| | HISTORY_MENU_MAX_HEIGHT | 188 | History dropdown max height in pixels |
| | HISTORY_MENU_MIN_WIDTH | 190 | History dropdown min width in pixels |
| **EDITOR** | FONT_SIZE | 13 | Editor font size in pixels |
| | LINE_HEIGHT | 1.7 | Editor line height ratio |
| | TAB_SIZE | 4 | Tab size in spaces |
| | PADDING_HORIZONTAL | 24 | Editor horizontal padding in pixels |
| | PADDING_TOP | 12 | Editor top padding in pixels |
| | PADDING_BOTTOM | 8 | Editor bottom padding in pixels |
| **COLORS** | PRIMARY | #2a2a2a | Primary text color (light mode) |
| | PRIMARY_LIGHT | #6a6a6a | Secondary text color (light mode) |
| | PRIMARY_LIGHTER | #9a9a9a | Tertiary text color (light mode) |
| | BACKGROUND_LIGHT | #ffffff | Background color (light mode) |
| | BACKGROUND_DARK | #181818 | Background color (dark mode) |
| | BORDER_LIGHT | #e8e8e8 | Border color (light mode) |
| | BORDER_DARK | #333333 | Border color (dark mode) |
| | DANGER | #dc3545 | Danger/delete button color |
| | WARNING | #f0ad4e | Warning color |
| | SUCCESS | #5cb85c | Success color |
| | DEFAULT_LABEL_COLOR | #b8b8b8 | Default label color (gray) |
| **ICONS** | SMALL | 11 | Small icon size in pixels |
| | MEDIUM | 14 | Medium icon size in pixels |
| | LARGE | 18 | Large icon size in pixels |
| | XLARGE | 24 | Extra large icon size in pixels |
| **Z_INDEX** | DRAWER | 2147483647 | Drawer z-index (max possible) |
| | RIBBON | 1 | Ribbon button z-index |
| | MODAL | 10 | Modal overlay z-index |
| | AUTOCOMPLETE | 5 | Autocomplete menu z-index |
| | HISTORY_MENU | 60 | History dropdown z-index |
| | HISTORY_WRAP | 50 | History wrapper z-index |
| **DEFAULTS** | NICKNAME | "Brow" | Default user nickname |
| | THEME | "light" | Default theme (light/dark) |
| | OPEN_NOTES_IN | "edit" | Default tab when opening notes |
| | AUTO_SAVE_DELAY | 1000 | Default auto-save delay in ms |
| | MAX_HISTORY_ENTRIES | 5 | Default max history entries |
| **STORAGE_KEYS** | NOTES | "notes" | Chrome Storage key for notes |
| | TRASH_NOTES | "trashNotes" | Chrome Storage key for trash |
| | NOTE_HISTORY | "noteHistory" | Chrome Storage key for history |
| | NICKNAME | "nickname" | Chrome Storage key for nickname |
| | LABELS | "labels" | Chrome Storage key for labels |
| | LABEL_COLORS | "labelColors" | Chrome Storage key for label colors |
| | DRAWER_TRANSPARENT | "drawerTransparent" | Chrome Storage key for transparency |
| | DRAWER_THEME | "drawerTheme" | Chrome Storage key for theme |
| | DRAWER_COLLAPSED | "drawerCollapsed" | Chrome Storage key for collapse state |
| | OPEN_NOTES_IN | "openNotesIn" | Chrome Storage key for default tab |
| | AUTO_SAVE_DELAY | "autoSaveDelay" | Chrome Storage key for auto-save delay |
| | MAX_HISTORY_ENTRIES | "maxHistoryEntries" | Chrome Storage key for max history |
| | LAST_BACKUP_AT | "lastBackupAt" | Chrome Storage key for last backup timestamp |
| | LOCKED_LABEL_FILTER | "lockedLabelFilter" | Chrome Storage key for locked filter |
| | GLOBAL_ENABLED | "globalEnabled" | Chrome Storage key for extension enabled state |
| **LABEL_COLORS** | (42 colors) | See palette | 42-color palette for labels (hex codes) |

**Label Color Palette (42 colors):**
```javascript
[
  '#8fb8ff', '#8fd8b8', '#f2c66d', '#f29c9c', '#c6a5ff', '#77c7d9',
  '#d6a06d', '#a8c26d', '#a3b8f5', '#b0d4ef', '#d4b8f5', '#f5b8cc',
  '#f5c9a8', '#f0e08a', '#a8e0d0', '#b8dca0', '#ddb8d4', '#a8e4f0',
  '#f0ddb0', '#ccb8e8', '#e8a898', '#c8b090', '#9ab888', '#b0be80',
  '#d4906a', '#80b8b8', '#d8c090', '#90a8c8', '#c8c080', '#c8a090',
  '#6dddb8', '#ffb38a', '#f080c0', '#50d0e8', '#f0d040', '#b070f0',
  '#f07070', '#90d840', '#60a8ff', '#f09860', '#40d4b8', '#8888f0'
]
```

### Why Modular?

- ✅ **Easy to maintain** - Small focused files (30-900 lines)
- ✅ **Easy to debug** - Clear module boundaries
- ✅ **Easy to extend** - Add new views/features easily
- ✅ **Easy to test** - Independent modules
- ✅ **Better performance** - Lazy loading possible

**Read more:** [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)

---

## � Storage Schema

All data is stored locally using Chrome Storage API (`chrome.storage.local`). Below are the exact data structures:

### Notes Storage

**Key:** `notes`  
**Format:** Object with note IDs as keys

```json
{
  "note-id-abc123": {
    "title": "My Note Title",
    "label": "work",
    "content": "# Heading\n\nNote content here...",
    "favorite": false,
    "king": false,
    "pinned": false,
    "createdAt": 1704067200000,
    "updatedAt": 1704153600000
  },
  "note-id-def456": {
    "title": "Another Note",
    "label": "",
    "content": "Content...",
    "favorite": true,
    "king": false,
    "pinned": true,
    "createdAt": 1704240000000,
    "updatedAt": 1704326400000
  }
}
```

**Field Specifications:**
- `title` (string): Note title, max 120 characters, optional (empty string if not set)
- `label` (string): Label name, max 32 characters, optional (empty string if not set)
- `content` (string): Markdown content, no length limit, optional (empty string if not set)
- `favorite` (boolean): Bookmark status, default false
- `king` (boolean): King note status, default false, only ONE note can be king
- `pinned` (boolean): Pin status, default false, multiple notes can be pinned
- `createdAt` (number): Unix timestamp in milliseconds, set on creation
- `updatedAt` (number): Unix timestamp in milliseconds, updated on every save

### Trash Storage

**Key:** `trashNotes`  
**Format:** Object with note IDs as keys (same structure as notes + deletedAt)

```json
{
  "note-id-xyz789": {
    "title": "Deleted Note",
    "label": "personal",
    "content": "This note was deleted...",
    "favorite": false,
    "king": false,
    "pinned": false,
    "createdAt": 1704067200000,
    "updatedAt": 1704153600000,
    "deletedAt": 1704412800000
  }
}
```

**Additional Field:**
- `deletedAt` (number): Unix timestamp in milliseconds when note was deleted, used for 30-day retention

### Note History Storage

**Key:** `noteHistory`  
**Format:** Object with note IDs as keys, arrays of snapshots as values

```json
{
  "note-id-abc123": [
    {
      "title": "My Note Title (v3)",
      "label": "work",
      "content": "Latest version...",
      "favorite": false,
      "king": false,
      "pinned": false,
      "snapshotAt": 1704412800000,
      "reason": "manual"
    },
    {
      "title": "My Note Title (v2)",
      "label": "work",
      "content": "Previous version...",
      "favorite": false,
      "king": false,
      "pinned": false,
      "snapshotAt": 1704326400000,
      "reason": "autosave"
    },
    {
      "title": "My Note Title (v1)",
      "label": "work",
      "content": "First version...",
      "favorite": false,
      "king": false,
      "pinned": false,
      "snapshotAt": 1704240000000,
      "reason": "before-restore"
    }
  ]
}
```

**Snapshot Fields:**
- All note fields (title, label, content, favorite, king, pinned)
- `snapshotAt` (number): Unix timestamp in milliseconds when snapshot was created
- `reason` (string): Snapshot reason - "manual", "autosave", "before-empty", "before-restore"

**Snapshot Rules:**
- Array sorted newest first (index 0 = most recent)
- Max entries: Configurable (default 5, range 3-20)
- FIFO deletion: Oldest snapshots dropped when limit exceeded
- Full snapshots: Not diffs, complete note state at each snapshot

### Labels Storage

**Key:** `labels`  
**Format:** Array of label names (strings)

```json
[
  "work",
  "personal",
  "ideas",
  "urgent"
]
```

**Rules:**
- Case-sensitive storage
- Case-insensitive matching when filtering
- No duplicates (enforced on creation)
- Max length: 32 characters per label

### Label Colors Storage

**Key:** `labelColors`  
**Format:** Object with label names as keys, hex colors as values

```json
{
  "work": "#8fb8ff",
  "personal": "#f29c9c",
  "ideas": "#c6a5ff",
  "urgent": "#f0d040"
}
```

**Rules:**
- Only custom colors stored (default gray #b8b8b8 not stored)
- Hex format: 6-character lowercase with # prefix
- Colors from 42-color palette (see Constants.LABEL_COLORS)
- Reset removes entry (reverts to default)

### Settings Storage

**Key:** `nickname`  
**Format:** String

```json
"Brow"
```

**Key:** `drawerTheme`  
**Format:** String ("light" or "dark")

```json
"light"
```

**Key:** `drawerTransparent`  
**Format:** Boolean

```json
false
```

**Key:** `drawerCollapsed`  
**Format:** Boolean

```json
false
```

**Key:** `openNotesIn`  
**Format:** String ("edit" or "preview")

```json
"edit"
```

**Key:** `autoSaveDelay`  
**Format:** Number (milliseconds, range 500-5000)

```json
1000
```

**Key:** `maxHistoryEntries`  
**Format:** Number (range 3-20)

```json
5
```

**Key:** `lastBackupAt`  
**Format:** Number (Unix timestamp in milliseconds)

```json
1704412800000
```

**Key:** `lockedLabelFilter`  
**Format:** Object with locked state and value

```json
{
  "locked": true,
  "value": "work"
}
```

**Key:** `globalEnabled`  
**Format:** Boolean (extension enabled/disabled state)

```json
true
```

### Export Format

When exporting data, all storage keys are combined into a single JSON file:

```json
{
  "notes": { /* notes object */ },
  "trashNotes": { /* trash object */ },
  "noteHistory": { /* history object */ },
  "nickname": "Brow",
  "labels": [ /* labels array */ ],
  "labelColors": { /* colors object */ },
  "drawerTheme": "light",
  "drawerTransparent": false,
  "openNotesIn": "edit",
  "autoSaveDelay": 1000,
  "maxHistoryEntries": 5,
  "lastBackupAt": 1704412800000,
  "lockedLabelFilter": { "locked": false, "value": "" },
  "exportedAt": "2024-01-15T10:30:00.000Z"
}
```

**Export Metadata:**
- `exportedAt` (string): ISO 8601 timestamp when export was created
- Filename format: `bronotes-backup-YYYY-MM-DD.json`
- MIME type: `application/json;charset=utf-8`
- Pretty-printed: 2-space indentation for readability

### Storage Limits

- **Chrome Storage API:** Unlimited quota (with "storage" permission)
- **Typical usage:** 10KB-1MB depending on note count and history
- **No hard limits:** Can store thousands of notes (limited by browser memory)
- **Backup recommended:** Export data regularly to prevent data loss

---

## �🚀 Installation

### From Source

1. **Download Extension**
   ```bash
   git clone https://github.com/gafurmog/bronotes.git
   # or download ZIP and extract
   ```

2. **Install in Chrome**
   ```
   1. Open chrome://extensions/
   2. Enable "Developer mode" (top right)
   3. Click "Load unpacked"
   4. Select the bronotes/ folder
   ```

3. **Start Using**
   ```
   1. Click Brow Notes icon in toolbar
   2. Drawer slides in from right
   3. Start taking notes!
   ```

### Permissions

- **storage** - Store notes locally
- **activeTab** - Inject drawer into current tab
- **scripting** - Run content scripts
- **host_permissions** - Work on all websites

---

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

---

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

See [DEVELOPER.md](docs/development/DEVELOPER.md) for detailed guide.

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
// 4. Load in manifest.json
```

### Module Loading Order

```javascript
// manifest.json - content_scripts order matters!
[
  "js/constants.js",           // 1. Constants first
  "js/helpers/utils.js",        // 2. Utilities
  "js/renderers/*.js",          // 3. Renderers
  "js/helpers/*.js",            // 4. Helpers
  "js/data/*.js",               // 5. Data
  "js/storage/core.js",         // 6. Storage core
  "js/storage/*.js",            // 7. Storage modules
  "js/storage.js",              // 8. Storage interface
  "js/data/templates.js",       // 9. Templates
  "js/helpers/button-effects.js", // 10. Effects
  "js/ui.js",                   // 11. UI helpers
  "js/drawer.js",               // 12. HTML template
  "js/views/*.js",              // 13. View controllers
  "js/app.js"                   // 14. Main app (last!)
]
```

---

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
4. Check Chrome Storage (DevTools → Application → Storage)
5. Check extension context (reload page if invalidated)

**Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| Drawer not appearing | Extension disabled | Enable in chrome://extensions/ |
| Notes not saving | Storage quota exceeded | Export and clear old notes |
| Module not loading | Load order wrong | Check manifest.json order |
| Context invalidated | Extension reloaded | Reload the webpage |
| Search not working | Large note count | Optimize search query |

**Read more:** [docs/architecture/ARCHITECTURE.md#debugging-guide](docs/architecture/ARCHITECTURE.md#debugging-guide)

---

## 🧪 Testing

### Manual Testing Checklist

#### Core Features
- [ ] Drawer opens/closes
- [ ] Navigation works (5 tabs)
- [ ] Create note with title and label
- [ ] Edit existing note
- [ ] Delete note (moves to trash)
- [ ] Auto-save works (1 second delay)
- [ ] Preview mode works

#### Search & Filter
- [ ] Search notes (title, content, label)
- [ ] Filter by label
- [ ] Filter by favorite
- [ ] Lock label filter
- [ ] Reset filters
- [ ] Sort by modified/created

#### Labels
- [ ] Add label
- [ ] Rename label (updates all notes)
- [ ] Delete label (removes from all notes)
- [ ] Change label color
- [ ] Reset label color
- [ ] Label autocomplete works

#### Editor Features
- [ ] Markdown toolbar works (all 15 buttons)
- [ ] In-editor search (Ctrl+F)
- [ ] Note templates (all 12)
- [ ] Export to markdown
- [ ] Print note
- [ ] Web context capture
- [ ] Note linking (@-mention)
- [ ] Version history dropdown
- [ ] Restore previous version

#### Organization
- [ ] Favorite note (bookmark icon)
- [ ] Pin note (pin icon)
- [ ] King note (crown icon)
- [ ] Note preview in list
- [ ] Label colors in list

#### Trash
- [ ] Restore note from trash
- [ ] Delete note forever
- [ ] Empty trash
- [ ] Trash retention (30 days)

#### Settings
- [ ] Change nickname
- [ ] Export data (JSON)
- [ ] Import data (JSON)
- [ ] Version display
- [ ] Developer link

#### UI/UX
- [ ] Dark mode toggle
- [ ] Transparency toggle
- [ ] Drawer collapse/expand
- [ ] Smooth animations
- [ ] Button press effects
- [ ] Modal dialogs
- [ ] Alert messages

### Browser Testing
- [ ] Chrome
- [ ] Edge
- [ ] Brave
- [ ] Opera

---

## 📦 Tech Stack

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, ES6+
- **Chrome Storage API** - Local storage
- **Content Scripts** - Inject drawer
- **Service Worker** - Background tasks
- **MVC Architecture** - Modular design pattern
- **Markdown Rendering** - Custom renderer
- **CSS-in-JS** - Inline styles for isolation

---

## 🔒 Privacy

- ✅ All data stored locally (Chrome Storage API)
- ✅ No external servers
- ✅ No analytics or tracking
- ✅ Does not read webpage content (except for context capture)
- ✅ User controls all data (export/import)
- ✅ Open source, auditable
- ✅ No network requests
- ✅ No third-party dependencies

[Read full privacy policy](PRIVACY.md)

---

## 🐛 Troubleshooting

### Drawer tidak muncul?
- Pastikan extension aktif (badge "ON")
- Refresh halaman setelah mengaktifkan
- Check console for errors
- Beberapa halaman Chrome internal tidak didukung (chrome://, chrome-extension://)

### Catatan tidak tersimpan?
- Check console for storage errors
- Check Chrome Storage (DevTools → Application)
- Pastikan browser storage tidak penuh
- Check auto-save delay setting

### Module tidak load?
- Check console for "All modules loaded successfully"
- Check web_accessible_resources in manifest
- Reload extension
- Check module load order in manifest.json

### Extension context invalidated?
- Reload the webpage
- This happens when extension is reloaded/updated
- Notes are safe, just reload page

### Search lambat?
- Reduce number of notes (archive old ones)
- Use more specific search terms
- Filter by label first

---

## 📝 Roadmap

### v3.1 (Next)
- [ ] Keyboard shortcuts (Ctrl+Shift+N for new note)
- [ ] Configurable preferences (font size, line height, etc.)
- [ ] Note tags (in addition to labels)
- [ ] Advanced markdown (math, diagrams)
- [ ] Note encryption

### v3.2 (Future)
- [ ] Multiple active notes with tabs
- [ ] Note folders/hierarchy
- [ ] Full-text search with highlighting
- [ ] Export to PDF
- [ ] Sync across devices (optional)

### v4.0 (Long-term)
- [ ] Collaborative features
- [ ] Mobile support
- [ ] Integration dengan Notion/Obsidian
- [ ] Plugin system
- [ ] AI-powered features

---

## 🤝 Contributing

Contributions welcome!

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

See [CONTRIBUTING.md](docs/development/CONTRIBUTING.md) for guidelines.

---

## 🎯 Version History

- **v3.0.0** (Current) - Modular architecture refactoring
- **v2.0.0** - Task-based note taking with labels
- **v1.0.0** - MVP release (deprecated)

See [CHANGELOG.md](CHANGELOG.md) for details.

---

## 🌟 What's New in v3.0.0

### Complete Refactoring
- ✅ Modular MVC architecture
- ✅ 24 separate modules (was 1 monolithic file)
- ✅ Better maintainability and debugging
- ✅ Comprehensive documentation
- ✅ **No breaking changes** - all features work the same!

### New Features
- ✅ 12 note templates
- ✅ 100+ inspirational quotes
- ✅ Web context capture
- ✅ Note linking (@-mention)
- ✅ Version history
- ✅ Label colors (42 palette)
- ✅ In-editor search
- ✅ Markdown toolbar
- ✅ Print notes
- ✅ Dark mode
- ✅ Transparency mode
- ✅ King note feature
- ✅ Pin notes
- ✅ Trash with retention

**Benefits:**
- Small focused files (30-900 lines each)
- Clear module boundaries
- Easy to add features
- Easy to debug with module logs
- Easy to test independently

**Read more:** [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)

---

## 💡 Tips

- **For users:** Just click the icon and start typing!
- **For developers:** Start with [docs/development/QUICK_REFERENCE.md](docs/development/QUICK_REFERENCE.md)
- **For debugging:** Check console logs with "Brow Notes:" prefix
- **For contributing:** Read [docs/development/DEVELOPER.md](docs/development/DEVELOPER.md) first
- **Need help?** Check [docs/guides/QUICK_FIX.md](docs/guides/QUICK_FIX.md)

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## 🙏 Credits

**Developed by:** [@gafurmog](https://github.com/gafurmog)

Built with focus on:
- Privacy-first approach
- Local-first data storage
- Minimalist design
- Task-based workflow
- Clean modular architecture
- User experience

---

**Brow Notes** - Your lightweight notepad in the browser 📝

**Version:** 3.0.0 | **Status:** ✅ Stable | **License:** MIT

[Changelog](CHANGELOG.md) | [Privacy](PRIVACY.md) | [Documentation](docs/INDEX.md) | [Developer Guide](docs/development/DEVELOPER.md)
