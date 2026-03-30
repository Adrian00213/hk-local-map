import { useState, useEffect } from 'react'
import { CreditCard, Store, Bus, Train, Coffee, ShoppingBag, Clock, MapPin, Navigation2, Star, Filter, RefreshCw } from 'lucide-react'

// 八達通優惠數據
const OCTOPUS_DEALS = [
  {
    id: 'oct_1',
    title: '7-Eleven 八達通優惠',
    description: '使用八達通消費滿$50減$5',
    category: '便利店',
    icon: '🏪',
    brand: '7-Eleven',
    validUntil: '2026-04-30',
    locations: ['全港分店'],
    requirements: '單次消費滿$50',
    saved: false
  },
  {
    id: 'oct_2',
    title: 'MTR 週日免費轉乘',
    description: '週日使用八達通轉乘指定路線免費',
    category: '交通',
    icon: '🚇',
    brand: '港鐵',
    validUntil: '2026-12-31',
    locations: ['全線港鐵'],
    requirements: '週日使用',
    saved: true
  },
  {
    id: 'oct_3',
    title: '麥當勞早餐優惠',
    description: '早上11點前使用八達通付款享9折',
    category: '快餐',
    icon: '🍔',
    brand: '麥當勞',
    validUntil: '2026-03-31',
    locations: ['全港分店'],
    requirements: '早上11點前',
    saved: false
  },
  {
    id: 'oct_4',
    title: '百佳超市八達通日',
    description: '每月8號使用八達通消費享95折',
    category: '超市',
    icon: '🛒',
    brand: '百佳',
    validUntil: '2026-12-31',
    locations: ['全港分店'],
    requirements: '每月8號',
    saved: false
  },
  {
    id: 'oct_5',
    title: '星巴克買一送一',
    description: '下午3-5點使用八達通買一送一',
    category: '咖啡',
    icon: '☕',
    brand: '星巴克',
    validUntil: '2026-03-31',
    locations: ['指定分店'],
    requirements: '下午3-5點',
    saved: true
  },
  {
    id: 'oct_6',
    title: '九巴八達通優惠',
    description: '使用八達通乘搭九巴享車費回贈',
    category: '交通',
    icon: '🚌',
    brand: '九巴',
    validUntil: '2026-06-30',
    locations: ['全線九巴'],
    requirements: '每月首10次',
    saved: false
  },
  {
    id: 'oct_7',
    title: '惠康八達通儲分',
    description: '使用八達通消費每$1儲1分',
    category: '超市',
    icon: '🏬',
    brand: '惠康',
    validUntil: '2026-12-31',
    locations: ['全港分店'],
    requirements: '無最低消費',
    saved: false
  },
  {
    id: 'oct_8',
    title: '大家樂八達通優惠',
    description: '使用八達通付款送熱飲一杯',
    category: '快餐',
    icon: '🍛',
    brand: '大家樂',
    validUntil: '2026-04-15',
    locations: ['全港分店'],
    requirements: '消費滿$40',
    saved: true
  }
]

const CATEGORIES = [
  { id: 'all', label: '全部', icon: '🛍️' },
  { id: '便利店', label: '便利店', icon: '🏪' },
  { id: '交通', label: '交通', icon: '🚇' },
  { id: '快餐', label: '快餐', icon: '🍔' },
  { id: '超市', label: '超市', icon: '🛒' },
  { id: '咖啡', label: '咖啡', icon: '☕' }
]

