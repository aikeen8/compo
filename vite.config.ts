import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // include the fallback icons here so they get cached
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], 
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
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})