import { useState, useEffect } from 'react'
import { Car, Train, Bus, AlertTriangle, Clock, MapPin, RefreshCw, ChevronRight, Info, Navigation2, TrendingUp, TrendingDown, Wifi, Cloud, Droplets, Thermometer, Wind } from 'lucide-react'

// 交通狀況數據
const TRAFFIC_CONDITIONS = [
  {
    id: 'road_1',
    name: '紅磡海底隧道',
    type: 'road',
    icon: '🚗',
    status: '擠塞',
    delay: '25分鐘',
    severity: 'high',
    description: '往香港方向車龍長達2公里',
    lastUpdated: '2026-03-31T10:30:00'
  },
  {
    id: 'road_2',
    name: '東區走廊',
    type: 'road',
    icon: '🛣️',
    status: '緩慢',
    delay: '15分鐘',
    severity: 'medium',
    description: '東行線交通緩慢',
    lastUpdated: '2026-03-31T10:25:00'
  },
  {
    id: 'road_3',
    name: '獅子山隧道',
    type: 'road',
    icon: '⛰️',
    status: '暢通',
    delay: '5分鐘',
    severity: 'low',
    description: '雙向行車暢順',
    lastUpdated: '2026-03-31T10:20:00'
  },
  {
    id: 'road_4',
    name: '青嶼幹線',
    type: 'road',
    icon: '🌉',
    status: '擠塞',
    delay: '30分鐘',
    severity: 'high',
    description: '往機場方向嚴重擠塞',
    lastUpdated: '2026-03-31T10:15:00'
  }
]

// MTR 線路狀態
const MTR_LINES = [
  { id: 'twl', name: '荃灣線', status: '延誤', delay: '10-15分鐘', icon: '🚇', color: 'bg-red-500' },
  { id: 'isl', name: '港島線', status: '正常', delay: '正常', icon: '🚇', color: 'bg-blue-500' },
  { id: 'ktl', name: '觀塘線', status: '正常', delay: '正常', icon: '🚇', color: 'bg-green-500' },
  { id: 'eal', name: '東鐵線', status: '部分延誤', delay: '5-10分鐘', icon: '🚇', color: 'bg-teal-500' },
  { id: 'tkl', name: '將軍澳線', status: '正常', delay: '正常', icon: '🚇', color: 'bg-purple-500' },
  { id: 'tcl', name: '東涌線', status: '正常', delay: '正常', icon: '🚇', color: 'bg-orange-500' }
]

// 巴士服務狀況
const BUS_SERVICES = [
  { id: 'bus_1', name: '九巴', status: '正常', affectedRoutes: [], icon: '🚌', color: 'bg-red-600' },
  { id: 'bus_2', name: '城巴', status: '部分改道', affectedRoutes: ['5B', '10', '72'], icon: '🚌', color: 'bg-yellow-600' },
  { id: 'bus_3', name: '新巴', status: '正常', affectedRoutes: [], icon: '🚌', color: 'bg-green-600' },
  { id: 'bus_4', name: '龍運巴士', status: '正常', affectedRoutes: [], icon: '🚌', color: 'bg-blue-600' }
]

// 天氣數據（影響交通）
const WEATHER_DATA = {
  temperature: '24°C',
  condition: '多雲',
  humidity: '78%',
  wind: '東風 15 km/h',
  visibility: '良好',
  icon: '☁️'
}

// 交通攝像頭位置
const TRAFFIC_CAMERAS = [
  { id: 'cam_1', name: '紅隧香港入口', location: '紅磡', url: 'https://www.td.gov.hk/traffic_notices/摄像头1.jpg', active: true },
  { id: 'cam_2', name: '青馬大橋', location: '青衣', url: 'https://www.td.gov.hk/traffic_notices/摄像头2.jpg', active: true },
  { id: 'cam_3', name: '獅子山隧道', location: '沙田', url: 'https://www.td.gov.hk/traffic_notices/摄像头3.jpg', active: false },
  { id: 'cam_4', name: '東區走廊', location: '鰂魚涌', url: 'https://www.td.gov.hk/traffic_notices/摄像头4.jpg', active: true }
]

