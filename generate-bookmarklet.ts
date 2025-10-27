#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';

const bundledCode = readFileSync('./dist/clipper.js', 'utf-8');

function createBookmarklet(code: string): string {
  const cleanCode = code.trim();
  const encoded = encodeURIComponent(cleanCode);
  return `javascript:${encoded}`;
}

const bookmarklet = createBookmarklet(bundledCode);

writeFileSync('./dist/bookmarklet.txt', bookmarklet);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obsidian Web Clipper - Bookmarklet</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
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
        .info {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
        }
        footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #666;
            font-size: 0.9em;
            text-align: center;
        }
        a {
            color: #3b82f6;
        }
        .github-icon {
            display: inline-block;
            vertical-align: text-bottom;
            fill: currentColor;
        }
    </style>
</head>
<body>
    <h1>Obsidian Web Clipper</h1>
    <p class="subtitle">A bookmarklet for clipping web pages to Obsidian</p>

    <div class="info">
        <strong>Note:</strong> You should probably try the <a href="https://obsidian.md/clipper">Official Obsidian Web Clipper</a> first. It's a Chrome extension with more features and better support.
        <br><br>
        Use this bookmarklet if you don't want to use a Chrome extension, use a non-Chrome browser, or need something that works on CSP-restricted sites.
    </div>

    <div class="instructions">
        <h2>Installation</h2>
        <ol>
            <li>Drag the button below to your browser's bookmarks bar</li>
            <li>Or right-click and select "Bookmark This Link"</li>
            <li>Click the bookmark on any web page to clip it to Obsidian</li>
        </ol>
    </div>

    <div class="button-container">
        <a href="${bookmarklet}" class="bookmarklet">Clip to Obsidian</a>
    </div>

    <footer>
        <p>
            <svg class="github-icon" height="16" width="16" viewBox="0 0 16 16">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            <a href="https://github.com/drichardson/obsidian-web-clipper">drichardson/obsidian-web-clipper</a>
        </p>
    </footer>

</body>
</html>`;

writeFileSync('./dist/index.html', html);
