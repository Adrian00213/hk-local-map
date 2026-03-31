/**
 * 排隊資訊服務 - 景點排隊時間同擁擠程度
 */

class QueueService {
  constructor() {
    this.queueData = this.loadQueueData()
    this.userFavorites = this.loadFavorites()
    
    console.log('⏰ 排隊資訊服務已啟動')
  }

  // 加載排隊數據
  loadQueueData() {
    try {
      const saved = localStorage.getItem('hk_queue_data')
      if (saved) {
        return JSON.parse(saved)
      }
      
      // 默認數據
      return [
        {
          id: 'att_1',
          name: '香港迪士尼樂園',
          category: '主題樂園',
          icon: '🏰',
          location: '大嶼山',
          currentWaitTime: 45,
          avgWaitTime: 60,
          trend: 'down',
          crowdLevel: 'high',
          lastUpdated: new Date().toISOString(),
          tips: ['建議早上10點前入園', '使用FastPass可節省時間'],
          saved: true,
          coordinates: { lat: 22.3130, lng: 114.0410 }
        },
        {
          id: 'att_2',
          name: '海洋公園',
          category: '主題樂園',
          icon: '🐬',
          location: '黃竹坑',
          currentWaitTime: 30,
          avgWaitTime: 45,
          trend: 'stable',
          crowdLevel: 'medium',
          lastUpdated: new Date().toISOString(),
          tips: ['山頂纜車通常較多人', '海洋劇場建議提早30分鐘排隊'],
          saved: false,
          coordinates: { lat: 22.2474, lng: 114.1744 }
        },
        {
          id: 'att_3',
          name: '山頂纜車',
          category: '觀光',
          icon: '🚠',
          location: '中環',
          currentWaitTime: 60,
          avgWaitTime: 75,
          trend: 'up',
          crowdLevel: 'very-high',
          lastUpdated: new Date().toISOString(),
          tips: ['建議網上預約', '傍晚時段最繁忙'],
          saved: true,
          coordinates: { lat: 22.2763, lng: 114.1496 }
        },
        {
          id: 'att_4',
          name: '天際100',
          category: '觀光',
          icon: '🏙️',
          location: '西九龍',
          currentWaitTime: 20,
          avgWaitTime: 30,
          trend: 'down',
          crowdLevel: 'low',
          lastUpdated: new Date().toISOString(),
          tips: ['網上購票有折扣', '日落時段景色最美'],
          saved: false,
          coordinates: { lat: 22.3047, lng: 114.1606 }
        },
        {
          id: 'att_5',
          name: '香港故宮博物館',
          category: '文化',
          icon: '🏛️',
          location: '西九文化區',
          currentWaitTime: 15,
          avgWaitTime: 25,
          trend: 'stable',
          crowdLevel: 'medium',
          lastUpdated: new Date().toISOString(),
          tips: ['週末較多人', '建議預約導賞團'],
          saved: false,
          coordinates: { lat: 22.3036, lng: 114.1610 }
        },
        {
          id: 'att_6',
          name: '廟街夜市',
          category: '美食',
          icon: '🍢',
          location: '佐敦',
          currentWaitTime: 10,
          avgWaitTime: 15,
          trend: 'stable',
          crowdLevel: 'medium',
          lastUpdated: new Date().toISOString(),
          tips: ['晚上7點後最熱鬧', '推薦煲仔飯同海鮮'],
          saved: true,
          coordinates: { lat: 22.3117, lng: 114.1706 }
        },
        {
          id: 'att_7',
          name: '蘭桂坊',
          category: '夜生活',
          icon: '🍻',
          location: '中環',
          currentWaitTime: 25,
          avgWaitTime: 35,
          trend: 'up',
          crowdLevel: 'high',
          lastUpdated: new Date().toISOString(),
          tips: ['週五週六最繁忙', '晚上10點後人多'],
          saved: false,
          coordinates: { lat: 22.2810, lng: 114.1557 }
        },
        {
          id: 'att_8',
          name: '赤柱市集',
          category: '購物',
          icon: '🛍️',
          location: '赤柱',
          currentWaitTime: 5,
          avgWaitTime: 10,
          trend: 'stable',
          crowdLevel: 'low',
          lastUpdated: new Date().toISOString(),
          tips: ['週末較熱鬧', '海邊餐廳景色好'],
          saved: false,
          coordinates: { lat: 22.2190, lng: 114.2090 }
        }
      ]
    } catch (error) {
      console.warn('⚠️ 加載排隊數據失敗:', error)
      return []
    }
  }

  // 加載用戶收藏
  loadFavorites() {
    try {
      const saved = localStorage.getItem('hk_queue_favorites')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn('⚠️ 加載收藏失敗:', error)
      return []
    }
  }

  // 保存數據
  saveData() {
    try {
      localStorage.setItem('hk_queue_data', JSON.stringify(this.queueData))
      localStorage.setItem('hk_queue_favorites', JSON.stringify(this.userFavorites))
    } catch (error) {
      console.error('❌ 保存排隊數據失敗:', error)
    }
  }

