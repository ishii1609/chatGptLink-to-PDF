import { validateShareUrl } from '../src/utils/validateShareUrl.js';

const cases = [
  'https://chatgpt.com/share/6af5ed4e-67d8-83ee-981b-f623e58e83af', // sahi
  'http://chatgpt.com/share/abc',                                    // http: galat
  'https://chatgpt.com.evil.com/share/abc',                          // fake domain
  'https://chatgpt.com/c/abc',                                       // private chat
  'http://localhost:5000/admin',                                     // SSRF try
  'hello',                                                           // URL hi nahi
];

for (const c of cases) {
  try {
    console.log('OK   ', validateShareUrl(c));
  } catch (e) {
    console.log('BLOCK', c, '->', e.message);
  }
}