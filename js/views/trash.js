// Trash view controller
const TrashView = {
  retentionDays: Constants.TRASH.RETENTION_DAYS,

  async load() {
    if (Storage.hasContextIssue?.()) {
      this.renderEmptyState({
        title: 'Reload required',
        message: 'This page is still connected to an old Brow Notes session, so deleted notes cannot be loaded here.',
        action: 'Reload this page, then open Brow Notes again.',
        reloadRequired: true
      });
      return;
    }

    const trashNotes = await Storage.getTrashNotes();

    if (Storage.hasContextIssue?.()) {
      this.renderEmptyState({
        title: 'Reload required',
        message: 'This page is still connected to an old Brow Notes session, so deleted notes cannot be loaded here.',
        action: 'Reload this page, then open Brow Notes again.',
        reloadRequired: true
      });
      return;
    }

    const notesArray = Object.entries(trashNotes)
      .map(([id, note]) => ({ id, ...note }))
      .sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

    await this.renderList(notesArray);
  },

  async renderList(notesArray) {
    const listDiv = UI.get('bn-trash-list');
    const emptyButton = UI.get('bn-btn-empty-trash');
    if (!listDiv) return;

    if (emptyButton) {
      emptyButton.style.display = notesArray.length ? 'block' : 'none';
    }

    if (notesArray.length === 0) {
      this.renderEmptyState();
      return;
    }

    listDiv.style.display = 'block';

    const labelIcon = Utils.assetUrl('icons/label.svg');
    const calendarIcon = Utils.assetUrl('icons/calendar.svg');
    const labelColors = await Storage.getLabelColors();

    listDiv.innerHTML = notesArray.map(note => {
      const title = Utils.escapeHtml(note.title || 'untitled');
      const label = Utils.escapeHtml(note.label || 'no label');
      const labelColor = Storage.getResolvedLabelColor(note.label, labelColors);
      const labelDot = note.label
        && labelColor
        ? `<span title="label color" style="display: inline-block; flex: 0 0 auto; width: 8px; height: 8px; background: ${Utils.escapeHtml(labelColor)}; margin-right: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,0.08);"></span>`
        : '';
      const preview = Utils.escapeHtml((note.content || '').substring(0, Constants.NOTES.TRASH_PREVIEW_LENGTH));
      const noteId = Utils.escapeHtml(note.id);
      const deletedAt = note.deletedAt ? Utils.formatDate(note.deletedAt, 'long') : 'recently';
      const permanentlyDeleteAt = note.deletedAt
        ? Utils.formatDate(this.getPermanentDeleteAt(note.deletedAt), 'long')
        : '-';

      return `
        <div class="bn-trash-item" data-note-id="${noteId}" style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
          <div style="font-size: 13px; font-weight: 650; margin-bottom: 6px; color: #2a2a2a;">${title}</div>
          <div style="font-size: 12px; color: #6a6a6a; margin-bottom: 8px; line-height: 1.5;">${preview}${preview.length >= Constants.NOTES.TRASH_PREVIEW_LENGTH ? '...' : ''}</div>
          <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px; color: #9a9a9a; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; gap: 0; min-width: 0;">${labelDot}<img src="${labelIcon}" alt="" style="width: 11px; height: 11px; opacity: 0.55; pointer-events: none; flex: 0 0 auto;" /><span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${label}</span></span>
            <span style="display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto;"><img src="${calendarIcon}" alt="" style="width: 11px; height: 11px; opacity: 0.55; pointer-events: none;" />${deletedAt}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; line-height: 1.45; color: #8a8a8a; margin-bottom: 10px;">
            <img src="${calendarIcon}" alt="" style="width: 10px; height: 10px; opacity: 0.45; pointer-events: none; flex: 0 0 auto;" />
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Permanently delete at ${permanentlyDeleteAt}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="bn-trash-restore" type="button" style="flex: 1; padding: 7px 10px; cursor: pointer; font-size: 11px; font-family: inherit; transition: transform 0.1s ease; box-sizing: border-box;">restore</button>
            <button class="bn-trash-delete" type="button" style="padding: 7px 10px; cursor: pointer; font-size: 11px; font-family: inherit; transition: transform 0.1s ease; box-sizing: border-box;">delete forever</button>
          </div>
        </div>
      `;
    }).join('');

    listDiv.querySelectorAll('.bn-trash-item').forEach(item => {
      const noteId = item.dataset.noteId;
      const restoreButton = item.querySelector('.bn-trash-restore');
      const deleteButton = item.querySelector('.bn-trash-delete');

      this.attachButtonFeedback(restoreButton);
      this.attachButtonFeedback(deleteButton);

      restoreButton.addEventListener('click', () => this.restore(noteId));
      deleteButton.addEventListener('click', () => this.deleteForever(noteId));
    });
  },

  getPermanentDeleteAt(deletedAt) {
    return deletedAt + (this.retentionDays * 24 * 60 * 60 * 1000);
  },

  renderEmptyState({
    title = 'Trash is empty',
    message = 'Deleted notes will appear here, so you can restore them before removing them forever.',
    action = 'Delete a note from the editor to move it here.',
    reloadRequired = false
  } = {}) {
    const listDiv = UI.get('bn-trash-list');
    const emptyButton = UI.get('bn-btn-empty-trash');
    if (!listDiv) return;

    if (emptyButton) {
      emptyButton.style.display = 'none';
    }

    const trashIcon = Utils.assetUrl('icons/trash.svg');
    listDiv.style.display = 'flex';
    listDiv.style.alignItems = 'center';
    listDiv.style.justifyContent = 'center';
    listDiv.innerHTML = `
      <div style="padding: 40px 8px; text-align: center; color: #8a8a8a; max-width: 292px;">
        <img src="${trashIcon}" alt="" style="width: 24px; height: 24px; opacity: 0.38; pointer-events: none; margin: 0 auto 12px auto; display: block;" />
        <div style="font-size: 13px; font-weight: 700; color: #4a4a4a; margin-bottom: 8px;">${title}</div>
        <div style="font-size: 12px; line-height: 1.55; margin: 0 auto 10px auto;">${message}</div>
        ${reloadRequired
          ? '<button type="button" data-action="reload-page" style="height: 34px; padding: 0 14px; border: 1px solid #d8d8d8; border-radius: 0; background: #f3f3f3; color: #333; font-size: 12px; font-weight: 700; cursor: pointer; margin-bottom: 10px;">Reload Page</button>'
          : ''}
        <div style="font-size: 11px; line-height: 1.5; margin: 0 auto; max-width: 260px;">${action}</div>
      </div>
    `;

    listDiv.querySelector('[data-action="reload-page"]')?.addEventListener('click', () => {
      window.location.reload();
    });
  },

  attachButtonFeedback(button) {
    if (!button) return;

    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.98)';
    });
    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  },

  async restore(noteId) {
    await Storage.restoreNote(noteId);
    await this.load();
    SettingsView.scheduleAutoBackup('restore-note');
  },

  async deleteForever(noteId) {
    const confirmed = await UI.showConfirm('Delete this note forever? This cannot be undone.', 'delete forever', {
      confirmText: 'delete',
      danger: true
    });
    if (!confirmed) return;

    await Storage.deleteTrashNote(noteId);
    await this.load();
    SettingsView.scheduleAutoBackup('delete-trash-note');
  },

  async empty() {
    const confirmed = await UI.showConfirm('Empty trash? All deleted notes will be removed forever.', 'empty trash', {
      confirmText: 'empty',
      danger: true
    });
    if (!confirmed) return;

    await Storage.emptyTrash();
    await this.load();
    SettingsView.scheduleAutoBackup('empty-trash');
  }
};
