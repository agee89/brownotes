// All Notes view controller
const AllNotesView = {
  async render() {
    const notes = await Storage.getNotes();
    let notesArray = Object.entries(notes).map(([id, note]) => ({ id, ...note }));

    // Search filter
    const searchTerm = UI.get('bn-search').value.toLowerCase();
    if (searchTerm) {
      notesArray = notesArray.filter(note => 
        (note.title || '').toLowerCase().includes(searchTerm) ||
        (note.content || '').toLowerCase().includes(searchTerm) ||
        (note.label || '').toLowerCase().includes(searchTerm)
      );
    }

    // Label filter
    const filterLabel = UI.get('bn-filter-label').value;
    if (filterLabel) {
      notesArray = notesArray.filter(note => note.label === filterLabel);
    }

    // Sort
    const sortBy = UI.get('bn-sort').value;
    if (sortBy === 'updated-desc') {
      notesArray.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (sortBy === 'updated-asc') {
      notesArray.sort((a, b) => a.updatedAt - b.updatedAt);
    } else if (sortBy === 'created-desc') {
      notesArray.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'created-asc') {
      notesArray.sort((a, b) => a.createdAt - b.createdAt);
    }

    // Update label filter options
    const labels = await Storage.getLabels();
    const currentFilter = UI.get('bn-filter-label').value;
    UI.updateLabelFilter(labels, currentFilter);

    // Render notes list
    this.renderList(notesArray);
  },

  renderList(notesArray) {
    const listDiv = UI.get('bn-notes-list');
    
    if (notesArray.length === 0) {
      listDiv.innerHTML = '<div style="text-align: center; padding: 40px 0; color: #9a9a9a; font-size: 12px;">no notes yet</div>';
      return;
    }

    listDiv.innerHTML = notesArray.map(note => {
      const dateStr = Utils.formatDate(note.updatedAt);
      const preview = (note.content || '').substring(0, 100);
      const title = Utils.escapeHtml(note.title || 'untitled');
      const label = Utils.escapeHtml(note.label || 'no label');
      const noteId = Utils.escapeHtml(note.id);
      
      return `
        <div class="bn-note-item" data-note-id="${noteId}" role="button" tabindex="0" style="padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.15s, transform 0.1s ease;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #2a2a2a;">${title}</div>
          <div style="font-size: 12px; color: #6a6a6a; margin-bottom: 8px; line-height: 1.5;">${Utils.escapeHtml(preview)}${preview.length >= 100 ? '...' : ''}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9a9a9a;">
            <span>${label}</span>
            <span>${dateStr}</span>
          </div>
        </div>
      `;
    }).join('');

    listDiv.querySelectorAll('.bn-note-item').forEach(item => {
      const openNote = () => EditorView.open(item.dataset.noteId);

      item.addEventListener('click', openNote);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openNote();
        }
      });
      item.addEventListener('mousedown', () => {
        item.style.transform = 'scale(0.98)';
      });
      item.addEventListener('mouseup', () => {
        item.style.transform = 'scale(1)';
      });
      item.addEventListener('mouseenter', () => {
        item.style.background = '#f8f8f8';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.background = 'transparent';
      });
    });
  }
};
