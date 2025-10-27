import Turndown from 'turndown';
import Readability from '@tehshrike/readability';

(async () => {
  /* Optional vault name */
  const vault = "";

  /* Optional folder name such as "Clippings/" */
  const folder = "Clippings/";

  /* Optional tags  */
  let tags = "clippings";

  /* Parse the site's meta keywords content into tags, if present */
  if (document.querySelector('meta[name="keywords" i]')) {
    const keywordsElement = document.querySelector('meta[name="keywords" i]');
    if (keywordsElement) {
      const keywords = keywordsElement.getAttribute('content')?.split(',') || [];

      keywords.forEach(function(keyword) {
        let tag = ' ' + keyword.split(' ').join('');
        tags += tag;
      });
    }
  }

  function getSelectionHtml(): string {
    let html = "";
    if (typeof window.getSelection != "undefined") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount) {
        const container = document.createElement("div");
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (typeof (document as any).selection != "undefined") {
      if ((document as any).selection.type == "Text") {
        html = (document as any).selection.createRange().htmlText;
      }
    }
    return html;
  }

  const selection = getSelectionHtml();

  const {
    title,
    byline,
    content
  } = new Readability(document.cloneNode(true) as Document).parse() || { title: '', byline: '', content: '' };

  function getFileName(fileName: string): string {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
    } else {
      fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
    }
    return fileName;
  }
  const fileName = getFileName(title);

  let markdownify: string;
  if (selection) {
    markdownify = selection;
  } else {
    markdownify = content;
  }

  let vaultName: string;
  if (vault) {
    vaultName = '&vault=' + encodeURIComponent(vault);
  } else {
    vaultName = '';
  }

  const markdownBody = new Turndown({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  }).turndown(markdownify);

  const date = new Date();

  function convertDate(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth()+1).toString();
    const dd  = date.getDate().toString();
    const mmChars = mm.split('');
    const ddChars = dd.split('');
    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
  }

  const today = convertDate(date);

  // Utility function to get meta content by name or property
  function getMetaContent(attr: string, value: string): string {
    const element = document.querySelector(`meta[${attr}='${value}']`);
    return element ? element.getAttribute("content")?.trim() || "" : "";
  }

  // Fetch byline, meta author, property author, or site name
  const author = byline || getMetaContent("name", "author") || getMetaContent("property", "author") || getMetaContent("property", "og:site_name");

  // Check if there's an author and add brackets
  const authorBrackets = author ? `"[[${author}]]"` : "";

  /* Try to get published date */
  const timeElement = document.querySelector("time");
  const publishedDate = timeElement ? timeElement.getAttribute("datetime") : "";

  let published = '';
  if (publishedDate && publishedDate.trim() !== "") {
    const date = new Date(publishedDate);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1; // Months are 0-based in JavaScript
    let day: string | number = date.getDate();

    // Pad month and day with leading zeros if necessary
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    published = year + '-' + month + '-' + day;
  }

  /* YAML front matter as tags render cleaner with special chars  */
  const fileContent =
    '---\n'
    + 'Category: ""\n'
    + 'Author: ' + authorBrackets + '\n'
    + 'Link: ' + document.URL + '\n'
    + 'Created time: ' + today + '\n'
    + 'Reading Status: Not started\n'
    + '---\n\n'
    + '# Clipping\n\n'
    + '---\n\n'
    + markdownBody;

  document.location.href = "obsidian://new?"
    + "file=" + encodeURIComponent(folder + fileName)
    + "&content=" + encodeURIComponent(fileContent)
    + vaultName;
})();
