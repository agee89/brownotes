// Drawer HTML component helpers
const DrawerHelpers = {
  renderEditorHeader() {
    return `
      <div style="padding: 16px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e8e8e8;">
        <div style="flex: 1; min-width: 0;"><button id="bn-btn-back" type="button" style="padding: 8px 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;">← back</button></div>
      </div>
    `;
  },

  renderEditorToolbar() {
    const buttons = [
      { action: 'bold', title: 'bold', icon: 'bold.svg' },
      { action: 'italic', title: 'italic', icon: 'italic.svg' },
      { action: 'link', title: 'link', icon: 'link.svg' },
      { action: 'bullet-list', title: 'bulleted list', icon: 'list-bullets.svg' },
      { action: 'number-list', title: 'numbered list', icon: 'list-numbers.svg' },
      { action: 'checklist', title: 'checklist', icon: 'checklist.svg' },
      { action: 'h1', title: 'heading 1', icon: 'h1.svg' },
      { action: 'h2', title: 'heading 2', icon: 'h2.svg' },
      { action: 'code', title: 'inline code', icon: 'code.svg' },
      { action: 'code-block', title: 'code block', icon: 'code-block.svg' },
      { action: 'quote', title: 'quote', icon: 'quotes.svg' },
      { action: 'line', title: 'horizontal line', icon: 'line.svg' },
      { action: 'table', title: 'table', icon: 'table.svg' },
      { action: 'image', title: 'image', icon: 'image.svg' },
      { action: 'strikethrough', title: 'strikethrough', icon: 'strikethrough.svg' }
    ];

    const buttonHtml = buttons.map(btn => 
      `<button class="bn-toolbar-button" type="button" title="${btn.title}" aria-label="${btn.title}" data-md-action="${btn.action}"><img src="${chrome.runtime.getURL('icons/toolbar/' + btn.icon)}" alt="" /></button>`
    ).join('');

    return `
      <div id="bn-editor-toolbar" class="bn-editor-toolbar" aria-label="markdown toolbar">
        ${buttonHtml}
        <button id="bn-toolbar-template" class="bn-toolbar-button bn-toolbar-template" type="button" title="insert template" aria-label="insert template" data-md-action="template"><img src="${chrome.runtime.getURL('icons/toolbar/preset.svg')}" alt="" /></button>
      </div>
    `;
  },

  renderEditorActions() {
    return `
      <div style="padding: 12px 24px; display: flex; align-items: center; gap: 16px;">
        <button id="bn-tab-edit" type="button" style="padding: 8px 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: inline-flex; align-items: center; gap: 7px;"><img src="${chrome.runtime.getURL('icons/write.png')}" alt="" style="width: 13px; height: 13px; display: block; opacity: 0.72; pointer-events: none;" /><span>edit</span></button>
        <button id="bn-tab-preview" type="button" style="padding: 8px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: inline-flex; align-items: center; gap: 7px;"><img src="${chrome.runtime.getURL('icons/markdown-view.png')}" alt="" style="width: 13px; height: 13px; display: block; opacity: 0.45; pointer-events: none;" /><span>preview</span></button>
        <button id="bn-btn-export-md" type="button" style="margin-left: auto; padding: 8px 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease, opacity 0.15s ease; display: inline-flex; align-items: center; gap: 7px; opacity: 0.45;"><img src="${chrome.runtime.getURL('icons/export-md.png')}" alt="" style="width: 13px; height: 13px; display: block; opacity: 0.72; pointer-events: none;" /><span>export</span></button>
        <button id="bn-btn-print-note" type="button" style="padding: 8px 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease, opacity 0.15s ease; display: none; align-items: center; gap: 7px; opacity: 0.45;"><img src="${chrome.runtime.getURL('icons/print.svg')}" alt="" style="width: 13px; height: 13px; display: block; opacity: 0.72; pointer-events: none;" /><span>print</span></button>
        <button id="bn-btn-save" type="button" disabled style="padding: 8px 12px; background: transparent; color: #2a2a2a; border: 1px solid #2a2a2a; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease, opacity 0.15s ease;">save</button>
        <button id="bn-btn-delete" type="button" style="padding: 8px 12px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: none;">delete</button>
      </div>
    `;
  }
};
