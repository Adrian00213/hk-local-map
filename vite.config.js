import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import {
  fetchTicketmasterEvents,
  getDemoHKEvents,
} from './src/lib/ticketmasterHelpers.js'

// - dev：'/'（開 localhost 根路徑）
// - Vercel：'/'（網站喺網域根，例如 hk-local-map.vercel.app）
// - GitHub Pages：'/hk-local-map/'（專案 homepage 子路徑）
function productionBase() {
  if (process.env.VERCEL === '1') return '/'
  if (process.env.VITE_BASE_PATH) return process.env.VITE_BASE_PATH
  return '/hk-local-map/'
}

/** 本機 dev：/api/events 轉發 Ticketmaster（與 Vercel api/events.js 一致） */
function eventsApiDevPlugin() {
  return {
    name: 'hk-events-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/events')) {
          next()
          return
        }
        const url = new URL(req.url, 'http://localhost')
        const lat = url.searchParams.get('lat') || '22.3193'
        const lng = url.searchParams.get('lng') || '114.1694'
        const env = loadEnv(server.config.mode, process.cwd(), '')
        const key = env.TICKETMASTER_API_KEY || env.VITE_TICKETMASTER_API_KEY
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        try {
          if (!key) {
            res.end(
              JSON.stringify({
                events: getDemoHKEvents(),
                source: 'demo',
                message:
                  '本機請在 .env 設定 TICKETMASTER_API_KEY（免費申請 Ticketmaster Developer）以載入真實演唱會／活動。',
              }),
            )
            return
          }
          const events = await fetchTicketmasterEvents(lat, lng, key)
          if (events.length === 0) {
            res.end(
              JSON.stringify({
                events: getDemoHKEvents(),
                source: 'demo',
                message: '此位置附近暫無 Ticketmaster 活動',
              }),
            )
            return
          }
          res.end(JSON.stringify({ events, source: 'ticketmaster' }))
        } catch (e) {
          res.end(
            JSON.stringify({
              events: getDemoHKEvents(),
              source: 'demo',
              error: e instanceof Error ? e.message : 'unknown',
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/shared-options.html#base
export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'serve' ? [eventsApiDevPlugin()] : [])],
  base: command === 'serve' ? '/' : productionBase(),
}))
