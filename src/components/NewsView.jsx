import { useState, useEffect } from 'react'
import { Newspaper, Clock, MapPin, Brain, Star, TrendingUp, Gift, AlertCircle, RefreshCw, Navigation, Utensils, Compass, Bus, Coffee, ShoppingBag, Home, Navigation2, Megaphone, Zap } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import { getPlaces } from '../services/MapData'

// Static news/messages data
const STATIC_NEWS = [
  {
    id: 'news_1',
    title: '📢 香港美食節 2026 強勢回歸',
    desc: '超過200間本地及國際美食參與，多間餐廳推出限定優惠，美食節為期兩週',
    source: '香港旅遊發展局',
    time: '今日',
    badge: '🔥 熱辣辣',
    urgent: true
  },
  {
    id: 'news_2',
    title: '🏛️ M+博物館 免費導賞團',
    desc: '每日3場免費導賞，預約從速，名額有限先到先得',
    source: '西九文化區',
    time: '本週',
    badge: '🎨 文化',
    urgent: false
  },
  {
    id: 'news_3',
    title: '🌤️ 週末天氣預報',
    desc: '週六週日大致天晴，氣溫25-30度，出門記得防曬',
    source: '天文台',
    time: '預報',
    badge: '⛅ 天氣',
    urgent: false
  },
  {
    id: 'news_4',
    title: '🚇 MTR 週末優惠',
    desc: '八達通週日免費轉乘優惠，環保出行慳更多',
    source: '港鐵',
    time: '週末',
    badge: '🚇 交通',
    urgent: false
  },
  {
    id: 'news_5',
    title: '🎫 香港故宮博物館 新展覽',
    desc: '北京故宮珍藏清代宮廷文物展，限期展出',
    source: '故宮博物館',
    time: '新展',
    badge: '🏛️ 文化',
    urgent: false
  },
  {
    id: 'news_6',
    title: '🍜 譚仔三哥 新口味登場',
    desc: '全新雲南麻辣湯底，辣度任選，香港首間旗艦店',
    source: '譚仔三哥',
    time: '新店',
    badge: '🆕 新店',
    urgent: false
  },
]

// Static offers data
const STATIC_OFFERS = [
  {
    id: 'offer_1',
    title: '🎉 香港美食節 2026',
    desc: '超過200間本地及國際美食參與，多間餐廳推出限定優惠',
    cat: 'restaurants',
    badge: '🔥 熱辣辣',
    urgent: true
  },
  {
    id: 'offer_2',
    title: '💳 AlipayHK 消費券',
    desc: '用 AlipayHK 付款最高回贈 $500，指定商戶再享額外折扣',
    cat: 'deals',
    badge: '💰 必搵',
    urgent: false
  },
  {
    id: 'offer_3',
    title: '🛍️ 海港城春季購物節',
    desc: '超過500間商店參與，最高7折優惠',
    cat: 'shopping',
    badge: '🛒 購物',
    urgent: false
  },
  {
    id: 'offer_4',
    title: '☕ 咖啡店買一送一',
    desc: '指定咖啡店下午茶時段優惠',
    cat: 'restaurants',
    badge: '☕ 下午茶',
    urgent: false
  },
]

// Time-specific offers
const getTimeOffer = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 11) {
    return { id: 'time_bf', title: '🌅 朝早早餐優惠', desc: '茶餐廳早餐套餐 $25 起', cat: 'restaurants', badge: '🍳 早餐特價' }
  } else if (hour >= 11 && hour < 14) {
    return { id: 'time_ln', title: '☀️ 午餐優惠', desc: '午市套餐最高慳 $30', cat: 'restaurants', badge: '🍜 午餐精選' }
  } else if (hour >= 14 && hour < 18) {
    return { id: 'time_at', title: '🌤️ 下午茶時段', desc: 'CAFÉ 甜品半價', cat: 'restaurants', badge: '🍰 下午茶' }
  } else if (hour >= 17 && hour < 21) {
    return { id: 'time_dn', title: '🌆 晚餐優惠', desc: '指定餐廳晚市8折', cat: 'restaurants', badge: '🍽️ 晚餐特選' }
  } else {
    return { id: 'time_nt', title: '🌙 夜貓特價', desc: '便利店精選貨品買一送一', cat: 'deals', badge: '🏪 夜貓著' }
  }
}

const catColors = {
  restaurants: 'from-yellow-600 to-yellow-500',
  places: 'from-blue-500 to-indigo-500',
  deals: 'from-red-500 to-pink-500',
  shopping: 'from-purple-500 to-violet-500',
  transport: 'from-emerald-500 to-teal-500',
  news: 'from-green-500 to-emerald-500'
}

const catIcons = {
  restaurants: Utensils,
  places: Compass,
  deals: Gift,
  shopping: ShoppingBag,
  transport: Bus,
  news: Newspaper
}

