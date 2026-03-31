import { useState, useEffect } from 'react'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import { AutomationProvider } from './context/AutomationContext'
import TabBar from './components/TabBar'
import MapView from './components/MapView'
import NewsView from './components/NewsView'
import ProfileView from './components/ProfileView'
import OnboardingView from './components/OnboardingView'
import Header from './components/Header'
import TrafficView from './components/TrafficView'
import QueueTimesView from './components/QueueTimesView'

export default function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [darkMode, setDarkMode] = useState(false)


  useEffect(() => {
    const seen = localStorage.getItem('hk_onboarding_complete')
    if (!seen) {
      setShowOnboarding(true)
    }
    
    // 檢查夜間模式設定
    const savedDarkMode = localStorage.getItem('hk_dark_mode')
    const hour = new Date().getHours()
    const shouldBeDark = hour >= 19 || hour < 7
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true')
    } else if (shouldBeDark) {
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('hk_dark_mode', newDarkMode.toString())
  }

  const renderView = () => {
    switch (activeTab) {
      case 'map': return <MapView darkMode={darkMode} />
      case 'news': return <NewsView darkMode={darkMode} />
      case 'traffic': return <TrafficView darkMode={darkMode} />
      case 'queue': return <QueueTimesView darkMode={darkMode} />
      case 'profile': return <ProfileView darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      default: return <MapView darkMode={darkMode} />
    }
  }

  if (showOnboarding) {
    return (
      <OnboardingView 
        onComplete={() => setShowOnboarding(false)} 
        darkMode={darkMode}
      />
    )
  }

  return (
    <AuthProvider>
      <MapProvider>
        <AutomationProvider>
          <div 
            className={`h-screen w-full flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`} 
            style={{ height: '100dvh' }}
          >
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="flex-1 min-h-0 overflow-y-auto">
              {renderView()}
            </main>
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
          </div>
        </AutomationProvider>
      </MapProvider>
    </AuthProvider>
  )
}
