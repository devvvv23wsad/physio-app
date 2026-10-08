import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Capacitor loads the built app from a local file/webview, so relative paths matter
  base: './',
  build: {
    outDir: 'dist',
  },
})
