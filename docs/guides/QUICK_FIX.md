# ⚡ Quick Fix Guide

## Problem: Drawer Tidak Keluar

### Symptoms
- ❌ Extension icon diklik tapi drawer tidak muncul
- ❌ Badge "ON" muncul tapi tidak ada drawer
- ❌ Console error tentang modules

### Solution

**1. Reload Extension**
```
1. Buka chrome://extensions/
2. Find "Brow Notes"
3. Click reload icon (⟳)
```

**2. Refresh Tab**
```
1. Refresh halaman yang sedang dibuka (F5)
2. Atau buka tab baru
```

**3. Click Extension Icon**
```
1. Click icon Brow Notes di toolbar
2. Drawer should slide in from right
```

### If Still Not Working

**Check Console:**
```
1. Press F12
2. Go to Console tab
3. Look for "Brow Notes:" messages
4. Check for errors
```

**Expected Console Output:**
```
Brow Notes: Content script loaded
Brow Notes: Service worker started
```

**If You See Errors:**
- Module loading errors → Extension needs reload
- Permission errors → Check manifest.json
- Script errors → Check specific module file

### Common Issues

#### Issue 1: "Cannot read property of undefined"
**Cause:** Modules not loaded in order
**Fix:** Reload extension

#### Issue 2: "chrome.runtime.getURL is not a function"
**Cause:** Script running in wrong context
**Fix:** Check manifest.json content_scripts

#### Issue 3: Drawer appears but no content
**Cause:** HTML not injected
**Fix:** Check js/drawer.js exists

#### Issue 4: Styles not working
**Cause:** Inline styles in drawer.js
**Fix:** Check DrawerHTML variable

### Verification Checklist

After fix, verify:
- [ ] Extension icon shows "ON" badge when clicked
- [ ] Drawer slides in from right
- [ ] Home view shows welcome message
- [ ] Navigation works (4 tabs)
- [ ] Can create new note
- [ ] Can save note
- [ ] No console errors

### Still Having Issues?

1. **Check Files Exist:**
   ```
   js/utils.js
   js/storage.js
   js/ui.js
   js/drawer.js
   js/views/home.js
   js/views/allnotes.js
   js/views/editor.js
   js/views/labels.js
   js/views/settings.js
   js/app.js
   ```

2. **Check manifest.json:**
   ```json
   "content_scripts": [{
     "js": [
       "js/utils.js",
       "js/storage.js",
       "js/ui.js",
       "js/drawer.js",
       "js/views/home.js",
       "js/views/allnotes.js",
       "js/views/editor.js",
       "js/views/labels.js",
       "js/views/settings.js",
       "js/app.js"
     ]
   }]
   ```

3. **Check Permissions:**
   ```json
   "permissions": [
     "storage",
     "activeTab",
     "scripting"
   ]
   ```

4. **Read Full Bug Report:**
   - See [BUGFIX_MODULE_LOADING.md](BUGFIX_MODULE_LOADING.md)

### Contact

If problem persists:
- Check console for specific errors
- Read BUGFIX_MODULE_LOADING.md
- Open issue on GitHub with console output

---

**Quick Fix:** Reload extension → Refresh tab → Click icon ✅
