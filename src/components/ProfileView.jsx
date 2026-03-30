import { useState, useEffect } from 'react'
import { User, Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, Clock, MapPin, CreditCard, Smartphone, CheckCircle, ThumbsUp, LogOut, Edit3, Camera, Sparkles, TrendingUp, Moon, Sun, MapPin as MapPinIcon, Locate } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMap } from '../context/MapContext'

// Sample saved deals for display
const SAVED_DEALS = [
  {
    id: '1',
    title: 'AlipayHK 消費券',
    desc: '用 AlipayHK 付款最高回贈 $500',
    brand: '支付寶HK',
    icon: '💜',
    color: 'from-purple-500 to-pink-500',
    validUntil: '2026-03-31',
  },
  {
    id: '4',
    title: 'HSBC 信用卡 餐飲85折',
    desc: '指定餐廳消費85折優惠',
    brand: 'HSBC',
    icon: '🔴',
    color: 'from-red-500 to-rose-500',
    validUntil: '2026-03-31',
  },
]

// Sample user reviews
const USER_REVIEWS = [
  {
    id: '1',
    placeName: '九記牛腩',
    rating: 5,
    text: '真係必試！牛腩軟腍入味，麵底掛湯👍',
    time: '2日前',
    likes: 23,
  },
  {
    id: '2',
    placeName: '山頂纜車',
    rating: 4,
    text: '維港景色一流！建議傍晚去睇日落',
    time: '1週前',
    likes: 45,
  },
]

const MENU_ITEMS = [
  { icon: Heart, label: '我的收藏', subtitle: '已收藏地點', color: 'from-pink-500 to-rose-500', badge: 3 },
  { icon: Gift, label: '我的優惠', subtitle: '收藏的優惠', color: 'from-yellow-500 to-yellow-600', badge: 2 },
  { icon: MessageCircle, label: '我的點評', subtitle: '發表的點評', color: 'from-emerald-500 to-teal-500', badge: 2 },
  { icon: Star, label: '我的評分', subtitle: '評分歷史', color: 'from-violet-500 to-purple-500', badge: null },
  { icon: Bell, label: '通知設定', subtitle: '推送通知', color: 'from-blue-500 to-cyan-500', badge: null },
  { icon: Shield, label: '私隱設定', subtitle: '資料安全', color: 'from-slate-500 to-gray-500', badge: null },
  { icon: Globe, label: '語言設定', subtitle: '繁體/簡體/English', color: 'from-teal-500 to-emerald-500', badge: null },
  { icon: Settings, label: '帳戶設定', subtitle: '個人資料', color: 'from-zinc-500 to-neutral-500', badge: null },
]

