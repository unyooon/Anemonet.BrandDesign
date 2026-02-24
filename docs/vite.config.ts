import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs',
  base: '/Anemonet.BrandDesign/',
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
