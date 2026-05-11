// All Notes view controller
const AllNotesView = {
  async render() {
    if (!this.checkRequiredElements()) {
      setTimeout(() => this.render(), 50);
      return;
    }

    if (Storage.hasContextIssue?.()) {
      this.renderList([], { reloadRequired: true });
      return;
    }

    const notes = await Storage.getNotes();
    if (Storage.hasContextIssue?.()) {
      this.renderList([], { reloadRequired: true });
      return;
    }

    let notesArray = Object.entries(notes).map(([id, note]) => ({ id, ...note }));
    const totalNotes = notesArray.length;

    // Apply filters
    notesArray = this.applySearchFilter(notesArray);
    notesArray = await this.applyLabelFilter(notesArray);
    notesArray = this.applyFavoriteFilter(notesArray);
    
    // Sort notes
    notesArray = this.sortNotes(notesArray);

    // Update UI
    await this.updateLabelFilterOptions();

    if (Storage.hasContextIssue?.()) {
      this.renderList([], { reloadRequired: true });
      return;
    }

    const labels = await Storage.getLabels();
    const labelColors = await Storage.getLabelColors();
    const lockedLabelFilter = await Storage.getLockedLabelFilter();
    const currentFilter = lockedLabelFilter.locked ? lockedLabelFilter.value : UI.get('bn-filter-label').value;
    UI.updateLabelFilter(labels, currentFilter);

    const searchTerm = UI.get('bn-search').value.toLowerCase();
    const filterLabel = lockedLabelFilter.locked ? lockedLabelFilter.value : UI.get('bn-filter-label').value;
    const favoriteOnly = UI.get('bn-filter-favorite').dataset.active === 'true';

    this.renderList(notesArray, { totalNotes, searchTerm, filterLabel, favoriteOnly, labelColors });
  },

  checkRequiredElements() {
    return UI.get('bn-notes-list') && 
           UI.get('bn-filter-label') && 
           UI.get('bn-filter-label-lock') && 
           UI.get('bn-filter-favorite') && 
           UI.get('bn-search') && 
           UI.get('bn-sort');
  },

  applySearchFilter(notesArray) {
    const searchTerm = UI.get('bn-search').value.toLowerCase();
    if (!searchTerm) return notesArray;

    return notesArray.filter(note => 
      (note.title || '').toLowerCase().includes(searchTerm) ||
      (note.content || '').toLowerCase().includes(searchTerm) ||
      (note.label || '').toLowerCase().includes(searchTerm)
    );
  },

  async applyLabelFilter(notesArray) {
    const lockedLabelFilter = await Storage.getLockedLabelFilter();
    UI.setLabelFilterLock(lockedLabelFilter.locked);
    
    if (lockedLabelFilter.locked && UI.get('bn-filter-label').value !== lockedLabelFilter.value) {
      UI.get('bn-filter-label').value = lockedLabelFilter.value;
    }

    const filterLabel = lockedLabelFilter.locked ? lockedLabelFilter.value : UI.get('bn-filter-label').value;
    
    if (filterLabel === '__NO_LABEL__') {
      return notesArray.filter(note => !note.label);
    } else if (filterLabel) {
      return notesArray.filter(note => note.label === filterLabel);
    }
    
    return notesArray;
  },

  applyFavoriteFilter(notesArray) {
    const favoriteOnly = UI.get('bn-filter-favorite').dataset.active === 'true';
    if (!favoriteOnly) return notesArray;
    
    return notesArray.filter(note => !!note.favorite);
  },

  sortNotes(notesArray) {
    const sortBy = UI.get('bn-sort').value;
    
    // Apply selected sort
    if (sortBy === 'updated-desc') {
      notesArray.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (sortBy === 'updated-asc') {
      notesArray.sort((a, b) => a.updatedAt - b.updatedAt);
    } else if (sortBy === 'created-desc') {
      notesArray.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'created-asc') {
      notesArray.sort((a, b) => a.createdAt - b.createdAt);
    }
    
    // Always prioritize king and pinned notes
    notesArray.sort((a, b) => {
      const kingSort = Number(!!b.king) - Number(!!a.king);
      if (kingSort) return kingSort;
      return Number(!!b.pinned) - Number(!!a.pinned);
    });
    
    return notesArray;
  },

  async updateLabelFilterOptions() {
    const labels = await Storage.getLabels();
    const lockedLabelFilter = await Storage.getLockedLabelFilter();
    const currentFilter = lockedLabelFilter.locked ? lockedLabelFilter.value : UI.get('bn-filter-label').value;
    UI.updateLabelFilter(labels, currentFilter);
  },

  toggleFavoriteFilter() {
    const active = UI.get('bn-filter-favorite')?.dataset.active !== 'true';
    UI.setFavoriteFilter(active);
    this.render();
  },

  async handleLabelFilterChange() {
    const label = UI.get('bn-filter-label');
    const lockedLabelFilter = await Storage.getLockedLabelFilter();
    if (lockedLabelFilter.locked && label) {
      await Storage.saveLockedLabelFilter({ locked: true, value: label.value });
    }
    this.render();
  },

  async toggleLabelFilterLock() {
    const label = UI.get('bn-filter-label');
    const lockedLabelFilter = await Storage.getLockedLabelFilter();
    const locked = !lockedLabelFilter.locked;
    const value = locked ? (label?.value || '') : '';

    await Storage.saveLockedLabelFilter({ locked, value });
    UI.setLabelFilterLock(locked);
    this.render();
  },

  resetFilters() {
    const search = UI.get('bn-search');
    const label = UI.get('bn-filter-label');

    if (search) {
      search.value = '';
    }

    const locked = UI.get('bn-filter-label-lock')?.dataset.active === 'true';
    if (label && !locked) {
      label.value = '';
    }

    UI.setFavoriteFilter(false);
    this.render();
  },

  renderList(notesArray, filters = {}) {
    const listDiv = UI.get('bn-notes-list');
    
    if (notesArray.length === 0) {
      listDiv.style.display = 'flex';
      listDiv.style.alignItems = 'center';
      listDiv.style.justifyContent = 'center';
      listDiv.innerHTML = this.renderEmptyState(filters);
      listDiv.querySelector('[data-action="reload-page"]')?.addEventListener('click', () => {
        window.location.reload();
      });
      return;
    }

    listDiv.style.display = 'block';
    listDiv.style.alignItems = '';
    listDiv.style.justifyContent = '';
    listDiv.innerHTML = notesArray.map(note => {
      const drawer = UI.get('bronotes-drawer');
      const dark = drawer?.dataset.theme === 'dark';
      const transparent = drawer?.dataset.transparent === 'true';
      const dateStr = Utils.formatDate(note.updatedAt, 'long');
      const preview = (note.content || '').substring(0, Constants.NOTES.PREVIEW_LENGTH);
      const title = Utils.escapeHtml(note.title || 'untitled');
      const label = Utils.escapeHtml(note.label || 'no label');
      const noteId = Utils.escapeHtml(note.id);
      const labelColor = Storage.getResolvedLabelColor(note.label, filters.labelColors || {});
      const labelDot = note.label
        && labelColor
        ? `<span title="label color" style="display: inline-block; flex: 0 0 auto; width: 8px; height: 8px; background: ${Utils.escapeHtml(labelColor)}; margin-right: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,0.08);"></span>`
        : '';
      const labelIcon = Utils.assetUrl('icons/label.svg');
      const calendarIcon = Utils.assetUrl('icons/calendar.svg');
      const bookmarkIcon = Utils.assetUrl('icons/bookmark.svg');
      const pinIcon = Utils.assetUrl('icons/pin.svg');
      const favoriteIcon = note.favorite
        ? `<img src="${bookmarkIcon}" alt="" title="favorite" style="width: 11px; height: 11px; opacity: 0.72; pointer-events: none; flex: 0 0 auto;" />`
        : '';
      const pinnedIcon = note.pinned
        ? `<img src="${pinIcon}" alt="" title="pinned" style="width: 11px; height: 11px; opacity: 0.72; pointer-events: none; flex: 0 0 auto;" />`
        : '';
      const kingStyle = this.getKingCardStyle(!!note.king, { dark, transparent });
      
      return `
        <div class="bn-note-item" data-note-id="${noteId}" data-king="${note.king ? 'true' : 'false'}" role="button" tabindex="0" style="padding: 16px; border-bottom: 1px solid ${kingStyle.border}; background: ${kingStyle.background}; cursor: pointer; transition: background 0.15s, transform 0.1s ease;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #2a2a2a;">${title}</div>
          <div style="font-size: 12px; color: #6a6a6a; margin-bottom: 8px; line-height: 1.5;">${Utils.escapeHtml(preview)}${preview.length >= Constants.NOTES.PREVIEW_LENGTH ? '...' : ''}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9a9a9a;">
            <span style="display: inline-flex; align-items: center; gap: 4px; min-width: 0;">${labelDot}<span style="display: inline-flex; align-items: center; gap: 0; min-width: 0;"><img src="${labelIcon}" alt="" style="width: 11px; height: 11px; opacity: 0.55; pointer-events: none; flex: 0 0 auto;" /><span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${label}</span></span>${favoriteIcon}${pinnedIcon}</span>
            <span style="display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto;"><img src="${calendarIcon}" alt="" style="width: 11px; height: 11px; opacity: 0.55; pointer-events: none;" />${dateStr}</span>
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
        const dark = UI.get('bronotes-drawer')?.dataset.theme === 'dark';
        const transparent = UI.get('bronotes-drawer')?.dataset.transparent === 'true';
        const king = item.dataset.king === 'true';
        item.style.background = king
          ? this.getKingCardStyle(true, { dark, transparent, hover: true }).background
          : (dark ? 'rgba(255, 255, 255, 0.08)' : '#f8f8f8');
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        const dark = UI.get('bronotes-drawer')?.dataset.theme === 'dark';
        const transparent = UI.get('bronotes-drawer')?.dataset.transparent === 'true';
        const king = item.dataset.king === 'true';
        item.style.background = king
          ? this.getKingCardStyle(true, { dark, transparent }).background
          : 'transparent';
      });
    });
  },

  getKingCardStyle(king, { dark = false, transparent = false, hover = false } = {}) {
    if (!king) {
      return {
        background: 'transparent',
        border: dark ? '#333333' : '#f0f0f0'
      };
    }

    if (dark) {
      return {
        background: transparent
          ? (hover ? 'rgba(255, 207, 64, 0.18)' : 'rgba(255, 207, 64, 0.12)')
          : (hover ? 'rgba(255, 207, 64, 0.14)' : 'rgba(255, 207, 64, 0.09)'),
        border: 'rgba(255, 207, 64, 0.22)'
      };
    }

    return {
      background: transparent
        ? (hover ? 'rgba(255, 224, 92, 0.2)' : 'rgba(255, 224, 92, 0.14)')
        : (hover ? '#fff8d9' : '#fffbed'),
      border: 'rgba(220, 174, 26, 0.18)'
    };
  },

  renderEmptyState({ totalNotes = 0, searchTerm = '', filterLabel = '', favoriteOnly = false, reloadRequired = false } = {}) {
    let title = 'No notes yet';
    let message = 'Create your first note to keep an idea, snippet, or reminder close by.';
    let action = 'Use the New Note button to start writing.';

    if (reloadRequired) {
      title = 'Reload required';
      message = 'This page is still connected to an old Brow Notes session, so saved notes cannot be loaded here.';
      action = 'Reload this page, then open Brow Notes again.';
    } else if (totalNotes > 0 && searchTerm) {
      title = 'No matching notes';
      message = `No notes match "${Utils.escapeHtml(searchTerm)}".`;
      action = 'Try a different keyword, clear the search, or check another label.';
    } else if (totalNotes > 0 && favoriteOnly) {
      title = 'No favorite notes';
      message = 'You have notes, but none are marked as favorite in this view.';
      action = 'Open a note and tap the bookmark icon, or turn off the favorite filter.';
    } else if (totalNotes > 0 && filterLabel) {
      title = filterLabel === '__NO_LABEL__' ? 'No unlabeled notes' : `No notes in "${Utils.escapeHtml(filterLabel)}"`;
      message = 'This filter does not have any notes to show right now.';
      action = 'Choose another label, clear the filter, or add this label to a note.';
    }

    const actionHtml = reloadRequired
      ? `
        <button type="button" data-action="reload-page" style="height: 34px; padding: 0 14px; border: 1px solid #d8d8d8; border-radius: 0; background: #f3f3f3; color: #333; font-size: 12px; font-weight: 700; cursor: pointer; margin-bottom: 10px;">Reload Page</button>
        <div style="font-size: 11px; line-height: 1.5; margin: 0 auto; max-width: 260px;">${action}</div>
      `
      : `<div style="font-size: 11px; line-height: 1.5; margin: 0 auto; max-width: 260px;">${action}</div>`;
    const icon = Utils.assetUrl(reloadRequired ? 'icons/reset.svg' : 'icons/allnotes.svg');

    return `
      <div style="padding: 40px 8px; text-align: center; color: #8a8a8a; max-width: 292px;">
        <img src="${icon}" alt="" style="width: 24px; height: 24px; opacity: 0.38; pointer-events: none; margin: 0 auto 12px auto; display: block;" />
        <div style="font-size: 13px; font-weight: 700; color: #4a4a4a; margin-bottom: 8px;">${title}</div>
        <div style="font-size: 12px; line-height: 1.55; margin: 0 auto 10px auto; max-width: 280px;">${message}</div>
        ${actionHtml}
      </div>
    `;
  }
};
