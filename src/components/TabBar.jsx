import { Map, Newspaper, Brain, User } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'ai', icon: Brain, label: 'AI助理' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange, darkMode }) {
  return (
    <nav
      className={`flex-none backdrop-blur-xl border-t flex items-stretch z-50 safe-area-bottom shadow-[0_-2px_15px_rgba(0,0,0,0.1)] rounded-t-2xl transition-colors duration-300 ${
        darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-amber-100/50'
      }`}
    >
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[64px] h-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? `text-yellow-600 ${darkMode ? 'bg-gray-700/50' : 'bg-yellow-50/50'} rounded-xl`
                  : darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-zinc-400 hover:text-yellow-600'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110 -translate-y-1' : ''} transition-transform duration-200`}>
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={darkMode && !isActive ? 'text-gray-400' : ''}
                />
                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-yellow-600'}`} />
                )}
              </div>
              <span className={`text-[12px] font-semibold ${isActive ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') : (darkMode ? 'text-gray-400' : 'text-zinc-400')}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}