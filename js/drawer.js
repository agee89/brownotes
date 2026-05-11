// Drawer HTML template
const DrawerHTML = `
  <style>
    @keyframes drawer-shake {
      0%, 100% { transform: translateX(0); }
      10%, 50%, 90% { transform: translateX(-3px); }
      30%, 70% { transform: translateX(3px); }
    }

    #bronotes-drawer.animate-drawer-shake {
      animation: drawer-shake 0.4s ease-in-out;
    }

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
    #bronotes-drawer[data-transparent="true"] #bn-trash-view,
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

    #bronotes-drawer[data-transparent="true"] #bn-note-link-autocomplete {
      background: rgba(255, 255, 255, 0.72) !important;
      border-color: transparent !important;
    }

    #bronotes-drawer[data-transparent="true"] #bn-editor-search {
      background: rgba(255, 255, 255, 0.34) !important;
      border-color: rgba(42, 42, 42, 0.16) !important;
      color: #2a2a2a !important;
    }

    #bronotes-drawer[data-transparent="true"] textarea#bn-editor {
      background: transparent !important;
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

    #bronotes-drawer select {
      -webkit-appearance: none !important;
      appearance: none !important;
      background-image: url("${chrome.runtime.getURL('icons/down.svg')}") !important;
      background-position: right 10px center !important;
      background-repeat: no-repeat !important;
      background-size: 10px 10px !important;
      padding-right: 28px !important;
    }

    #bronotes-drawer[data-transparent="true"] select {
      background-image: url("${chrome.runtime.getURL('icons/down.svg')}") !important;
      background-position: right 10px center !important;
      background-repeat: no-repeat !important;
      background-size: 10px 10px !important;
    }

    #bn-editor-shell {
      background: #f7f7f7;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      position: relative;
    }

    #bn-editor-highlight,
    #bn-editor {
      border: none !important;
      font-family: inherit !important;
      font-size: 13px !important;
      height: 100% !important;
      letter-spacing: 0 !important;
      line-height: 1.7 !important;
      margin: 0 !important;
      overflow-wrap: break-word !important;
      padding: 12px 24px 8px 24px !important;
      scrollbar-gutter: stable !important;
      tab-size: 4 !important;
      white-space: pre-wrap !important;
      width: 100% !important;
      word-break: normal !important;
      box-sizing: border-box !important;
    }

    #bn-editor-highlight {
      color: transparent !important;
      inset: 0;
      overflow: auto;
      pointer-events: none;
      position: absolute;
      z-index: 1;
    }

    #bn-editor-highlight * {
      color: transparent !important;
    }

    #bn-editor {
      background: transparent !important;
      caret-color: #2a2a2a;
      color: #2a2a2a;
      overflow-y: auto !important;
      position: relative;
      resize: none !important;
      z-index: 2;
    }

    .bn-search-highlight {
      background: rgba(255, 217, 102, 0.58);
      border-radius: 2px;
      box-shadow: 0 0 0 1px rgba(214, 168, 0, 0.12);
    }

    .bn-search-highlight-current {
      background: rgba(255, 177, 66, 0.78);
      box-shadow: 0 0 0 1px rgba(180, 111, 0, 0.24);
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

    .bn-icon-toggle:disabled {
      cursor: not-allowed;
      opacity: 0.38;
    }

    .bn-icon-toggle:disabled img {
      opacity: 0.42;
    }

    .bn-filter-favorite,
    .bn-filter-reset {
      height: 31px;
      width: 34px;
    }

    .bn-editor-toolbar {
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex: 0 0 auto;
      gap: 1px;
      justify-content: flex-start;
      min-width: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      padding: 0 24px 8px 24px;
    }

    .bn-toolbar-button {
      align-items: center;
      background: transparent;
      border: none;
      box-sizing: border-box;
      color: #2a2a2a;
      cursor: pointer;
      display: inline-flex;
      flex: 0 0 auto;
      height: 22px;
      justify-content: center;
      padding: 0;
      transition: transform 0.1s ease, opacity 0.15s ease, background 0.15s ease;
      width: 20px;
    }

    .bn-toolbar-button:hover {
      background: rgba(42, 42, 42, 0.05);
    }

    .bn-toolbar-button img {
      display: block;
      height: 12px;
      opacity: 0.72;
      pointer-events: none;
      width: 12px;
    }

    .bn-toolbar-template {
      margin-left: auto;
    }

    .bn-toolbar-text-icon {
      color: #2a2a2a;
      font-size: 13px;
      font-weight: 800;
      line-height: 1;
      pointer-events: none;
    }

    .bn-code-block {
      margin: 12px 0;
      position: relative;
    }

    .bn-code-block pre {
      background: rgba(42, 42, 42, 0.025) !important;
      border: 1px solid rgba(42, 42, 42, 0.12) !important;
      box-sizing: border-box;
      color: #2a2a2a !important;
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
      overflow-x: visible;
      padding: 12px 12px 34px 12px !important;
      text-shadow: none !important;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bn-code-block code {
      background: transparent !important;
      color: inherit !important;
      font-family: inherit;
      text-shadow: none !important;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bn-copy-code {
      align-items: center;
      background: transparent !important;
      border: 1px solid rgba(42, 42, 42, 0.18) !important;
      color: #6a6a6a !important;
      cursor: pointer;
      display: inline-flex;
      font-family: inherit;
      font-size: 10px;
      justify-content: center;
      padding: 4px 7px;
      position: absolute;
      right: 8px;
      text-shadow: none !important;
      top: 8px;
    }

    .bn-code-block-actions {
      display: contents;
    }

    .bn-history-wrap {
      left: 50%;
      pointer-events: auto;
      position: absolute;
      top: 46%;
      transform: translate(-50%, -50%);
      z-index: 50;
    }

    .bn-history-button {
      align-items: center;
      background: #ffffff !important;
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      color: #7a7a7a;
      cursor: pointer;
      display: inline-flex;
      font-family: inherit;
      font-size: 10px;
      gap: 5px;
      height: 24px;
      justify-content: center;
      min-width: 96px;
      padding: 4px 10px;
      white-space: nowrap;
    }

    .bn-history-button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .bn-history-menu {
      background: #ffffff !important;
      border: 1px solid #e8e8e8;
      bottom: 30px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      box-sizing: border-box;
      display: none;
      max-height: 188px;
      min-width: 190px;
      overflow-y: auto !important;
      overscroll-behavior: contain;
      pointer-events: auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 60;
    }

    .bn-history-option {
      background: #ffffff !important;
      border: none;
      border-bottom: 1px solid #f0f0f0;
      box-sizing: border-box;
      color: #4a4a4a;
      cursor: pointer;
      display: block;
      font-family: inherit;
      padding: 8px 10px;
      text-align: left;
      width: 100%;
    }

    .bn-history-option:hover {
      background: #f7f7f7 !important;
    }

    .bn-history-time {
      color: #6a6a6a;
      display: block;
      font-size: 10px;
      line-height: 1.3;
      margin-bottom: 3px;
    }

    .bn-history-preview {
      color: #9a9a9a;
      display: block;
      font-size: 10px;
      line-height: 1.35;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .bn-template-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-height: 360px;
      overflow-y: auto;
      padding-right: 2px;
    }

    .bn-template-card {
      background: transparent;
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      color: #2a2a2a;
      cursor: pointer;
      font-family: inherit;
      min-height: 66px;
      padding: 10px;
      text-align: left;
    }

    .bn-template-card:hover {
      background: rgba(42, 42, 42, 0.04);
    }

    .bn-template-name {
      display: block;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.35;
      margin-bottom: 5px;
    }

    .bn-template-category {
      color: #9a9a9a;
      display: block;
      font-size: 10px;
      line-height: 1.3;
    }

    #bronotes-drawer[data-transparent="true"] .bn-icon-toggle {
      background: rgba(255, 255, 255, 0.18) !important;
      border-color: rgba(255, 255, 255, 0.34) !important;
    }

    #bronotes-drawer[data-transparent="true"] #bn-editor-shell {
      background: rgba(255, 255, 255, 0.18) !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-code-block pre {
      background: rgba(255, 255, 255, 0.16) !important;
      border-color: rgba(42, 42, 42, 0.14) !important;
      box-shadow: none !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-copy-code {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(42, 42, 42, 0.16) !important;
      color: #5a5a5a !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-history-button,
    #bronotes-drawer[data-transparent="true"] .bn-history-menu {
      background: #ffffff !important;
      border-color: rgba(42, 42, 42, 0.14) !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-history-option {
      background: #ffffff !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-template-card {
      background: rgba(255, 255, 255, 0.34) !important;
      border-color: rgba(42, 42, 42, 0.14) !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-icon-toggle[data-active="true"] {
      background: rgba(255, 255, 255, 0.34) !important;
      border-color: rgba(42, 42, 42, 0.12) !important;
    }

    .bn-trash-restore {
      background: #ffffff !important;
      border: 1px solid #2a2a2a !important;
      color: #2a2a2a !important;
    }

    .bn-trash-delete {
      background: transparent !important;
      border: 1px solid #dc3545 !important;
      color: #dc3545 !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-trash-restore {
      background: rgba(255, 255, 255, 0.22) !important;
      border-color: rgba(42, 42, 42, 0.58) !important;
      color: #2a2a2a !important;
    }

    #bronotes-drawer[data-transparent="true"] .bn-trash-delete {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(220, 53, 69, 0.58) !important;
      color: #b72838 !important;
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
      top: 88px;
      left: -42px;
      width: 42px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid #dedede;
      border-right: none;
      box-sizing: border-box;
      z-index: 1;
    }

    #bn-drawer-ribbon button {
      align-items: center;
      background: transparent;
      border: none;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      height: 100%;
      justify-content: center;
      padding: 0;
      transition: background 0.15s ease, transform 0.1s ease;
      width: 100%;
    }

    #bn-drawer-ribbon button:hover {
      background: rgba(42, 42, 42, 0.04);
    }

    #bn-drawer-ribbon img {
      display: block;
      height: 18px;
      opacity: 0.78;
      pointer-events: none;
      width: 18px;
    }

    #bronotes-drawer[data-transparent="true"] #bn-drawer-ribbon {
      background: rgba(255, 255, 255, 0.34) !important;
      border-color: rgba(255, 255, 255, 0.42) !important;
    }

    #bronotes-drawer[data-theme="dark"] {
      background: #181818 !important;
      color: #e8e8e8 !important;
      box-shadow: -1px 0 0 #303030 !important;
    }

    #bronotes-drawer[data-theme="dark"] * {
      border-color: #333333 !important;
      color: #e8e8e8 !important;
    }

    #bronotes-drawer[data-theme="dark"] input,
    #bronotes-drawer[data-theme="dark"] textarea,
    #bronotes-drawer[data-theme="dark"] select,
    #bronotes-drawer[data-theme="dark"] #bn-preview-container,
    #bronotes-drawer[data-theme="dark"] #bn-privacy-panel,
    #bronotes-drawer[data-theme="dark"] #bn-summary-panel,
    #bronotes-drawer[data-theme="dark"] #bn-label-autocomplete,
    #bronotes-drawer[data-theme="dark"] #bn-note-link-autocomplete {
      background: #202020 !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"] button {
      background: transparent !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-editor-toolbar {
      border-color: #303030 !important;
    }

    #bronotes-drawer[data-theme="dark"] #bn-editor-shell {
      background: #1d1d1d !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-toolbar-button:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-toolbar-button img {
      filter: invert(1);
      opacity: 0.78;
    }

    #bronotes-drawer[data-theme="dark"] img[src$=".svg"] {
      filter: invert(1);
    }

    #bronotes-drawer[data-theme="dark"] #bn-theme-icon {
      filter: none !important;
    }

    #bronotes-drawer[data-theme="dark"] #bn-btn-context img {
      filter: invert(1);
      opacity: 0.78;
    }

    #bronotes-drawer[data-theme="dark"] #bn-btn-print-note img {
      filter: invert(1);
      opacity: 0.78;
    }

    #bronotes-drawer[data-theme="dark"] .bn-toolbar-text-icon {
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"] #bn-editor {
      background: transparent !important;
      caret-color: #f1f1f1 !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] textarea#bn-editor,
    #bronotes-drawer[data-theme="dark"] textarea#bn-editor {
      background: transparent !important;
    }

    #bronotes-drawer[data-theme="dark"] #bn-editor-search {
      background: #202020 !important;
      border-color: #3a3a3a !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-code-block pre {
      background: rgba(255, 255, 255, 0.035) !important;
      border-color: rgba(255, 255, 255, 0.14) !important;
      color: #e8e8e8 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-copy-code {
      background: transparent !important;
      border-color: rgba(255, 255, 255, 0.18) !important;
      color: #c7c7c7 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-history-button,
    #bronotes-drawer[data-theme="dark"] .bn-history-menu {
      background: #202020 !important;
      border-color: #333333 !important;
      color: #c7c7c7 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-history-option {
      background: #202020 !important;
      border-color: #303030 !important;
      color: #e8e8e8 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-history-option:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-history-time,
    #bronotes-drawer[data-theme="dark"] .bn-history-preview {
      color: #a8a8a8 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-template-card {
      background: #202020 !important;
      border-color: #333333 !important;
      color: #e8e8e8 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-template-card:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-template-category {
      color: #a8a8a8 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-search-highlight {
      background: rgba(251, 191, 36, 0.36);
      box-shadow: 0 0 0 1px rgba(251, 191, 36, 0.18);
    }

    #bronotes-drawer[data-theme="dark"] .bn-search-highlight-current {
      background: rgba(245, 158, 11, 0.58);
      box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.32);
    }

    #bronotes-drawer[data-theme="dark"] .bn-new-note-button {
      background: #f1f1f1 !important;
      color: #181818 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-new-note-button * {
      color: #181818 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-trash-delete,
    #bronotes-drawer[data-theme="dark"] .bn-label-delete {
      border-color: #dc3545 !important;
      color: #ff6b7a !important;
    }

    #bronotes-drawer[data-theme="dark"] #bn-drawer-ribbon {
      background: rgba(24, 24, 24, 0.96) !important;
      border-color: #333333 !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] {
      background: rgba(20, 20, 20, 0.52) !important;
      box-shadow: none !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] input,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] textarea,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] select,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-preview-container,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-privacy-panel,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-summary-panel,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-label-autocomplete,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-note-link-autocomplete {
      background: rgba(20, 20, 20, 0.42) !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-editor-search {
      background: rgba(20, 20, 20, 0.44) !important;
      border-color: rgba(255, 255, 255, 0.16) !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] #bn-editor-shell {
      background: rgba(20, 20, 20, 0.2) !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] .bn-code-block pre {
      background: rgba(20, 20, 20, 0.24) !important;
      border-color: rgba(255, 255, 255, 0.16) !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] .bn-copy-code {
      background: rgba(20, 20, 20, 0.18) !important;
      border-color: rgba(255, 255, 255, 0.18) !important;
      color: #d8d8d8 !important;
    }

    #bronotes-drawer[data-theme="dark"][data-transparent="true"] .bn-history-button,
    #bronotes-drawer[data-theme="dark"][data-transparent="true"] .bn-history-menu {
      background: #202020 !important;
      border-color: rgba(255, 255, 255, 0.16) !important;
    }

    .bn-preferences-button {
      align-items: center;
      background: transparent;
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      color: #2a2a2a;
      cursor: pointer;
      display: flex;
      font-family: inherit;
      font-size: 12px;
      gap: 8px;
      justify-content: center;
      letter-spacing: 0.4px;
      margin-bottom: 24px;
      padding: 10px 12px;
      transition: transform 0.1s ease, opacity 0.15s ease;
      width: 100%;
    }

    .bn-preferences-button:hover {
      opacity: 0.86;
    }

    .bn-preferences-button img {
      display: block;
      height: 16px;
      pointer-events: none;
      width: 16px;
    }

    .bn-preference-modal {
      max-height: calc(100% - 36px);
      overflow-y: auto;
    }

    .bn-preference-row {
      border-bottom: 1px solid #eeeeee;
      box-sizing: border-box;
      display: grid;
      gap: 12px;
      grid-template-columns: minmax(0, 1fr) 178px;
      padding: 11px 0;
    }

    .bn-preference-row-title {
      color: #2a2a2a;
      font-size: 11px;
      font-weight: 650;
      letter-spacing: 0.2px;
      line-height: 1.35;
      margin-bottom: 3px;
    }

    .bn-preference-row-desc {
      color: #7a7a7a;
      font-size: 10px;
      line-height: 1.5;
      margin-bottom: 0;
    }

    .bn-preference-segment {
      display: grid;
      gap: 0;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .bn-preference-choice {
      background: transparent;
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
      color: #6a6a6a;
      cursor: pointer;
      font-family: inherit;
      font-size: 10px;
      line-height: 1.3;
      min-height: 30px;
      padding: 7px 6px;
    }

    .bn-preference-choice + .bn-preference-choice {
      border-left: none;
    }

    .bn-preference-choice[data-active="true"] {
      background: #2a2a2a !important;
      border-color: #2a2a2a !important;
      color: #ffffff !important;
    }

    .bn-preference-range {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: 1fr 58px;
    }

    .bn-preference-range input[type="range"] {
      accent-color: #2a2a2a;
      width: 100%;
    }

    .bn-preference-number {
      background: transparent;
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
      color: #2a2a2a;
      font-family: inherit;
      font-size: 10px;
      height: 30px;
      padding: 6px;
      text-align: center;
      width: 58px;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preferences-button {
      background: transparent !important;
      border-color: #333333 !important;
      color: #f1f1f1 !important;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preference-row {
      border-color: #333333;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preference-row-title {
      color: #f1f1f1;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preference-row-desc {
      color: #a8a8a8;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preference-choice,
    #bronotes-drawer[data-theme="dark"] .bn-preference-number {
      border-color: #3a3a3a;
      color: #d8d8d8;
    }

    #bronotes-drawer[data-theme="dark"] .bn-preference-choice[data-active="true"] {
      background: #f1f1f1 !important;
      border-color: #f1f1f1 !important;
      color: #181818 !important;
    }

    @media (max-width: 390px) {
      .bn-preference-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
  <div id="bn-drawer-ribbon">
    <button id="bn-btn-drawer-ribbon" title="open panel" aria-label="open panel">
      <img id="bn-drawer-ribbon-icon" src="${chrome.runtime.getURL('icons/slide-in.svg')}" alt="" />
    </button>
  </div>
  <div style="padding: 20px 24px 16px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e8e8e8;">
    <div class="bn-drawer-brand">
      <img class="bn-drawer-brand-icon" src="${chrome.runtime.getURL('icons/icon32.png')}" alt="" />
      <div class="bn-drawer-brand-text">Brow Notes</div>
    </div>
    <button id="bn-btn-transparency" title="toggle transparency" aria-label="toggle transparency" aria-pressed="false" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;">
      <img id="bn-transparency-icon" src="${chrome.runtime.getURL('icons/eye.svg')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
    <button id="bn-btn-theme" title="switch to dark mode" aria-label="switch to dark mode" aria-pressed="false" style="width: 28px; height: 28px; padding: 5px; background: transparent; color: #9a9a9a; border: none; cursor: pointer; opacity: 0.72; transition: transform 0.1s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: center;">
      <img id="bn-theme-icon" src="${chrome.runtime.getURL('icons/dark.svg')}" alt="" style="width: 18px; height: 18px; display: block; pointer-events: none;" />
    </button>
  </div>
  
  <div id="bn-home-view" style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; overflow-y: auto; padding: 42px 30px 26px 30px;">
    <div class="bn-home-intro">
      <h2 id="bn-welcome-message" class="bn-welcome-title">Welcome back, Brow 👋</h2>
      <p class="bn-welcome-copy">Let's turn today's scattered thoughts into tomorrow's clear plans.</p>
      <button id="bn-btn-new-note" class="bn-new-note-button">
        <img src="${chrome.runtime.getURL('icons/new-notes.png')}" alt="" />
        <span>New Note</span>
      </button>
    </div>
    <div id="bn-summary" style="display: none; width: 100%;">
      <h3 class="bn-summary-heading">
        <img class="bn-summary-heading-icon" src="${chrome.runtime.getURL('icons/summary.svg')}" alt="" />
        <span class="bn-summary-heading-text">summary</span>
      </h3>
      <div id="bn-summary-panel">
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.svg')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">total notes</span><span id="bn-total-notes" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.svg')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">total labels</span><span id="bn-total-labels" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.svg')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">favorite notes</span><span id="bn-total-favorites" class="bn-summary-value">0</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.svg')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">last note</span><span id="bn-last-note" class="bn-summary-value">-</span></div>
        </div>
        <div class="bn-summary-row">
          <img class="bn-summary-dot" src="${chrome.runtime.getURL('icons/dot-outline.svg')}" alt="" />
          <div class="bn-summary-text"><span class="bn-summary-label">last backup</span><span id="bn-last-backup" class="bn-summary-value">never</span></div>
        </div>
      </div>
    </div>
    <div id="bn-quote-card" style="display: none; width: 100%; margin-top: 74px; padding: 0 4px; box-sizing: border-box; text-align: center;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; color: #6a6a6a; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase;">
        <img src="${chrome.runtime.getURL('icons/quotes.svg')}" alt="" style="width: 14px; height: 14px; opacity: 0.62; pointer-events: none;" />
        <span>daily note spark</span>
      </div>
      <div id="bn-quote-text" style="font-size: 16px; line-height: 1.65; color: #686868; font-weight: 600; font-style: italic; margin: 0 auto 10px auto; max-width: 340px;"></div>
      <div id="bn-quote-author" style="font-size: 11px; color: #7a7a7a; text-align: center;"></div>
    </div>
  </div>
  
  <div id="bn-allnotes-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden;">
    <div style="padding: 16px 24px;">
      <input id="bn-search" type="text" placeholder="search..." style="width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #2a2a2a; outline: none; margin-bottom: 12px; box-sizing: border-box;" />
      <div style="display: flex; align-items: center; gap: 12px; font-size: 11px;">
        <button id="bn-filter-label-lock" type="button" title="lock label filter" aria-label="lock label filter" aria-pressed="false" style="flex: 0 0 auto; width: 24px; height: 31px; padding: 0; background: transparent; border: none; cursor: pointer; opacity: 0.72; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.1s ease, opacity 0.15s ease; box-sizing: border-box;"><img id="bn-filter-label-lock-icon" src="${chrome.runtime.getURL('icons/unlocked.svg')}" alt="" style="width: 16px; height: 16px; display: block; pointer-events: none;" /></button>
        <select id="bn-filter-label" style="flex: 1; min-width: 0; height: 31px; padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; line-height: 1.2; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;"><option value="">all labels</option></select>
        <select id="bn-sort" style="height: 31px; padding: 6px 8px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 11px; line-height: 1.2; color: #6a6a6a; outline: none; cursor: pointer; transition: transform 0.1s ease; box-sizing: border-box;"><option value="updated-desc">latest</option><option value="updated-asc">oldest</option><option value="created-desc">newest</option><option value="created-asc">first</option></select>
        <button id="bn-filter-favorite" class="bn-icon-toggle bn-filter-favorite" type="button" title="show favorite notes" aria-label="show favorite notes" aria-pressed="false" data-active="false"><img src="${chrome.runtime.getURL('icons/bookmark.svg')}" alt="" /></button>
        <button id="bn-filter-reset" class="bn-icon-toggle bn-filter-reset" type="button" title="reset filters" aria-label="reset filters"><img src="${chrome.runtime.getURL('icons/reset.svg')}" alt="" /></button>
      </div>
    </div>
    <div id="bn-notes-list" style="flex: 1; overflow-y: auto; padding: 0 24px 80px 24px;"></div>
    <button id="bn-fab-new" title="new note" aria-label="new note" style="position: absolute; bottom: 100px; right: 24px; width: 52px; height: 52px; border-radius: 0; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; padding: 14px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease; box-sizing: border-box;"><img src="${chrome.runtime.getURL('icons/new-notes.png')}" alt="" style="width: 20px; height: 20px; display: block; pointer-events: none;" /></button>
  </div>
  
  <div id="bn-editor-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden;">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e8e8e8;"><button id="bn-btn-back" style="padding: 0; background: transparent; color: #6a6a6a; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease;">← back</button></div>
    <div style="padding: 16px 24px 0 24px; display: flex; align-items: center; gap: 10px;"><input id="bn-note-title" type="text" placeholder="note title..." maxlength="120" style="flex: 1; min-width: 0; padding: 12px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 16px; font-family: inherit; font-weight: 600; color: #2a2a2a; outline: none; box-sizing: border-box;" /><span id="bn-note-title-count" aria-live="polite" style="flex: 0 0 auto; min-width: 42px; color: #9a9a9a; font-size: 10px; line-height: 1; text-align: right; white-space: nowrap; user-select: none;">0/120</span></div>
    <div style="padding: 12px 24px 0 24px; position: relative;"><div style="display: flex; align-items: center; gap: 10px;"><input id="bn-note-label" type="text" placeholder="label..." autocomplete="off" maxlength="32" style="flex: 1; min-width: 0; padding: 8px 0; border: none; border-bottom: 1px solid #e8e8e8; background: transparent; font-size: 12px; font-family: inherit; color: #6a6a6a; outline: none; box-sizing: border-box;" /><span id="bn-note-label-count" aria-live="polite" style="flex: 0 0 auto; min-width: 34px; color: #9a9a9a; font-size: 10px; line-height: 1; text-align: right; white-space: nowrap; user-select: none;">0/32</span><button id="bn-btn-context" class="bn-icon-toggle" type="button" title="capture page context" aria-label="capture page context" disabled><img src="${chrome.runtime.getURL('icons/context.svg')}" alt="" /></button><button id="bn-note-favorite" class="bn-icon-toggle" type="button" title="favorite note" aria-label="favorite note" aria-pressed="false" data-active="false"><img src="${chrome.runtime.getURL('icons/bookmark.svg')}" alt="" /></button><button id="bn-note-king" class="bn-icon-toggle" type="button" title="make king note" aria-label="make king note" aria-pressed="false" data-active="false"><img src="${chrome.runtime.getURL('icons/crown.svg')}" alt="" /></button><button id="bn-note-pinned" class="bn-icon-toggle" type="button" title="pin note" aria-label="pin note" aria-pressed="false" data-active="false"><img src="${chrome.runtime.getURL('icons/pin.svg')}" alt="" /></button></div><div id="bn-label-autocomplete" style="display: none; position: absolute; left: 24px; right: 194px; top: 44px; z-index: 12; background: #ffffff; border: 1px solid #e8e8e8; max-height: 152px; overflow-y: auto; box-sizing: border-box;"></div></div>
    <div style="padding: 12px 24px; display: flex; align-items: center; gap: 16px;">
      <button id="bn-tab-edit" style="padding: 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 13px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 5px; transition: transform 0.1s ease; display: inline-flex; align-items: center; gap: 7px;"><img src="${chrome.runtime.getURL('icons/write.svg')}" alt="" style="width: 16px; height: 16px; display: block; pointer-events: none;" /><span>Write</span></button>
      <button id="bn-tab-preview" style="padding: 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 13px; font-family: inherit; letter-spacing: 0.5px; padding-bottom: 5px; transition: transform 0.1s ease; display: inline-flex; align-items: center; gap: 7px;"><img src="${chrome.runtime.getURL('icons/markdown-view.svg')}" alt="" style="width: 16px; height: 16px; display: block; pointer-events: none;" /><span>Preview</span></button>
      <button id="bn-btn-export-md" disabled title="export markdown" aria-label="export markdown" style="margin-left: auto; padding: 0 0 5px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: not-allowed; font-size: 13px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease, opacity 0.15s ease; display: inline-flex; align-items: center; gap: 7px; opacity: 0.45;"><img src="${chrome.runtime.getURL('icons/export-md.svg')}" alt="" style="width: 16px; height: 16px; display: block; pointer-events: none;" /><span>Export</span></button>
      <button id="bn-btn-print-note" disabled title="print note" aria-label="print note" style="margin-left: auto; padding: 0 0 5px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: not-allowed; font-size: 13px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease, opacity 0.15s ease; display: none; align-items: center; gap: 7px; opacity: 0.45;"><img src="${chrome.runtime.getURL('icons/print.svg')}" alt="" style="width: 16px; height: 16px; display: block; pointer-events: none;" /><span>Print</span></button>
    </div>
    <div id="bn-editor-toolbar" class="bn-editor-toolbar" aria-label="markdown toolbar">
      <button class="bn-toolbar-button" type="button" title="bold" aria-label="bold" data-md-action="bold"><img src="${chrome.runtime.getURL('icons/toolbar/bold.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="italic" aria-label="italic" data-md-action="italic"><img src="${chrome.runtime.getURL('icons/toolbar/italic.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="link" aria-label="link" data-md-action="link"><img src="${chrome.runtime.getURL('icons/toolbar/link.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="bulleted list" aria-label="bulleted list" data-md-action="bullet-list"><img src="${chrome.runtime.getURL('icons/toolbar/list-bullets.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="numbered list" aria-label="numbered list" data-md-action="number-list"><img src="${chrome.runtime.getURL('icons/toolbar/list-numbers.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="checklist" aria-label="checklist" data-md-action="checklist"><img src="${chrome.runtime.getURL('icons/toolbar/checklist.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="quote" aria-label="quote" data-md-action="quote"><img src="${chrome.runtime.getURL('icons/toolbar/quotes.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="code" aria-label="code" data-md-action="code"><img src="${chrome.runtime.getURL('icons/toolbar/code.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="code block" aria-label="code block" data-md-action="code-block"><img src="${chrome.runtime.getURL('icons/toolbar/code-block.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="heading 1" aria-label="heading 1" data-md-action="h1"><img src="${chrome.runtime.getURL('icons/toolbar/h1.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="heading 2" aria-label="heading 2" data-md-action="h2"><img src="${chrome.runtime.getURL('icons/toolbar/h2.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="strikethrough" aria-label="strikethrough" data-md-action="strike"><img src="${chrome.runtime.getURL('icons/toolbar/strikethrough.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="image" aria-label="image" data-md-action="image"><img src="${chrome.runtime.getURL('icons/toolbar/image.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="table" aria-label="table" data-md-action="table"><img src="${chrome.runtime.getURL('icons/toolbar/table.svg')}" alt="" /></button>
      <button class="bn-toolbar-button" type="button" title="divider" aria-label="divider" data-md-action="line"><img src="${chrome.runtime.getURL('icons/toolbar/line.svg')}" alt="" /></button>
      <button id="bn-btn-template" class="bn-toolbar-button bn-toolbar-template" type="button" title="templates" aria-label="templates"><img src="${chrome.runtime.getURL('icons/toolbar/preset.svg')}" alt="" /></button>
    </div>
    <div id="bn-editor-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;"><div id="bn-editor-shell"><div id="bn-editor-highlight" aria-hidden="true"></div><textarea id="bn-editor" placeholder="start typing..." style="width: 100%; height: 100%; border: none; outline: none; resize: none; overflow-y: auto;"></textarea></div><div id="bn-editor-status" style="flex: 0 0 40px; height: 40px; padding: 0 24px; box-sizing: border-box; position: relative;"><div id="bn-editor-search-wrap" style="display: none; position: absolute; left: 24px; top: 50%; transform: translateY(-50%); min-width: 0; align-items: center; gap: 6px;"><input id="bn-editor-search" type="search" placeholder="find..." autocomplete="off" aria-label="find in note" style="width: 100px; max-width: 100%; height: 24px; padding: 4px 7px; border: 1px solid #e8e8e8; background: transparent; color: #2a2a2a; font-family: inherit; font-size: 11px; line-height: 1.3; outline: none; box-sizing: border-box;" /><span id="bn-editor-search-count" aria-live="polite" style="flex: 0 0 auto; color: #9a9a9a; font-size: 10px; line-height: 1.4; white-space: nowrap;">0/0</span></div><div id="bn-history-wrap" class="bn-history-wrap"><button id="bn-history-button" class="bn-history-button" type="button" title="version history" aria-label="version history" aria-expanded="false" disabled>history ▾</button><div id="bn-history-menu" class="bn-history-menu"></div></div><div id="bn-editor-count" aria-live="polite" style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); min-width: 0; color: #9a9a9a; font-size: 10px; line-height: 1.4; letter-spacing: 0.4px; text-align: right; white-space: nowrap; user-select: none; box-sizing: border-box;">0 words / 0 chars</div></div><div id="bn-note-link-autocomplete" style="display: none; position: absolute; left: 24px; right: 24px; top: 10px; z-index: 12; background: #ffffff; border: 1px solid #e8e8e8; max-height: 188px; overflow-y: auto; box-sizing: border-box; box-shadow: 0 8px 24px rgba(0,0,0,0.08);"></div></div>
    <div id="bn-preview-container" style="flex: 1; padding: 12px 24px 24px 24px; overflow-y: auto; display: none; font-size: 13px; line-height: 1.7;"></div>
    <div style="padding: 16px 24px; border-top: 1px solid #e8e8e8; display: flex; gap: 12px;">
      <button id="bn-btn-save" style="flex: 1; padding: 10px; background: #2a2a2a; color: #ffffff; border: none; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 6px;">save</button>
      <button id="bn-btn-delete" style="padding: 10px 16px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 12px; font-family: inherit; transition: transform 0.1s ease; box-sizing: border-box;">delete</button>
    </div>
  </div>
  
  <div id="bn-labels-view" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">manage labels</h3>
    <div id="bn-labels-list" style="margin-bottom: 24px;"></div>
    <button id="bn-btn-add-label" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;">+ add label</button>
  </div>

  <div id="bn-trash-view" style="flex: 1; display: none; flex-direction: column; overflow: hidden; padding: 24px;">
    <div style="display: flex; align-items: center; gap: 8px; margin: 0 0 16px 0;">
      <img src="${chrome.runtime.getURL('icons/trash.svg')}" alt="" style="width: 16px; height: 16px; opacity: 0.7; pointer-events: none;" />
      <h3 style="margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">trash</h3>
    </div>
    <div id="bn-trash-list" style="flex: 1; overflow-y: auto; padding: 0 0 16px 0;"></div>
    <button id="bn-btn-empty-trash" style="display: none; width: 100%; padding: 10px; background: transparent; color: #dc3545; border: 1px solid #dc3545; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;">empty trash</button>
  </div>
  
  <div id="bn-settings-view" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">personal</h3>
    <div style="margin-bottom: 24px;"><label style="display: block; margin-bottom: 8px; font-size: 11px; color: #6a6a6a; letter-spacing: 0.5px;">nama panggilan</label><input id="bn-nickname" type="text" placeholder="Brow" style="width: 100%; padding: 8px 12px; border: 1px solid #e8e8e8; background: transparent; font-family: inherit; font-size: 12px; outline: none; box-sizing: border-box;" /></div>
    <h3 style="margin: 24px 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">preferences</h3>
    <button id="bn-btn-preferences" class="bn-preferences-button" type="button"><img src="${chrome.runtime.getURL('icons/settings.svg')}" alt="" /><span>open preferences</span></button>
    <h3 style="margin: 24px 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">data</h3>
    <button id="bn-btn-export" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; margin-bottom: 12px; transition: transform 0.1s ease; box-sizing: border-box;">export all notes</button>
    <button id="bn-btn-import" style="width: 100%; padding: 10px; background: transparent; color: #2a2a2a; border: 1px solid #e8e8e8; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; box-sizing: border-box;">import notes</button>
    <input type="file" id="bn-import-file" accept=".json" style="display: none;">
    <div id="bn-privacy-panel" style="margin-top: 24px; padding: 12px; background: #f8f8f8; border-radius: 4px; font-size: 11px; color: #6a6a6a; line-height: 1.6;"><strong>privacy:</strong> all notes stored locally. no data sent to servers.</div>
    <div style="margin-top: 32px; padding: 0; border-top: 1px solid #e8e8e8;">
      <div style="padding: 20px 0 16px 0; display: flex; align-items: center; justify-content: space-between;">
        <div style="flex: 1;">
          <div style="font-size: 18px; font-weight: 750; color: #2a2a2a; letter-spacing: -0.3px; margin-bottom: 4px;">Brow Notes</div>
          <div style="font-size: 10px; color: #9a9a9a; letter-spacing: 0.8px; text-transform: uppercase;">Version <span id="bn-app-version">3.0.0</span></div>
        </div>
        <div style="width: 32px; height: 32px; background: #2a2a2a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">B</div>
      </div>
      <div style="padding: 12px 0; border-top: 1px solid #f0f0f0;">
        <div style="font-size: 10px; color: #7a7a7a; line-height: 1.6;">
          Crafted with care by <a href="https://github.com/gafurmog" target="_blank" rel="noopener noreferrer" style="color: #2a2a2a; text-decoration: none; font-weight: 600; border-bottom: 1px solid #e0e0e0; transition: border-color 0.2s;">@gafurmog</a>
        </div>
      </div>
    </div>
  </div>
  
  <div style="padding: 12px 18px; border-top: 1px solid #e8e8e8; display: flex; justify-content: space-between; gap: 8px;">
    <button id="bn-nav-home" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #2a2a2a; border: none; border-bottom: 2px solid #2a2a2a; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL('icons/home.svg')}" alt="" style="width: 18px; height: 18px; opacity: 1; pointer-events: none;" /><span>HOME</span></button>
    <button id="bn-nav-allnotes" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL('icons/allnotes.svg')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>ALL NOTES</span></button>
    <button id="bn-nav-labels" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL('icons/label.svg')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>LABELS</span></button>
    <button id="bn-nav-trash" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL('icons/trash.svg')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>TRASH</span></button>
    <button id="bn-nav-settings" style="flex: 1; padding: 4px 0 6px 0; background: transparent; color: #9a9a9a; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-family: inherit; letter-spacing: 0.5px; transition: transform 0.1s ease; display: flex; flex-direction: column; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL('icons/settings.svg')}" alt="" style="width: 18px; height: 18px; opacity: 0.45; pointer-events: none;" /><span>SETTINGS</span></button>
  </div>
`;
