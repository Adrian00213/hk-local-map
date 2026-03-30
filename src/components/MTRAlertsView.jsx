import { useState, useEffect } from 'react'
import { Train, AlertTriangle, Clock, MapPin, RefreshCw, ChevronRight, Info, XCircle, CheckCircle, AlertCircle } from 'lucide-react'

// MTR 線路數據
const MTR_LINES = [
  { id: 'twl', name: '荃灣線', color: 'bg-red-500', stations: ['中環', '金鐘', '尖沙咀', '佐敦', '油麻地', '旺角', '太子', '深水埗', '長沙灣', '荔枝角', '美孚', '荔景', '葵芳', '葵興', '大窩口', '荃灣'] },
  { id: 'isl', name: '港島線', color: 'bg-blue-500', stations: ['柴灣', '杏花邨', '筲箕灣', '西灣河', '太古', '鰂魚涌', '北角', '炮台山', '天后', '銅鑼灣', '灣仔', '金鐘', '中環', '上環'] },
  { id: 'ktl', name: '觀塘線', color: 'bg-green-500', stations: ['黃埔', '何文田', '油麻地', '旺角', '太子', '石硤尾', '九龍塘', '樂富', '黃大仙', '鑽石山', '彩虹', '九龍灣', '牛頭角', '觀塘', '藍田', '油塘'] },
  { id: 'eal', name: '東鐵線', color: 'bg-teal-500', stations: ['金鐘', '會展', '紅磡', '旺角東', '九龍塘', '大圍', '沙田', '火炭', '馬場', '大學', '大埔墟', '太和', '粉嶺', '上水', '羅湖', '落馬洲'] },
  { id: 'tkl', name: '將軍澳線', color: 'bg-purple-500', stations: ['北角', '鰂魚涌', '油塘', '調景嶺', '將軍澳', '坑口', '寶琳', '康城'] },
  { id: 'tcl', name: '東涌線', color: 'bg-orange-500', stations: ['香港', '九龍', '奧運', '南昌', '荔景', '青衣', '東涌'] },
  { id: 'ael', name: '機場快線', color: 'bg-indigo-500', stations: ['香港', '九龍', '青衣', '機場', '博覽館'] },
  { id: 'drl', name: '迪士尼線', color: 'bg-pink-500', stations: ['欣澳', '迪士尼'] },
]

// 模擬實時延誤數據
const MTR_ALERTS = [
  {
    id: 'alert_1',
    line: 'twl',
    severity: 'high',
    title: '荃灣線信號故障',
    description: '荃灣線往中環方向列車服務延誤10-15分鐘',
    affectedStations: ['旺角', '太子', '深水埗', '長沙灣'],
    startTime: '2026-03-31T08:30:00',
    estimatedEndTime: '2026-03-31T10:00:00',
    updatedAt: '2026-03-31T09:15:00'
  },
  {
    id: 'alert_2',
    line: 'isl',
    severity: 'medium',
    title: '港島線列車調度',
    description: '港島線班次調整，候車時間稍長',
    affectedStations: ['銅鑼灣', '灣仔', '金鐘'],
    startTime: '2026-03-31T09:00:00',
    estimatedEndTime: '2026-03-31T10:30:00',
    updatedAt: '2026-03-31T09:20:00'
  },
  {
    id: 'alert_3',
    line: 'eal',
    severity: 'low',
    title: '東鐵線特別班次',
    description: '因應馬場賽事，加開特別班次',
    affectedStations: ['火炭', '馬場'],
    startTime: '2026-03-31T12:00:00',
    estimatedEndTime: '2026-03-31T18:00:00',
    updatedAt: '2026-03-31T08:45:00'
  }
]

// 正常運作線路
const NORMAL_LINES = ['ktl', 'tkl', 'tcl', 'ael', 'drl']

