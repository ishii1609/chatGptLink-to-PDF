import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // /api se shuru hone wali requests backend (port 5000) ko jayengi
      '/api': 'http://localhost:5000',
    },
  },
});