import { useState, useEffect } from 'react'
import { 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Zap, 
  History, 
  Settings,
  Home,
  Coffee,
  ShoppingBag,
  Building,
  Train,
  Car,
  Bus,
  Heart
} from 'lucide-react'

export default function AutomationView({ darkMode }) {
  const [userHabits, setUserHabits] = useState({
    frequentFunctions: [],
    frequentLocations: [],
    usagePatterns: {},
    preferences: {}
  })

  const [suggestions, setSuggestions] = useState([])
  const [quickActions, setQuickActions] = useState([])

  // 模擬嘅常用功能
  const mockFrequentFunctions = [
    { id: 'map', name: '地圖導航', icon: MapPin, count: 42, lastUsed: '今日' },
    { id: 'traffic', name: '交通狀況', icon: Car, count: 28, lastUsed: '今日' },
    { id: 'queue', name: '排隊時間', icon: Clock, count: 15, lastUsed: '昨日' },
    { id: 'news', name: '本地資訊', icon: TrendingUp, count: 12, lastUsed: '前日' },
  ]

  // 模擬嘅常用地點
  const mockFrequentLocations = [
    { id: 'home', name: '屋企', icon: Home, address: '九龍塘', visits: 120, lastVisit: '今日' },
    { id: 'office', name: '辦公室', icon: Building, address: '中環', visits: 85, lastVisit: '今日' },
    { id: 'cafe', name: '常去咖啡店', icon: Coffee, address: '銅鑼灣', visits: 45, lastVisit: '昨日' },
    { id: 'mall', name: '商場', icon: ShoppingBag, address: '旺角', visits: 32, lastVisit: '上星期' },
  ]

  // 智能建議
  const mockSuggestions = [
    { 
      id: 's1', 
      type: 'function', 
      title: '交通高峰期提醒', 
      description: '根據你嘅出行習慣，建議避開17:00-19:00嘅交通繁忙時段',
      icon: Car,
      priority: 'high'
    },
    { 
      id: 's2', 
      type: 'location', 
      title: '快捷導航到辦公室', 
      description: '你通常喺08:30出發去辦公室，要唔要而家設定導航？',
      icon: Building,
      priority: 'medium'
    },
    { 
      id: 's3', 
      type: 'reminder', 
      title: '排隊時間提醒', 
      description: '你常去嘅餐廳而家排隊時間約15分鐘',
      icon: Clock,
      priority: 'low'
    },
  ]

  // 快捷操作
  const mockQuickActions = [
    { id: 'qa1', name: '回家導航', icon: Home, action: 'navigate_home' },
    { id: 'qa2', name: '查看交通', icon: Car, action: 'check_traffic' },
    { id: 'qa3', name: '餐廳排隊', icon: Clock, action: 'check_queue' },
    { id: 'qa4', name: '收藏地點', icon: Heart, action: 'save_location' },
  ]

  useEffect(() => {
    // 模擬加載用戶習慣數據
    setUserHabits({
      frequentFunctions: mockFrequentFunctions,
      frequentLocations: mockFrequentLocations,
      usagePatterns: {
        peakHours: ['08:00-09:00', '17:00-19:00'],
        favoriteDay: '星期五',
        mostUsedFunction: 'map'
      },
      preferences: {
        autoNavigation: true,
        trafficAlerts: true,
        queueNotifications: false
      }
    })
    
    setSuggestions(mockSuggestions)
    setQuickActions(mockQuickActions)
  }, [])

  const handleQuickAction = (action) => {
    console.log('執行快捷操作:', action)
    // 實際應用中會觸發相應嘅功能
    alert(`執行: ${action}`)
  }

  const togglePreference = (key) => {
    setUserHabits(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }))
  }

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'}`}>
      {/* 標題 */}
      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-yellow-100'} rounded-b-3xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <Zap size={32} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
          <div>
            <h1 className="text-2xl font-bold">智能自動化</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              學習你嘅習慣，提供個性化服務
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 快捷操作 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap size={20} /> 快捷操作
            </h2>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>一鍵到達</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.action)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-yellow-50 shadow-sm'
                }`}
              >
                <action.icon size={24} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                <span className="text-xs mt-2 font-medium">{action.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 智能建議 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star size={20} /> 智能建議
            </h2>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>根據你嘅習慣</span>
          </div>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-xl border-l-4 ${
                  suggestion.priority === 'high' 
                    ? 'border-red-500' 
                    : suggestion.priority === 'medium'
                    ? 'border-yellow-500'
                    : 'border-blue-500'
                } ${
                  darkMode 
                    ? 'bg-gray-800' 
                    : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <suggestion.icon size={20} className={
                    suggestion.priority === 'high' 
                      ? 'text-red-500' 
                      : suggestion.priority === 'medium'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  } />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 常用功能 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History size={20} /> 常用功能
            </h2>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>根據使用頻率</span>
          </div>
          <div className="space-y-2">
            {userHabits.frequentFunctions.map((func) => (
              <div
                key={func.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                    <func.icon size={20} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{func.name}</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      使用 {func.count} 次 • 最後 {func.lastUsed}
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                }`}>
                  使用
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 常用地點 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={20} /> 常用地點
            </h2>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>你經常去嘅地方</span>
          </div>
          <div className="space-y-2">
            {userHabits.frequentLocations.map((location) => (
              <div
                key={location.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                    <location.icon size={20} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {location.address} • {location.visits}次到訪
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                }`}>
                  導航
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 設定 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} /> 自動化設定
            </h2>
          </div>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">自動導航建議</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    根據時間同地點自動建議路線
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('autoNavigation')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    userHabits.preferences.autoNavigation
                      ? darkMode ? 'bg-yellow-600' : 'bg-yellow-500'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    userHabits.preferences.autoNavigation ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">交通提醒</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    實時交通狀況通知
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('trafficAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    userHabits.preferences.trafficAlerts
                      ? darkMode ? 'bg-yellow-600' : 'bg-yellow-500'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    userHabits.preferences.trafficAlerts ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">排隊時間通知</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    常去地點嘅排隊時間更新
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('queueNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    userHabits.preferences.queueNotifications
                      ? darkMode ? 'bg-yellow-600' : 'bg-yellow-500'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    userHabits.preferences.queueNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 使用模式統計 */}
        <section>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <h3 className="font-semibold mb-3">你的使用模式</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>最常用功能</span>
                <span className="font-medium">{userHabits.usagePatterns.mostUsedFunction === 'map' ? '地圖導航' : '其他'}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>交通繁忙時段</span>
                <span className="font-medium">{userHabits.usagePatterns.peakHours?.join('、')}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>最活躍日子</span>
                <span className="font-medium">{userHabits.usagePatterns.favoriteDay}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}