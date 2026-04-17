import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: { port: 3000, host: true },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        gateway: resolve(__dirname, 'index.html'),
        art: resolve(__dirname, 'art/index.html'),
        resort: resolve(__dirname, 'resort/index.html')
      }
    }
  }
});
