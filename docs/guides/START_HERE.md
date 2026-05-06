# 👋 Start Here!

Welcome to Bro Notes! This guide will help you get started quickly.

## 🎯 What is Bro Notes?

Bro Notes adalah Chrome extension untuk note-taking yang:
- ✅ Minimalist dan lightweight
- ✅ Privacy-first (semua data lokal)
- ✅ Task-based workflow
- ✅ Markdown support
- ✅ Auto-save

## 🚀 Quick Start

### For Users

**1. Install Extension**
```
1. Download/clone repository
2. Buka chrome://extensions/
3. Enable "Developer mode"
4. Klik "Load unpacked"
5. Pilih folder bronotes/
```

**2. Start Using**
```
1. Klik icon Bro Notes di toolbar
2. Drawer akan muncul dari kanan
3. Mulai mencatat!
```

**3. Learn More**
- Read [README.md](README.md) for features
- Read [QUICKSTART.md](QUICKSTART.md) for usage guide

---

### For Developers

**1. Understand the Structure**

Bro Notes v3.0.0 menggunakan **modular MVC architecture**:

```
js/
├── app.js          # Main controller
├── storage.js      # Data layer (Model)
├── ui.js           # UI helpers
├── utils.js        # Utilities
├── drawer.js       # HTML template
└── views/          # View controllers
    ├── home.js
    ├── allnotes.js
    ├── editor.js
    ├── labels.js
    └── settings.js
```

**2. Read Documentation**

Start with these in order:

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ← Start here!
   - Quick overview of structure
   - Where to find code
   - Common tasks

2. **[ARCHITECTURE.md](ARCHITECTURE.md)**
   - Complete architecture guide
   - Module descriptions
   - Data flow diagrams
   - Debugging guide

3. **[DEVELOPER.md](DEVELOPER.md)**
   - How to add features
   - Code examples
   - Testing guide
   - Best practices

4. **[REFACTORING.md](REFACTORING.md)**
   - Why we refactored
   - Before/after comparison
   - Benefits

**3. Start Coding**

```bash
# 1. Setup
git clone <repo>
cd bronotes

# 2. Load in Chrome
chrome://extensions/ → Load unpacked

# 3. Make changes
# Edit files in js/

# 4. Test
# Reload extension
# Check console for errors

# 5. Debug
# Check "Bro Notes: [Module]" logs in console
```

**4. Common Tasks**

See [DEVELOPER.md](DEVELOPER.md) for detailed examples:
- Add new view
- Add storage method
- Add utility function
- Add UI helper

---

## 📚 Documentation Map

### 🎯 Quick Reference
- **[START_HERE.md](START_HERE.md)** ← You are here
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick lookup

### 📖 User Docs
- **[README.md](README.md)** - Overview and features
- **[QUICKSTART.md](QUICKSTART.md)** - Usage guide
- **[INSTALLATION.md](INSTALLATION.md)** - Installation guide
- **[PRIVACY.md](PRIVACY.md)** - Privacy policy

### 🔧 Developer Docs
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture guide
- **[DEVELOPER.md](DEVELOPER.md)** - Development guide
- **[js/README.md](js/README.md)** - Module documentation

### 📝 Project Docs
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[REFACTORING.md](REFACTORING.md)** - Refactoring summary
- **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)** - v3.0.0 details
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guide
- **[TODO.md](TODO.md)** - Future plans

## 🎓 Learning Path

### Beginner Developer
```
1. Read START_HERE.md (this file)
2. Read QUICK_REFERENCE.md
3. Look at small files (utils.js, ui.js)
4. Read view controllers (views/*.js)
5. Understand app.js
6. Start making changes!
```

### Experienced Developer
```
1. Read QUICK_REFERENCE.md
2. Read ARCHITECTURE.md
3. Check DEVELOPER.md for patterns
4. Start coding!
```

### Just Want to Use It
```
1. Install extension (see above)
2. Click icon
3. Start typing!
```

## 🔍 Finding What You Need

| I want to... | Read this... |
|--------------|--------------|
| Understand architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Add a feature | [DEVELOPER.md](DEVELOPER.md) |
| Fix a bug | Check console, find module, open file |
| Understand refactoring | [REFACTORING.md](REFACTORING.md) |
| Quick lookup | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| Use the extension | [README.md](README.md) |
| Install | [INSTALLATION.md](INSTALLATION.md) |
| Contribute | [CONTRIBUTING.md](CONTRIBUTING.md) |

## 🐛 Debugging

### Quick Debug Steps
1. Open DevTools (F12)
2. Check Console tab
3. Look for "Bro Notes: [Module]" logs
4. Find module name in error
5. Open that module file
6. Fix the issue

### Common Issues

**Drawer not appearing:**
- Check if extension enabled
- Check console for errors
- Verify modules loaded

**Data not saving:**
- Check Storage API logs
- Check Chrome Storage in DevTools
- Verify permissions

**Module not loading:**
- Check "All modules loaded successfully" in console
- Check web_accessible_resources in manifest
- Reload extension

## 💡 Pro Tips

### For Users
- Use labels to organize notes
- Export regularly for backup
- Use markdown for formatting
- Search to find old notes

### For Developers
- Check console logs first
- Module names in logs help debugging
- Small files = easy to understand
- Test after each change
- Read QUICK_REFERENCE.md for quick answers

## 🎯 What's Special About v3.0.0?

### Before (v2.0.0)
- 1 monolithic file (1000+ lines)
- Hard to maintain
- Hard to debug
- Hard to extend

### After (v3.0.0)
- 13 modular files (50-150 lines each)
- Easy to maintain
- Easy to debug (module logs)
- Easy to extend (add new views)

**Same features, better code!**

Read more: [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)

## 🚀 Next Steps

### Users
1. ✅ Install extension
2. ✅ Start using
3. ✅ Read [README.md](README.md) for features
4. ✅ Export backup regularly

### Developers
1. ✅ Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. ✅ Read [ARCHITECTURE.md](ARCHITECTURE.md)
3. ✅ Read [DEVELOPER.md](DEVELOPER.md)
4. ✅ Start coding!

## 📞 Need Help?

- **Questions:** Check documentation first
- **Bugs:** Open issue on GitHub
- **Features:** Read DEVELOPER.md
- **Architecture:** Read ARCHITECTURE.md

## 🎉 Welcome!

You're all set! Choose your path:

- **User?** → Install and start using
- **Developer?** → Read QUICK_REFERENCE.md
- **Contributor?** → Read CONTRIBUTING.md

---

**Happy noting! 📝**

Version 3.0.0 | [README](README.md) | [Docs](QUICK_REFERENCE.md)
