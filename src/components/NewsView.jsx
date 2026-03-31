import { useState, useEffect } from 'react'
import {
  Newspaper,
  RefreshCw,
  MessageCircle,
  Plus,
  Globe,
  AlertCircle,
  Clock,
  Timer,
  ExternalLink,
  CalendarDays,
} from 'lucide-react'
import { useMap } from '../context/MapContext'
import newsService from '../services/NewsService'
import communityService from '../services/CommunityService'
import queueService from '../services/QueueService'
import { fetchNearbyEvents } from '../services/EventsApi'

export default function NewsView({ darkMode }) {
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [newsItems, setNewsItems] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [queueAttractions, setQueueAttractions] = useState([])
  const [eventsItems, setEventsItems] = useState([])
  const [eventsHint, setEventsHint] = useState('')
  const [eventsLoading, setEventsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('news')
  const [currentRegion, setCurrentRegion] = useState('未知地區')

  useEffect(() => {
    if (activeTab === 'news') {
      loadNews()
    } else if (activeTab === 'events') {
      loadEvents()
    } else if (activeTab === 'community') {
      loadCommunityPosts()
    } else if (activeTab === 'queue') {
      loadQueueAttractions()
    }
  }, [userLocation, activeTab])

  const loadNews = () => {
    try {
      let news = []
      if (userLocation && !locationError) {
        news = newsService.getRealTimeNews(userLocation.lat, userLocation.lng)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        news = [{
          id: 'no_location',
          type: 'info',
          title: '📍 等待位置資訊',
          message: '請允許位置權限以獲取本地資訊',
          priority: 'info',
          icon: '📍',
          timestamp: new Date().toISOString()
        }]
        setCurrentRegion('未知地區')
      }
      setNewsItems(news)
    } catch (error) {
      console.error('❌ 加載資訊失敗:', error)
    }
  }

  const loadCommunityPosts = () => {
    try {
      let posts = []
      if (userLocation && !locationError) {
        posts = communityService.getNearbyPosts(userLocation.lat, userLocation.lng, 10, 10)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        posts = communityService.getPopularPosts(10)
        setCurrentRegion('附近')
      }
      setCommunityPosts(posts)
    } catch (error) {
      console.error('❌ 加載社區發佈失敗:', error)
    }
  }

  const loadQueueAttractions = () => {
    try {
      const attractions = queueService.queueData.slice(0, 10)
      setQueueAttractions(attractions)
      setCurrentRegion('熱門景點')
    } catch (error) {
      console.error('❌ 加載排隊資訊失敗:', error)
      setQueueAttractions([])
    }
  }

  const loadEvents = async () => {
    setEventsLoading(true)
    setEventsHint('')
    try {
      const lat = userLocation?.lat ?? 22.3193
      const lng = userLocation?.lng ?? 114.1694
      if (userLocation && !locationError) {
        const regionInfo = newsService.getRegionInfo(lat, lng)
        setCurrentRegion(regionInfo.name)
      } else {
        setCurrentRegion('香港（預設位置）')
      }
      const data = await fetchNearbyEvents(lat, lng)
      setEventsItems(data.events || [])
      const parts = []
      if (data.message) parts.push(data.message)
      if (data.source === 'ticketmaster') parts.push('資料來源：Ticketmaster')
      else parts.push('示範／離線資料')
      setEventsHint(parts.join(' · '))
    } catch (error) {
      console.error('❌ 加載活動失敗:', error)
      setEventsItems([])
      setEventsHint('載入失敗')
    } finally {
      setEventsLoading(false)
    }
  }

  const headerStyle =
    activeTab === 'events'
      ? 'from-amber-500 to-orange-600'
      : activeTab === 'community'
        ? 'from-emerald-500 to-green-600'
        : activeTab === 'queue'
          ? 'from-violet-500 to-purple-600'
          : 'from-blue-500 to-cyan-500'

  const HeaderIcon =
    activeTab === 'events'
      ? CalendarDays
      : activeTab === 'community'
        ? MessageCircle
        : activeTab === 'queue'
          ? Clock
          : Newspaper

  const handleCreatePost = () => {
    const content = prompt('分享你身邊嘅新鮮事：')
    if (!content) return
    
    try {
      const postData = {
        content: content,
        category: 'general',
        location: userLocation || { lat: 22.3193, lng: 114.1694 },
        locationName: currentRegion,
        username: '我',
        userAvatar: '👤'
      }
      communityService.createPost(postData)
      loadCommunityPosts()
      alert('發佈成功！')
    } catch (error) {
      console.error('❌ 發佈失敗:', error)
      alert('發佈失敗')
    }
  }

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-950' : 'bg-zinc-50'}`}>
      <div className={`${darkMode ? 'bg-gray-900/95' : 'bg-white'} px-4 sm:px-5 pt-5 pb-4 border-b ${darkMode ? 'border-gray-800' : 'border-zinc-100'} shadow-sm`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${headerStyle} flex items-center justify-center shadow-md shrink-0`}>
              <HeaderIcon className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {activeTab === 'news'
                  ? '智能資訊'
                  : activeTab === 'events'
                    ? '演唱會 · 活動'
                    : activeTab === 'community'
                      ? '即時討論'
                      : '排隊資訊'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium max-w-[14rem] truncate ${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-blue-50 text-blue-700'}`}
                >
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="truncate">{currentRegion}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'community' && (
              <button
                onClick={handleCreatePost}
                className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center`}
              >
                <Plus className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </button>
            )}
            <button
              type="button"
              title="重新整理"
              onClick={() => {
                if (activeTab === 'news') loadNews()
                else if (activeTab === 'events') loadEvents()
                else if (activeTab === 'community') loadCommunityPosts()
                else loadQueueAttractions()
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-95 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-zinc-100 hover:bg-zinc-200'}`}
            >
              <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`} />
            </button>
          </div>
        </div>

        <div
          className={`flex mt-4 gap-1 p-1 rounded-2xl ${darkMode ? 'bg-gray-950/80 ring-1 ring-gray-800' : 'bg-zinc-100/90 ring-1 ring-zinc-200/80'}`}
          role="tablist"
        >
          {[
            { id: 'news', label: '資訊' },
            { id: 'events', label: '活動' },
            { id: 'community', label: '討論' },
            { id: 'queue', label: '排隊' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 min-w-0 py-2.5 px-1 rounded-xl text-center text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? darkMode
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white text-zinc-900 shadow-sm'
                  : darkMode
                    ? 'text-zinc-500 hover:text-zinc-300'
                    : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {locationError && (
        <div className={`mx-4 mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${darkMode ? 'border-red-800' : 'border-red-200'}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <div className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>位置權限問題</div>
              <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                請啟用位置權限以獲取本地資訊
              </div>
            </div>
            <button
              onClick={refreshUserLocation}
              className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-red-700' : 'bg-red-600'} text-white`}
            >
              重試
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'news' ? (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white'} border ${darkMode ? 'border-gray-700/80' : 'border-zinc-100'} p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-2xl shadow-inner`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {item.title}
                      </h3>
                      {item.type === 'deal' && item.timeLeft && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
                          <Timer className="w-3 h-3" />
                          <span>{item.timeLeft}</span>
                        </div>
                      )}
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                      {item.message}
                    </p>
                    {item.type === 'deal' && item.expiry && (
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                        到期日: {item.expiry}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'events' ? (
          <div className="space-y-4">
            {eventsLoading && (
              <div className="space-y-3 pt-1" aria-busy="true">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-28 rounded-2xl animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-zinc-200/80'}`}
                  />
                ))}
                <p className={`text-center text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>載入演唱會／活動…</p>
              </div>
            )}
            {!eventsLoading && eventsHint && (
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed border ${darkMode ? 'bg-amber-950/40 border-amber-800/50 text-amber-100/95' : 'bg-amber-50 border-amber-200/80 text-amber-950'}`}
              >
                {eventsHint}
              </div>
            )}
            {!eventsLoading &&
              eventsItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden border-l-[4px] ${darkMode ? 'border-l-amber-500 bg-gray-800/80 border border-gray-700/80' : 'border-l-amber-500 bg-white border border-zinc-100'} p-5 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-gradient-to-br from-amber-600 to-orange-600' : 'bg-gradient-to-br from-amber-400 to-orange-500'} flex items-center justify-center text-white text-2xl shadow-md`}
                    >
                      {item.icon || '📅'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-bold leading-snug ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h3>
                        {item.category && (
                          <span
                            className={`shrink-0 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium ${darkMode ? 'bg-gray-900/80 text-amber-200/90' : 'bg-amber-100 text-amber-900'}`}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>{item.message}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition ${darkMode ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' : 'bg-amber-100 text-amber-900 hover:bg-amber-200/80'}`}
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                          詳情／購票
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : activeTab === 'community' ? (
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className={`rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white'} border ${darkMode ? 'border-gray-700/80' : 'border-zinc-100'} p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                    {post.userAvatar}
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {post.username}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'} mt-1`}>
                      {post.locationName} • {post.distance}km
                    </div>
                  </div>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-3`}>
                  {post.content}
                </p>
                <div className={`flex items-center gap-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">❤️</div>
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">💬</div>
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">↪️</div>
                    <span className="text-sm">{post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {queueAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className={`rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white'} border ${darkMode ? 'border-gray-700/80' : 'border-zinc-100'} p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{attraction.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {attraction.name}
                    </h3>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'} mt-1`}>
                      {attraction.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {attraction.currentWaitTime}分鐘
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {attraction.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-gray-900/95' : 'bg-white'} border-t ${darkMode ? 'border-gray-800' : 'border-zinc-100'} px-5 py-3.5 safe-area-bottom`}>
        <div className={`text-xs flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
              activeTab === 'events'
                ? 'bg-amber-500'
                : activeTab === 'community'
                  ? 'bg-emerald-500'
                  : activeTab === 'queue'
                    ? 'bg-violet-500'
                    : 'bg-blue-500'
            }`}
            aria-hidden
          />
          {activeTab === 'news'
            ? `${newsItems.length} 則資訊 • ${currentRegion}`
            : activeTab === 'events'
              ? `${eventsItems.length} 個活動 • ${currentRegion}`
              : activeTab === 'community'
                ? `${communityPosts.length} 則發佈 • ${currentRegion}`
                : `${queueAttractions.length} 個景點 • ${currentRegion}`}
        </div>
      </div>
    </div>
  )
}