# Testing Guide - Brow Notes v3.0.0

Quick guide to test all functionality after bug fixes.

---

## 🚀 Quick Test (5 minutes)

### 1. Extension Loads ✅
1. Open Chrome
2. Click Brow Notes extension icon
3. **Expected**: Drawer slides in from right
4. **If fails**: Check [Module Loading Fix](../bugfixes/BUGFIX_MODULE_LOADING.md)

### 2. Create Note ✅
1. Click "new note" button on HOME tab
2. Type title: "Test Note"
3. Type content: "This is a test"
4. **Expected**: Auto-saves after 1 second, "saved!" appears
5. **If fails**: Check console for errors

### 3. View All Notes ✅
1. Click "ALL NOTES" tab
2. **Expected**: See "Test Note" in list
3. Click on "Test Note"
4. **Expected**: Editor opens with note content
5. **If fails**: Check [Note Click Fix](../bugfixes/BUGFIX_NOTE_CLICK.md)

### 4. No Overflow ✅
1. Click "SETTINGS" tab
2. **Expected**: No horizontal scroll
3. All inputs fit within drawer
4. **If fails**: Check [Overflow Fix](../bugfixes/OVERFLOW_FIX.md)

---

## 🔍 Complete Test (15 minutes)

### HOME Tab
- [ ] "new note" button works
- [ ] Button scales to 0.98 on click
- [ ] Recent notes list shows correctly
- [ ] Can click recent notes to open

### ALL NOTES Tab
- [ ] All notes appear in list
- [ ] Search box filters notes
- [ ] Label filter dropdown works
- [ ] Sort dropdown works (updated/created, asc/desc)
- [ ] Can click any note to open editor
- [ ] FAB "+" button creates new note
- [ ] Note items scale on click

### EDITOR View
- [ ] Opens when clicking note
- [ ] Title, label, content load correctly
- [ ] Can edit all fields
- [ ] Auto-saves after 1 second
- [ ] "save" button shows "saved!" feedback
- [ ] "back" button returns to ALL NOTES
- [ ] "delete" button deletes note (with confirmation)
- [ ] Edit/Preview tabs work
- [ ] Preview renders markdown correctly
- [ ] All buttons scale on click

### LABELS Tab
- [ ] All labels appear in list
- [ ] Can add new label
- [ ] Can delete label (with confirmation)
- [ ] Note count shows correctly
- [ ] No horizontal overflow
- [ ] All buttons scale on click

### SETTINGS Tab
- [ ] Nickname field displays correctly
- [ ] No horizontal overflow on input
- [ ] Export button downloads JSON
- [ ] Import button accepts JSON file
- [ ] All buttons scale on click

---

## 🎨 UI/UX Test

### Visual Feedback
- [ ] All buttons have hover effect
- [ ] All clickable items scale to 0.98 on mousedown
- [ ] Scale resets on mouseup/mouseleave
- [ ] Transitions are smooth (0.1s ease)

### Navigation
- [ ] All 4 tabs work (HOME | ALL NOTES | LABELS | SETTINGS)
- [ ] Active tab is highlighted (dark text, bottom border)
- [ ] Inactive tabs are gray
- [ ] Close button (×) hides drawer

### Layout
- [ ] Drawer is 440px wide
- [ ] Pure white background (#ffffff)
- [ ] Monospace font throughout
- [ ] No horizontal scroll in any view
- [ ] All content fits within drawer

---

## 🐛 Bug Verification

### Module Loading Bug (Fixed)
**Test**: Open extension
- ✅ Drawer appears
- ✅ All modules load
- ✅ No console errors about module loading

### Overflow Bug (Fixed)
**Test**: Go to Settings
- ✅ Input fields fit within drawer
- ✅ No horizontal scroll
- ✅ All elements have box-sizing: border-box

### Note Click Bug (Fixed)
**Test**: Click note in All Notes
- ✅ Editor opens
- ✅ Note content loads
- ✅ Can edit and save
- ✅ No console errors

---

## 🔧 Developer Test

### Console Check
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Reload page
4. **Expected**: "Brow Notes: Content script loaded"
5. **No errors** should appear

### Module Loading
1. In Console, type: `window.openNoteById`
2. **Expected**: `ƒ (noteId) => EditorView.open(noteId)`
3. Type: `EditorView`
4. **Expected**: Object with open, save, delete methods

### Storage Check
1. In Console, type: `chrome.storage.local.get(null, console.log)`
2. **Expected**: Object with notes, labels, settings

---

## 📊 Performance Test

### Load Time
- [ ] Drawer appears within 500ms
- [ ] View switching is instant
- [ ] No lag when typing in editor

### Auto-save
- [ ] Saves after 1 second of inactivity
- [ ] No lag during auto-save
- [ ] "saved!" feedback appears briefly

### Large Data
1. Create 50+ notes
2. **Expected**: All Notes view still smooth
3. Search/filter still fast
4. No performance issues

---

## ❌ Common Issues

### Drawer doesn't appear
- **Check**: Extension is enabled (icon should be colored)
- **Check**: Console for errors
- **Fix**: Reload extension in chrome://extensions

### Note click doesn't work
- **Check**: Console for errors
- **Check**: `window.openNoteById` exists
- **Fix**: Reload page

### Horizontal scroll appears
- **Check**: Which view has overflow
- **Check**: Element styles in DevTools
- **Fix**: Add box-sizing: border-box

### Auto-save not working
- **Check**: Console for errors
- **Check**: Storage permissions
- **Fix**: Check chrome.storage.local permissions

---

## ✅ Test Completion Checklist

- [ ] Extension loads correctly
- [ ] All 4 tabs work
- [ ] Can create notes
- [ ] Can edit notes
- [ ] Can delete notes
- [ ] Can click notes in list
- [ ] Search/filter/sort work
- [ ] Labels work
- [ ] Settings work
- [ ] Export/import work
- [ ] No horizontal overflow
- [ ] All buttons have scale effect
- [ ] No console errors
- [ ] Performance is good

---

## 🎯 Test Results

**Date**: ___________  
**Tester**: ___________  
**Version**: v3.0.0

**Overall Status**: ⬜ Pass | ⬜ Fail

**Notes**:
```
(Add any issues or observations here)
```

---

**Happy Testing! 🧪**

For bug reports, see [Bug Fix Summary](../bugfixes/BUGFIX_SUMMARY.md)
