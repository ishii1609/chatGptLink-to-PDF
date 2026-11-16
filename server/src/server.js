import app from './app.js';
import { env } from './config/env.js';
import { closeBrowser } from './services/browser.service.js';

const server = app.listen(env.port, () => {
  console.log(`Server chal raha hai: http://localhost:${env.port}`);
});

// Ctrl+C pe browser aur server saaf tareeke se band karo
async function shutdown() {
  server.close();
  await closeBrowser();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);