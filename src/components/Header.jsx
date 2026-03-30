import { useAuth } from '../context/AuthContext'
import { Moon, Sun, LogOut, User } from 'lucide-react'

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className={`${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-amber-100/50'} backdrop-blur-xl border-b px-4 py-3 flex items-center justify-between z-[1001] transition-colors duration-300`}>
      <div className="flex items-center gap-3">
        <img 
          src="/favicon.png" 
          alt="Logo" 
          className="w-10 h-10 rounded-2xl object-contain shadow-lg"
          style={{ background: darkMode ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
        />
        <div>
          <h1 className={`font-bold text-base tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            香港生活地圖
          </h1>
          <p className={`text-xs font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            探索香港精彩
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl transition-colors active:scale-95 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-yellow-100'}`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-yellow-600" />
          )}
        </button>
      </div>
    </header>
  )
}