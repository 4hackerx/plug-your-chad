import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  root: "./src/interface",
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/interface"),
    },
  },

  build: {
    outDir: "../../out/interface",
    rollupOptions: {
      input: {
        index: "src/interface/index.html", // Entry point for the main React app
      },
      output: {
        entryFileNames: (_) => {
          return `[name].js`;
        },
        chunkFileNames: (_) => {
          return `[name].js`;
        },
        assetFileNames: (_) => {
          return `[name].[ext]`;
        },
      },
    },
  },
});