export default function TrafficView({ darkMode }) {
  const [trafficData, setTrafficData] = useState(TRAFFIC_CONDITIONS)
  const [mtrData, setMtrData] = useState(MTR_LINES)
  const [busData, setBusData] = useState(BUS_SERVICES)
  const [weather, setWeather] = useState(WEATHER_DATA)
  const [cameras, setCameras] = useState(TRAFFIC_CAMERAS)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview') // overview, roads, mtr, buses

  useEffect(() => {
    // 模擬實時更新
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    // 模擬API請求
    setTimeout(() => {
      // 隨機更新交通狀況
      const updatedTraffic = trafficData.map(road => ({
        ...road,
        delay: `${Math.max(5, Math.min(45, parseInt(road.delay) + Math.floor(Math.random() * 10) - 5))}分鐘`,
        lastUpdated: new Date().toISOString()
      }))
      setTrafficData(updatedTraffic)
      
      setLastUpdate(new Date())
      setRefreshing(false)
    }, 1500)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'high': 'from-red-500 to-orange-500',
      'medium': 'from-yellow-500 to-amber-500',
      'low': 'from-green-500 to-emerald-500'
    }
    return colors[severity] || 'from-gray-500 to-slate-500'
  }

  const getStatusColor = (status) => {
    if (status === '正常' || status === '暢通') return 'text-green-600'
    if (status === '緩慢' || status === '部分延誤') return 'text-yellow-600'
    if (status === '擠塞' || status === '延誤') return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusBgColor = (status) => {
    if (status === '正常' || status === '暢通') return 'bg-green-100 text-green-800'
    if (status === '緩慢' || status === '部分延誤') return 'bg-yellow-100 text-yellow-800'
    if (status === '擠塞' || status === '延誤') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getTimeAgo = (timeStr) => {
    const diff = Math.floor((new Date() - new Date(timeStr)) / 60000)
    if (diff < 1) return '剛剛'
    if (diff < 60) return `${diff}分鐘前`
    return `${Math.floor(diff / 60)}小時前`
  }

  const openTrafficMap = () => {
    window.open('https://www.td.gov.hk/traffic_notices/zh-hk/index.html', '_blank')
  }

  const openGoogleMapsTraffic = () => {
    window.open('https://www.google.com/maps/@22.3193,114.1694,11z/data=!5m1!1e1', '_blank')
  }

  const openCameraView = (camera) => {
    if (camera.active) {
      window.open(camera.url, '_blank')
    } else {
      alert('此攝像頭暫時無法使用')
    }
  }

  const renderOverview = () => (
    <>
      {/* Weather Card */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-4`}>
        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>天氣狀況</h3>
            </div>
            <div className="text-3xl">{weather.icon}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              <Thermometer className="w-4 h-4" />
              <span>{weather.temperature}</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              <Droplets className="w-4 h-4" />
              <span>濕度 {weather.humidity}</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              <Wind className="w-4 h-4" />
              <span>{weather.wind}</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              <Wifi className="w-4 h-4" />
              <span>能見度 {weather.visibility}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Summary */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-4`}>
        <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Car className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>道路狀況</h3>
            </div>
            <button
              onClick={() => setActiveTab('roads')}
              className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-600'} font-medium flex items-center gap-1`}
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-2">
            {trafficData.slice(0, 3).map(road => (
              <div key={road.id} className="flex items-center justify-between p-2 hover:bg-opacity-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{road.icon}</span>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {road.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                      {road.description}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBgColor(road.status)}`}>
                  {road.delay}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MTR Summary */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-4`}>
        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Train className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>港鐵服務</h3>
            </div>
            <button
              onClick={() => setActiveTab('mtr')}
              className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium flex items-center gap-1`}
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {mtrData.slice(0, 4).map(line => (
              <div key={line.id} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded ${line.color} flex items-center justify-center text-white text-xs`}>
                    {line.name.charAt(0)}
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {line.name}
                    </div>
                    <div className={`text-xs ${getStatusColor(line.status)}`}>
                      {line.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Cameras */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wifi className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>交通攝像頭</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {cameras.slice(0, 4).map(camera => (
              <button
                key={camera.id}
                onClick={() => openCameraView(camera)}
                className={`p-2 rounded-lg text-left ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors ${!camera.active ? 'opacity-50' : ''}`}
                disabled={!camera.active}
              >
                <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {camera.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                  {camera.location}
                </div>
                <div className={`text-xs mt-1 ${camera.active ? 'text-green-600' : 'text-red-600'}`}>
                  {camera.active ? '🟢 在線' : '🔴 離線'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  const renderRoads = () => (
    <div className="space-y-4">
      {trafficData.map(road => (
        <div key={road.id} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className={`h-2 bg-gradient-to-r ${getSeverityColor(road.severity)}`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{road.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {road.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-lg font-medium ${getStatusBgColor(road.status)}`}>
                    {road.status}
                  </div>
                </div>
                
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-2`}>
                  {road.description}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">延誤：{road.delay}</span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>
                    更新於 {getTimeAgo(road.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  const searchQuery = encodeURIComponent(`${road.name} 香港 交通`)
                  window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank')
                }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <Navigation2 className="w-4 h-4" />
                查看地圖
              </button>
              <button
                onClick={openTrafficMap}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <Info className="w-4 h-4" />
                官方資訊
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMTR = () => (
    <div className="space-y-4">
      {mtrData.map(line => (
        <div key={line.id} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className={`h-2 ${line.color}`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl ${line.color} flex items-center justify-center text-2xl text-white`}>
                {line.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {line.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-lg font-medium ${getStatusBgColor(line.status)}`}>
                    {line.status}
                  </div>
                </div>
                
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                  預計延誤：{line.delay}
                </div>
                
                <div className="mt-2">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    🚇 港鐵實時資訊
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => window.open('https://www.mtr.com.hk/alert/zh-hk/', '_blank')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <Info className="w-4 h-4" />
                服務詳情
              </button>
              <button
                onClick={() => window.open('https://www.mtr.com.hk/ch/customer/services/service_hours.html', '_blank')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                班次時間
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderBuses = () => (
    <div className="space-y-4">
      {busData.map(bus => (
        <div key={bus.id} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className={`h-2 ${bus.color}`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{bus.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {bus.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-lg font-medium ${getStatusBgColor(bus.status)}`}>
                    {bus.status}
                  </div>
                </div>
                
                {bus.affectedRoutes.length > 0 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-2`}>
                    受影響路線：{bus.affectedRoutes.join('、')}
                  </div>
                )}
                
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                  🚌 巴士服務實時資訊
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  if (bus.name === '九巴') window.open('https://www.kmb.hk/tc/', '_blank')
                  if (bus.name === '城巴') window.open('https://www.citybus.com.hk/', '_blank')
                  if (bus.name === '新巴') window.open('https://www.bravobus.com.hk/', '_blank')
                  if (bus.name === '龍運巴士') window.open('https://www.lwb.hk/tc/', '_blank')
                }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <Info className="w-4 h-4" />
                官方網站
              </button>
              <button
                onClick={() => window.open('https://www.td.gov.hk/tc/transport_in_hong_kong/public_transport/buses/index.html', '_blank')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                路線查詢
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
              <Car className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>交通狀況</h1>
              <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>全港實時交通資訊</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} flex items-center justify-center transition-colors active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </button>
        </div>
      </div>

      {/* Last Update */}
      <div className={`px-5 py-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-blue-50 text-blue-700'} text-xs border-b ${darkMode ? 'border-gray-700' : 'border-blue-100'}`}>
        <div className="flex items-center justify-between">
          <span>最後更新：{lastUpdate.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{trafficData.filter(t => t.severity === 'high').length} 個擠塞點</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex gap-2 overflow-x-auto">
          {['overview', 'roads', 'mtr', 'buses'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {tab === 'overview' && '總覽'}
              {tab === 'roads' && '道路狀況'}
              {tab === 'mtr' && '港鐵服務'}
              {tab === 'buses' && '巴士服務'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'roads' && renderRoads()}
        {activeTab === 'mtr' && renderMTR()}
        {activeTab === 'buses' && renderBuses()}
      </div>

      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openGoogleMapsTraffic}
            className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'} transition-colors active:scale-95`}
          >
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center`}>
              <MapPin className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className="text-left">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Google 地圖</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>實時交通圖</div>
            </div>
          </button>
          
          <button
            onClick={openTrafficMap}
            className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'} transition-colors active:scale-95`}
          >
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className="text-left">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>運輸署</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>官方交通通告</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className={`px-5 py-3 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-blue-50 text-blue-700'} text-sm border-t ${darkMode ? 'border-gray-700' : 'border-blue-100'}`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>💡 貼士：繁忙時間（早上8-9點、傍晚6-7點）建議使用公共交通工具，避開主要幹道！</span>
        </div>
      </div>
    </div>
  )
}