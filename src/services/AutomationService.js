/**
 * 後台自動化服務 - 默默記錄用戶喜好
 * 不顯示界面，只在後台運作
 */

class AutomationService {
  constructor() {
    this.userPreferences = this.loadPreferences()
    this.locationHistory = this.loadLocationHistory()
    this.foodPreferences = this.loadFoodPreferences()
    this.usagePatterns = this.loadUsagePatterns()
    
    console.log('🤖 自動化服務已啟動 - 默默記錄你的喜好')
  }

  // 加載用戶偏好
  loadPreferences() {
    try {
      const saved = localStorage.getItem('hk_user_preferences')
      return saved ? JSON.parse(saved) : {
        theme: 'light',
        notifications: true,
        autoNavigation: true,
        trafficAlerts: true,
        queueNotifications: false,
        language: 'zh-HK'
      }
    } catch (error) {
      console.warn('⚠️ 加載偏好失敗:', error)
      return {}
    }
  }

  // 加載位置歷史
  loadLocationHistory() {
    try {
      const saved = localStorage.getItem('hk_location_history')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn('⚠️ 加載位置歷史失敗:', error)
      return []
    }
  }

  // 加載飲食偏好
  loadFoodPreferences() {
    try {
      const saved = localStorage.getItem('hk_food_preferences')
      return saved ? JSON.parse(saved) : {
        favoriteCuisines: [],
        dislikedCuisines: [],
        dietaryRestrictions: [],
        priceRange: { min: 0, max: 500 },
        favoriteRestaurants: []
      }
    } catch (error) {
      console.warn('⚠️ 加載飲食偏好失敗:', error)
      return {}
    }
  }

  // 加載使用模式
  loadUsagePatterns() {
    try {
      const saved = localStorage.getItem('hk_usage_patterns')
      return saved ? JSON.parse(saved) : {
        peakHours: [],
        favoriteDay: null,
        mostUsedFunction: null,
        averageSessionTime: 0,
        frequentLocations: []
      }
    } catch (error) {
      console.warn('⚠️ 加載使用模式失敗:', error)
      return {}
    }
  }

  // 保存偏好
  savePreferences() {
    try {
      localStorage.setItem('hk_user_preferences', JSON.stringify(this.userPreferences))
      localStorage.setItem('hk_location_history', JSON.stringify(this.locationHistory))
      localStorage.setItem('hk_food_preferences', JSON.stringify(this.foodPreferences))
      localStorage.setItem('hk_usage_patterns', JSON.stringify(this.usagePatterns))
    } catch (error) {
      console.error('❌ 保存偏好失敗:', error)
    }
  }

  // 記錄位置訪問
  recordLocationVisit(location) {
    try {
      const visit = {
        ...location,
        timestamp: new Date().toISOString(),
        visitCount: 1
      }

      // 檢查是否已存在
      const existingIndex = this.locationHistory.findIndex(
        loc => loc.id === location.id || loc.name === location.name
      )

      if (existingIndex >= 0) {
        // 更新現有記錄
        this.locationHistory[existingIndex].visitCount++
        this.locationHistory[existingIndex].lastVisit = new Date().toISOString()
        this.locationHistory[existingIndex].totalTimeSpent = 
          (this.locationHistory[existingIndex].totalTimeSpent || 0) + 1
      } else {
        // 添加新記錄
        this.locationHistory.unshift(visit)
        
        // 保持最多100個記錄
        if (this.locationHistory.length > 100) {
          this.locationHistory.pop()
        }
      }

      // 更新常用地點
      this.updateFrequentLocations()
      this.savePreferences()
      
      console.log('📍 記錄位置訪問:', location.name)
    } catch (error) {
      console.warn('⚠️ 記錄位置訪問失敗:', error)
    }
  }

  // 記錄飲食偏好
  recordFoodPreference(restaurant, rating, category) {
    try {
      const pref = {
        restaurant,
        rating,
        category,
        timestamp: new Date().toISOString()
      }

      // 添加到飲食偏好
      if (rating >= 4) {
        // 高評分 - 添加到喜愛餐廳
        if (!this.foodPreferences.favoriteRestaurants.some(r => r.id === restaurant.id)) {
          this.foodPreferences.favoriteRestaurants.unshift({
            ...restaurant,
            firstTried: new Date().toISOString(),
            visitCount: 1
          })
        }
        
        // 添加到喜愛菜系
        if (category && !this.foodPreferences.favoriteCuisines.includes(category)) {
          this.foodPreferences.favoriteCuisines.push(category)
        }
      } else if (rating <= 2) {
        // 低評分 - 添加到不喜愛菜系
        if (category && !this.foodPreferences.dislikedCuisines.includes(category)) {
          this.foodPreferences.dislikedCuisines.push(category)
        }
      }

      this.savePreferences()
      console.log('🍜 記錄飲食偏好:', restaurant.name, '評分:', rating)
    } catch (error) {
      console.warn('⚠️ 記錄飲食偏好失敗:', error)
    }
  }

