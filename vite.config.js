import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api-kora': {
        target: 'https://kora-api.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-kora/, ''),
      },
      '/api-meshify': {
        target: 'https://us.meshify.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-meshify/, ''),
      },
    },
  },
})
