import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.woff2')) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
})
