import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, Settings, X, Globe, AlertCircle, ChevronRight } from 'lucide-react'
import { useMap } from '../context/MapContext'
import newsService from '../services/NewsService'

export default function NewsView({ darkMode }) {
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [newsItems, setNewsItems] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [userPreferences, setUserPreferences] = useState(newsService.userPreferences)
  const [currentRegion, setCurrentRegion] = useState('未知地區')

  // 加載資訊
  useEffect(() => {
    loadNews()
  }, [userLocation])

  // 加載新聞資訊
  const loadNews = () => {
    setRefreshing(true)
    
    try {
      let news = []
      
      if (userLocation && !locationError) {
        // 有位置 - 獲取實時資訊
        news = newsService.getRealTimeNews(userLocation.lat, userLocation.lng)
        
        // 更新當前地區
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        // 無位置 - 顯示通用資訊
        news = [
          {
            id: 'no_location',
            type: 'info',
            title: '📍 等待位置資訊',
            message: '請允許位置權限以獲取本地資訊',
            priority: 'info',
            icon: '📍',
            timestamp: new Date().toISOString(),
            region: 'unknown',
            regionName: '未知地區'
          },
          {
            id: 'enable_location',
            type: 'action',
            title: '🔧 啟用位置服務',
            message: '點擊下方按鈕啟用位置權限',
            priority: 'high',
            icon: '⚙️',
            timestamp: new Date().toISOString(),
            region: 'unknown',
            regionName: '未知地區'
          }
        ]
        setCurrentRegion('未知地區')
      }
      
      setNewsItems(news)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('❌ 加載資訊失敗:', error)
      setNewsItems([
        {
          id: 'error',
          type: 'error',
          title: '❌ 加載失敗',
          message: '無法加載資訊，請稍後再試',
          priority: 'high',
          icon: '⚠️',
          timestamp: new Date().toISOString(),
          region: 'error',
          regionName: '錯誤'
        }
      ])
    } finally {
      setRefreshing(false)
    }
  }

  // 手動刷新
  const handleRefresh = () => {
    loadNews()
  }

  // 更新偏好設定
  const updatePreference = (key, value) => {
    const updates = { [key]: value }
    newsService.updatePreferences(updates)
    setUserPreferences({ ...userPreferences, ...updates })
  }

  // 重置偏好
  const resetPreferences = () => {
    if (confirm('確定要重置所有資訊偏好嗎？')) {
      newsService.resetPreferences()
      setUserPreferences(newsService.userPreferences)
      alert('偏好已重置')
    }
  }

  // 獲取優先級顏色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      case 'info': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  // 獲取類型顏色
  const getTypeColor = (type) => {
    const colors = {
      local: 'from-blue-500 to-cyan-500',
      weather: 'from-sky-500 to-blue-500',
      transport: 'from-emerald-500 to-teal-500',
      food: 'from-orange-500 to-amber-500',
      event: 'from-purple-500 to-violet-500',
      finance: 'from-yellow-500 to-yellow-600',
      safety: 'from-red-500 to-rose-500',
      info: 'from-gray-500 to-slate-500',
      action: 'from-indigo-500 to-purple-500',
      error: 'from-red-600 to-pink-600'
    }
    return colors[type] || 'from-gray-500 to-slate-500'
  }

  // 設置面板
  const renderSettings = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className={`w-full max-w-md mx-4 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center`}>
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>資訊設定</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>自訂資訊顯示偏好</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-zinc-100'}`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Region Info */}
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>當前地區</h3>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="flex items-center gap-3">
                    <Globe className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{currentRegion}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                        {userLocation ? '位置服務正常' : '等待位置資訊'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>顯示偏好</h3>
                <div className="space-y-3">
                  {[
                    { key: 'showLocalNews', label: '本地新聞', desc: '顯示本地新聞同資訊' },
                    { key: 'showDeals', label: '優惠資訊', desc: '顯示折扣同優惠' },
                    { key: 'showEvents', label: '活動資訊', desc: '顯示文化同娛樂活動' },
                    { key: 'showWeather', label: '天氣預報', desc: '顯示天氣資訊' },
                    { key: 'showTraffic', label: '交通資訊', desc: '顯示交通狀況' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{label}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>{desc}</div>
                      </div>
                      <button
                        onClick={() => updatePreference(key, !userPreferences[key])}
                        className={`w-12 h-6 rounded-full relative ${userPreferences[key] ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-300')}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${userPreferences[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>通知設定</h3>
                <div className="space-y-3">
                  {[
                    { key: 'notificationSound', label: '提示音效', desc: '重要資訊時播放音效' },
                    { key: 'vibration', label: '震動提示', desc: '重要資訊時震動提示' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{label}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>{desc}</div>
                      </div>
                      <button
                        onClick={() => updatePreference(key, !userPreferences[key])}
                        className={`w-12 h-6 rounded-full relative ${userPreferences[key] ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-300')}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${userPreferences[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>資訊優先級</h3>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updatePreference('priorityLevel', level)}
                      className={`flex-1 py-2 rounded-lg text-center font-medium ${
                        userPreferences.priorityLevel === level
                          ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-zinc-700'
                      }`}
                    >
                      {level === 'low' ? '低' : level === 'medium' ? '中' : '高'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
            <div className="flex gap-3">
              <button
                onClick={resetPreferences}
                className={`flex-1 py-3 rounded-xl text-center font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-zinc-700'}`}
              >
                重置設定
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className={`flex-1 py-3 rounded-xl text-center font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 主界面
  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-amber-50/50 to-white'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-amber-100/50'} backdrop-blur-xl border-b px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200/50">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>智能資訊</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Globe className="w-3 h-3" />
                  <span>{currentRegion}</span>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                  {lastUpdate.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} flex items-center justify-center transition-colors active:scale-95`}
            >
              <Settings className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </button>
            <button 
              onClick={handleRefresh}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} flex items-center justify-center transition-colors active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
          根據你嘅位置自動推送相關資訊。{userLocation ? '正在為你提供本地資訊...' : '等待位置權限...'}
        </p>
      </div>

      {/* Location Status */}
      {locationError && (
        <div className={`mx-4 mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <div className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>位置權限問題</div>
              <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                {locationError === 'denied' 
                  ? '位置權限被拒絕，請在設定中啟用' 
                  : '無法獲取位置資訊，請檢查設定'}
              </div>
            </div>
            <button
              onClick={refreshUserLocation}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
            >
              重試
            </button>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        {newsItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className={`w-20 h-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
              <Newspaper className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`