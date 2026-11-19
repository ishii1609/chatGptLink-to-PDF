// Saari settings ek jagah. Kuch badalna ho to sirf yahi file badlo.

export const PDF_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
   timeout: 120000, // page.pdf() ka default 30s slow CPU pe kam padega
};

export const TIMEOUTS = {
  navigation: 60000,
  render: 30000,
};

export const VIEWPORT = { width: 900, height: 800 };

// Page ko PDF ke layak banane wali CSS
export const CLEANUP_CSS = `
  html, body {
    height: auto !important;
    overflow: visible !important;
    width: 100% !important;
  }
  main, main * {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  pre, code {
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }
  img { max-width: 100% !important; height: auto !important; }
  table, pre, img { break-inside: avoid; }
`;