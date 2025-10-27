# Obsidian Web Clipper

A bookmarklet for clipping web content to Obsidian.

**[Install the bookmarklet here](https://drichardson.github.io/obsidian-web-clipper/)**

## What This Does

This bookmarklet lets you clip web pages to Obsidian with one click:
- Converts articles to Markdown
- Extracts metadata (author, date, keywords)
- Supports text selection clipping
- Creates Windows & Unix-safe filenames
- Works on sites with strict Content Security Policies (CSP)

## Should You Use This?

You should probably try the [Official Obsidian Web Clipper](https://obsidian.md/clipper) first. It's a Chrome extension with more features and better support.

This bookmarklet is useful if you:
- Don't want to use a Chrome extension
- Use a browser that doesn't support Chrome extensions
- Need something that works on CSP-restricted sites

## For the Curious

This project solves a specific problem with existing Obsidian web clipper bookmarklets. The original versions load dependencies ([Turndown](https://github.com/mixmark-io/turndown) and [Readability](https://github.com/mozilla/readability)) from CDNs using `fetch()`, which fails on websites with [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers that block external script loading. This version bundles all dependencies inline, eliminating the CSP issue.

### Credits

Based on:
- Original bookmarklet by [@kepano](https://github.com/kepano): [kepano/obsidian-web-clipper.js](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)
- My fork with modifications: [drichardson/obsidian-web-clipper.js](https://gist.github.com/drichardson/b7bbad0e44f075c155362d820c6975c0)

## Development

To install dependencies:

```bash
bun install
```

To build products in `dist/`, run:

```bash
bun run build
```
