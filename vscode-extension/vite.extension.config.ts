import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../out",
    target: "node12",
    lib: {
      entry: "src/extension/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["vscode", "path", "fs", "http"],
      input: {
        extension: "src/extension/index.ts", // Entry point for the extension script
      },
      output: {
        entryFileNames: (_) => {
          return `[name].cjs`;
        },
        format: "cjs",
      },
      preserveEntrySignatures: "strict",
    },
  },
});
