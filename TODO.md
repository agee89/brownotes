# TODO List - Brow Notes

## MVP (v1.0.0) - Current

### Must Have (Blocking Release)
- [x] Manifest.json dengan permissions yang tepat
- [x] Background service worker untuk global state
- [x] Content script untuk inject drawer
- [x] Drawer UI dengan slide-in animation
- [x] Markdown editor
- [x] Preview mode dengan Markdown renderer
- [x] Auto-save dengan debounce
- [x] Export JSON backup
- [x] Import JSON backup dengan validasi
- [x] Settings panel (drawer position, theme, default mode)
- [x] Clear all data dengan konfirmasi
- [x] Privacy statement
- [x] **Icons (16, 32, 48, 128) - REQUIRED!**
- [x] Testing di berbagai website
- [x] Testing di berbagai skenario (refresh, new tab, dll)

### Nice to Have (Can be added later)
- [ ] Onboarding screen untuk first-time users
- [ ] Better error handling dan user feedback
- [ ] Loading states untuk async operations
- [ ] Keyboard navigation support
- [ ] Better Markdown renderer (support more syntax)

### Known Issues to Fix
- [ ] Markdown renderer masih sederhana (tidak support tables, footnotes, dll)
- [ ] Tidak ada keyboard shortcut
- [ ] Drawer width fixed, tidak bisa resize
- [ ] Preview mode tidak support interactive checklist
- [ ] Tidak ada search dalam catatan

---

## v1.1 - Planned

### Features
- [ ] Keyboard shortcut untuk toggle drawer (Ctrl+Shift+N atau custom)
- [ ] Resize drawer width (drag handle)
- [ ] Multiple notes dengan tabs
- [ ] Search dalam catatan (Ctrl+F di drawer)
- [ ] Export ke Markdown file (.md)
- [ ] Improved Markdown renderer
  - [ ] Tables support
  - [ ] Strikethrough
  - [ ] Task lists dengan checkbox
  - [ ] Syntax highlighting untuk code blocks
- [ ] Undo/Redo support
- [ ] Word count dan character count
- [ ] Auto-backup ke file lokal (optional)

### Improvements
- [ ] Better onboarding experience
- [ ] Keyboard shortcuts documentation
- [ ] Performance optimization untuk catatan panjang
- [ ] Better error messages
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

### Bug Fixes
- [ ] Fix Markdown renderer edge cases
- [ ] Fix drawer z-index conflicts dengan beberapa website
- [ ] Fix auto-save race conditions

---

## v1.2 - Future

### Features
- [ ] Session notes (catatan per sesi browsing)
- [ ] Tags untuk organisasi catatan
- [ ] Domain blocklist (disable drawer di domain tertentu)
- [ ] Pin/collapse drawer (minimize ke sidebar)
- [ ] Font size setting
- [ ] Custom CSS untuk preview
- [ ] Templates untuk catatan
- [ ] Quick notes (popup kecil untuk catatan cepat)

### Improvements
- [ ] Better theme customization
- [ ] Custom keyboard shortcuts
- [ ] Import dari Markdown files
- [ ] Batch export (multiple notes)
- [ ] Better backup management (auto-backup schedule)

---

## v2.0 - Long Term

### Major Features
- [ ] Optional cloud sync (dengan encryption)
- [ ] Multi-device support
- [ ] Encrypted backup
- [ ] Integration dengan external tools:
  - [ ] Notion
  - [ ] Obsidian
  - [ ] Google Drive
  - [ ] Dropbox
- [ ] Collaborative features (share notes)
- [ ] Advanced Markdown support:
  - [ ] Math equations (KaTeX)
  - [ ] Diagrams (Mermaid)
  - [ ] Embeds (YouTube, Twitter, dll)
- [ ] AI features (optional):
  - [ ] Summarize notes
  - [ ] Grammar check
  - [ ] Auto-tagging

### Architecture
- [ ] Refactor ke TypeScript
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Better state management
- [ ] Plugin system untuk extensibility

---

## Technical Debt

### Code Quality
- [ ] Add JSDoc comments untuk semua functions
- [ ] Refactor content.js (terlalu panjang, perlu split)
- [ ] Extract Markdown renderer ke separate module
- [ ] Add error boundaries
- [ ] Improve code organization (separate concerns)

### Performance
- [ ] Lazy load drawer UI (hanya inject saat diperlukan)
- [ ] Virtual scrolling untuk catatan panjang
- [ ] Optimize auto-save (better debounce strategy)
- [ ] Reduce memory footprint
- [ ] Profile dan optimize rendering

### Testing
- [ ] Setup testing framework
- [ ] Unit tests untuk core functions
- [ ] Integration tests untuk storage operations
- [ ] E2E tests untuk user flows
- [ ] Performance tests
- [ ] Cross-browser testing (Edge, Brave, dll)

### Documentation
- [ ] Add JSDoc untuk semua functions
- [ ] API documentation untuk developers
- [ ] Architecture documentation
- [ ] Contributing guide improvements
- [ ] Video tutorial untuk users

---

## Bugs & Issues

### High Priority
- [ ] (None currently)

### Medium Priority
- [ ] Markdown renderer tidak handle nested lists dengan baik
- [ ] Preview mode tidak preserve scroll position saat switch dari Edit
- [ ] Auto-save indicator kadang stuck di "Saving..."

### Low Priority
- [ ] Icon tidak terlihat jelas di dark mode toolbar
- [ ] Settings panel tidak bisa di-scroll dengan keyboard
- [ ] Export filename bisa lebih descriptive

---

## Community Requests

(Akan diisi berdasarkan feedback dari users)

---

## Notes

### Decision Log
- **2024-01-XX:** Memutuskan untuk tidak include cloud sync di MVP untuk fokus pada privacy-first approach
- **2024-01-XX:** Memutuskan untuk menggunakan simple Markdown renderer di MVP, akan improve di v1.1
- **2024-01-XX:** Memutuskan untuk single note di MVP, multiple notes di v1.1

### Ideas to Explore
- [ ] Browser extension untuk Firefox
- [ ] Mobile app (React Native?)
- [ ] Desktop app (Electron?)
- [ ] Web version (untuk non-Chrome users)
- [ ] API untuk third-party integrations

---

**Last Updated:** 2024-01-XX
