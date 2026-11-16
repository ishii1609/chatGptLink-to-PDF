import puppeteer from 'puppeteer';

// Ek hi browser poore server ke liye. Har request pe naya Chrome nahi.
let browser = null;

export async function getBrowser() {
  // Pehli baar ya browser crash ho gaya ho to naya launch karo
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}