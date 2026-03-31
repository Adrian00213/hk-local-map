import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// - dev：'/'（開 localhost 根路徑）
// - Vercel：'/'（網站喺網域根，例如 hk-local-map.vercel.app）
// - GitHub Pages：'/hk-local-map/'（專案 homepage 子路徑）
// https://vite.dev/config/shared-options.html#base
function productionBase() {
  if (process.env.VERCEL === '1') return '/'
  if (process.env.VITE_BASE_PATH) return process.env.VITE_BASE_PATH
  return '/hk-local-map/'
}

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : productionBase(),
}))
