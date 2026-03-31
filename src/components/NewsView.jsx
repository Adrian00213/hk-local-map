import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, Settings, Globe, AlertCircle } from 'lucide-react'
import { useMap } from '../context/MapContext'
import newsService from '../services/NewsService'

export default function NewsView({ darkMode }) {
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [newsItems, setNewsItems] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [currentRegion, setCurrentRegion] = useState('未知地區')

  // 加載資訊
  useEffect(() => {
    loadNews()
  }, [userLocation])

  const loadNews = () => {
    setRefreshing(true)
    
    try {
      let news = []
      
      if (userLocation && !locationError) {
        news = newsService.getRealTimeNews(userLocation.lat, userLocation.lng)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        news = [
          {
            id: 'no_location',
            type: 'info',
            title: '📍 等待位置資訊',
            message: '請允許位置權限以獲取本地資訊',
            priority: 'info',
            icon: '📍',
            timestamp: new Date().toISOString()
          }
        ]
        setCurrentRegion('未知地區')
      }
      
      setNewsItems(news)
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
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      local: 'from-blue-500 to-cyan-500',
      weather: 'from-sky-500 to-blue-500',
      transport: 'from-emerald-500 to-teal-500',
      food: 'from-orange-500 to-amber-500',
      event: 'from-purple-500 to-violet-500',
      info: 'from-gray-500 to-slate-500'
    }
    return colors[type] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>智能資訊</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Globe className="w-3 h-3" />
                  <span>{currentRegion}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={loadNews}
            className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </button>
        </div>
        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
          根據位置自動推送相關資訊
        </p>
      </div>

      {/* Location Error */}
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

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-4">
        {newsItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
              <Newspaper className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>正在加載資訊...</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}
              >
                <div className={`h-1 ${getPriorityColor(item.priority)}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center text-white`}>
                      <div className="text-2xl">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>
                        {item.title}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-3`}>
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-zinc-600'}`}>
                          {item.type === 'local' ? '本地' : 
                           item.type === 'weather' ? '天氣' :
                           item.type === 'transport' ? '交通' :
                           item.type === 'food' ? '飲食' : '資訊'}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                          {new Date(item.timestamp).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'} px-5 py-3`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
          {newsItems.length} 則資訊 • {currentRegion}
        </div>
      </div>
    </div>
  )
}