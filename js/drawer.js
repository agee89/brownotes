// Drawer HTML template
const DrawerHTML = `
  <div style="padding: 20px 24px 16px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e8e8e8;">
    <div style="flex: 1; font-size: 13px; color: #6a6a6a; letter-spacing: 0.5px;">bro notes</div>
    <button id="bn-btn-close" style="padding: 4px 8px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; font-size: 16px; line-height: 1; opacity: 0.6; transition: transform 0.1s ease, opacity 0.2s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">×</button>
  </div>
  
  <div id="bn-home-view" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow-y: auto; padding: 24px;">
    <div style="text-align: center; margin-bottom: 32px; width: 100%;">
      <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
      <div id="bn-welcome-message" style="font-size: 13px; line-height: 1.6; color: #6a6a6a; margin-bottom: 24px;"></div>
      <button id="bn-btn-new-note" style="padding: 12px 24px; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">buat catatan</button>
    </div>
    <div id="bn-summary" style="display: none; width: 100%;">
      <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">summary</h3>
      <div style="background: #f8f8f8; padding: 16px; border-radius: 4px; font-size: 12px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #6a6a6a;">total catatan:</span><span id="bn-total-notes" style="font-weight: 600;">0</span></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #6a6a6a;">total label:</span><span id="bn-total-labels" style="font-weight: 600;">0</span></div>
        <div style="display: flex; justify-content: space-between;"><span style="color: #6a6a6a;">terakhir mencatat:</span><span id="bn-last-note" style="font-weight: 600;">-</span></div>
      </div>
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
    <div style="padding: 12px 24px 0 24px;"><input id="bn-note-label" type="text" placeholder="label..." list="bn-label-suggestions" style="width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #6a6a6a; outline: none; box-sizing: border-box;" /><datalist id="bn-label-suggestions"></datalist></div>
    <div style="padding: 12px 24px; display: flex; gap: 16px;">
      <button id="bn-tab-edit" style="padding: 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">edit</button>
      <button id="bn-tab-preview" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">preview</button>
    </div>
    <div id="bn-editor-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;"><textarea id="bn-editor" placeholder="start typing..." style="flex: 1; width: 100%; padding: 0 24px 24px 24px; border: none; outline: none; resize: none; background: transparent; font-family: inherit; font-size: 13px; line-height: 1.7; color: #2a2a2a; overflow-y: auto; box-sizing: border-box;"></textarea></div>
    <div id="bn-preview-container" style="flex: 1; padding: 0 24px 24px 24px; overflow-y: auto; display: none; font-size: 13px; line-height: 1.7;"></div>
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
    <div style="margin-top: 24px; padding: 12px; background: #f8f8f8; border-radius: 4px; font-size: 11px; color: #6a6a6a; line-height: 1.6;"><strong>privacy:</strong> all notes stored locally. no data sent to servers.</div>
  </div>
  
  <div style="padding: 16px 24px; border-top: 1px solid #e8e8e8; display: flex; justify-content: center; gap: 20px;">
    <button id="bn-nav-home" style="padding: 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">home</button>
    <button id="bn-nav-allnotes" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">all notes</button>
    <button id="bn-nav-labels" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">labels</button>
    <button id="bn-nav-settings" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 4px; transition: transform 0.1s ease;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'" onmouseleave="this.style.transform='scale(1)'">settings</button>
  </div>
`;
