import puppeteer from 'puppeteer';

let browserPromise = null;

export function getBrowser() {
  if (!browserPromise) {
   browserPromise = puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',                      // extra helper process kam
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-features=site-per-process,IsolateOrigins', // kam renderer processes
    '--js-flags=--max-old-space-size=192',
  ],
}).catch((err) => {
      browserPromise = null; // launch fail hua to dobara try ho sake
      throw err;
    });
  }
  return browserPromise;
}

export async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    browserPromise = null;
    await browser.close();
  }
}