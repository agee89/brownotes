// Core storage operations
const StorageCore = {
  contextWarningShown: false,
  contextInvalidated: false,

  isContextAvailable() {
    try {
      const available = typeof chrome !== 'undefined' &&
        !!chrome.runtime?.id &&
        !!chrome.storage?.local;

      if (!available) {
        this.warnContextInvalidated();
      }

      return available;
    } catch (error) {
      this.warnContextInvalidated(error);
      return false;
    }
  },

  warnContextInvalidated(error) {
    this.contextInvalidated = true;
    if (this.contextWarningShown) return;
    this.contextWarningShown = true;
    console.warn('Brow Notes: Extension context invalidated. Reload this page to reconnect the extension.', error);
  },

  hasContextIssue() {
    return this.contextInvalidated || !this.isContextAvailable();
  },

  getLastError() {
    try {
      return chrome.runtime?.lastError || null;
    } catch (error) {
      return error;
    }
  },

  get(keys) {
    return new Promise((resolve) => {
      if (!this.isContextAvailable()) {
        resolve({});
        return;
      }

      try {
        chrome.storage.local.get(keys, (result) => {
          const error = this.getLastError();
          if (error) {
            this.warnContextInvalidated(error);
            resolve({});
            return;
          }

          resolve(result || {});
        });
      } catch (error) {
        this.warnContextInvalidated(error);
        resolve({});
      }
    });
  },

  set(data) {
    return new Promise((resolve) => {
      if (!this.isContextAvailable()) {
        resolve(false);
        return;
      }

      try {
        chrome.storage.local.set(data, () => {
          const error = this.getLastError();
          if (error) {
            this.warnContextInvalidated(error);
            resolve(false);
            return;
          }

          resolve(true);
        });
      } catch (error) {
        this.warnContextInvalidated(error);
        resolve(false);
      }
    });
  }
};
