import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Redprints",
      fileName: "redprints",
    },
  },
});
