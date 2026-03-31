import { useState } from 'react'
import MinecraftMapView from './components/MinecraftMapView'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <h1 className="text-3xl font-bold text-green-600">
          🎮 Minecraft香港地圖
        </h1>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          {darkMode ? '☀️ 亮色模式' : '🌙 暗色模式'}
        </button>
      </header>
      
      <main className="app-main">
        <MinecraftMapView darkMode={darkMode} />
      </main>
      
      <footer className="app-footer">
        <p className="text-gray-600">
          🐉 全新部署版本 | 修復所有GitHub Pages問題
        </p>
      </footer>
    </div>
  )
}

export default App