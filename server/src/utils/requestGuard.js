import dns from 'node:dns/promises';
import net from 'node:net';

const ALLOWED_NAV_HOSTS = new Set(['chatgpt.com']);

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 169 && b === 254) ||            // cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)     // CGNAT
    );
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7)); // IPv4-mapped
    return v === '::1' || v === '::' || v.startsWith('fc') ||
           v.startsWith('fd') || v.startsWith('fe80');
  }
  return true; // samajh na aaye to block
}

// Hostname -> safe hai ya nahi (DNS resolve karke asli IP check)
const cache = new Map();
async function isSafeHost(hostname) {
  if (cache.has(hostname)) return cache.get(hostname);

  let safe;
  if (hostname === 'localhost' || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
    safe = false;
  } else if (net.isIP(hostname)) {
    safe = !isPrivateIp(hostname);
  } else {
    try {
      const addrs = await dns.lookup(hostname, { all: true });
      safe = addrs.length > 0 && addrs.every((a) => !isPrivateIp(a.address));
    } catch {
      safe = false;
    }
  }
  cache.set(hostname, safe);
  return safe;
}

export async function isRequestAllowed(request) {
  let url;
  try {
    url = new URL(request.url());
  } catch {
    return false;
  }

  if (url.protocol === 'data:' || url.protocol === 'blob:' || url.href === 'about:blank') {
    return true;
  }
  if (url.protocol !== 'https:') return false; // http, file:, ftp: sab block

  // Main page navigation (redirects bhi yahin pakde jayenge): sirf chatgpt.com
  const isMainNav =
    request.isNavigationRequest() && request.frame()?.parentFrame() === null;
  if (isMainNav && !ALLOWED_NAV_HOSTS.has(url.hostname)) return false;

  return isSafeHost(url.hostname);
}

export async function installRequestGuard(page) {
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    try {
      if (await isRequestAllowed(request)) await request.continue();
      else await request.abort('blockedbyclient');
    } catch {
      // request pehle hi handle ho chuki ho sakti hai, ignore
    }
  });
}