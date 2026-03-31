import { createContext, useContext, useState, useEffect } from 'react'
import automationService from '../services/AutomationService'

const AutomationContext = createContext()

export function useAutomation() {
  return useContext(AutomationContext)
}

export function AutomationProvider({ children }) {
  const [suggestions, setSuggestions] = useState([])
  const [userSummary, setUserSummary] = useState(null)
  const [isLearning, setIsLearning] = useState(true)

  // 初始化加載用戶摘要
  useEffect(() => {
    const summary = automationService.getUserSummary()
    setUserSummary(summary)
    console.log('🤖 自動化Context已初始化')
  }, [])

  // 記錄位置訪問
  const recordLocation = (location) => {
    if (!isLearning) return
    
    try {
      automationService.recordLocationVisit(location)
      
      // 更新摘要
      const newSummary = automationService.getUserSummary()
      setUserSummary(newSummary)
      
      // 獲取新建議
      const newSuggestions = automationService.getSmartSuggestions()
      setSuggestions(newSuggestions)
    } catch (error) {
      console.warn('⚠️ 記錄位置失敗:', error)
    }
  }

  // 記錄餐廳評分
  const recordRestaurantRating = (restaurant, rating, category) => {
    if (!isLearning) return
    
    try {
      automationService.recordFoodPreference(restaurant, rating, category)
      
      // 更新摘要
      const newSummary = automationService.getUserSummary()
      setUserSummary(newSummary)
    } catch (error) {
      console.warn('⚠️ 記錄餐廳評分失敗:', error)
    }
  }

  // 記錄功能使用
  const recordFunctionUsage = (functionName, duration = 1) => {
    if (!isLearning) return
    
    try {
      automationService.recordUsage(functionName, duration)
    } catch (error) {
      console.warn('⚠️ 記錄功能使用失敗:', error)
    }
  }

  // 獲取智能建議
  const getSuggestions = () => {
    try {
      const newSuggestions = automationService.getSmartSuggestions()
      setSuggestions(newSuggestions)
      return newSuggestions
    } catch (error) {
      console.warn('⚠️ 獲取建議失敗:', error)
      return []
    }
  }

  // 切換學習模式
  const toggleLearning = () => {
    setIsLearning(!isLearning)
    console.log(`🤖 學習模式: ${!isLearning ? '開啟' : '關閉'}`)
  }

  // 重置學習數據
  const resetLearningData = () => {
    if (confirm('確定要重置所有學習數據嗎？這將清除你的使用習慣記錄。')) {
      automationService.resetAllData()
      setUserSummary(automationService.getUserSummary())
      setSuggestions([])
      alert('學習數據已重置')
    }
  }

  // 獲取用戶偏好
  const getUserPreferences = () => {
    return {
      ...automationService.userPreferences,
      isLearning
    }
  }

  // 更新用戶偏好
  const updateUserPreferences = (updates) => {
    try {
      automationService.userPreferences = {
        ...automationService.userPreferences,
        ...updates
      }
      automationService.savePreferences()
    } catch (error) {
      console.warn('⚠️ 更新偏好失敗:', error)
    }
  }

  const value = {
    // 狀態
    suggestions,
    userSummary,
    isLearning,
    
    // 操作
    recordLocation,
    recordRestaurantRating,
    recordFunctionUsage,
    getSuggestions,
    toggleLearning,
    resetLearningData,
    getUserPreferences,
    updateUserPreferences,
    
    // 服務直接訪問
    automationService
  }

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  )
}