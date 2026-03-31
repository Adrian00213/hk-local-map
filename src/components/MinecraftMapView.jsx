import { useEffect, useRef, useState } from 'react'
import './MinecraftMapView.css'

export default function MinecraftMapView({ darkMode }) {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [mapStyle, setMapStyle] = useState('minecraft')

  // 初始化地圖
  useEffect(() => {
    const initMap = async () => {
      try {
        // 動態加載Leaflet
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')
        
        // 香港中心坐標
        const hongKongCenter = [22.3193, 114.1694]
        
        // 創建地圖
        const map = L.map(mapRef.current).setView(hongKongCenter, 13)
        
        // 添加OpenStreetMap圖層
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map)
        
        // 應用Minecraft風格濾鏡
        if (mapStyle === 'minecraft') {
          const style = document.createElement('style')
          style.textContent = `
            .leaflet-tile {
              filter: 
                brightness(1.2) 
                contrast(1.3) 
                saturate(1.5)
                hue-rotate(10deg);
              image-rendering: pixelated;
            }
          `
          document.head.appendChild(style)
        }
        
        // 添加用戶位置標記
        if (userLocation) {
          L.marker(userLocation, {
            icon: L.divIcon({
              html: '<div class="user-marker">📍</div>',
              className: 'user-marker-icon',
              iconSize: [40, 40]
            })
          }).addTo(map)
        }
        
        // 添加Minecraft風格控件
        const control = L.control({ position: 'bottomright' })
        control.onAdd = function() {
          const div = L.DomUtil.create('div', 'minecraft-controls')
          div.innerHTML = `
            <button class="style-btn" data-style="minecraft">🎮 Minecraft</button>
            <button class="style-btn" data-style="pixel">🎨 像素</button>
            <button class="style-btn" data-style="normal">🗺️ 普通</button>
          `
          return div
        }
        control.addTo(map)
        
        // 樣式切換事件
        mapRef.current.querySelectorAll('.style-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            setMapStyle(e.target.dataset.style)
          })
        })
        
        setMapLoaded(true)
        
        // 清理函數
        return () => {
          map.remove()
        }
      } catch (error) {
        console.error('地圖加載失敗:', error)
      }
    }
    
    initMap()
  }, [mapStyle, userLocation])

  // 獲取用戶位置
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.warn('位置獲取失敗:', error.message)
          // 使用香港默認位置
          setUserLocation([22.3193, 114.1694])
        }
      )
    } else {
      setUserLocation([22.3193, 114.1694])
    }
  }

  return (
    <div className={`minecraft-map-view ${darkMode ? 'dark-mode' : ''}`}>
      <div className="map-header">
        <h2 className="map-title">
          {mapStyle === 'minecraft' ? '🎮 Minecraft風格' : 
           mapStyle === 'pixel' ? '🎨 像素風格' : '🗺️ 普通地圖'}
        </h2>
        
        <div className="map-controls">
          <button 
            onClick={getUserLocation}
            className="minecraft-btn"
            disabled={!mapLoaded}
          >
            📍 定位我的位置
          </button>
          
          <div className="style-buttons">
            <button 
              onClick={() => setMapStyle('minecraft')}
              className={`style-btn ${mapStyle === 'minecraft' ? 'active' : ''}`}
            >
              🎮
            </button>
            <button 
              onClick={() => setMapStyle('pixel')}
              className={`style-btn ${mapStyle === 'pixel' ? 'active' : ''}`}
            >
              🎨
            </button>
            <button 
              onClick={() => setMapStyle('normal')}
              className={`style-btn ${mapStyle === 'normal' ? 'active' : ''}`}
            >
              🗺️
            </button>
          </div>
        </div>
      </div>
      
      <div ref={mapRef} className="map-container" />
      
      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>🎮 加載Minecraft地圖中...</p>
        </div>
      )}
      
      {userLocation && (
        <div className="location-info">
          <p>📍 位置: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
        </div>
      )}
    </div>
  )
}