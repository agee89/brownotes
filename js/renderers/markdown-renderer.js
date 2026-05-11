// Markdown renderer - split into focused functions
const MarkdownRenderer = {
  render(markdown) {
    if (!markdown) return '<div style="color: #9a9a9a; font-size: 12px;">nothing to preview</div>';

    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    let html = '';
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const next = lines[i + 1] || '';

      if (this.isBlank(line)) {
        i++;
        continue;
      }

      // Try each block type
      const codeBlock = this.tryCodeBlock(lines, i);
      if (codeBlock) {
        html += codeBlock.html;
        i = codeBlock.next;
        continue;
      }

      const heading = this.tryHeading(line);
      if (heading) {
        html += heading;
        i++;
        continue;
      }

      if (this.isHr(line)) {
        html += '<hr style="border: none; border-top: 1px solid #e8e8e8; margin: 18px 0;">';
        i++;
        continue;
      }

      const youtubeIframe = this.tryYoutubeIframe(line);
      if (youtubeIframe) {
        html += youtubeIframe;
        i++;
        continue;
      }

      const blockquote = this.tryBlockquote(lines, i);
      if (blockquote) {
        html += blockquote.html;
        i = blockquote.next;
        continue;
      }

      const table = this.tryTable(lines, i, next);
      if (table) {
        html += table.html;
        i = table.next;
        continue;
      }

      const list = this.tryList(lines, i);
      if (list) {
        html += list.html;
        i = list.next;
        continue;
      }

      // Default: paragraph
      const paragraph = this.renderParagraph(lines, i);
      html += paragraph.html;
      i = paragraph.next;
    }

    return html;
  },

  isBlank(line) {
    return /^\s*$/.test(line);
  },

  isHr(line) {
    return /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line);
  },

  tryCodeBlock(lines, start) {
    const fence = lines[start].match(/^\s*```(\S*)?\s*$/);
    if (!fence) return null;

    const code = [];
    let i = start + 1;
    while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
      code.push(lines[i]);
      i++;
    }
    if (i < lines.length) i++;

    const html = `<div class="bn-code-block" style="position: relative; margin: 12px 0;"><button type="button" class="bn-copy-code" style="position: absolute; top: 6px; right: 6px; padding: 4px 7px; background: rgba(255,255,255,0.86); color: #4a4a4a; border: 1px solid #e0e0e0; cursor: pointer; font-size: 10px; font-family: inherit;">copy</button><pre style="background: rgba(0,0,0,0.06); padding: 34px 12px 12px 12px; overflow-x: visible; white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.5; margin: 0;"><code style="white-space: pre-wrap; word-break: break-word;">${Utils.escapeHtml(code.join('\n'))}</code></pre></div>`;

    return { html, next: i };
  },

  tryHeading(line) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (!heading) return null;

    const level = heading[1].length;
    const sizes = { 1: 20, 2: 17, 3: 15, 4: 14, 5: 13, 6: 12 };
    const style = `margin: ${level === 1 ? 24 : 14}px 0 8px 0; font-size: ${sizes[level]}px; font-weight: ${level < 3 ? 700 : 600};`;
    
    return `<h${level} style="${style}">${this.renderInline(heading[2].replace(/\s+#+$/, ''))}</h${level}>`;
  },

  tryYoutubeIframe(line) {
    const match = line.trim().match(/^<iframe\b([^>]*)><\/iframe>$/i);
    if (!match) return null;

    const src = match[1].match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
    if (!/^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/[A-Za-z0-9_-]+/.test(src)) return null;

    const title = match[1].match(/\btitle=["']([^"']+)["']/i)?.[1] || 'YouTube video player';
    return `<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; margin: 14px auto; background: rgba(0,0,0,0.06); overflow: hidden;"><iframe src="${Utils.escapeHtml(src)}" title="${Utils.escapeHtml(title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"></iframe></div>`;
  },

  tryBlockquote(lines, start) {
    if (!/^>\s?/.test(lines[start])) return null;

    const quote = [];
    let i = start;
    while (i < lines.length && /^>\s?/.test(lines[i])) {
      quote.push(lines[i].replace(/^>\s?/, ''));
      i++;
    }

    const html = `<blockquote style="border-left: 3px solid #d0d0d0; margin: 12px 0; padding: 2px 0 2px 12px; color: #5a5a5a;">${quote.map(text => this.renderInline(text)).join('<br>')}</blockquote>`;
    return { html, next: i };
  },

  tryTable(lines, start, next) {
    if (!lines[start].includes('|') || !this.isTableDelimiter(next)) return null;

    const header = this.splitTableRow(lines[start]);
    const align = this.splitTableRow(next).map(cell => 
      cell.startsWith(':') && cell.endsWith(':') ? 'center' : 
      cell.endsWith(':') ? 'right' : 'left'
    );

    let i = start + 2;
    let rows = '';
    while (i < lines.length && lines[i].includes('|') && !this.isBlank(lines[i])) {
      const cells = this.splitTableRow(lines[i]);
      rows += `<tr>${header.map((_, index) => `<td style="text-align: ${align[index] || 'left'}; border-bottom: 1px solid #f0f0f0; padding: 6px 8px;">${this.renderInline(cells[index] || '')}</td>`).join('')}</tr>`;
      i++;
    }

    const html = `<div style="overflow-x: auto; margin: 12px 0;"><table style="width: 100%; border-collapse: collapse; font-size: 12px;"><thead><tr>${header.map((cell, index) => `<th style="text-align: ${align[index] || 'left'}; border-bottom: 1px solid #e8e8e8; padding: 6px 8px;">${this.renderInline(cell)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
    
    return { html, next: i };
  },

  isTableDelimiter(line) {
    const cells = this.splitTableRow(line);
    return cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
  },

  splitTableRow(line) {
    let trimmed = line.trim();
    if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
    return trimmed.replace(/\\\|/g, '\u0001').split('|').map(cell => cell.replace(/\u0001/g, '|').trim());
  },

  tryList(lines, start) {
    const match = this.listMatch(lines[start]);
    if (!match) return null;

    const rendered = this.renderList(lines, start, match[1].length, /^\d/.test(match[2]));
    return rendered;
  },

  listMatch(line) {
    return line.match(/^(\s*)([-+*]|\d+[.)])\s+(\[[ xX]\]\s+)?(.*)$/);
  },

  renderList(lines, start, indent, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    const firstItem = this.listMatch(lines[start]);
    const taskList = !ordered && !!firstItem[3];
    const listStyle = ordered ? 'decimal' : taskList ? 'none' : 'disc';
    const listIndent = taskList ? '20px' : '18px';
    let listHtml = `<${tag} style="margin: 8px 0 8px 20px; padding-left: ${listIndent}; list-style-type: ${listStyle}; list-style-position: outside;">`;
    let index = start;

    while (index < lines.length) {
      const item = this.listMatch(lines[index]);
      if (!item) break;

      const itemIndent = item[1].length;
      const itemOrdered = /^\d/.test(item[2]);
      if (itemIndent < indent) break;
      if (itemIndent > indent) break;
      if (itemOrdered !== ordered) break;

      const checked = item[3] && /\[[xX]\]/.test(item[3]);
      const task = item[3] ? `<input type="checkbox" disabled ${checked ? 'checked ' : ''}style="margin: 2px 6px 0 0; flex: 0 0 auto;">` : '';
      const itemStyle = item[3] ? 'display: flex; align-items: flex-start; list-style-type: none; margin: 5px 0; padding-left: 0; margin-left: -18px;' : 'display: list-item; margin: 5px 0; padding-left: 2px;';
      listHtml += `<li style="${itemStyle}">${task}<span>${this.renderInline(item[4])}</span>`;
      index++;

      while (index < lines.length) {
        const nested = this.listMatch(lines[index]);
        if (!nested) break;

        const nestedIndent = nested[1].length;
        if (nestedIndent <= indent) break;

        const nestedList = this.renderList(lines, index, nestedIndent, /^\d/.test(nested[2]));
        listHtml += nestedList.html;
        index = nestedList.next;
      }

      listHtml += '</li>';
    }

    listHtml += `</${tag}>`;
    return { html: listHtml, next: index };
  },

  renderParagraph(lines, start) {
    const paragraph = [];
    let i = start;
    while (i < lines.length && !this.isBlank(lines[i]) && !this.startsBlock(lines[i], lines[i + 1] || '')) {
      paragraph.push(lines[i]);
      i++;
    }
    const html = `<p style="margin: 12px 0;">${this.renderInline(paragraph.join('\n').replace(/ {2,}\n/g, '<br>').replace(/\n/g, ' '))}</p>`;
    return { html, next: i };
  },

  startsBlock(line, next) {
    return /^\s*```/.test(line) || /^#{1,6}\s+/.test(line) || /^>\s?/.test(line) || 
           this.isHr(line) || this.listMatch(line) || this.tryYoutubeIframe(line) || 
           (line.includes('|') && this.isTableDelimiter(next));
  },

  renderInline(text) {
    const tokens = [];
    const keep = (html) => {
      const token = `\u0000${tokens.length}\u0000`;
      tokens.push(html);
      return token;
    };

    let value = String(text || '');

    value = value.replace(/`([^`]+)`/g, (_, code) =>
      keep(`<code style="background: rgba(0,0,0,0.06); padding: 2px 5px; border-radius: 3px; font-family: inherit; font-size: 12px;">${Utils.escapeHtml(code)}</code>`)
    );

    value = value.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, url) =>
      keep(`<img src="${Utils.escapeHtml(url)}" alt="${Utils.escapeHtml(alt)}" style="max-width: 100%; height: auto; display: block; margin: 12px auto;" />`)
    );

    value = value.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, url) =>
      keep(`<a href="${Utils.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="color: #1f5fbf; text-decoration: underline;">${this.renderInline(label)}</a>`)
    );

    value = Utils.escapeHtml(value)
      .replace(/\\([\\`*{}\[\]()#+\-.!_>~|])/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      .replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>')
      .replace(/(^|[\s(])_([^_\s][^_]*?)_(?=$|[\s).,!?:;])/g, '$1<em>$2</em>');

    tokens.forEach((html, index) => {
      value = value.replaceAll(`\u0000${index}\u0000`, html);
    });

    return value;
  }
};
