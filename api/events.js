/**
 * Vercel Serverless：轉發 Ticketmaster Discovery（避免瀏覽器 CORS）
 * 環境變數：TICKETMASTER_API_KEY（Vercel 專案設定）
 */
import {
  fetchTicketmasterEvents,
  getDemoHKEvents,
} from '../src/lib/ticketmasterHelpers.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }
  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const lat = req.query?.lat || '22.3193'
  const lng = req.query?.lng || '114.1694'
  const key = process.env.TICKETMASTER_API_KEY

  if (!key) {
    return res.status(200).json({
      events: getDemoHKEvents(),
      source: 'demo',
      message: '未設定 TICKETMASTER_API_KEY，顯示示範資料。請到 Vercel → Settings → Environment Variables 加入免費 key。',
    })
  }

  try {
    const events = await fetchTicketmasterEvents(lat, lng, key)
    if (events.length === 0) {
      return res.status(200).json({
        events: getDemoHKEvents(),
        source: 'demo',
        message: '此位置附近暫無 Ticketmaster 活動，顯示示範資料。',
      })
    }
    return res.status(200).json({ events, source: 'ticketmaster' })
  } catch (e) {
    return res.status(200).json({
      events: getDemoHKEvents(),
      source: 'demo',
      error: e instanceof Error ? e.message : 'unknown',
    })
  }
}
