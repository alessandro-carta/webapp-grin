import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:8081',
    },
  },
  plugins: [react()],
})
