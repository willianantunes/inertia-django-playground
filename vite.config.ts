import { join, resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const INPUT_DIR = "./frontend";
  const OUTPUT_DIR = "./frontend/dist";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(INPUT_DIR),
      },
    },
    root: resolve(INPUT_DIR),
    base: "/static/",
    server: {
      host: "localhost",
      port: Number(env.DJANGO_VITE_DEV_SERVER_PORT) || 5173,
      watch: {
        usePolling: true,
      },
      cors: true,
    },
    build: {
      manifest: "manifest.json",
      emptyOutDir: true,
      outDir: resolve(OUTPUT_DIR),
      rollupOptions: {
        input: {
          main: join(INPUT_DIR, "/main.tsx"),
          css: join(INPUT_DIR, "/styles/main.css"),
        },
      },
    },
  };
});
