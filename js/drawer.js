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

    #bronotes-drawer[data-transparent="true"] #bn-summary-panel,
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
    <div style="flex: 1; font-size: 13px; color: #6a6a6a; letter-spacing: 0.5px;">bro notes</div>
    <button id="bn-btn-transparency" title="toggle transparency" aria-label="toggle transparency" aria-pressed="false" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;" onmousedown="this.style.transform='scale(0.94)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
      <img id="bn-transparency-icon" src="${chrome.runtime.getURL('icons/eye.png')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
    <button id="bn-btn-close" title="close panel" aria-label="close panel" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;" onmousedown="this.style.transform='scale(0.94)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">
      <img src="${chrome.runtime.getURL('icons/panel-right-close.png')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
  </div>
  
  <div id="bn-home-view" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow-y: auto; padding: 24px;">
    <div style="text-align: center; margin-bottom: 32px; width: 100%;">
      <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
      <div id="bn-welcome-message" style="font-size: 13px; line-height: 1.6; color: #6a6a6a; margin-bottom: 24px;"></div>
      <button id="bn-btn-new-note" style="padding: 12px 24px; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">buat catatan</button>
    </div>
    <div id="bn-summary" style="display: none; width: 100%;">
      <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">summary</h3>
      <div id="bn-summary-panel" style="background: #f8f8f8; padding: 16px; border-radius: 4px; font-size: 12px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #6a6a6a;">total catatan:</span><span id="bn-total-notes" style="font-weight: 600;">0</span></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #6a6a6a;">total label:</span><span id="bn-total-labels" style="font-weight: 600;">0</span></div>
        <div style="display: flex; justify-content: space-between;"><span style="color: #6a6a6a;">terakhir mencatat:</span><span id="bn-last-note" style="font-weight: 600;">-</span></div>
      </div>
    </div>
    <div id="bn-quote-card" style="display: none; width: 100%; margin-top: 44px; padding: 0 4px; box-sizing: border-box; text-align: center;">
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
        <select id="bn-filter-label" style="flex: 1; padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><option value="">all labels</option></select>
        <select id="bn-sort" style="padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'"><option value="updated-desc">latest</option><option value="updated-asc">oldest</option><option value="created-desc">newest</option><option value="created-asc">first</option></select>
      </div>
    </div>
    <div id="bn-notes-list" style="flex: 1; overflow-y: auto; padding: 0 24px 80px 24px;"></div>
    <button id="bn-fab-new" style="position: absolute; bottom: 80px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">+</button>
  </div>
  
  <div id="bn-editor-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden;">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e8e8e8;"><button id="bn-btn-back" style="padding: 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">← back</button></div>
    <div style="padding: 16px 24px 0 24px;"><input id="bn-note-title" type="text" placeholder="note title..." style="width: 100%; padding: 12px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 16px; font-family: inherit; font-weight: 600; color: #2a2a2a; outline: none; box-sizing: border-box;" /></div>
    <div style="padding: 12px 24px 0 24px; position: relative;"><input id="bn-note-label" type="text" placeholder="label..." autocomplete="off" style="width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #6a6a6a; outline: none; box-sizing: border-box;" /><div id="bn-label-autocomplete" style="display: none; position: absolute; left: 24px; right: 24px; top: 44px; z-index: 12; background: #ffffff; border: 1px solid #e8e8e8; max-height: 152px; overflow-y: auto; box-sizing: border-box;"></div></div>
    <div style="padding: 12px 24px; display: flex; gap: 16px;">
      <button id="bn-tab-edit" style="padding: 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">edit</button>
      <button id="bn-tab-preview" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">preview</button>
    </div>
    <div id="bn-editor-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;"><textarea id="bn-editor" placeholder="start typing..." style="flex: 1; width: 100%; padding: 12px 24px 24px 24px; border: none; outline: none; resize: none; background: transparent; font-family: inherit; font-size: 13px; line-height: 1.7; color: #2a2a2a; overflow-y: auto; box-sizing: border-box;"></textarea></div>
    <div id="bn-preview-container" style="flex: 1; padding: 12px 24px 24px 24px; overflow-y: auto; display: none; font-size: 13px; line-height: 1.7;"></div>
    <div style="padding: 16px 24px; border-top: 1px solid #e8e8e8; display: flex; gap: 12px;">
      <button id="bn-btn-save" style="flex: 1; padding: 10px; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">save</button>
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
    <div style="margin-bottom: 24px;"><label style="display: block; margin-bottom: 8px; font-size: 11px; color: #6a6a6a; letter-spacing: 0.5px;">nama panggilan</label><input id="bn-nickname" type="text" placeholder="bro" style="width: 100%; padding: 8px 12px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 12px; outline: none; box-sizing: border-box;" /></div>
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