export default function ProfileView({ darkMode, toggleDarkMode }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [savedDeals, setSavedDeals] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeSection, setActiveSection] = useState(null) // 'deals' | 'reviews' | 'favorites'
  const [locationStatus, setLocationStatus] = useState('loading')
  const [userArea, setUserArea] = useState('香港')

  useEffect(() => {
    // Load saved deals
    const saved = localStorage.getItem('hk_saved_deals')
    if (saved) {
      const savedIds = JSON.parse(saved)
      setSavedDeals(SAVED_DEALS.filter(d => savedIds.includes(d.id)))
    }
    setUserReviews(USER_REVIEWS)
    
    // Load favorites
    const favs = localStorage.getItem('hk_favorites')
    if (favs) setFavorites(JSON.parse(favs))
    
    // Update location status
    updateLocationStatus()
  }, [userLocation, locationError])

  const updateLocationStatus = () => {
    if (userLocation && !locationError) {
      setLocationStatus('located')
      // 簡單區域判斷
      const areas = {
        'kowloon': '九龍',
        'hk_island': '香港島', 
        'new_territories': '新界'
      }
      setUserArea('香港')
    } else if (locationError === 'denied') {
      setLocationStatus('denied')
    } else if (locationError === 'prompt') {
      setLocationStatus('prompt')
    } else {
      setLocationStatus('unavailable')
    }
  }

  const getDaysLeft = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days}日` : '已過期'
  }

  // Show deals section
  if (activeSection === 'deals') {
    return (
      <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的優惠</h1>
              <p className="text-sm text-zinc-400">已收藏 {savedDeals.length} 個優惠</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {savedDeals.length > 0 ? (
            <div className="space-y-4">
              {savedDeals.map((deal) => (
                <div key={deal.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-zinc-100/80'} overflow-hidden`}>
                  <div className={`h-2 bg-gradient-to-r ${deal.color}`} />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {deal.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-zinc-400 font-medium">{deal.brand}</span>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{deal.title}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'} mt-1`}>{deal.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-lg text-xs font-medium">
                            有效期：{getDaysLeft(deal.validUntil)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto mb-5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-zinc-100'} flex items-center justify-center`}>
                <Gift className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-zinc-300'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-zinc-700'} mb-2`}>未收藏過優惠</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>去「我的」收藏心水優惠啦</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show reviews section
  if (activeSection === 'reviews') {
    return (
      <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的點評</h1>
              <p className="text-sm text-zinc-400">已發表 {userReviews.length} 篇點評</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-zinc-100/80'} p-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600">{review.placeName}</span>
                        <span className="text-xs text-zinc-400">{review.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-amber-400' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} leading-relaxed`}>{review.text}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}">
                    <ThumbsUp className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>{review.likes} 人覺得有用</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">未發表過點評</h3>
              <p className="text-sm text-zinc-400">試下分享你嘅體驗啦！</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show favorites section
  if (activeSection === 'favorites') {
    return (
      <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的收藏</h1>
              <p className="text-sm text-zinc-400">已收藏 {favorites.length} 個地點</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {favorites.length > 0 ? (
            <div className="space-y-4">
              {favorites.map((fav, idx) => (
                <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-zinc-100/80'} p-5`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{fav.name || fav.placeName}</h3>
                      {fav.category && (
                        <span className="text-xs text-pink-500 font-medium">{fav.category}</span>
                      )}
                      {fav.description && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'} mt-1`}>{fav.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <Heart className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">未收藏過地方</h3>
              <p className="text-sm text-zinc-400">去地圖碌碌，儲你最like嘅地方</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default Profile View
  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Profile Header - Premium Design */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-5 pt-8 pb-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
              <img 
                src="/favicon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform">
              <Camera className="w-4 h-4 text-yellow-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name || '香港用家'}</h2>
            <p className="text-white/70 text-sm mt-0.5">{user?.email || '探索香港生活'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs text-white font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Level 1
              </span>
              <span className="flex items-center gap-1 text-xs text-white/70">
                <Sparkles className="w-3 h-3" />
                0 積分
              </span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform">
            <Edit3 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} mx-4 -mt-8 rounded-2xl shadow-lg ${darkMode ? 'shadow-gray-900/30' : 'shadow-amber-200/30'} p-4`}>
        <div className="grid grid-cols-4 gap-4">
          <button onClick={() => setActiveSection('favorites')} className={`text-center hover:${darkMode ? 'bg-gray-700' : 'bg-zinc-50'} rounded-xl p-2 -m-2 transition-colors`}>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{favorites.length}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>收藏</div>
          </button>
          <button onClick={() => setActiveSection('deals')} className={`text-center hover:${darkMode ? 'bg-gray-700' : 'bg-zinc-50'} rounded-xl p-2 -m-2 transition-colors`}>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{savedDeals.length}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>優惠</div>
          </button>
          <button onClick={() => setActiveSection('reviews')} className={`text-center hover:${darkMode ? 'bg-gray-700' : 'bg-zinc-50'} rounded-xl p-2 -m-2 transition-colors`}>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{userReviews.length}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>點評</div>
          </button>
          <div className="text-center">
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>0</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>積分</div>
          </div>
        </div>
        
        {/* Location Status */}
        <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                locationStatus === 'located' 
                  ? 'bg-green-500' 
                  : locationStatus === 'denied'
                  ? 'bg-red-500'
                  : locationStatus === 'prompt'
                  ? 'bg-blue-500'
                  : 'bg-yellow-500'
              }`} />
              <span className={`text-xs font-medium ${
                locationStatus === 'located' 
                  ? 'text-green-600' 
                  : locationStatus === 'denied'
                  ? 'text-red-600'
                  : locationStatus === 'prompt'
                  ? 'text-blue-600'
                  : 'text-yellow-600'
              }`}>
                {locationStatus === 'located' 
                  ? `📍 ${userArea}` 
                  : locationStatus === 'denied'
                  ? '❌ 位置權限'
                  : locationStatus === 'prompt'
                  ? '❓ 等待權限'
                  : '📍 定位中...'}
              </span>
            </div>
            {locationStatus !== 'located' && (
              <button
                onClick={refreshUserLocation}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  locationStatus === 'denied' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : locationStatus === 'prompt'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                重試
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">快速存取</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveSection('deals')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100/80 flex items-center gap-3 card-hover"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">我的優惠</div>
              <div className="text-xs text-zinc-500">{savedDeals.length} 個收藏</div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveSection('reviews')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100/80 flex items-center gap-3 card-hover"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">我的點評</div>
              <div className="text-xs text-zinc-500">{userReviews.length} 篇發表</div>
            </div>
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-5 mt-6">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-zinc-400'} uppercase tracking-wider mb-3`}>設定</h3>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-zinc-100/80'} overflow-hidden`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100/80"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${darkMode ? 'from-gray-700 to-gray-800' : 'from-yellow-500 to-amber-500'} flex items-center justify-center shadow-lg`}>
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1 text-left">
              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>夜間模式</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>{darkMode ? '切換到日間模式' : '切換到夜間模式'}</div>
            </div>
            <div className={`w-12 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </button>

          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isLast = index === MENU_ITEMS.length - 1
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 px-4 py-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-zinc-50'} transition-colors ${
                  !isLast ? `border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100/80'}` : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{item.label}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>{item.subtitle}</div>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 ${darkMode ? 'bg-violet-900 text-violet-300' : 'bg-violet-100 text-violet-600'} rounded-lg text-xs font-bold`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-zinc-300'}`} />
              </button>
            )
          })}

          {/* Logout Button */}
          {isAuthenticated && (
            <button
              onClick={() => {
                if (confirm('確定要登出嗎？')) {
                  logout()
                }
              }}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 transition-colors border-t border-zinc-100/80"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-red-600">登出帳戶</div>
                <div className="text-xs text-red-400">結束當前登入會話</div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-300" />
            </button>
          )}
        </div>
        
        {/* App Version */}
        <div className="text-center py-8">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>香港本地生活地圖 v1.0</p>
          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-zinc-300'} mt-1`}>Made with 🐉 in Hong Kong</p>
        </div>
      </div>
    </div>
  )
}
