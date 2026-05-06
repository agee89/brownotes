// Labels view controller
const LabelsView = {
  async load() {
    const labels = await Storage.getLabels();
    this.renderList(labels);
  },

  renderList(labels) {
    const listDiv = UI.get('bn-labels-list');
    
    if (labels.length === 0) {
      listDiv.innerHTML = '<div style="text-align: center; padding: 20px 0; color: #9a9a9a; font-size: 12px;">no labels yet</div>';
      return;
    }

    listDiv.innerHTML = labels.map(label => {
      const escapedLabel = Utils.escapeHtml(label);
      return `
        <div class="bn-label-item" data-label="${escapedLabel}" style="display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid #e8e8e8; border-radius: 4px; margin-bottom: 8px;">
          <div style="flex: 1; font-size: 12px; color: #2a2a2a;">${escapedLabel}</div>
          <button class="bn-label-rename" type="button" style="padding: 6px 12px; background: transparent; color: #6a6a6a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 11px; font-family: inherit; transition: transform 0.1s ease;">rename</button>
          <button class="bn-label-delete" type="button" style="padding: 6px 12px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 11px; font-family: inherit; transition: transform 0.1s ease;">delete</button>
        </div>
      `;
    }).join('');

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
