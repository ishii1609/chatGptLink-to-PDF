import fs from 'node:fs';
import { generatePdf } from '../src/services/pdf.service.js';
import { closeBrowser } from '../src/services/browser.service.js';

const SHARE_URL = 'https://chatgpt.com/share/6af5ed4e-67d8-83ee-981b-f623e58e83af';

try {
  const pdfBuffer = await generatePdf(SHARE_URL);
  fs.writeFileSync('output.pdf', pdfBuffer);
  console.log(`Done! output.pdf ban gayi (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
} catch (err) {
  console.error('Failed:', err.message);
  process.exitCode = 1;
} finally {
  await closeBrowser(); // warna script atki rahegi
}