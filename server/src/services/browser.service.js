import puppeteer from 'puppeteer';

let browserPromise = null;

export function getBrowser() {
  if (!browserPromise) {
   browserPromise = puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  args: [
    '--no-sandbox',            // container mein root user ke liye zaroori
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage', // chhote /dev/shm se crash bachata hai
    '--disable-gpu',
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