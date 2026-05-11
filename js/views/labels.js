// Labels view controller
const LabelsView = {
  async load() {
    const labels = await Storage.getLabels();
    const notes = await Storage.getNotes();
    const labelColors = await Storage.getLabelColors();
    this.renderList(labels, notes, labelColors);
  },

  renderList(labels, notes = {}, labelColors = {}) {
    const listDiv = UI.get('bn-labels-list');
    
    const counts = this.getLabelCounts(notes);
    const noLabelCount = this.getNoLabelCount(notes);
    const labelIcon = Utils.assetUrl('icons/label.svg');

    const labelItems = labels.map(label => {
      const escapedLabel = Utils.escapeHtml(label);
      const count = counts.get(label) || 0;
      const color = Storage.getResolvedLabelColor(label, labelColors);
      const colorBackground = color ? `${Utils.escapeHtml(color)} !important` : 'transparent !important';
      const colorBorder = color ? 'rgba(0,0,0,0.12)' : '#cfcfcf';
      return `
        <div class="bn-label-item" data-label="${escapedLabel}" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid #e8e8e8; border-radius: 4px; margin-bottom: 7px; box-sizing: border-box;">
          <div style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 0; font-size: 12px; color: #2a2a2a;">
            <button class="bn-label-color" type="button" title="change label color" aria-label="change label color" data-label="${escapedLabel}" data-color="${Utils.escapeHtml(color)}" style="display: block; flex: 0 0 auto; width: 12px; height: 12px; background: ${colorBackground}; border: 1px solid ${colorBorder}; padding: 0; margin: 0 7px 0 0; cursor: pointer; box-sizing: border-box;"></button>
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
      if (!label) return;
      const colorButton = item.querySelector('.bn-label-color');
      const renameButton = item.querySelector('.bn-label-rename');
      const deleteButton = item.querySelector('.bn-label-delete');

      this.attachButtonFeedback(colorButton);
      this.attachButtonFeedback(renameButton);
      this.attachButtonFeedback(deleteButton);

      colorButton.addEventListener('click', () => this.openColorPicker(label));
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

  async rename(oldLabel) {
    const rawLabel = (await UI.showLimitedPrompt('Rename label:', oldLabel, 'rename label', Storage.maxLabelLength)) || '';
    if (rawLabel.trim().length > Storage.maxLabelLength) {
      await UI.showAlert(`Label names are limited to ${Storage.maxLabelLength} characters.`, 'label too long');
      return;
    }
    const newLabel = Storage.normalizeLabel(rawLabel);
    if (!newLabel || newLabel === oldLabel) return;
    const labels = await Storage.getManualLabels();
    if (Storage.isDuplicateLabel(newLabel, labels, oldLabel)) {
      await UI.showAlert('A label with that name already exists.', 'duplicate label');
      return;
    }

    const renamedLabel = await Storage.renameLabel(oldLabel, newLabel);
    if (!renamedLabel) return;
    await this.load();
    UI.updateLabelSuggestions(await Storage.getLabels());
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
    const rawLabel = (await UI.showLimitedPrompt('New label name:', '', 'add label', Storage.maxLabelLength)) || '';
    if (rawLabel.trim().length > Storage.maxLabelLength) {
      await UI.showAlert(`Label names are limited to ${Storage.maxLabelLength} characters.`, 'label too long');
      return;
    }
    const label = Storage.normalizeLabel(rawLabel);
    if (!label) return;
    const labels = await Storage.getManualLabels();
    if (Storage.isDuplicateLabel(label, labels)) {
      await UI.showAlert('A label with that name already exists.', 'duplicate label');
      return;
    }

    const createdLabel = await Storage.addLabel(label);
    if (!createdLabel) return;
    await this.load();
    UI.updateLabelSuggestions(await Storage.getLabels());
  },

  async openColorPicker(label) {
    const drawer = UI.get('bronotes-drawer');
    if (!drawer) return;

    const labelColors = await Storage.getLabelColors();
    const currentColor = Storage.getResolvedLabelColor(label, labelColors);
    const dark = drawer.dataset.theme === 'dark';
    const existingModal = UI.get('bn-label-color-modal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'bn-label-color-modal';
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 14;
      background: ${dark ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.72)'};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      backdrop-filter: blur(2px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      width: 100%;
      max-width: 292px;
      background: ${dark ? '#202020' : '#ffffff'};
      border: 1px solid ${dark ? '#3a3a3a' : '#e0e0e0'};
      box-shadow: 0 12px 36px ${dark ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0.16)'};
      padding: 16px;
      box-sizing: border-box;
    `;
    modal.style.setProperty('background', dark ? '#202020' : '#ffffff', 'important');
    modal.style.setProperty('border-color', dark ? '#3a3a3a' : '#e0e0e0', 'important');

    const title = document.createElement('div');
    title.textContent = `label color: ${label}`;
    title.style.cssText = `font-size: 13px; font-weight: 600; color: ${dark ? '#f1f1f1' : '#2a2a2a'}; margin-bottom: 12px; letter-spacing: 0.5px; overflow-wrap: anywhere;`;
    title.style.setProperty('color', dark ? '#f1f1f1' : '#2a2a2a', 'important');
    modal.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 7px;
      margin-bottom: 14px;
    `;

    Storage.labelColorPalette.forEach(color => {
      const button = document.createElement('button');
      button.type = 'button';
      button.title = color;
      button.setAttribute('aria-label', `use ${color}`);
      button.style.cssText = `
        width: 100%;
        aspect-ratio: 1;
        background: ${color};
        border: 2px solid ${currentColor && color === currentColor ? (dark ? '#ffffff' : '#2a2a2a') : 'transparent'};
        box-shadow: 0 0 0 1px ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'};
        cursor: pointer;
        padding: 0;
        transition: transform 0.1s ease;
      `;
      button.style.setProperty('background', color, 'important');
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.94)';
      });
      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
      });
      button.addEventListener('click', async () => {
        await Storage.saveLabelColor(label, color);
        overlay.remove();
        await this.load();
        AllNotesView.render();
        TrashView.load();
      });
      grid.appendChild(button);
    });
    modal.appendChild(grid);

    const actions = document.createElement('div');
    actions.style.cssText = 'display: flex; gap: 8px;';

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.textContent = 'reset';
    reset.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      background: transparent;
      color: ${dark ? '#d8d8d8' : '#6a6a6a'};
      border: 1px solid ${dark ? '#555555' : '#e0e0e0'};
      cursor: pointer;
      font-size: 11px;
      font-family: inherit;
    `;
    reset.style.setProperty('background', 'transparent', 'important');
    reset.style.setProperty('border-color', dark ? '#555555' : '#e0e0e0', 'important');
    reset.style.setProperty('color', dark ? '#d8d8d8' : '#6a6a6a', 'important');
    reset.addEventListener('click', async () => {
      await Storage.resetLabelColor(label);
      overlay.remove();
      await this.load();
      AllNotesView.render();
      TrashView.load();
    });
    actions.appendChild(reset);

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'cancel';
    cancel.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      background: transparent;
      color: ${dark ? '#d8d8d8' : '#6a6a6a'};
      border: 1px solid ${dark ? '#555555' : '#e0e0e0'};
      cursor: pointer;
      font-size: 11px;
      font-family: inherit;
    `;
    cancel.style.setProperty('background', 'transparent', 'important');
    cancel.style.setProperty('border-color', dark ? '#555555' : '#e0e0e0', 'important');
    cancel.style.setProperty('color', dark ? '#d8d8d8' : '#6a6a6a', 'important');
    cancel.addEventListener('click', () => overlay.remove());
    actions.appendChild(cancel);
    modal.appendChild(actions);

    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        overlay.remove();
      }
    });

    overlay.appendChild(modal);
    drawer.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.querySelector('button')?.focus();
    });
  }
};