  // 記錄使用模式
  recordUsage(functionName, duration) {
    try {
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()
      
      // 記錄高峰時段
      const hourRange = `${hour}:00-${hour+1}:00`
      if (!this.usagePatterns.peakHours.includes(hourRange)) {
        this.usagePatterns.peakHours.push(hourRange)
      }
      
      // 記錄最常用功能
      if (!this.usagePatterns.mostUsedFunction) {
        this.usagePatterns.mostUsedFunction = functionName
      }
      
      // 記錄平均使用時間
      const totalSessions = this.usagePatterns.averageSessionTime > 0 ? 2 : 1
      this.usagePatterns.averageSessionTime = 
        (this.usagePatterns.averageSessionTime + duration) / totalSessions
      
      // 記錄最活躍日子
      const days = ['日', '一', '二', '三', '四', '五', '六']
      this.usagePatterns.favoriteDay = days[day]
      
      this.savePreferences()
      console.log('📊 記錄使用模式:', functionName, '時長:', duration)
    } catch (error) {
      console.warn('⚠️ 記錄使用模式失敗:', error)
    }
  }

  // 更新常用地點
  updateFrequentLocations() {
    try {
      // 按訪問次數排序
      const sorted = [...this.locationHistory].sort((a, b) => b.visitCount - a.visitCount)
      this.usagePatterns.frequentLocations = sorted.slice(0, 10) // 取前10個
    } catch (error) {
      console.warn('⚠️ 更新常用地點失敗:', error)
    }
  }

  // 獲取智能建議
  getSmartSuggestions(userLocation, currentTime) {
    try {
      const suggestions = []
      const hour = new Date().getHours()
      
      // 1. 交通建議
      if (hour >= 7 && hour <= 9) {
        suggestions.push({
          type: 'traffic',
          title: '早高峰提醒',
          message: '現在是交通繁忙時段，建議使用公共交通工具',
          priority: 'high'
        })
      }
      
      // 2. 飲食建議
      if (hour >= 11 && hour <= 13) {
        const favoriteCuisine = this.foodPreferences.favoriteCuisines[0]
        if (favoriteCuisine) {
          suggestions.push({
            type: 'food',
            title: '午餐時間',
            message: `根據你的喜好，推薦${favoriteCuisine}餐廳`,
            priority: 'medium'
          })
        }
      }
      
      // 3. 常用地點提醒
      if (this.usagePatterns.frequentLocations.length > 0) {
        const frequentLocation = this.usagePatterns.frequentLocations[0]
        suggestions.push({
          type: 'location',
          title: '常去地點',
          message: `你經常去${frequentLocation.name}，要唔要設定快捷導航？`,
          priority: 'low'
        })
      }
      
      return suggestions
    } catch (error) {
      console.warn('⚠️ 獲取智能建議失敗:', error)
      return []
    }
  }

  // 獲用戶摘要
  getUserSummary() {
    return {
      totalLocationsVisited: this.locationHistory.length,
      favoriteCuisines: this.foodPreferences.favoriteCuisines.slice(0, 3),
      frequentLocations: this.usagePatterns.frequentLocations.slice(0, 5),
      peakHours: this.usagePatterns.peakHours.slice(0, 3),
      mostUsedFunction: this.usagePatterns.mostUsedFunction,
      averageSessionTime: Math.round(this.usagePatterns.averageSessionTime)
    }
  }

  // 重置所有數據
  resetAllData() {
    try {
      this.userPreferences = {}
      this.locationHistory = []
      this.foodPreferences = {
        favoriteCuisines: [],
        dislikedCuisines: [],
        dietaryRestrictions: [],
        priceRange: { min: 0, max: 500 },
        favoriteRestaurants: []
      }
      this.usagePatterns = {
        peakHours: [],
        favoriteDay: null,
        mostUsedFunction: null,
        averageSessionTime: 0,
        frequentLocations: []
      }
      
      this.savePreferences()
      console.log('🔄 所有數據已重置')
    } catch (error) {
      console.error('❌ 重置數據失敗:', error)
    }
  }
}

// 導出單例實例
const automationService = new AutomationService()
export default automationService