export default function NewsView({ darkMode }) {
  const [region, setRegion] = useState('hong_kong')
  const [activeCat, setActiveCat] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Load nearby places
    loadNearbyPlaces()
  }, [region])

  const loadNearbyPlaces = () => {
    setRefreshing(true)
    const places = getPlaces(region, activeCat || 'all')
    setNearbyPlaces(places)
    setLastUpdate(new Date())
    setRefreshing(false)
  }

  const handleRefresh = () => {
    loadNearbyPlaces()
  }

  const timeOffer = getTimeOffer()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return '🌅 朝早好'
    if (hour >= 11 && hour < 14) return '☀️ 午飯時間'
    if (hour >= 14 && hour < 18) return '🌤️ 下午時光'
    if (hour >= 18 && hour < 22) return '🌆 晚晚開始'
    return '🌙 夜喇'
  }

  // Handle navigation
  const handleNavigate = (place) => {
    const lat = place.lat || place.geometry?.location?.lat()
    const lng = place.lng || place.geometry?.location?.lng()
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank')
    }
  }

  const categories = [
    { id: null, label: '全部', icon: Home },
    { id: 'restaurants', label: '餐廳', icon: Utensils },
    { id: 'places', label: '好去處', icon: Compass },
    { id: 'shopping', label: '購物', icon: ShoppingBag },
    { id: 'deals', label: '優惠', icon: Gift },
    { id: 'transport', label: '交通', icon: Bus },
  ]

  const filteredPlaces = activeCat 
    ? nearbyPlaces.filter(p => p.category === activeCat)
    : nearbyPlaces

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-amber-50/50 to-white'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-amber-100/50'} backdrop-blur-xl border-b px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>📰 資訊中心</h1>
              <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>為你精挑細選</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`w-10 h-10 rounded-xl bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-all active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-yellow-600" />
          </button>
        </div>
      </div>

      {/* Time-based Greeting Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-stone-100 to-stone-200 border-b border-yellow-200/50">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700 font-medium">
            {getGreeting()}！為你精選附近優惠：
          </span>
        </div>
      </div>

      {/* Region Selector */}
      <div className="px-5 py-3 bg-white border-b border-zinc-100/50">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['hong_kong', 'china', 'taiwan', 'japan', 'korea', 'se_asia', 'europe'].map(r => {
            const labels = { hong_kong: '🇭🇰 香港', china: '🇨🇳 大陸', taiwan: '🇹🇼 台灣', japan: '🇯🇵 日本', korea: '🇰🇷 韓國', se_asia: '🌏 東南亞', europe: '🇪🇺 歐洲' }
            return (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  region === r 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {labels[r]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-5 py-3 bg-white border-b border-zinc-100/50">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id || 'all'}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  activeCat === cat.id
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Time-based Special Offer */}
        <div className="px-5 py-4">
          <div 
            className={`bg-gradient-to-r ${catColors[timeOffer.cat]} rounded-2xl p-4 text-white shadow-lg cursor-pointer active:scale-[0.98] transition-transform`}
            onClick={() => setActiveCat(timeOffer.cat)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium opacity-80">{timeOffer.badge}</span>
                <h3 className="font-bold text-lg mt-1">{timeOffer.title}</h3>
                <p className="text-sm opacity-90 mt-1">{timeOffer.desc}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Places Section */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-zinc-900">附近精選</h2>
            <span className="ml-auto text-xs text-zinc-400">{filteredPlaces.length} 個地點</span>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-zinc-100/50">
              <Compass className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">暫時冇相關地點</p>
              <button 
                onClick={() => setActiveCat(null)}
                className="mt-2 text-yellow-600 text-sm font-medium"
              >
                查看全部 →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlaces.map((place, idx) => (
                <div
                  key={place.id || `place-${idx}`}
                  className="bg-white rounded-2xl border border-amber-100/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`h-1 bg-gradient-to-r ${catColors[place.category] || 'from-zinc-400 to-neutral-500'}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Emoji Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catColors[place.category] || 'from-amber-100 to-orange-100'} flex items-center justify-center text-2xl shrink-0`}>
                        {CATEGORY_ICONS[place.category] || '📍'}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-yellow-600 font-medium px-2 py-0.5 bg-yellow-100 rounded-full">
                            {CATEGORY_LABELS[place.category] || place.category}
                          </span>
                          {place.rating && (
                            <span className="text-xs text-yellow-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-500 fill-amber-400" />
                              {place.rating}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-zinc-900 text-base leading-tight">{place.name}</h3>
                        {place.description && (
                          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{place.description}</p>
                        )}
                        {place.price !== undefined && (
                          <p className="text-sm font-medium text-yellow-600 mt-1">
                            {place.price > 0 ? `$${place.price}` : '免費'}
                          </p>
                        )}
                      </div>

                      {/* Navigate Button */}
                      <button
                        onClick={() => handleNavigate(place)}
                        className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform"
                      >
                        <Navigation2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* News Section */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-zinc-900">最新消息</h2>
            <span className="ml-auto text-xs text-zinc-400">{STATIC_NEWS.length} 則</span>
          </div>

          <div className="space-y-2">
            {STATIC_NEWS.map(news => (
              <div
                key={news.id}
                className={`bg-white rounded-xl border ${news.urgent ? 'border-yellow-300 border-l-4 border-l-stone-600' : 'border-yellow-100/50'} p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${news.urgent ? 'bg-yellow-200 text-yellow-700' : 'bg-yellow-50 text-yellow-600'}`}>
                        {news.badge}
                      </span>
                      <span className="text-[10px] text-zinc-400">{news.source}</span>
                    </div>
                    <h4 className="font-semibold text-zinc-900 text-sm leading-tight line-clamp-1">{news.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{news.desc}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span className="text-[10px] text-zinc-400">{news.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Static Offers Section */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-zinc-900">精選優惠</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATIC_OFFERS.map(offer => (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl border border-yellow-100/50 overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform`}
                onClick={() => setActiveCat(offer.cat)}
              >
                <div className={`h-1.5 bg-gradient-to-r ${catColors[offer.cat] || 'from-stone-400 to-stone-500'}`} />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-lg shrink-0">
                      {CATEGORY_ICONS[offer.cat] || '🎁'}
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${offer.urgent ? 'bg-yellow-200 text-yellow-700' : 'bg-yellow-100 text-yellow-600'}`}>
                      {offer.badge}
                    </span>
                  </div>
                  <h4 className="font-semibold text-zinc-900 text-sm mt-2 line-clamp-1">{offer.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center py-4 px-5">
          <p className="text-xs text-zinc-400">
            最後更新：{lastUpdate.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
}