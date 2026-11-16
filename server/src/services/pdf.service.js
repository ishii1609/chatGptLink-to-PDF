import { getBrowser } from './browser.service.js';
import { PDF_OPTIONS, TIMEOUTS, VIEWPORT, CLEANUP_CSS } from '../config/pdf.config.js';

// Page ko neeche tak scroll karo taaki lazy content render ho jaye,
// phir saari images load hone ka wait karo (max 15s)
async function loadLazyContent(page) {
  await page.evaluate(async () => {
    const step = 600;
    let y = 0;
    while (y < document.documentElement.scrollHeight) {
      window.scrollTo(0, y);
      y += step;
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });

  await page.evaluate(async () => {
    const waitForImages = Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? null
          : new Promise((res) => {
              img.onload = img.onerror = res;
            })
      )
    );
    const timeout = new Promise((res) => setTimeout(res, 15000));
    await Promise.race([waitForImages, timeout]);
  });
}
export async function generatePdf(url) {
  const browser = await getBrowser();
  const page = await browser.newPage(); // har request ka apna tab

  try {
    await page.setViewport(VIEWPORT);
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
    ]);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: TIMEOUTS.navigation });

    // Chat render hone ka wait
    await page.waitForSelector('main', { timeout: TIMEOUTS.render });
    await page.waitForFunction(
      () => document.querySelector('main').innerText.length > 200,
      { timeout: TIMEOUTS.render }
    );

    await page.addStyleTag({ content: CLEANUP_CSS });

    // Popup/input box hatao, scroll containers kholo (chat wrapper ko chhode bina)
    await page.evaluate(() => {
      const transcript =
        document.querySelector('[data-conversation-transcript]') ||
        document.querySelector('main');

      document.querySelectorAll('*').forEach((el) => {
        const s = getComputedStyle(el);
        const containsChat = transcript && el.contains(transcript);

        if (s.position === 'fixed' && !containsChat) {
          el.style.display = 'none';
        } else if (s.position === 'sticky') {
          el.style.position = 'static';
        }

        if (
          (s.overflowY === 'auto' || s.overflowY === 'scroll') &&
          !el.closest('pre, table, [data-d-table-viewport]')
        ) {
          el.style.overflow = 'visible';
          el.style.height = 'auto';
          el.style.maxHeight = 'none';
        }
      });
    });

    await loadLazyContent(page);
    
    return await page.pdf(PDF_OPTIONS); // file nahi, buffer
  } finally {
    await page.close(); // error aaye ya na aaye, tab band
  }
}