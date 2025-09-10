import { join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd(), '')

  const INPUT_DIR = './frontend'
  const OUTPUT_DIR = './frontend/dist'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(INPUT_DIR, 'js'),
      },
    },
    root: resolve(INPUT_DIR),
    base: '/static/',
    server: {
      host: 'localhost',
      port: env.DJANGO_VITE_DEV_SERVER_PORT || 5173,
      watch: {
        usePolling: true,
      },
      cors: true,
    },
    build: {
      manifest: 'manifest.json',
      emptyOutDir: true,
      outDir: resolve(OUTPUT_DIR),
      rollupOptions: {
        input: {
          main: join(INPUT_DIR, '/js/main.jsx'),
          css: join(INPUT_DIR, '/css/main.css'),
        },
      },
    },
  }
})
