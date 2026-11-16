import { AppError } from './AppError.js';

// Sirf https://chatgpt.com/share/<id> allow hai
const SHARE_PATH = /^\/share\/[a-zA-Z0-9-]+\/?$/;

export function validateShareUrl(input) {
  if (typeof input !== 'string' || input.length > 200) {
    throw new AppError('Invalid link', 400);
  }

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    throw new AppError('url not valid', 400);
  }

  const isAllowed =
    url.protocol === 'https:' &&
    url.hostname === 'chatgpt.com' &&
    SHARE_PATH.test(url.pathname);

  if (!isAllowed) {
    throw new AppError(
      'only https://chatgpt.com/share/<id> format is allowed',
      400
    );
  }

  // Query/hash hata ke clean URL wapas do
  return `${url.origin}${url.pathname}`;
}
