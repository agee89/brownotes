# Contributing to Brow Notes

Terima kasih atas minat Anda untuk berkontribusi pada Brow Notes! 🎉

## Cara Berkontribusi

### 1. Report Bugs

Jika menemukan bug:

1. Cek apakah bug sudah dilaporkan di Issues
2. Jika belum, buat Issue baru dengan informasi:
   - Deskripsi bug yang jelas
   - Steps to reproduce
   - Expected behavior vs actual behavior
   - Screenshot jika memungkinkan
   - Browser version dan OS
   - Extension version

### 2. Suggest Features

Untuk request fitur baru:

1. Cek roadmap di [prd_mvp_markdown_note_drawer.md](prd_mvp_markdown_note_drawer.md)
2. Cek apakah fitur sudah ada di Issues
3. Buat Issue baru dengan:
   - Deskripsi fitur yang jelas
   - Use case / problem yang diselesaikan
   - Mockup atau contoh jika ada
   - Apakah Anda bersedia implement sendiri?

### 3. Submit Pull Request

#### Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd bronotes

# Install extension ke Chrome
# Ikuti panduan di INSTALLATION.md

# Buat branch baru untuk fitur/fix
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

#### Development Workflow

1. **Buat perubahan** pada code
2. **Test** perubahan:
   - Reload extension di chrome://extensions/
   - Test di berbagai skenario
   - Pastikan tidak ada error di console
3. **Commit** dengan message yang jelas:
   ```bash
   git commit -m "feat: tambah keyboard shortcut untuk toggle drawer"
   # atau
   git commit -m "fix: preview tidak render bold text dengan benar"
   ```
4. **Push** ke repository:
   ```bash
   git push origin feature/nama-fitur
   ```
5. **Buat Pull Request** dengan deskripsi:
   - Apa yang diubah
   - Kenapa perubahan diperlukan
   - Screenshot/video jika ada perubahan UI
   - Testing yang sudah dilakukan

#### Commit Message Convention

Gunakan format:

```
<type>: <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Formatting, missing semicolons, etc (tidak mengubah logic)
- `refactor`: Refactoring code (tidak mengubah behavior)
- `perf`: Performance improvements
- `test`: Menambah atau memperbaiki tests
- `chore`: Maintenance tasks

**Contoh:**
```
feat: add keyboard shortcut Ctrl+Shift+N to toggle drawer

- Add keyboard event listener in content script
- Update settings panel with shortcut info
- Add documentation in README

Closes #123
```

### 4. Code Style

#### JavaScript

- Gunakan ES6+ syntax
- Gunakan `const` dan `let`, hindari `var`
- Gunakan arrow functions untuk callbacks
- Gunakan template literals untuk string interpolation
- Gunakan async/await untuk asynchronous code
- Tambahkan comments untuk logic yang kompleks

**Contoh:**

```javascript
// Good
async function saveNoteData() {
  try {
    const editor = document.getElementById('bronotes-editor');
    const content = editor.value;
    const now = new Date().toISOString();
    
    const data = {
      id: 'main-note',
      content: content,
      updatedAt: now
    };
    
    await chrome.storage.local.set({ noteData: data });
    updateStatus('Saved');
  } catch (error) {
    console.error('Error saving note:', error);
    updateStatus('Error saving');
  }
}

// Bad
function saveNoteData() {
  var editor = document.getElementById('bronotes-editor');
  var content = editor.value;
  chrome.storage.local.set({ noteData: { content: content } }, function() {
    updateStatus('Saved');
  });
}
```

#### CSS

- Gunakan class names yang descriptive
- Prefix semua class dengan `bronotes-` untuk menghindari konflik
- Gunakan CSS variables untuk colors dan spacing yang reusable
- Group related properties
- Tambahkan comments untuk sections

**Contoh:**

```css
/* Good */
.bronotes-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  background: var(--bronotes-bg-color, #ffffff);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}

/* Bad */
.drawer {
  position: fixed;
  background: white;
  width: 380px;
  top: 0;
  right: 0;
  bottom: 0;
}
```

#### HTML

- Gunakan semantic HTML
- Gunakan ID untuk elements yang perlu diakses via JavaScript
- Gunakan class untuk styling
- Tambahkan aria labels untuk accessibility

### 5. Testing Checklist

Sebelum submit PR, pastikan:

- [ ] Extension bisa diinstall tanpa error
- [ ] Toggle ON/OFF bekerja dengan benar
- [ ] Drawer muncul di tab baru
- [ ] Editor bisa menerima input
- [ ] Auto-save bekerja
- [ ] Preview mode render Markdown dengan benar
- [ ] Settings bisa diubah dan tersimpan
- [ ] Export JSON berhasil
- [ ] Import JSON berhasil restore data
- [ ] Clear data bekerja dengan konfirmasi
- [ ] Tidak ada error di console
- [ ] Tidak ada memory leak (test dengan membuka/tutup drawer berkali-kali)
- [ ] Bekerja di berbagai website (test minimal 5 website berbeda)
- [ ] Theme switching bekerja
- [ ] Drawer position switching bekerja

### 6. Documentation

Jika menambah fitur baru:

- Update README.md dengan dokumentasi fitur
- Update CHANGELOG.md dengan entry baru
- Tambahkan comments di code untuk logic yang kompleks
- Update INSTALLATION.md jika ada perubahan setup

### 7. Performance Guidelines

- Hindari DOM manipulation yang berlebihan
- Gunakan debounce untuk event yang sering terjadi (input, scroll, resize)
- Lazy load resources yang tidak immediately needed
- Minimize storage operations
- Test dengan catatan yang panjang (>50KB)

### 8. Security Guidelines

- Sanitize semua user input sebelum render ke HTML
- Jangan gunakan `eval()` atau `innerHTML` dengan user content
- Validate semua data dari storage sebelum digunakan
- Jangan request permission yang tidak diperlukan
- Jangan akses atau modify halaman web tanpa alasan yang jelas

## Questions?

Jika ada pertanyaan:

1. Cek dokumentasi di README.md dan PRD
2. Cek Issues yang sudah ada
3. Buat Issue baru dengan label "question"

## Code of Conduct

- Be respectful dan professional
- Fokus pada improvement, bukan kritik personal
- Welcome newcomers dan bantu mereka contribute
- Diskusi harus konstruktif dan solution-oriented

## License

Dengan contribute, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi yang sama dengan project ini (MIT License).

---

Terima kasih sudah berkontribusi! 🙏
