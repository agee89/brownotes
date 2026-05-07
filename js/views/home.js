// Home view controller
const HomeView = {
  async load() {
    const nickname = await Storage.getNickname();
    const displayName = String(nickname || '').trim() || 'Brow';
    const notes = await Storage.getNotes();
    const notesArray = Object.values(notes);

    // Welcome message - ALWAYS show
    const welcomeMsg = UI.get('bn-welcome-message');
    welcomeMsg.textContent = `Welcome back, ${displayName} 👋`;

    // Summary - show if there are notes
    const summaryDiv = UI.get('bn-summary');
    const labels = await Storage.getLabels();
    const lastBackupAt = await Storage.getLastBackupAt();
    if (notesArray.length > 0 || lastBackupAt) {
      summaryDiv.style.display = 'block';
      const favoriteNotes = notesArray.filter(note => !!note.favorite).length;
      let lastDateStr = '-';

      if (notesArray.length > 0) {
        // Find last updated note
        const sortedNotes = notesArray.sort((a, b) => b.updatedAt - a.updatedAt);
        const lastNote = sortedNotes[0];
        lastDateStr = Utils.formatDate(lastNote.updatedAt, 'long');
      }
      
      UI.get('bn-total-notes').textContent = notesArray.length;
      UI.get('bn-total-labels').textContent = labels.length;
      UI.get('bn-total-favorites').textContent = favoriteNotes;
      UI.get('bn-last-note').textContent = lastDateStr;
      UI.get('bn-last-backup').textContent = lastBackupAt ? Utils.formatDate(lastBackupAt, 'datetime') : 'never';
    } else {
      summaryDiv.style.display = 'none';
    }

    await this.loadQuote();
  },

  async loadQuote() {
    const quoteCard = UI.get('bn-quote-card');
    const quoteText = UI.get('bn-quote-text');
    const quoteAuthor = UI.get('bn-quote-author');
    if (!quoteCard || !quoteText || !quoteAuthor || typeof Quotes === 'undefined') return;

    const quote = await Quotes.random();
    if (!quote) {
      quoteCard.style.display = 'none';
      return;
    }

    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = quote.source ? `${quote.author} · ${quote.source}` : quote.author;
    quoteCard.style.display = 'block';
  }
};
