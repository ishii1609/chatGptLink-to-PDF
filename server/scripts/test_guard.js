import { isRequestAllowed } from '../src/utils/requestGuard.js';

// Fake request object (sirf test ke liye)
const fake = (url, nav = false) => ({
  url: () => url,
  isNavigationRequest: () => nav,
  frame: () => ({ parentFrame: () => null }),
});

const cases = [
  ['https://chatgpt.com/share/abc', true],          // allow
  ['https://cdn.oaistatic.com/x.js', false],        // sub-resource: allow
  ['https://evil.com/redirect', true],              // main nav, galat host: block
  ['http://169.254.169.254/latest/meta-data', false],
  ['https://127.0.0.1:5000/api/health', false],
  ['https://localhost/x', false],
  ['file:///C:/Windows/win.ini', false],
];

for (const [url, nav] of cases) {
  console.log(await isRequestAllowed(fake(url, nav)) ? 'ALLOW' : 'BLOCK', url);
}