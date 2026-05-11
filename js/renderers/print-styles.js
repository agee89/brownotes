// Print styles helper
const PrintStyles = {
  get() {
    return `
    @page {
      margin: 0;
      size: A4 portrait;
    }
    * { box-sizing: border-box; text-shadow: none !important; }
    html {
      background: #ffffff;
    }
    body {
      background: #ffffff;
      color: #1b1b1b;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Mono", "Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 13.5pt;
      font-weight: 400;
      line-height: 1.58;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    main {
      margin: 0;
      max-width: none;
      min-height: 100vh;
      padding: 16mm 18mm 18mm 18mm;
      width: 100%;
    }
    h1.bn-print-title {
      color: #111111;
      font-size: 27pt;
      font-weight: 750;
      letter-spacing: 0;
      line-height: 1.18;
      margin: 0 0 34px 0 !important;
      padding: 0 0 14px 0 !important;
      border-bottom: 1px solid #d8d8d8;
    }
    h1:not(.bn-print-title),
    h2,
    h3 {
      color: #151515;
      font-weight: 720;
      letter-spacing: 0;
      line-height: 1.24;
      margin: 34px 0 14px 0 !important;
      page-break-after: avoid;
    }
    h1:not(.bn-print-title) { font-size: 22pt; }
    h2 { font-size: 18pt; }
    h3 { font-size: 15.5pt; }
    p {
      line-height: 1.58 !important;
      margin: 0 0 18px 0 !important;
      orphans: 3;
      widows: 3;
    }
    p + p {
      margin-top: 4px !important;
    }
    p + h1,
    p + h2,
    p + h3,
    ul + h1,
    ul + h2,
    ul + h3,
    ol + h1,
    ol + h2,
    ol + h3,
    blockquote + h1,
    blockquote + h2,
    blockquote + h3,
    table + h1,
    table + h2,
    table + h3,
    .bn-code-block + h1,
    .bn-code-block + h2,
    .bn-code-block + h3 {
      margin-top: 40px !important;
    }
    a {
      color: #111111;
      text-decoration: underline;
      text-decoration-thickness: 0.08em;
      text-underline-offset: 0.14em;
    }
    ul,
    ol {
      margin: 12px 0 22px 0 !important;
      padding-left: 28px !important;
    }
    li {
      line-height: 1.55 !important;
      margin: 7px 0 !important;
    }
    li > span {
      line-height: 1.55 !important;
    }
    img {
      display: block;
      margin: 24px 0 !important;
      max-width: 100%;
      page-break-inside: avoid;
    }
    table {
      border-collapse: collapse;
      font-size: 12.5pt;
      line-height: 1.45;
      margin: 24px 0 !important;
      page-break-inside: avoid;
      width: 100%;
    }
    th, td {
      border: 1px solid #d2d2d2;
      padding: 9px 11px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f4f4f4;
      color: #111111;
      font-weight: 700;
    }
    blockquote {
      border-left: 4px solid #bdbdbd;
      color: #3f3f3f;
      font-size: 13pt;
      font-style: italic;
      line-height: 1.56;
      margin: 24px 0 !important;
      padding: 6px 0 6px 18px !important;
      page-break-inside: avoid;
    }
    code {
      background: #f3f3f3 !important;
      color: #202020 !important;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Mono", "Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace !important;
      font-size: 0.92em;
      text-shadow: none !important;
    }
    .bn-code-block {
      margin: 26px 0 !important;
      page-break-inside: avoid;
      position: relative;
    }
    .bn-code-block pre {
      background: #f7f7f7 !important;
      border: 1px solid #d8d8d8 !important;
      color: #202020 !important;
      font-size: 11.5pt;
      line-height: 1.48;
      margin: 0 !important;
      overflow: visible;
      padding: 16px 17px !important;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .bn-copy-code { display: none !important; }
  `;
  }
};
