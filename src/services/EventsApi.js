import { getDemoHKEvents } from '../lib/ticketmasterHelpers.js'

/**
 * 讀取附近演唱會／活動（Ticketmaster，經 /api/events 代理）
 */
export async function fetchNearbyEvents(lat, lng) {
  const q = new URLSearchParams({
    lat: String(lat ?? 22.3193),
    lng: String(lng ?? 114.1694),
  })
  try {
    const r = await fetch(`/api/events?${q.toString()}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const data = await r.json()
    if (Array.isArray(data.events) && data.events.length > 0) {
      return data
    }
    return {
      events: getDemoHKEvents(),
      source: data.source || 'demo',
      message: data.message || '暫無資料，顯示示範內容',
    }
  } catch (e) {
    console.warn('[EventsApi]', e)
    return {
      events: getDemoHKEvents(),
      source: 'demo',
      message: '無法連接活動 API（靜態部署可能無 /api）。顯示示範資料。',
      error: e instanceof Error ? e.message : 'fetch failed',
    }
  }
}

export default { fetchNearbyEvents }
