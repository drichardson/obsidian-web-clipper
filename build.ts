#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';

const result = await Bun.build({
  entrypoints: ['./src/clipper.ts'],
  outdir: './dist',
  minify: true,
  target: 'browser',
  format: 'iife',
});

if (!result.success) {
  console.error('Build failed:');
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

const bundledCode = readFileSync('./dist/clipper.js', 'utf-8');

function createBookmarklet(code: string): string {
  const cleanCode = code.trim();
  const encoded = encodeURIComponent(cleanCode);
  return `javascript:${encoded}`;
}

const bookmarklet = createBookmarklet(bundledCode);

writeFileSync('./dist/bookmarklet.txt', bookmarklet);
writeFileSync('./dist/clipper.min.js', bundledCode);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obsidian Web Clipper - Bookmarklet</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
        }
        .bookmarklet {
            display: inline-block;
            padding: 12px 24px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: move;
            margin: 20px 0;
        }
        .bookmarklet:hover {
            background: #6d28d9;
        }
        .instructions {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
        }
        code {
            background: #e5e7eb;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 0.9em;
        }
        .info {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
        }
        .stats {
            color: #666;
            font-size: 0.9em;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Obsidian Web Clipper</h1>

    <div class="info">
        <strong>CSP-Safe Version</strong><br>
        This bookmarklet has all dependencies bundled inline, so it works on sites with strict Content Security Policies.
    </div>

    <div class="instructions">
        <h2>Installation</h2>
        <ol>
            <li>Drag the button below to your browser's bookmarks bar</li>
            <li>Or right-click the button and select "Bookmark This Link" / "Add to Bookmarks"</li>
            <li>Click the bookmark on any web page to clip it to Obsidian</li>
        </ol>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${bookmarklet}" class="bookmarklet">Clip to Obsidian</a>
        <div class="stats">
            Bundle size: ${(bundledCode.length / 1024).toFixed(2)} KB (minified)<br>
            Bookmarklet size: ${(bookmarklet.length / 1024).toFixed(2)} KB (encoded)
        </div>
    </div>

    <div class="instructions">
        <h2>Features</h2>
        <ul>
            <li>Works on sites with Content Security Policy (CSP)</li>
            <li>Converts articles to Markdown</li>
            <li>Extracts metadata (author, date, keywords)</li>
            <li>Supports text selection clipping</li>
            <li>Windows & Unix-safe filenames</li>
            <li>Customizable vault and folder</li>
        </ul>
    </div>

    <div class="instructions">
        <h2>Customization</h2>
        <p>To customize the vault name or folder, edit <code>src/clipper.ts</code> and rebuild:</p>
        <pre><code>const vault = "MyVault";
const folder = "Clippings/";</code></pre>
        <p>Then run: <code>bun run build</code></p>
    </div>

</body>
</html>`;

writeFileSync('./dist/index.html', html);
