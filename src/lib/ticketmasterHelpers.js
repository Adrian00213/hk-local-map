/**
 * Ticketmaster Discovery API 回應 → 資訊卡片格式
 * @see https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */

export function mapTicketmasterJson(data) {
  const list = data?._embedded?.events
  if (!Array.isArray(list)) return []
  return list.map((ev) => {
    const venue = ev._embedded?.venues?.[0]
    const venueName = venue?.name || '地點待定'
    const city = venue?.city?.name || ''
    const date = ev.dates?.start?.localDate || ''
    const time = ev.dates?.start?.localTime || ''
    const dateLabel = [date, time].filter(Boolean).join(' ')
    const seg = ev.classifications?.[0]?.segment?.name || '活動'
    const icon =
      seg === 'Music'
        ? '🎤'
        : seg === 'Sports'
          ? '⚽'
          : seg === 'Arts & Theatre'
            ? '🎭'
            : '📅'
    return {
      id: `tm-${ev.id}`,
      type: 'event',
      category: seg,
      title: ev.name || '活動',
      message: [venueName, city, dateLabel].filter(Boolean).join(' · '),
      icon,
      priority: 'high',
      url: ev.url,
      venue: venueName,
      dateLabel,
      timestamp: new Date().toISOString(),
    }
  })
}

/** 無 API key 或 API 無資料時嘅香港活動示範（靜態） */
export function getDemoHKEvents() {
  return [
    {
      id: 'demo-hk-1',
      type: 'event',
      category: 'Music',
      title: '紅館 · 流行演唱會季',
      message: '香港體育館 · 請申請 Ticketmaster API key 以載入真實排期',
      icon: '🎤',
      priority: 'medium',
      dateLabel: '不定期',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-hk-2',
      type: 'event',
      category: 'Arts & Theatre',
      title: '西九文化區 · 舞台演出',
      message: '戲曲中心 / 自由空間 · 節目請以官方為準',
      icon: '🎭',
      priority: 'medium',
      dateLabel: '全年',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-hk-3',
      type: 'event',
      category: 'Community',
      title: '維多利亞公園 · 大型活動',
      message: '銅鑼灣 · 節慶／市集活動（示範資料）',
      icon: '🎪',
      priority: 'low',
      dateLabel: '週末',
      timestamp: new Date().toISOString(),
    },
  ]
}

export async function fetchTicketmasterEvents(lat, lng, apiKey) {
  const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${lat},${lng}&radius=50&unit=km&size=25&locale=*&sort=date,asc`
  const r = await fetch(tmUrl)
  const data = await r.json()
  if (!r.ok) {
    const msg = data?.errors?.[0]?.detail || data?.fault?.faultstring || r.statusText
    throw new Error(msg || 'Ticketmaster request failed')
  }
  return mapTicketmasterJson(data)
}