export default function MTRAlertsView({ darkMode }) {
  const [alerts, setAlerts] = useState(MTR_ALERTS)
  const [normalLines, setNormalLines] = useState(NORMAL_LINES)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedLine, setSelectedLine] = useState(null)

  useEffect(() => {
    // 模擬實時更新
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 60000) // 每分鐘更新一次
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    // 模擬API請求
    setTimeout(() => {
      setRefreshing(false)
      setLastUpdate(new Date())
    }, 1500)
  }

  const getLineInfo = (lineId) => {
    return MTR_LINES.find(line => line.id === lineId)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'from-red-500 to-orange-500',
      medium: 'from-yellow-500 to-amber-500',
      low: 'from-blue-500 to-cyan-500'
    }
    return colors[severity] || 'from-gray-500 to-slate-500'
  }

  const getSeverityIcon = (severity) => {
    const icons = {
      high: <AlertTriangle className="w-5 h-5 text-red-500" />,
      medium: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      low: <Info className="w-5 h-5 text-blue-500" />
    }
    return icons[severity] || <Info className="w-5 h-5 text-gray-500" />
  }

  const getSeverityText = (severity) => {
    const texts = {
      high: '嚴重延誤',
      medium: '輕微延誤',
      low: '特別安排'
    }
    return texts[severity] || '資訊'
  }

  const formatTime = (timeStr) => {
    const time = new Date(timeStr)
    return time.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
  }

  const getTimeAgo = (timeStr) => {
    const diff = Math.floor((new Date() - new Date(timeStr)) / 60000) // 分鐘
    if (diff < 1) return '剛剛'
    if (diff < 60) return `${diff}分鐘前`
    return `${Math.floor(diff / 60)}小時前`
  }

  const filteredAlerts = selectedLine 
    ? alerts.filter(alert => alert.line === selectedLine)
    : alerts

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
              <Train className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>MTR 實時資訊</h1>
              <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>港鐵服務狀況即時更新</p>
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
          <span>{alerts.length} 個服務影響</span>
        </div>
      </div>

      {/* Line Filter */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedLine(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
              !selectedLine
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            全部線路
          </button>
          {MTR_LINES.map(line => (
            <button
              key={line.id}
              onClick={() => setSelectedLine(line.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                selectedLine === line.id
                  ? `${line.color} text-white shadow-md`
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {line.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Current Alerts */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>服務影響</h2>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
              {filteredAlerts.length} 個
            </span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">所有線路運作正常</p>
              <p className="text-sm">港鐵服務暢順</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map(alert => {
                const lineInfo = getLineInfo(alert.line)
                return (
                  <div
                    key={alert.id}
                    className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                  >
                    {/* Severity Header */}
                    <div className={`h-2 bg-gradient-to-r ${getSeverityColor(alert.severity)}`} />
                    
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Line Badge */}
                        <div className={`w-12 h-12 rounded-xl ${lineInfo?.color || 'bg-gray-500'} flex items-center justify-center text-white font-bold text-sm`}>
                          {lineInfo?.name?.charAt(0) || 'M'}
                        </div>
                        
                        {/* Alert Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-zinc-100 text-zinc-600'}`}>
                              {lineInfo?.name || '未知線路'}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity).replace('from-', 'bg-').replace(' to-', '/')} text-white`}>
                              {getSeverityText(alert.severity)}
                            </span>
                          </div>
                          
                          <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                            {alert.title}
                          </h3>
                          
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                            {alert.description}
                          </p>
                          
                          {/* Affected Stations */}
                          {alert.affectedStations && alert.affectedStations.length > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center gap-1 mb-1">
                                <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`} />
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>受影響車站：</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {alert.affectedStations.map((station, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 rounded-lg text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-zinc-100 text-zinc-600'}`}
                                  >
                                    {station}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Time Info */}
                          <div className={`flex items-center gap-4 mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
                            <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                              <Clock className="w-3 h-3" />
                              <span>開始：{formatTime(alert.startTime)}</span>
                            </div>
                            <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                              <Clock className="w-3 h-3" />
                              <span>預計恢復：{formatTime(alert.estimatedEndTime)}</span>
                            </div>
                          </div>
                          
                          {/* Update Time */}
                          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>
                            更新於 {getTimeAgo(alert.updatedAt)}
                          </div>
                        </div>
                        
                        {/* Severity Icon */}
                        <div className="shrink-0">
                          {getSeverityIcon(alert.severity)}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            // 打開MTR官方網站
                            window.open('https://www.mtr.com.hk/alert/zh-hk/', '_blank')
                          }}
                          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          <Info className="w-4 h-4" />
                          官方詳情
                        </button>
                        <button
                          onClick={() => {
                            // 分享功能
                            const shareText = `🚇 MTR服務資訊：${alert.title}\n${alert.description}\n\n受影響車站：${alert.affectedStations.join('、')}\n\n下載「香港生活地圖」App睇實時交通資訊！`
                            if (navigator.share) {
                              navigator.share({
                                title: 'MTR服務資訊',
                                text: shareText,
                                url: 'https://adrian00213.github.io/hk-local-map/'
                              })
                            } else {
                              navigator.clipboard.writeText(shareText)
                              alert('資訊已複製到剪貼簿！')
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
                )
              })}
            </div>
          )}
        </div>

        {/* Normal Lines */}
        <div className={`p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>運作正常線路</h2>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
              {normalLines.length} 條
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {normalLines.map(lineId => {
              const lineInfo = getLineInfo(lineId)
              if (!lineInfo) return null
              
              return (
                <div
                  key={lineId}
                  className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-green-50'} border ${darkMode ? 'border-gray-600' : 'border-green-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${lineInfo.color} flex items-center justify-center text-white font-bold text-xs`}>
                      {lineInfo.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {lineInfo.name}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ✅ 運作正常
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <div className={`p-5 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-blue-50 text-blue-700'} text-sm border-t ${darkMode ? 'border-gray-700' : 'border-blue-100'}`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>💡 貼士：繁忙時間（早上8-9點、傍晚6-7點）建議預留額外時間出行</span>
          </div>
        </div>
      </div>
    </div>
  )
}