// Drawer HTML template
const DrawerHTML = `
  <style>
    #bronotes-drawer[data-transparent="true"] {
      background: rgba(255, 255, 255, 0.38) !important;
      box-shadow: none !important;
    }

    #bronotes-drawer[data-transparent="true"] input,
    #bronotes-drawer[data-transparent="true"] textarea,
    #bronotes-drawer[data-transparent="true"] select,
    #bronotes-drawer[data-transparent="true"] #bn-preview-container {
      background: rgba(255, 255, 255, 0.38) !important;
      border-color: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    #bronotes-drawer[data-transparent="true"] #bn-home-view,
    #bronotes-drawer[data-transparent="true"] #bn-labels-view,
    #bronotes-drawer[data-transparent="true"] #bn-settings-view,
    #bronotes-drawer[data-transparent="true"] #bn-notes-list {
      text-shadow: none !important;
    }

    #bronotes-drawer[data-transparent="true"] [style*="border"] {
      border-color: transparent !important;
    }

    #bronotes-drawer[data-transparent="true"] #bn-privacy-panel {
      background: rgba(248, 248, 248, 0.38) !important;
    }

    #bronotes-drawer[data-transparent="true"] #bn-label-autocomplete {
      background: rgba(255, 255, 255, 0.72) !important;
      border-color: transparent !important;
    }

    #bronotes-drawer input:focus,
    #bronotes-drawer textarea:focus,
    #bronotes-drawer select:focus {
      outline: none !important;
      border-color: rgba(42, 42, 42, 0.48) !important;
    }

    #bronotes-drawer[data-transparent="true"] input:focus,
    #bronotes-drawer[data-transparent="true"] textarea:focus,
    #bronotes-drawer[data-transparent="true"] select:focus {
      border-color: rgba(42, 42, 42, 0.62) !important;
    }

    .bn-drawer-brand {
      align-items: center;
      display: flex;
      flex: 1;
      gap: 9px;
      min-width: 0;
    }

    .bn-drawer-brand-icon {
      display: block;
      flex: 0 0 auto;
      height: 24px;
      pointer-events: none;
      width: 24px;
    }

    .bn-drawer-brand-text {
      color: #242424;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
      white-space: nowrap;
    }

    #bronotes-drawer[data-transparent="true"] .bn-drawer-brand-icon {
      opacity: 0.82;
    }

    .bn-home-intro {
      box-sizing: border-box;
      margin: 0 auto 44px auto;
      max-width: 316px;
      padding: 0 2px;
      text-align: left;
      width: 100%;
    }

    .bn-welcome-title {
      color: #242424;
      font-size: 24px;
      font-weight: 750;
      letter-spacing: 0;
      line-height: 1.18;
      margin: 0 0 10px 0;
      overflow-wrap: anywhere;
    }

    .bn-welcome-copy {
      color: #6a6a6a;
      font-size: 13px;
      line-height: 1.55;
      margin: 0 0 20px 0;
      max-width: 292px;
    }

    .bn-new-note-button {
      align-items: center;
      background: #2a2a2a;
      border: none;
      box-sizing: border-box;
      color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      font-family: inherit;
      font-size: 12px;
      font-weight: 650;
      gap: 8px;
      justify-content: center;
      letter-spacing: 0.4px;
      min-height: 38px;
      padding: 10px 16px;
      transition: transform 0.1s ease;
    }

    .bn-new-note-button img {
      display: block;
      height: 16px;
      pointer-events: none;
      width: 16px;
    }

    #bronotes-drawer[data-transparent="true"] .bn-new-note-button {
      background: rgba(42, 42, 42, 0.9) !important;
    }

    .bn-icon-toggle {
      align-items: center;
      background: transparent;
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      flex: 0 0 auto;
      height: 32px;
      justify-content: center;
      padding: 7px;
      transition: transform 0.1s ease, border-color 0.15s ease, background 0.15s ease;
      width: 32px;
    }

    .bn-icon-toggle img {
      display: block;
      height: 16px;
      opacity: 0.62;
      pointer-events: none;
      width: 16px;
    }

    .bn-icon-toggle[data-active="true"] {
      background: rgba(42, 42, 42, 0.05);
      border-color: rgba(42, 42, 42, 0.22);
    }

    .bn-icon-toggle[data-active="true"] img {
      opacity: 0.9;
    }

    .bn-filter-favorite {
      height: 31px;
      width: 34px;
    }

    #bronotes-drawer[data-transparent="true"] .bn-icon-toggle {
      background: rgba(255, 255, 255, 0.18) !important;
      border-color: rgba(255, 255, 255, 0.34) !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-icon-toggle[data-active="true"] {
      background: rgba(255, 255, 255, 0.34) !important;
      border-color: rgba(42, 42, 42, 0.12) !important;
    }

    .bn-summary-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 14px 0;
      color: #2a2a2a;
    }

    .bn-summary-heading-icon {
      width: 17px;
      height: 17px;
      display: block;
      opacity: 0.78;
      pointer-events: none;
    }

    .bn-summary-heading-text {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.7px;
      line-height: 1;
      text-transform: uppercase;
    }

    #bn-summary-panel {
      background: rgba(252, 252, 252, 0.96);
      border: 1px solid #f0f0f0;
      border-radius: 0;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 1.5;
      padding: 8px 12px;
      width: 100%;
    }

    .bn-summary-row {
      align-items: center;
      border-bottom: 1px solid rgba(42, 42, 42, 0.05);
      display: flex;
      gap: 9px;
      min-height: 34px;
    }

    .bn-summary-row:last-child {
      border-bottom: none;
    }

    .bn-summary-dot {
      display: block;
      flex: 0 0 auto;
      height: 14px;
      opacity: 0.54;
      pointer-events: none;
      width: 14px;
    }

    .bn-summary-text {
      align-items: center;
      display: flex;
      flex: 1;
      gap: 12px;
      justify-content: space-between;
      min-width: 0;
    }

    .bn-summary-label {
      color: #6a6a6a;
      flex: 0 0 auto;
      white-space: nowrap;
    }

    .bn-summary-value {
      color: #2a2a2a;
      font-weight: 700;
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: right;
    }

    #bronotes-drawer[data-transparent="true"] #bn-summary-panel {
      background: rgba(255, 255, 255, 0.24) !important;
      border-color: rgba(255, 255, 255, 0.34) !important;
      box-shadow: none !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-summary-row {
      border-color: rgba(42, 42, 42, 0.05) !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-summary-heading-icon,
    #bronotes-drawer[data-transparent="true"] .bn-summary-dot {
      opacity: 0.68;
    }

    #bn-drawer-ribbon {
      position: absolute;
      top: 76px;
      left: -44px;
      width: 44px;
      height: 44px;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #e8e8e8;
      border-right: none;
      box-sizing: border-box;
    }

    #bronotes-drawer[data-collapsed="true"] #bn-drawer-ribbon {
      display: flex;
    }
  </style>
  <div id="bn-drawer-ribbon">
    <button id="bn-btn-open-panel" title="open panel" aria-label="open panel" style="width: 100%; height: 100%; padding: 10px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;" onmousedown="this.style.transform='scale(0.94)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
      <img src="${chrome.runtime.getURL('icons/panel-left-close.png')}" alt="" style="width: 20px; height: 20px; display: block; pointer-events: none;" />
    </button>
  </div>
  <div style="padding: 20px 24px 16px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e8e8e8;">
    <div class="bn-drawer-brand">
      <img class="bn-drawer-brand-icon" src="${chrome.runtime.getURL('icons/icon32.png')}" alt="" />
      <div class="bn-drawer-brand-text">Brow Notes</div>
    </div>
    <button id="bn-btn-transparency" title="toggle transparency" aria-label="toggle transparency" aria-pressed="false" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;" onmousedown="this.style.transform='scale(0.94)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
      <img id="bn-transparency-icon" src="${chrome.runtime.getURL('icons/eye.png')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
    <button id="bn-btn-close" title="close panel" aria-label="close panel" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;" onmousedown="this.style.transform='scale(0.94)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
      <img src="${chrome.runtime.getURL('icons/panel-right-close.png')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
  </div>
  
  <div id="bn-home-view" style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; overflow-y: auto; padding: 42px 30px 26px 30px;">
    <div class="bn-home-intro">
      <h2 id="bn-welcome-message" class="bn-welcome-title">Welcome back, Brow 👋</h2>
      <p class="bn-welcome-copy">Let's turn today's scattered thoughts into tomorrow's clear plans.</p>
      <button id="bn-btn-new-note" class="bn-new-note-button" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
        <img src="${chrome.runtime.getURL('icons/new-notes.png')}" alt="" />
        <span>New Note</span>
      </button>
    </div>
    <div id="bn-summary" style="display: none; width: 100%;">
      <h3 class="bn-summary-heading">
        <img class="bn-summary-heading-icon" src="${chrome.runtime.getURL('icons/summary.png')}" alt="" />
        <span class="bn-summary-heading-text">summary</span>
      </h3>
      <div id="bn-summary-panel">
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.png')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">total notes</span><span id="bn-total-notes" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.png')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">total labels</span><span id="bn-total-labels" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.png')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">favorite notes</span><span id="bn-total-favorites" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.png')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">last note</span><span id="bn-last-note" class="bn-summary-value">-</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.png')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">last backup</span><span id="bn-last-backup" class="bn-summary-value">never</span></div>
        </div>
      </div>
    </div>
    <div id="bn-quote-card" style="display: none; width: 100%; margin-top: 74px; padding: 0 4px; box-sizing: border-box; text-align: center;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; color: #6a6a6a; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase;">
        <img src="${chrome.runtime.getURL('icons/quotes.png')}" alt="" style="width: 14px; height: 14px; opacity: 0.62; pointer-events: none;" />
        <span>daily note spark</span>
      </div>
      <div id="bn-quote-text" style="font-size: 16px; line-height: 1.65; color: #686868; font-weight: 600; font-style: italic; margin: 0 auto 10px auto; max-width: 340px;"></div>
      <div id="bn-quote-author" style="font-size: 11px; color: #7a7a7a; text-align: center;"></div>
    </div>
  </div>
  
  <div id="bn-allnotes-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden;">
    <div style="padding: 16px 24px;">
      <input id="bn-search" type="text" placeholder="search..." style="width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #2a2a2a; outline: none; margin-bottom: 12px; box-sizing: border-box;" />
      <div style="display: flex; gap: 12px; font-size: 11px;">
        <select id="bn-filter-label" style="flex: 1; min-width: 0; padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><option value="">all labels</option></select>
        <select id="bn-sort" style="padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><option value="updated-desc">latest</option><option value="updated-asc">oldest</option><option value="created-desc">newest</option><option value="created-asc">first</option></select>
        <button id="bn-filter-favorite" class="bn-icon-toggle bn-filter-favorite" type="button" title="show favorite notes" aria-label="show favorite notes" aria-pressed="false" data-active="false" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/bookmark.png')}" alt="" /></button>
      </div>
    </div>
    <div id="bn-notes-list" style="flex: 1; overflow-y: auto; padding: 0 24px 80px 24px;"></div>
    <button id="bn-fab-new" title="new note" aria-label="new note" style="position: absolute; bottom: 100px; right: 24px; width: 52px; height: 52px; border-radius: 0; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; padding: 14px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/new-notes.png')}" alt="" style="width: 20px; height: 20px; display: block; pointer-events: none;" /></button>
  </div>
  
  <div id="bn-editor-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden;">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e8e8e8;"><button id="bn-btn-back" style="padding: 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">← back</button></div>
    <div style="padding: 16px 24px 0 24px;"><input id="bn-note-title" type="text" placeholder="note title..." style="width: 100%; padding: 12px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 16px; font-family: inherit; font-weight: 600; color: #2a2a2a; outline: none; box-sizing: border-box;" /></div>
    <div style="padding: 12px 24px 0 24px; position: relative;"><div style="display: flex; align-items: center; gap: 10px;"><input id="bn-note-label" type="text" placeholder="label..." autocomplete="off" style="flex: 1; min-width: 0; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #6a6a6a; outline: none; box-sizing: border-box;" /><button id="bn-note-favorite" class="bn-icon-toggle" type="button" title="favorite note" aria-label="favorite note" aria-pressed="false" data-active="false" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/bookmark.png')}" alt="" /></button></div><div id="bn-label-autocomplete" style="display: none; position: absolute; left: 24px; right: 66px; top: 44px; z-index: 12; background: #ffffff; border: 1px solid #e8e8e8; max-height: 152px; overflow-y: auto; box-sizing: border-box;"></div></div>
    <div style="padding: 12px 24px; display: flex; gap: 16px;">
      <button id="bn-tab-edit" style="padding: 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">edit</button>
      <button id="bn-tab-preview" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">preview</button>
    </div>
    <div id="bn-editor-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;"><textarea id="bn-editor" placeholder="start typing..." style="flex: 1; width: 100%; padding: 12px 24px 24px 24px; border: none; outline: none; resize: none; background: transparent; font-family: inherit; font-size: 13px; line-height: 1.7; color: #2a2a2a; overflow-y: auto; box-sizing: border-box;"></textarea></div>
    <div id="bn-preview-container" style="flex: 1; padding: 12px 24px 24px 24px; overflow-y: auto; display: none; font-size: 13px; line-height: 1.7;"></div>
    <div style="padding: 16px 24px; border-top: 1px solid #e8e8e8; display: flex; gap: 12px;">
      <button id="bn-btn-save" style="flex: 1; padding: 10px; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 6px;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">save</button>
      <button id="bn-btn-delete" style="padding: 10px 16px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 12px; font-family: inherit; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">delete</button>
    </div>
  </div>
  
  <div id="bn-labels-view" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">manage labels</h3>
    <div id="bn-labels-list" style="margin-bottom: 24px;"></div>
    <button id="bn-btn-add-label" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">+ add label</button>
  </div>
  
  <div id="bn-settings-view" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">personal</h3>
    <div style="margin-bottom: 24px;"><label style="display: block; margin-bottom: 8px; font-size: 11px; color: #6a6a6a; letter-spacing: 0.5px;">nama panggilan</label><input id="bn-nickname" type="text" placeholder="Brow" style="width: 100%; padding: 8px 12px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 12px; outline: none; box-sizing: border-box;" /></div>
    <h3 style="margin: 24px 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">data</h3>
    <button id="bn-btn-export" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; margin-bottom: 12px; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">export all notes</button>
    <button id="bn-btn-import" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">import notes</button>
    <input type="file" id="bn-import-file" accept=".json" style="display: none;">
    <div id="bn-privacy-panel" style="margin-top: 24px; padding: 12px; background: #f8f8f8; border-radius: 4px; font-size: 11px; color: #6a6a6a; line-height: 1.6;"><strong>privacy:</strong> all notes stored locally. no data sent to servers.</div>
  </div>
  
  <div style="padding: 12px 18px; border-top: 1px solid #e8e8e8; display: flex; justify-content: space-between; gap: 8px;">
    <button id="bn-nav-home" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/home.png')}" alt="" style="width: 18px; height: 18px; opacity: 1; pointer-events: none;" /><span>HOME</span></button>
    <button id="bn-nav-allnotes" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/allnotes.png')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>ALL NOTES</span></button>
    <button id="bn-nav-labels" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/label.png')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>LABELS</span></button>
    <button id="bn-nav-settings" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><img src="${chrome.runtime.getURL('icons/settings.png')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>SETTINGS</span></button>
  </div>
`;
