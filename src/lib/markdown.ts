/**
 * Simple markdown to HTML converter
 * Handles: headings, bold, italic, code, tables, lists, links
 */
export function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre style="background:rgba(0,0,0,.3);padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;margin:16px 0"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,.06);padding:2px 6px;border-radius:4px;font-size:12px">$1</code>');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:700;color:#f1f5f9;margin:20px 0 10px;padding-left:12px;border-left:3px solid var(--blue)">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:700;color:#f1f5f9;margin:24px 0 12px;padding-left:12px;border-left:3px solid var(--cyan)">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;color:#f1f5f9;margin:16px 0 8px">$1</h1>');

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f1f5f9">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
    const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--cyan);text-decoration:underline">$1</a>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:20px 0">');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<')) return p;
    return `<p style="margin-bottom:12px">${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