  // 獲取附近景點
  getNearbyAttractions(userLat, userLng, radiusKm = 20, limit = 15) {
    try {
      const nearby = this.queueData.filter(attraction => {
        if (!attraction.coordinates) return false
        
        // 簡單距離計算
        const latDiff = Math.abs(attraction.coordinates.lat - userLat)
        const lngDiff = Math.abs(attraction.coordinates.lng - userLng)
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111
        
        attraction.distance = Math.round(distance * 10) / 10
        return distance <= radiusKm
      })
      
      // 按距離排序
      nearby.sort((a, b) => a.distance - b.distance)
      
      return nearby.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取附近景點失敗:', error)
      return []
    }
  }

  // 獲取熱門景點
  getPopularAttractions(limit = 10) {
    try {
      const popular = [...this.queueData]
      
      // 按擁擠程度排序
      const crowdLevelOrder = { 'very-high': 4, 'high': 3, 'medium': 2, 'low': 1 }
      popular.sort((a, b) => crowdLevelOrder[b.crowdLevel] - crowdLevelOrder[a.crowdLevel])
      
      return popular.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取熱門景點失敗:', error)
      return []
    }
  }

  // 獲取收藏景點
  getFavoriteAttractions() {
    try {
      return this.queueData.filter(attraction => 
        this.userFavorites.includes(attraction.id) || attraction.saved
      )
    } catch (error) {
      console.warn('⚠️ 獲取收藏景點失敗:', error)
      return []
    }
  }

  // 切換收藏
  toggleFavorite(attractionId) {
    try {
      const index = this.userFavorites.indexOf(attractionId)
      
      if (index === -1) {
        this.userFavorites.push(attractionId)
      } else {
        this.userFavorites.splice(index, 1)
      }
      
      // 更新queueData中嘅saved狀態
      const attraction = this.queueData.find(a => a.id === attractionId)
      if (attraction) {
        attraction.saved = index === -1
      }
      
      this.saveData()
      return index === -1 // 返回是否已收藏
    } catch (error) {
      console.warn('⚠️ 切換收藏失敗:', error)
      return false
    }
  }

  // 更新排隊時間
  updateWaitTime(attractionId, newWaitTime) {
    try {
      const attraction = this.queueData.find(a => a.id === attractionId)
      if (!attraction) return false
      
      const oldTime = attraction.currentWaitTime
      attraction.currentWaitTime = newWaitTime
      attraction.lastUpdated = new Date().toISOString()
      
      // 更新趨勢
      if (newWaitTime > oldTime) {
        attraction.trend = 'up'
      } else if (newWaitTime < oldTime) {
        attraction.trend = 'down'
      } else {
        attraction.trend = 'stable'
      }
      
      // 更新擁擠程度
      if (newWaitTime >= 60) {
        attraction.crowdLevel = 'very-high'
      } else if (newWaitTime >= 40) {
        attraction.crowdLevel = 'high'
      } else if (newWaitTime >= 20) {
        attraction.crowdLevel = 'medium'
      } else {
        attraction.crowdLevel = 'low'
      }
      
      this.saveData()
      return true
    } catch (error) {
      console.warn('⚠️ 更新排隊時間失敗:', error)
      return false
    }
  }

  // 獲取分類景點
  getAttractionsByCategory(category, limit = 10) {
    try {
      const filtered = this.queueData.filter(a => a.category === category)
      filtered.sort((a, b) => b.currentWaitTime - a.currentWaitTime)
      return filtered.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取分類景點失敗:', error)
      return []
    }
  }

  // 搜索景點
  searchAttractions(query, limit = 10) {
    try {
      const results = this.queueData.filter(attraction => {
        const searchText = `${attraction.name} ${attraction.category} ${attraction.location}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
      
      results.sort((a, b) => a.distance - b.distance)
      return results.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 搜索景點失敗:', error)
      return []
    }
  }

  // 獲取分類統計
  getCategoryStats() {
    try {
      const stats = {}
      this.queueData.forEach(attraction => {
        stats[attraction.category] = (stats[attraction.category] || 0) + 1
      })
      return stats
    } catch (error) {
      console.warn('⚠️ 獲取分類統計失敗:', error)
      return {}
    }
  }

  // 獲取擁擠程度統計
  getCrowdStats() {
    try {
      const stats = {
        'very-high': 0,
        'high': 0,
        'medium': 0,
        'low': 0
      }
      
      this.queueData.forEach(attraction => {
        if (stats[attraction.crowdLevel] !== undefined) {
          stats[attraction.crowdLevel]++
        }
      })
      
      return stats
    } catch (error) {
      console.warn('⚠️ 獲取擁擠統計失敗:', error)
      return {}
    }
  }

  // 重置所有數據
  resetAllData() {
    try {
      this.queueData = this.loadQueueData()
      this.userFavorites = []
      this.saveData()
      console.log('🔄 排隊數據已重置')
    } catch (error) {
      console.error('❌ 重置數據失敗:', error)
    }
  }
}

// 導出單例實例
const queueService = new QueueService()
export default queueService