import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "docs",
  base: "/",
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "design-system": resolve(__dirname, "design-system.html"),
        legal: resolve(__dirname, "legal.html"),
        privacy: resolve(__dirname, "privacy.html"),
        "404": resolve(__dirname, "404.html"),
      },
    },
  },
});
