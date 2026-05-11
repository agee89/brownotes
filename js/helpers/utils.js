// Utility functions
const Utils = {
  // Generate unique ID
  generateId() {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Create filesystem-safe names for exported files
  slugifyFilename(value, fallback = 'untitled-note') {
    const slug = String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    return slug || fallback;
  },

  // Stable short id for filenames, derived from the stored note id when possible
  shortExportId(noteId) {
    const source = noteId || this.generateId();
    const parts = String(source).split('_').filter(Boolean);
    return (parts[parts.length - 1] || source)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .slice(0, 10) || Date.now().toString(36);
  },

  assetUrl(path) {
    try {
      if (typeof chrome === 'undefined' || !chrome.runtime?.id) return '';
      return chrome.runtime.getURL(path);
    } catch (error) {
      console.warn('Brow Notes: Extension context invalidated. Reload this page to reconnect the extension.', error);
      return '';
    }
  },

  // Format date
  formatDate(timestamp, format = 'short') {
    const date = new Date(timestamp);
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
    if (format === 'datetime') {
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  // Markdown to HTML preview renderer - delegates to MarkdownRenderer
  markdownToHtml(markdown) {
    return MarkdownRenderer.render(markdown);
  },

  // Escape HTML
  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Download file
  downloadFile(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Read file
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};