export default function OctopusDealsView({ darkMode }) {
  const [deals, setDeals] = useState(OCTOPUS_DEALS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // 從localStorage加載已保存的優惠
    const savedDeals = JSON.parse(localStorage.getItem('octopus_saved_deals') || '[]')
    const updatedDeals = OCTOPUS_DEALS.map(deal => ({
      ...deal,
      saved: savedDeals.includes(deal.id)
    }))
    setDeals(updatedDeals)
  }, [])

  const toggleSaveDeal = (dealId) => {
    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, saved: !deal.saved } : deal
    )
    setDeals(updatedDeals)
    
    // 更新localStorage
    const savedDeals = updatedDeals.filter(d => d.saved).map(d => d.id)
    localStorage.setItem('octopus_saved_deals', JSON.stringify(savedDeals))
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const filteredDeals = deals.filter(deal => {
    if (selectedCategory !== 'all' && deal.category !== selectedCategory) return false
    if (showSavedOnly && !deal.saved) return false
    return true
  })

  const getDaysLeft = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    if (days < 0) return '已過期'
    if (days === 0) return '今日到期'
    if (days === 1) return '聽日到期'
    return `${days}日後到期`
  }

  const getCategoryColor = (category) => {
    const colors = {
      '便利店': 'from-blue-500 to-cyan-500',
      '交通': 'from-green-500 to-emerald-500',
      '快餐': 'from-orange-500 to-amber-500',
      '超市': 'from-purple-500 to-pink-500',
      '咖啡': 'from-yellow-600 to-yellow-500'
    }
    return colors[category] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-yellow-100'} flex items-center justify-center`}>
              <CreditCard className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>八達通優惠</h1>
              <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>全港精選八達通優惠</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-yellow-100 hover:bg-yellow-200'} flex items-center justify-center transition-colors active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
          <div className="flex gap-2 overflow-x-auto flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
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
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
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

      {/* Stats */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex items-center justify-between text-sm">
          <span className={darkMode ? 'text-gray-300' : 'text-zinc-600'}>
            共 {deals.length} 個優惠
          </span>
          <span className={darkMode ? 'text-yellow-400' : 'text-yellow-600'}>
            ❤️ {deals.filter(d => d.saved).length} 個已收藏
          </span>
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 overflow-y-auto p-5">
        {filteredDeals.length === 0 ? (
          <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">搵唔到相關優惠</p>
            <p className="text-sm">試下清除篩選條件</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setShowSavedOnly(false)
              }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl text-sm font-medium"
            >
              顯示全部優惠
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map(deal => (
              <div
                key={deal.id}
                className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                {/* Category Header */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(deal.category)}`} />
                
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(deal.category)} flex items-center justify-center text-2xl shadow-lg`}>
                      {deal.icon}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-zinc-100 text-zinc-600'}`}>
                          {deal.brand}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>
                          {deal.category}
                        </span>
                      </div>
                      
                      <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {deal.title}
                      </h3>
                      
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                        {deal.description}
                      </p>
                      
                      {/* Requirements */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                          <Clock className="w-3 h-3" />
                          {getDaysLeft(deal.validUntil)}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                          <Store className="w-3 h-3" />
                          {deal.requirements}
                        </div>
                      </div>
                      
                      {/* Locations */}
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                          {deal.locations.join('、')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveDeal(deal.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                        deal.saved
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400'
                      }`}
                    >
                      {deal.saved ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // 打開地圖搜索
                        const searchQuery = encodeURIComponent(`${deal.brand} ${deal.category} 香港`)
                        window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank')
                      }}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      搵分店
                    </button>
                    <button
                      onClick={() => {
                        // 分享功能
                        const shareText = `🎫 八達通優惠：${deal.title}\n${deal.description}\n\n下載「香港生活地圖」App睇更多優惠！`
                        if (navigator.share) {
                          navigator.share({
                            title: '八達通優惠',
                            text: shareText,
                            url: 'https://adrian00213.github.io/hk-local-map/'
                          })
                        } else {
                          navigator.clipboard.writeText(shareText)
                          alert('優惠已複製到剪貼簿！')
                        }
                      }}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      📤 分享
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className={`px-5 py-3 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-yellow-50 text-yellow-700'} text-sm border-t ${darkMode ? 'border-gray-700' : 'border-yellow-100'}`}>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>💡 貼士：每月8號係「八達通日」，好多商戶都有特別優惠！</span>
        </div>
      </div>
    </div>
  )
}