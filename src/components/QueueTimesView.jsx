import { useState, useEffect } from 'react'
import { Clock, Users, TrendingUp, TrendingDown, RefreshCw, MapPin, Star, AlertCircle, Info, ChevronRight, Filter, Heart, Share2, Navigation2 } from 'lucide-react'

// 熱門景點排隊時間數據
const POPULAR_ATTRACTIONS = [
  {
    id: 'att_1',
    name: '香港迪士尼樂園',
    category: '主題樂園',
    icon: '🏰',
    location: '大嶼山',
    currentWaitTime: 45, // 分鐘
    avgWaitTime: 60,
    trend: 'down', // up, down, stable
    crowdLevel: 'high', // low, medium, high, very-high
    lastUpdated: '2026-03-31T10:15:00',
    tips: ['建議早上10點前入園', '使用FastPass可節省時間'],
    saved: true,
    coordinates: { lat: 22.3130, lng: 114.0410 }
  },
  {
    id: 'att_2',
    name: '海洋公園',
    category: '主題樂園',
    icon: '🐬',
    location: '黃竹坑',
    currentWaitTime: 30,
    avgWaitTime: 45,
    trend: 'stable',
    crowdLevel: 'medium',
    lastUpdated: '2026-03-31T10:20:00',
    tips: ['山頂纜車通常較多人', '海洋劇場建議提早30分鐘排隊'],
    saved: false,
    coordinates: { lat: 22.2474, lng: 114.1744 }
  },
  {
    id: 'att_3',
    name: '山頂纜車',
    category: '觀光',
    icon: '🚠',
    location: '中環',
    currentWaitTime: 60,
    avgWaitTime: 75,
    trend: 'up',
    crowdLevel: 'very-high',
    lastUpdated: '2026-03-31T10:10:00',
    tips: ['建議網上預約', '傍晚時段最繁忙'],
    saved: true,
    coordinates: { lat: 22.2763, lng: 114.1496 }
  },
  {
    id: 'att_4',
    name: '昂坪360',
    category: '觀光',
    icon: '🚡',
    location: '東涌',
    currentWaitTime: 25,
    avgWaitTime: 40,
    trend: 'down',
    crowdLevel: 'medium',
    lastUpdated: '2026-03-31T10:05:00',
    tips: ['水晶車廂排隊時間較長', '平日早上較少人'],
    saved: false,
    coordinates: { lat: 22.2891, lng: 113.9434 }
  },
  {
    id: 'att_5',
    name: '香港故宮博物館',
    category: '博物館',
    icon: '🏛️',
    location: '西九',
    currentWaitTime: 15,
    avgWaitTime: 25,
    trend: 'stable',
    crowdLevel: 'low',
    lastUpdated: '2026-03-31T10:00:00',
    tips: ['網上預約免排隊', '週末較多人'],
    saved: false,
    coordinates: { lat: 22.3026, lng: 114.1582 }
  },
  {
    id: 'att_6',
    name: 'M+博物館',
    category: '博物館',
    icon: '🎨',
    location: '西九',
    currentWaitTime: 20,
    avgWaitTime: 30,
    trend: 'up',
    crowdLevel: 'medium',
    lastUpdated: '2026-03-31T09:55:00',
    tips: ['特展通常較多人', '建議預約參觀時段'],
    saved: false,
    coordinates: { lat: 22.3036, lng: 114.1592 }
  },
  {
    id: 'att_7',
    name: '天星小輪',
    category: '交通',
    icon: '⛴️',
    location: '尖沙咀',
    currentWaitTime: 10,
    avgWaitTime: 15,
    trend: 'stable',
    crowdLevel: 'low',
    lastUpdated: '2026-03-31T09:50:00',
    tips: ['傍晚看維港夜景較多人', '八達通付款更快'],
    saved: true,
    coordinates: { lat: 22.2944, lng: 114.1699 }
  },
  {
    id: 'att_8',
    name: '廟街夜市',
    category: '夜市',
    icon: '🌃',
    location: '油麻地',
    currentWaitTime: 5,
    avgWaitTime: 10,
    trend: 'up',
    crowdLevel: 'high',
    lastUpdated: '2026-03-31T09:45:00',
    tips: ['晚上7點後最熱鬧', '週末人潮最多'],
    saved: false,
    coordinates: { lat: 22.3117, lng: 114.1705 }
  }
]

const CATEGORIES = [
  { id: 'all', label: '全部', icon: '📍' },
  { id: '主題樂園', label: '主題樂園', icon: '🎢' },
  { id: '觀光', label: '觀光', icon: '🚠' },
  { id: '博物館', label: '博物館', icon: '🏛️' },
  { id: '交通', label: '交通', icon: '⛴️' },
  { id: '夜市', label: '夜市', icon: '🌃' }
]

const CROWD_LEVELS = [
  { id: 'all', label: '全部', color: 'from-gray-500 to-slate-500' },
  { id: 'low', label: '少人', color: 'from-green-500 to-emerald-500' },
  { id: 'medium', label: '中等', color: 'from-yellow-500 to-amber-500' },
  { id: 'high', label: '多人', color: 'from-orange-500 to-red-500' },
  { id: 'very-high', label: '極多人', color: 'from-red-600 to-pink-600' }
]

