// Home view controller
const HomeView = {
  async load() {
    const nickname = await Storage.getNickname();
    const notes = await Storage.getNotes();
    const notesArray = Object.values(notes);

    // Welcome message - ALWAYS show
    const welcomeMsg = UI.get('bn-welcome-message');
    welcomeMsg.textContent = `Ada yang mau dicatat hari ini ${nickname}?, catat biar gak nguap`;

    // Summary - show if there are notes
    const summaryDiv = UI.get('bn-summary');
    if (notesArray.length > 0) {
      summaryDiv.style.display = 'block';
      
      // Count unique labels
      const labels = await Storage.getLabels();
      
      // Find last updated note
      const sortedNotes = notesArray.sort((a, b) => b.updatedAt - a.updatedAt);
      const lastNote = sortedNotes[0];
      const lastDateStr = Utils.formatDate(lastNote.updatedAt, 'long');
      
      UI.get('bn-total-notes').textContent = notesArray.length;
      UI.get('bn-total-labels').textContent = labels.length;
      UI.get('bn-last-note').textContent = lastDateStr;
    } else {
      summaryDiv.style.display = 'none';
    }
  }
};
