// Label operations
const StorageLabels = {
  normalizeLabel(label) {
    return String(label || '').replace(/\s+/g, ' ').trim().slice(0, Constants.NOTES.MAX_LABEL_LENGTH);
  },

  isDuplicateLabel(label, labels, ignoredLabel = '') {
    const normalized = this.normalizeLabel(label).toLowerCase();
    const ignored = this.normalizeLabel(ignoredLabel).toLowerCase();
    return labels.some(existingLabel => {
      const existing = this.normalizeLabel(existingLabel).toLowerCase();
      return existing === normalized && existing !== ignored;
    });
  },

  async getManualLabels() {
    const result = await StorageCore.get(['labels']);
    return result.labels || [];
  },

  async saveManualLabels(labels) {
    const normalizedLabels = labels
      .map(label => this.normalizeLabel(label))
      .filter(Boolean);
    await StorageCore.set({ labels: Array.from(new Set(normalizedLabels)).sort() });
  },

  async getLabels() {
    return this.getManualLabels();
  },

  async addLabel(label) {
    const normalized = this.normalizeLabel(label);
    if (!normalized) return '';
    const labels = await this.getManualLabels();
    if (this.isDuplicateLabel(normalized, labels)) return normalized;
    labels.push(normalized);
    await this.saveManualLabels(labels);
    return normalized;
  },

  async renameLabel(oldLabel, newLabel) {
    const normalizedOldLabel = this.normalizeLabel(oldLabel);
    const normalizedNewLabel = this.normalizeLabel(newLabel);
    if (!normalizedOldLabel || !normalizedNewLabel) return '';
    const notes = await StorageNotes.getNotes();
    const manualLabels = await this.getManualLabels();
    const labelColors = await this.getLabelColors();
    if (this.isDuplicateLabel(normalizedNewLabel, manualLabels, normalizedOldLabel)) return '';
    Object.keys(notes).forEach(id => {
      if (notes[id].label === normalizedOldLabel) {
        notes[id].label = normalizedNewLabel;
      }
    });
    if (labelColors[normalizedOldLabel] && !labelColors[normalizedNewLabel]) {
      labelColors[normalizedNewLabel] = labelColors[normalizedOldLabel];
    }
    delete labelColors[normalizedOldLabel];
    await StorageNotes.saveNotes(notes);
    await StorageCore.set({
      labels: Array.from(new Set(manualLabels.map(label => label === normalizedOldLabel ? normalizedNewLabel : label))).sort(),
      labelColors
    });
    return normalizedNewLabel;
  },

  async deleteLabel(label) {
    const notes = await StorageNotes.getNotes();
    const manualLabels = await this.getManualLabels();
    const labelColors = await this.getLabelColors();
    Object.keys(notes).forEach(id => {
      if (notes[id].label === label) {
        notes[id].label = '';
      }
    });
    delete labelColors[label];
    await StorageNotes.saveNotes(notes);
    await StorageCore.set({
      labels: manualLabels.filter(existingLabel => existingLabel !== label),
      labelColors
    });
  },

  async getLabelColors() {
    const result = await StorageCore.get(['labelColors']);
    return result.labelColors || {};
  },

  getDefaultLabelColor(label) {
    const text = String(label || '');
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Constants.LABEL_COLORS[Math.abs(hash) % Constants.LABEL_COLORS.length];
  },

  getResolvedLabelColor(label, labelColors = {}) {
    if (!label) return Constants.DEFAULT_LABEL_COLOR;
    return labelColors[label] || '';
  },

  async saveLabelColor(label, color) {
    const labelColors = await this.getLabelColors();
    labelColors[label] = color;
    await StorageCore.set({ labelColors });
  },

  async resetLabelColor(label) {
    const labelColors = await this.getLabelColors();
    delete labelColors[label];
    await StorageCore.set({ labelColors });
  }
};
