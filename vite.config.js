import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    proxy: {
      '/api-meshify': {
        target:       'https://us.meshify.cloud',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/api-meshify/, ''),
        headers: {
          'Origin':  'https://vip.kora-top.zip',
          'Referer': 'https://vip.kora-top.zip/',
        },
      },
    },
  },
})
