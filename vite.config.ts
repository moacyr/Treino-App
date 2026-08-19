import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project site: https://moacyr.github.io/Treino-App/
// O `base` precisa bater com o nome do repositório (com barras nas pontas).
const base = '/Treino-App/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Ficha Trekking',
        short_name: 'Trekking',
        description:
          'Ficha de treino de preparação para trilhas de carga alta. Registre a carga de cada série e acompanhe a progressão.',
        lang: 'pt-BR',
        theme_color: '#2563eb',
        background_color: '#f7f8fa',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        // Android/Chrome: links dentro do escopo abrem no app instalado em vez
        // do navegador, reaproveitando a janela já aberta. Não resolve o link
        // do e-mail (ele passa antes pelo domínio do Supabase), por isso o
        // login também aceita o código de 6 dígitos.
        handle_links: 'preferred',
        launch_handler: { client_mode: 'navigate-existing' },
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: `${base}index.html`,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
