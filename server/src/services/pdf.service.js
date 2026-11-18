import { getBrowser } from './browser.service.js';
import { PDF_OPTIONS, TIMEOUTS, VIEWPORT, CLEANUP_CSS } from '../config/pdf.config.js';
import { createLimiter } from '../utils/createLimiter.js';
import { env } from '../config/env.js';
import { installRequestGuard } from '../utils/requestGuard.js';

const limit = createLimiter({
  maxConcurrent: env.maxConcurrentPdfs,
  maxQueue: env.maxQueuedPdfs,
});

// Page beech mein reload ho jaye to steps dobara chalao
async function withNavRetry(page, fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      const navigated = /Execution context was destroyed|detached/i.test(err.message);
      if (!navigated || i === tries - 1) throw err;
      console.error(`[pdf] page navigated mid-step, retry ${i + 1}`);
      await page.waitForSelector('main', { timeout: TIMEOUTS.render });
    }
  }
}

// Page ko neeche tak scroll karo taaki lazy content render ho jaye,
// phir saari images load hone ka wait karo (max 15s)
async function loadLazyContent(page) {
  await page.evaluate(async () => {
    const step = 600;
    let y = 0;
    let steps = 0;
    while (y < document.documentElement.scrollHeight && steps < 300) {
      window.scrollTo(0, y);
      y += step;
      steps++;
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

async function renderPdf(url) {
  const browser = await getBrowser();
  const page = await browser.newPage(); // har request ka apna tab
  const started = Date.now();

  try {
    await page.setViewport(VIEWPORT);
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
    ]);
    await installRequestGuard(page);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });

    // Network thoda shaant hone do, par zyada der nahi (fail ho to aage badho)
    await page.waitForNetworkIdle({ idleTime: 2000, timeout: 30000 }).catch(() => {});

    // Ye poora hissa retry ke andar: page reload ho to dobara chalega
    await withNavRetry(page, async () => {
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
    });

    return await page.pdf(PDF_OPTIONS); // file nahi, buffer
  } catch (err) {
    console.error(`[pdf] failed after ${Date.now() - started}ms:`, err.name, err.message);
    try {
      console.error('[pdf] url  :', page.url());
      console.error('[pdf] title:', await page.title());
      const text = await page.evaluate(() => document.body?.innerText?.slice(0, 300));
      console.error('[pdf] body :', text);
    } catch {
      // page hi band ho gaya ho to ignore
    }
    throw err;
  } finally {
    await page.close(); // error aaye ya na aaye, tab band
  }
}

// Bahar ke code ko yahi function dikhta hai: limit ke saath
export function generatePdf(url) {
  return limit(() => renderPdf(url));
}