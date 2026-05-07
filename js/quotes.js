// Quotes module - loads and parses Quote.md
const Quotes = {
  items: null,

  async load() {
    if (this.items) return this.items;

    try {
      const response = await fetch(chrome.runtime.getURL('Quote.md'));
      const markdown = await response.text();
      this.items = this.parse(markdown);
    } catch (error) {
      console.error('Brow Notes: Error loading quotes:', error);
      this.items = [];
    }

    return this.items;
  },

  parse(markdown) {
    return markdown
      .split('\n')
      .map(line => line.trim())
      .map(line => {
        const match = line.match(/^\d+\.\s+\*\*(.*?)\*\*(?:\s+\((.*?)\))?\s+[–-]\s+\*"([^"]+)"\*(?:\s+\*\((.*?)\)\*)?/);
        if (!match) return null;

        return {
          author: [match[1], match[2] ? `(${match[2]})` : ''].filter(Boolean).join(' ').trim(),
          text: match[3].trim(),
          source: (match[4] || '').trim()
        };
      })
      .filter(Boolean);
  },

  async random() {
    const quotes = await this.load();
    if (quotes.length === 0) return null;

    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }
};
