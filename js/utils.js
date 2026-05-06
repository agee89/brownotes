// Utility functions
const Utils = {
  // Generate unique ID
  generateId() {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Format date
  formatDate(timestamp, format = 'short') {
    const date = new Date(timestamp);
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  // Simple markdown to HTML
  markdownToHtml(markdown) {
    if (!markdown) return '<div style="color: #9a9a9a; font-size: 12px;">nothing to preview</div>';

    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3 style="margin: 16px 0 8px 0; font-size: 14px; font-weight: 600;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="margin: 20px 0 10px 0; font-size: 16px; font-weight: 600;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="margin: 24px 0 12px 0; font-size: 18px; font-weight: 600;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: inherit; font-size: 12px;">$1</code>')
      .replace(/\n\n/g, '</p><p style="margin: 12px 0;">')
      .replace(/\n/g, '<br>');

    return '<p style="margin: 12px 0;">' + html + '</p>';
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
