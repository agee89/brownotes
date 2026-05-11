# Git Workflow - Brow Notes

Panduan penggunaan Git untuk development Brow Notes.

---

## 📋 Branch Structure

### Main Branches

**`master`** (Production)
- Branch utama untuk production-ready code
- Hanya menerima merge dari `develop` atau hotfix branches
- Setiap commit di master harus di-tag dengan version number
- **NEVER commit directly to master**

**`develop`** (Development)
- Branch untuk development aktif
- Tempat integrasi semua feature branches
- Harus selalu dalam keadaan stable (bisa di-build dan di-test)
- Merge ke `master` saat siap release

### Supporting Branches

**`feature/*`** (Feature Development)
- Format: `feature/nama-fitur`
- Dibuat dari: `develop`
- Merge ke: `develop`
- Contoh: `feature/dark-mode`, `feature/cloud-sync`

**`bugfix/*`** (Bug Fixes)
- Format: `bugfix/nama-bug`
- Dibuat dari: `develop`
- Merge ke: `develop`
- Contoh: `bugfix/note-click`, `bugfix/overflow`

**`hotfix/*`** (Production Hotfixes)
- Format: `hotfix/nama-bug`
- Dibuat dari: `master`
- Merge ke: `master` DAN `develop`
- Untuk bug critical di production
- Contoh: `hotfix/security-xss`, `hotfix/data-loss`

**`release/*`** (Release Preparation)
- Format: `release/v3.1.0`
- Dibuat dari: `develop`
- Merge ke: `master` DAN `develop`
- Untuk persiapan release (version bump, changelog, testing)

---

## 🔄 Workflow Examples

### 1. Develop New Feature

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/dark-mode

# Work on feature (commit often)
git add .
git commit -m "Add dark mode toggle in settings"
git commit -m "Implement dark mode styles"
git commit -m "Add dark mode persistence"

# When feature is complete
git checkout develop
git merge feature/dark-mode

# Delete feature branch
git branch -d feature/dark-mode
```

### 2. Fix Bug

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create bugfix branch
git checkout -b bugfix/note-click

# Fix the bug
git add js/views/editor.js js/app.js
git commit -m "Fix note click in All Notes view

- Changed EditorView.open() to use App.switchView()
- Added editor case handler in App.switchView()
- Added error handling and logging"

# Merge back to develop
git checkout develop
git merge bugfix/note-click

# Delete bugfix branch
git branch -d bugfix/note-click
```

### 3. Hotfix Production Bug

```bash
# Start from master
git checkout master
git pull origin master

# Create hotfix branch
git checkout -b hotfix/security-xss

# Fix the bug
git add js/utils.js
git commit -m "Fix XSS vulnerability in markdown renderer"

# Merge to master
git checkout master
git merge hotfix/security-xss
git tag -a v3.0.1 -m "Hotfix: Security XSS vulnerability"

# Merge to develop
git checkout develop
git merge hotfix/security-xss

# Delete hotfix branch
git branch -d hotfix/security-xss
```

### 4. Prepare Release

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v3.1.0

# Update version numbers
# Edit manifest.json, CHANGELOG.md, etc.
git add manifest.json CHANGELOG.md
git commit -m "Bump version to 3.1.0"

# Final testing and bug fixes
git commit -m "Fix typo in documentation"

# Merge to master
git checkout master
git merge release/v3.1.0
git tag -a v3.1.0 -m "Release v3.1.0: Dark Mode Support"

# Merge back to develop
git checkout develop
git merge release/v3.1.0

# Delete release branch
git branch -d release/v3.1.0
```

---

## 📝 Commit Message Guidelines

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (build, dependencies)

### Examples

**Good commits:**
```bash
git commit -m "feat: Add dark mode support

- Add dark mode toggle in settings
- Implement dark mode styles for all views
- Persist dark mode preference in storage"

git commit -m "fix: Note items not clickable in All Notes view

Changed EditorView.open() to use App.switchView() instead of
UI.switchView() to properly update application state."

git commit -m "docs: Update architecture documentation

Added section about view switching and state management."

git commit -m "refactor: Extract markdown rendering to utils

Moved markdown rendering logic from EditorView to Utils module
for better reusability."
```

**Bad commits:**
```bash
git commit -m "fix stuff"
git commit -m "update"
git commit -m "asdfasdf"
git commit -m "WIP"
```

---

## 🏷️ Tagging Releases

### Semantic Versioning

Format: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (v2.0.0 → v3.0.0)
- **MINOR**: New features, backward compatible (v3.0.0 → v3.1.0)
- **PATCH**: Bug fixes, backward compatible (v3.0.0 → v3.0.1)

### Creating Tags

```bash
# Lightweight tag
git tag v3.0.0

# Annotated tag (recommended)
git tag -a v3.0.0 -m "Release v3.0.0: Modular Architecture"

# Tag specific commit
git tag -a v3.0.1 abc1234 -m "Hotfix v3.0.1"

# List tags
git tag

# Show tag details
git show v3.0.0

# Delete tag
git tag -d v3.0.0

# Push tags to remote
git push origin v3.0.0
git push origin --tags  # Push all tags
```

---

## 🔍 Useful Git Commands

### Status & History

```bash
# Check status
git status

# View commit history
git log --oneline
git log --graph --oneline --all

# View changes
git diff
git diff --staged

# View file history
git log --follow -- js/app.js
```

### Branching

```bash
# List branches
git branch
git branch -a  # Include remote branches

# Create branch
git branch feature/new-feature

# Switch branch
git checkout develop
git checkout -b feature/new-feature  # Create and switch

# Delete branch
git branch -d feature/old-feature
git branch -D feature/old-feature  # Force delete
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- js/app.js

# Unstage file
git reset HEAD js/app.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert abc1234
```

### Stashing

```bash
# Save work in progress
git stash
git stash save "WIP: dark mode feature"

# List stashes
git stash list

# Apply stash
git stash apply
git stash apply stash@{0}

# Apply and remove stash
git stash pop

# Delete stash
git stash drop stash@{0}
```

---

## 🚀 Current Repository State

### Branches
- ✅ `master` - Production branch (v3.0.0)
- ✅ `develop` - Development branch

### Latest Commit
```
b7a1fb8 Initial commit: Brow Notes v3.0.0 - Modular Architecture
```

### Files Tracked
- 48 files
- 6,662 lines of code
- Complete v3.0.0 implementation

---

## 📚 Best Practices

### DO ✅
- Commit often with clear messages
- Use feature branches for new work
- Keep commits focused (one logical change per commit)
- Write descriptive commit messages
- Test before committing
- Pull before pushing
- Use `.gitignore` for generated files

### DON'T ❌
- Commit directly to master
- Commit broken code
- Use vague commit messages ("fix", "update")
- Commit large binary files
- Commit sensitive data (passwords, API keys)
- Force push to shared branches
- Commit commented-out code

---

## 🔐 Security

### Never Commit
- API keys
- Passwords
- Private keys (.pem files)
- Database credentials
- User data
- `.env` files with secrets

### If Accidentally Committed
```bash
# Remove from history (use with caution!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret.key" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner (easier)
bfg --delete-files secret.key
```

---

## 📖 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Happy Coding! 🎉**

Version: 1.0.0 | Last Updated: 2026-05-06
