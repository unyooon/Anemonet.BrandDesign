import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs',
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
