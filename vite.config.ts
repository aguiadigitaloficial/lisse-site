import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { contactApiPlugin } from './scripts/contact-api-plugin'

export default defineConfig(({ mode }) => {
  const localEnv = loadEnv(mode, process.cwd(), 'DATACRAZY_')
  process.env.DATACRAZY_WEBHOOK_URL ??= localEnv.DATACRAZY_WEBHOOK_URL
  return {
  plugins: [react(), tailwindcss(), contactApiPlugin(), {
    name: 'preview-route-documents',
    configurePreviewServer(server) {
      // Mirror Vercel's route documents instead of preview's homepage fallback.
      server.middlewares.use((request, _response, next) => {
        const [path, query] = (request.url ?? '/').split('?')
        if (['/harmonizacao', '/faloplastia', '/emagrecimento'].includes(path)) {
          request.url = `${path}/${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  }
})
