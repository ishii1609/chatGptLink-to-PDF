// Saare errors yahin aate hain, taaki response ka format ek jaisa rahe
export function errorHandler(err, req, res, next) {
  // Puppeteer timeout ko 504 mein badlo
  if (err.name === 'TimeoutError') {
    return res.status(504).json({
      error: 'Link khulne mein bahut time laga. Link private/expired ho sakta hai.',
    });
  }

  const status = err.statusCode || 500;

  // Unexpected errors ki detail user ko mat dikhao, sirf server log mein rakho
  if (status === 500) console.error(err);

  res.status(status).json({
    error: status === 500 ? 'Server mein kuch gadbad hui.' : err.message,
  });
}