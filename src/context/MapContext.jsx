import { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'

const MapContext = createContext()

export function useMap() {
  return useContext(MapContext)
}

// Category icons mapping
export const CATEGORY_ICONS = {
  deals: '🛒',
  restaurants: '🍜',
  places: '🎯',
  news: '📰',
  transport: '🚌',
  shopping: '🛍️'
}

// Category labels (Cantonese)
export const CATEGORY_LABELS = {
  deals: '優惠',
  restaurants: '餐廳',
  places: '好去處',
  news: '資訊',
  transport: '交通',
  shopping: '購物'
}

// Mock data for demo (when Firebase is not configured)
const MOCK_MARKERS = [
  {
    id: '1',
    title: 'Nike Outlet 大特賣',
    category: 'deals',
    lat: 22.3193,
    lng: 114.1694,
    description: '全場低至5折！包括運動鞋、運動服裝',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    contact: '旺角朗豪坊',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '九龍公園',
    category: 'places',
    lat: 22.3021,
    lng: 114.1730,
    description: '市區綠洲，有鳥湖和免費表演',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    contact: '尖沙咀',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '義順牛奶公司',
    category: 'restaurants',
    lat: 22.3065,
    lng: 114.1707,
    description: '馳名雙皮奶、薑汁撞奶',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300',
    contact: '旺角弼街',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: '香港美食節 2026',
    category: 'news',
    lat: 22.3208,
    lng: 114.1761,
    description: '年度美食盛事，超過100間餐廳參與',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
    contact: '灣仔會展中心',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: '🚇 港鐵中環站',
    category: 'transport',
    lat: 22.2978,
    lng: 114.1690,
    description: '港島線/荃灣線交匯點，出口通往IFC和置地廣場',
    imageUrl: null,
    contact: '港島線、荃灣線',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: '🚌 旺角巴士總站',
    category: 'transport',
    lat: 22.3176,
    lng: 114.1726,
    description: '多條巴士線途經，包括：1, 1A, 2, 3C, 72X等',
    imageUrl: null,
    contact: '旺角道',
    userId: 'demo',
    createdAt: new Date().toISOString()
  }
]

export function MapProvider({ children }) {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null) // 'denied' | 'unavailable' | 'timeout' | null

  // Fetch markers from Firestore or use mock data
  const fetchMarkers = async () => {
    setLoading(true)
    try {
      const markersRef = collection(db, 'markers')
      const q = query(markersRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        // Use mock data when no data in Firebase
        setMarkers(MOCK_MARKERS)
      } else {
        const fetchedMarkers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMarkers(fetchedMarkers)
      }
    } catch (error) {
      console.log('Using mock data (Firebase not configured):', error.message)
      // Use mock data when Firebase fails
      setMarkers(MOCK_MARKERS)
    }
    setLoading(false)
  }

  // Add new marker
  const addMarker = async (markerData) => {
    try {
      const markersRef = collection(db, 'markers')
      const newMarker = {
        ...markerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const docRef = await addDoc(markersRef, newMarker)
      
      setMarkers(prev => [{
        id: docRef.id,
        ...newMarker
      }, ...prev])
      
      return docRef.id
    } catch (error) {
      console.error('Error adding marker:', error)
      throw error
    }
  }

  // Update marker
  const updateMarker = async (markerId, updates) => {
    try {
      const markerRef = doc(db, 'markers', markerId)
      await updateDoc(markerRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      setMarkers(prev => prev.map(marker => 
        marker.id === markerId 
          ? { ...marker, ...updates, updatedAt: new Date().toISOString() }
          : marker
      ))
    } catch (error) {
      console.error('Error updating marker:', error)
      throw error
    }
  }

  // Delete marker
  const deleteMarker = async (markerId) => {
    try {
      const markerRef = doc(db, 'markers', markerId)
      await deleteDoc(markerRef)
      
      setMarkers(prev => prev.filter(marker => marker.id !== markerId))
    } catch (error) {
      console.error('Error deleting marker:', error)
      throw error
    }
  }

  // Get user's current location with better error handling
  const getUserLocation = () => {
    console.log('🔄 嘗試獲取位置...')
    
    // 檢查是否在安全上下文（HTTPS或localhost）
    if (!window.isSecureContext) {
      console.warn('⚠️ 非安全上下文：Geolocation需要HTTPS或localhost')
      setLocationError('unavailable')
      setUserLocation({ lat: 22.3193, lng: 114.1694 })
      return
    }
    
    if (navigator.geolocation) {
      console.log('✅ Geolocation API可用')
      
      // 首先檢查權限狀態
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          console.log('📍 權限狀態:', result.state)
          
          if (result.state === 'granted') {
            console.log('✅ 已有位置權限，獲取位置...')
            fetchLocation()
          } else if (result.state === 'prompt') {
            console.log('❓ 需要請求權限...')
            // 顯示用戶提示
            setLocationError('prompt')
            // 仍然嘗試獲取位置（會觸發瀏覽器提示）
            fetchLocation()
          } else {
            // Permission denied
            console.log('❌ 位置權限被拒絕')
            setLocationError('denied')
            setUserLocation({ lat: 22.3193, lng: 114.1694 })
            
            // 顯示修復指引
            setTimeout(() => {
              alert('📍 位置權限被拒絕\n\n請在瀏覽器設定中允許位置權限：\n1. 點擊網址欄左側的鎖定圖標\n2. 選擇「網站設定」\n3. 將「位置」改為「允許」')
            }, 1000)
          }
        }).catch((error) => {
          console.warn('⚠️ 權限API錯誤，使用fallback:', error)
          // Fallback for browsers without permissions API
          fetchLocation()
        })
      } else {
        console.log('⚠️ 權限API不可用，直接嘗試獲取位置...')
        // 舊瀏覽器直接嘗試
        fetchLocation()
      }
    } else {
      // Geolocation not supported
      console.error('❌ Geolocation不支援')
      setLocationError('unavailable')
      setUserLocation({ lat: 22.3193, lng: 114.1694 })
      
      // 顯示錯誤訊息
      setTimeout(() => {
        alert('❌ 你的瀏覽器不支援定位功能\n\n請嘗試：\n1. 使用Chrome、Firefox或Edge瀏覽器\n2. 確保使用HTTPS連接\n3. 檢查瀏覽器設定中的位置權限')
      }, 1000)
    }
  }

  const fetchLocation = () => {
    console.log('📍 開始獲取位置...')
    
    const options = {
      enableHighAccuracy: true,  // 使用GPS等高精度
      timeout: 15000,           // 15秒超時
      maximumAge: 30000         // 30秒內緩存有效
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ 成功獲取位置:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy + '米'
        })
        
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationError(null)
        
        // 成功提示
        setTimeout(() => {
          console.log('📍 位置已更新到地圖中心')
        }, 500)
      },
      (error) => {
        console.error('❌ Geolocation錯誤:', error.code, error.message)
        
        // 詳細錯誤處理
        let errorType = 'unavailable'
        let errorMessage = '無法獲取位置'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = 'denied'
            errorMessage = '位置權限被拒絕'
            console.log('❌ 用戶拒絕了位置權限')
            break
          case error.POSITION_UNAVAILABLE:
            errorType = 'unavailable'
            errorMessage = '位置服務不可用'
            console.log('❌ 位置服務不可用（GPS關閉？）')
            break
          case error.TIMEOUT:
            errorType = 'timeout'
            errorMessage = '獲取位置超時'
            console.log('⏰ 獲取位置超時')
            break
          default:
            errorType = 'unavailable'
            errorMessage = '未知錯誤'
        }
        
        setLocationError(errorType)
        
        // 使用香港中心作為默認位置
        const defaultLocation = { lat: 22.3193, lng: 114.1694 }
        setUserLocation(defaultLocation)
        
        // 顯示詳細錯誤訊息
        setTimeout(() => {
          const messages = {
            denied: '📍 位置權限被拒絕\n\n請在瀏覽器設定中允許位置權限：\n1. 點擊網址欄左側的鎖定圖標\n2. 選擇「網站設定」\n3. 將「位置」改為「允許」',
            unavailable: '📍 位置服務不可用\n\n請確保：\n1. GPS或位置服務已開啟\n2. 使用HTTPS連接（GitHub Pages已提供）\n3. 瀏覽器支援Geolocation API',
            timeout: '📍 獲取位置超時\n\n請檢查網絡連接，或稍後再試',
            prompt: '📍 需要位置權限\n\n請允許瀏覽器獲取你的位置以使用定位功能'
          }
          
          if (messages[errorType]) {
            alert(messages[errorType])
          }
        }, 1000)
      },
      options
    )
  }

  useEffect(() => {
    fetchMarkers()
    getUserLocation()
  }, [])

  const filteredMarkers = selectedCategory
    ? markers.filter(m => m.category === selectedCategory)
    : markers

  const value = {
    markers: filteredMarkers,
    allMarkers: markers,
    loading,
    selectedCategory,
    setSelectedCategory,
    userLocation,
    locationError,
    addMarker,
    updateMarker,
    deleteMarker,
    refreshMarkers: fetchMarkers,
    refreshUserLocation: fetchLocation
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}
