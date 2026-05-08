// Labels view controller
const LabelsView = {
  async load() {
    const labels = await Storage.getLabels();
    const notes = await Storage.getNotes();
    this.renderList(labels, notes);
  },

  renderList(labels, notes = {}) {
    const listDiv = UI.get('bn-labels-list');
    
    const counts = this.getLabelCounts(notes);
    const noLabelCount = this.getNoLabelCount(notes);
    const labelIcon = Utils.assetUrl('icons/label.png');

    const labelItems = labels.map(label => {
      const escapedLabel = Utils.escapeHtml(label);
      const count = counts.get(label) || 0;
      return `
        <div class="bn-label-item" data-label="${escapedLabel}" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid #e8e8e8; border-radius: 4px; margin-bottom: 7px; box-sizing: border-box;">
          <div style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 0; font-size: 12px; color: #2a2a2a;">
            <img src="${labelIcon}" alt="" style="display: block; flex: 0 0 auto; width: 13px; height: 13px; opacity: 0.58; pointer-events: none;" />
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapedLabel}</span>
            <span title="${count} notes" style="flex: 0 0 auto; min-width: 22px; padding: 2px 6px; background: rgba(42, 42, 42, 0.06); color: #5f5f5f; border: 1px solid #eeeeee; font-size: 10px; font-weight: 700; line-height: 1.2; text-align: center; box-sizing: border-box; margin-left: 8px;">${count}</span>
          </div>
          <button class="bn-label-rename" type="button" style="padding: 5px 9px; background: transparent; color: #6a6a6a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 10px; font-family: inherit; transition: transform 0.1s ease;">rename</button>
          <button class="bn-label-delete" type="button" style="padding: 5px 9px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 10px; font-family: inherit; transition: transform 0.1s ease;">delete</button>
        </div>
      `;
    }).join('');

    const noLabelItem = `
      <div class="bn-label-item bn-label-static" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid #eeeeee; border-radius: 4px; margin-bottom: 7px; background: rgba(42, 42, 42, 0.025); box-sizing: border-box;">
        <div style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 0; font-size: 12px; color: #6a6a6a;">
          <img src="${labelIcon}" alt="" style="display: block; flex: 0 0 auto; width: 13px; height: 13px; opacity: 0.42; pointer-events: none;" />
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">no label</span>
          <span title="${noLabelCount} notes" style="flex: 0 0 auto; min-width: 22px; padding: 2px 6px; background: rgba(42, 42, 42, 0.05); color: #6a6a6a; border: 1px solid #eeeeee; font-size: 10px; font-weight: 700; line-height: 1.2; text-align: center; box-sizing: border-box; margin-left: 8px;">${noLabelCount}</span>
        </div>
        <div style="flex: 0 0 auto; color: #aaaaaa; font-size: 10px;">default</div>
      </div>
    `;

    listDiv.innerHTML = `${labelItems}${noLabelItem}`;

    listDiv.querySelectorAll('.bn-label-item').forEach(item => {
      const label = item.dataset.label;
      const renameButton = item.querySelector('.bn-label-rename');
      const deleteButton = item.querySelector('.bn-label-delete');

      this.attachButtonFeedback(renameButton);
      this.attachButtonFeedback(deleteButton);

      renameButton.addEventListener('click', () => this.rename(label));
      deleteButton.addEventListener('click', () => this.delete(label));
    });
  },

  getLabelCounts(notes) {
    const counts = new Map();

    Object.values(notes).forEach(note => {
      const label = note.label;
      if (!label) return;
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return counts;
  },

  getNoLabelCount(notes) {
    return Object.values(notes).filter(note => !note.label).length;
  },

  attachButtonFeedback(button) {
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

  async rename(oldLabel) {
    const newLabel = (await UI.showPrompt('Rename label:', oldLabel, 'rename label'))?.trim();
    if (!newLabel || newLabel === oldLabel) return;

    await Storage.renameLabel(oldLabel, newLabel);
    await this.load();
  },

  async delete(label) {
    const confirmed = await UI.showConfirm(`Delete label "${label}"? This will remove the label from all notes.`, 'delete label', {
      confirmText: 'delete',
      danger: true
    });
    if (!confirmed) return;

    await Storage.deleteLabel(label);
    await this.load();
  },

  async add() {
    const label = (await UI.showPrompt('New label name:', '', 'add label'))?.trim();
    if (!label) return;

    await Storage.addLabel(label);
    await this.load();
  }
};
