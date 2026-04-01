import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'compo',
        short_name: 'compo',
        description: 'a place to compose.',
        theme_color: '#121214',
        background_color: '#121214',
        display: 'standalone',
        icons: [
          {
            src: 'public/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'public/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})