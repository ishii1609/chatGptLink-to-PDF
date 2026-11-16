import puppeteer from 'puppeteer';

let browserPromise = null;

export function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({ headless: true }).then((browser) => {
      // Crash/disconnect ho jaye to agli request naya browser banaye
      browser.on('disconnected', () => {
        browserPromise = null;
      });
      return browser;
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