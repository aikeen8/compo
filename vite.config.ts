import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'], 
      manifest: {
        name: 'compo',
        short_name: 'compo',
        description: 'a place to compose.',
        theme_color: '#121214',
        background_color: '#121214',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})