export default function QueueTimesView({ darkMode }) {
  const [attractions, setAttractions] = useState(POPULAR_ATTRACTIONS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState('all')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('waitTime') // waitTime, name, crowdLevel
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedAttraction, setSelectedAttraction] = useState(null)

  useEffect(() => {
    // 從localStorage加載已保存的景點
    const savedAttractions = JSON.parse(localStorage.getItem('saved_attractions') || '[]')
    const updatedAttractions = POPULAR_ATTRACTIONS.map(attraction => ({
      ...attraction,
      saved: savedAttractions.includes(attraction.id)
    }))
    setAttractions(updatedAttractions)
  }, [])

  const toggleSaveAttraction = (attractionId) => {
    const updatedAttractions = attractions.map(attraction => 
      attraction.id === attractionId ? { ...attraction, saved: !attraction.saved } : attraction
    )
    setAttractions(updatedAttractions)
    
    // 更新localStorage
    const savedAttractions = updatedAttractions.filter(a => a.saved).map(a => a.id)
    localStorage.setItem('saved_attractions', JSON.stringify(savedAttractions))
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // 模擬實時更新排隊時間
    setTimeout(() => {
      const updatedAttractions = attractions.map(attraction => ({
        ...attraction,
        currentWaitTime: Math.max(5, Math.min(120, attraction.currentWaitTime + Math.floor(Math.random() * 10) - 5)),
        lastUpdated: new Date().toISOString()
      }))
      setAttractions(updatedAttractions)
      setLastUpdate(new Date())
      setRefreshing(false)
    }, 1500)
  }

  const getWaitTimeColor = (minutes) => {
    if (minutes <= 15) return 'text-green-600'
    if (minutes <= 30) return 'text-yellow-600'
    if (minutes <= 45) return 'text-orange-600'
    return 'text-red-600'
  }

  const getWaitTimeBgColor = (minutes) => {
    if (minutes <= 15) return 'bg-green-100 text-green-800'
    if (minutes <= 30) return 'bg-yellow-100 text-yellow-800'
    if (minutes <= 45) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getCrowdLevelColor = (level) => {
    const colors = {
      'low': 'from-green-500 to-emerald-500',
      'medium': 'from-yellow-500 to-amber-500',
      'high': 'from-orange-500 to-red-500',
      'very-high': 'from-red-600 to-pink-600'
    }
    return colors[level] || 'from-gray-500 to-slate-500'
  }

  const getCrowdLevelText = (level) => {
    const texts = {
      'low': '少人',
      'medium': '中等',
      'high': '多人',
      'very-high': '極多人'
    }
    return texts[level] || '未知'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />
    return <TrendingUp className="w-4 h-4 text-gray-400 rotate-90" />
  }

  const getTrendText = (trend) => {
    if (trend === 'up') return '上升中'
    if (trend === 'down') return '下降中'
    return '穩定'
  }

  const getTimeAgo = (timeStr) => {
    const diff = Math.floor((new Date() - new Date(timeStr)) / 60000) // 分鐘
    if (diff < 1) return '剛剛'
    if (diff < 60) return `${diff}分鐘前`
    return `${Math.floor(diff / 60)}小時前`
  }

  const getBestTimeToVisit = (attraction) => {
    const hour = new Date().getHours()
    const currentWait = attraction.currentWaitTime
    const avgWait = attraction.avgWaitTime
    
    if (currentWait < avgWait * 0.7) return '✅ 現在係好時機！'
    if (currentWait > avgWait * 1.3) return '⏰ 建議稍後再來'
    
    // 根據景點類型建議最佳時間
    if (attraction.category === '主題樂園') {
      if (hour < 11) return '🌅 早上較少人'
      if (hour > 16) return '🌇 傍晚排隊時間較短'
    }
    
    if (attraction.category === '觀光') {
      if (hour < 10 || hour > 18) return '🌃 非繁忙時段較佳'
    }
    
    return '📊 排隊時間屬正常水平'
  }

  const filteredAttractions = attractions.filter(attraction => {
    if (selectedCategory !== 'all' && attraction.category !== selectedCategory) return false
    if (selectedCrowdLevel !== 'all' && attraction.crowdLevel !== selectedCrowdLevel) return false
    if (showSavedOnly && !attraction.saved) return false
    return true
  })

  // 排序
  const sortedAttractions = [...filteredAttractions].sort((a, b) => {
    if (sortBy === 'waitTime') return a.currentWaitTime - b.currentWaitTime
    if (sortBy === 'crowdLevel') {
      const levelOrder = { 'low': 1, 'medium': 2, 'high': 3, 'very-high': 4 }
      return levelOrder[a.crowdLevel] - levelOrder[b.crowdLevel]
    }
    return a.name.localeCompare(b.name, 'zh-HK')
  })

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-purple-100'} flex items-center justify-center`}>
              <Clock className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>排隊時間</h1>
              <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>熱門景點實時等候時間</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} flex items-center justify-center transition-colors active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </button>
        </div>
      </div>

      {/* Last Update */}
      <div className={`px-5 py-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-purple-50 text-purple-700'} text-xs border-b ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
        <div className="flex items-center justify-between">
          <span>最後更新：{lastUpdate.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{filteredAttractions.length} 個景點</span>
        </div>
      </div>

      {/* Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex flex-col gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
            <div className="flex gap-2 overflow-x-auto flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crowd Level Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {CROWD_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setSelectedCrowdLevel(level.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  selectedCrowdLevel === level.id
                    ? `${level.color.replace('from-', 'bg-gradient-to-r from-')} text-white shadow-md`
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Sort and Save Filters */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 border-gray-600'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              } border`}
            >
              <option value="waitTime">按排隊時間排序</option>
              <option value="crowdLevel">按人流排序</option>
              <option value="name">按名稱排序</option>
            </select>
            
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                showSavedOnly
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {showSavedOnly ? '❤️ 已收藏' : '🤍 收藏'}
            </button>
          </div>
        </div>
      </div>

      {/* Attractions List */}
      <div className="flex-1 overflow-y-auto p-5">
        {sortedAttractions.length === 0 ? (
          <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">搵唔到相關景點</p>
            <p className="text-sm">試下清除篩選條件</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedCrowdLevel('all')
                setShowSavedOnly(false)
              }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium"
            >
              顯示全部景點
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAttractions.map(attraction => (
              <div
                key={attraction.id}
                className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              >
                {/* Crowd Level Header */}
                <div className={`h-2 bg-gradient-to-r ${getCrowdLevelColor(attraction.crowdLevel)}`} />
                
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCrowdLevelColor(attraction.crowdLevel)} flex items-center justify-center text-2xl shadow-lg`}>
                      {attraction.icon}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-zinc-100 text-zinc-600'}`}>
                          {attraction.category}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}>
                          {attraction.location}
                        </span>
                      </div>
                      
                      <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {attraction.name}
                      </h3>
                      
                      {/* Wait Time */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${getWaitTimeColor(attraction.currentWaitTime)}`} />
                          <span className={`text-lg font-bold ${getWaitTimeColor(attraction.currentWaitTime)}`}>
                            {attraction.currentWaitTime}分鐘
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                            平均{attraction.avgWaitTime}分鐘
                          </span>
                        </div>
                        
                        {/* Trend */}
                        <div className="flex items-center gap-1">
                          {getTrendIcon(attraction.trend)}
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                            {getTrendText(attraction.trend)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Crowd Level */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getWaitTimeBgColor(attraction.currentWaitTime)}`}>
                          👥 {getCrowdLevelText(attraction.crowdLevel)}
                        </div>
                        
                        {/* Best Time */}
                        <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {getBestTimeToVisit(attraction)}
                        </div>
                      </div>
                      
                      {/* Tips */}
                      {attraction.tips && attraction.tips.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Info className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`} />
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>貼士：</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {attraction.tips.map((tip, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded-lg text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-zinc-100 text-zinc-600'}`}
                              >
                                {tip}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Update Time */}
                      <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>
                        更新於 {getTimeAgo(attraction.lastUpdated)}
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveAttraction(attraction.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                        attraction.saved
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400'
                      }`}
                    >
                      {attraction.saved ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // 打開地圖導航
                        const { lat, lng } = attraction.coordinates
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=transit`, '_blank')
                      }}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <Navigation2 className="w-4 h-4" />
                      導航
                    </button>
                    <button
                      onClick={() => {
                        // 分享功能
                        const shareText = `🎯 ${attraction.name} 排隊時間：${attraction.currentWaitTime}分鐘\n人流：${getCrowdLevelText(attraction.crowdLevel)}\n\n${getBestTimeToVisit(attraction)}\n\n下載「香港生活地圖」App睇實時排隊資訊！`
                        if (navigator.share) {
                          navigator.share({
                            title: `${attraction.name} 排隊時間`,
                            text: shareText,
                            url: 'https://adrian00213.github.io/hk-local-map/'
                          })
                        } else {
                          navigator.clipboard.writeText(shareText)
                          alert('排隊資訊已複製到剪貼簿！')
                        }
                      }}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold ${getWaitTimeColor(15)}`}>
              {sortedAttractions.filter(a => a.currentWaitTime <= 15).length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>15分鐘內</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${getWaitTimeColor(30)}`}>
              {sortedAttractions.filter(a => a.currentWaitTime > 15 && a.currentWaitTime <= 30).length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>15-30分鐘</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${getWaitTimeColor(60)}`}>
              {sortedAttractions.filter(a => a.currentWaitTime > 30).length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>30分鐘以上</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`px-5 py-3 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-purple-50 text-purple-700'} text-sm border-t ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>💡 貼士：平日早上10點前同下午4點後通常較少人，建議避開週末同公眾假期！</span>
        </div>
      </div>
    </div>
  )
}