/**
 * 智能資訊服務 - 根據位置自動推送相關資訊
 * 情境感知，不顯示固定列表
 */

class NewsService {
  constructor() {
    this.newsCache = {}
    this.userPreferences = this.loadPreferences()
    this.lastLocation = null
    this.lastRegion = null
    
    console.log('📰 智能資訊服務已啟動 - 情境感知資訊推送')
  }

  // 加載用戶偏好
  loadPreferences() {
    try {
      const saved = localStorage.getItem('hk_news_preferences')
      return saved ? JSON.parse(saved) : {
        showLocalNews: true,
        showDeals: true,
        showEvents: true,
        showWeather: true,
        showTraffic: true,
        notificationSound: false,
        vibration: true,
        priorityLevel: 'medium' // low, medium, high
      }
    } catch (error) {
      console.warn('⚠️ 加載資訊偏好失敗:', error)
      return {}
    }
  }

  // 保存偏好
  savePreferences() {
    try {
      localStorage.setItem('hk_news_preferences', JSON.stringify(this.userPreferences))
    } catch (error) {
      console.error('❌ 保存資訊偏好失敗:', error)
    }
  }

  // 根據位置獲取區域資訊
  getRegionInfo(latitude, longitude) {
    // 簡單區域判斷（實際應該用更精確嘅地理編碼）
    if (latitude >= 22.2 && latitude <= 22.5 && longitude >= 113.8 && longitude <= 114.3) {
      return {
        region: 'hong_kong',
        name: '香港',
        language: 'zh-HK',
        currency: 'HKD',
        timezone: 'Asia/Hong_Kong',
        emergencyNumber: '999'
      }
    } else if (latitude >= 35.0 && latitude <= 45.0 && longitude >= 135.0 && longitude <= 145.0) {
      return {
        region: 'japan',
        name: '日本',
        language: 'ja',
        currency: 'JPY',
        timezone: 'Asia/Tokyo',
        emergencyNumber: '110'
      }
    } else if (latitude >= 21.0 && latitude <= 25.5 && longitude >= 120.0 && longitude <= 122.0) {
      return {
        region: 'taiwan',
        name: '台灣',
        language: 'zh-TW',
        currency: 'TWD',
        timezone: 'Asia/Taipei',
        emergencyNumber: '110'
      }
    } else if (latitude >= 22.0 && latitude <= 42.0 && longitude >= 110.0 && longitude <= 123.0) {
      return {
        region: 'china',
        name: '中國',
        language: 'zh-CN',
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        emergencyNumber: '110'
      }
    } else if (latitude >= 37.0 && latitude <= 43.0 && longitude >= 126.0 && longitude <= 130.0) {
      return {
        region: 'korea',
        name: '韓國',
        language: 'ko',
        currency: 'KRW',
        timezone: 'Asia/Seoul',
        emergencyNumber: '112'
      }
    } else {
      return {
        region: 'international',
        name: '國際',
        language: 'en',
        currency: 'USD',
        timezone: 'UTC',
        emergencyNumber: '112'
      }
    }
  }

  // 獲取區域特定資訊
  getRegionSpecificNews(regionInfo) {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    
    const baseNews = []
    
    switch (regionInfo.region) {
      case 'hong_kong':
        baseNews.push(
          {
            id: 'hk_news_1',
            type: 'local',
            title: '🇭🇰 香港本地資訊',
            message: '歡迎來到香港！為你提供最新本地資訊',
            priority: 'info',
            icon: '🏙️',
            timestamp: now.toISOString()
          },
          {
            id: 'hk_weather',
            type: 'weather',
            title: '🌤️ 香港天氣',
            message: '今日天氣晴朗，氣溫25-30°C，濕度75%',
            priority: 'medium',
            icon: '⛅',
            timestamp: now.toISOString()
          },
          {
            id: 'hk_transport',
            type: 'transport',
            title: '🚇 港鐵服務',
            message: '所有路線正常運作，班次頻密',
            priority: 'low',
            icon: '🚇',
            timestamp: now.toISOString()
          }
        )
        
        // 時間特定資訊
        if (hour >= 11 && hour <= 14) {
          baseNews.push({
            id: 'hk_lunch',
            type: 'food',
            title: '🍜 午餐時間',
            message: '附近有多間地道餐廳，推薦試下港式茶餐廳',
            priority: 'medium',
            icon: '🍽️',
            timestamp: now.toISOString()
          })
        }
        
        if (hour >= 17 && hour <= 20) {
          baseNews.push({
            id: 'hk_dinner',
            type: 'food',
            title: '🌃 晚餐推薦',
            message: '香港夜景配美食，推薦海濱餐廳',
            priority: 'medium',
            icon: '🌉',
            timestamp: now.toISOString()
          })
        }
        
        // 週末特定資訊
        if (day === 0 || day === 6) {
          baseNews.push({
            id: 'hk_weekend',
            type: 'event',
            title: '🎉 週末活動',
            message: '本週末有多個文化活動同市集',
            priority: 'medium',
            icon: '🎪',
            timestamp: now.toISOString()
          })
        }
        break
        
      case 'japan':
        baseNews.push(
          {
            id: 'jp_welcome',
            type: 'local',
            title: '🇯🇵 日本旅遊資訊',
            message: '歡迎來到日本！為你提供旅遊提示',
            priority: 'info',
            icon: '🗾',
            timestamp: now.toISOString()
          },
          {
            id: 'jp_currency',
            type: 'finance',
            title: '💴 匯率提示',
            message: `今日匯率：1 HKD ≈ ${(Math.random() * 18 + 15).toFixed(2)} JPY`,
            priority: 'high',
            icon: '💱',
            timestamp: now.toISOString()
          },
          {
            id: 'jp_transport',
            type: 'transport',
            title: '🚅 新幹線資訊',
            message: 'JR Pass可無限次乘坐新幹線',
            priority: 'medium',
            icon: '🚄',
            timestamp: now.toISOString()
          }
        )
        
        // 季節特定資訊
        const month = now.getMonth()
        if (month >= 3 && month <= 4) {
          baseNews.push({
            id: 'jp_sakura',
            type: 'event',
            title: '🌸 櫻花季節',
            message: '正值櫻花盛開季節，推薦上野公園賞櫻',
            priority: 'high',
            icon: '🌸',
            timestamp: now.toISOString()
          })
        }
        break
        
      case 'taiwan':
        baseNews.push(
          {
            id: 'tw_welcome',
            type: 'local',
            title: '🇹🇼 台灣旅遊資訊',
            message: '歡迎來到台灣！為你提供本地資訊',
            priority: 'info',
            icon: '🏮',
            timestamp: now.toISOString()
          },
          {
            id: 'tw_nightmarket',
            type: 'food',
            title: '🍢 夜市推薦',
            message: '台灣夜市美食多，推薦士林夜市同饒河夜市',
            priority: 'medium',
            icon: '🍡',
            timestamp: now.toISOString()
          },
          {
            id: 'tw_transport',
            type: 'transport',
            title: '🚆 捷運資訊',
            message: '台北捷運覆蓋主要景點，方便快捷',
            priority: 'low',
            icon: '🚆',
            timestamp: now.toISOString()
          }
        )
        break
        
      case 'china':
        baseNews.push(
          {
            id: 'cn_welcome',
            type: 'local',
            title: '🇨🇳 中國旅遊資訊',
            message: '歡迎來到中國！為你提供旅遊提示',
            priority: 'info',
            icon: '🏯',
            timestamp: now.toISOString()
          },
          {
            id: 'cn_payment',
            type: 'finance',
            title: '💳 支付提示',
            message: '中國主要使用微信支付同支付寶，現金使用較少',
            priority: 'high',
            icon: '📱',
            timestamp: now.toISOString()
          },
          {
            id: 'cn_transport',
            type: 'transport',
            title: '🚇 地鐵資訊',
            message: '大城市地鐵網絡發達，建議下載當地地鐵App',
            priority: 'medium',
            icon: '🚊',
            timestamp: now.toISOString()
          }
        )
        break
        
      case 'korea':
        baseNews.push(
          {
            id: 'kr_welcome',
            type: 'local',
            title: '🇰🇷 韓國旅遊資訊',
            message: '歡迎來到韓國！為你提供旅遊提示',
            priority: 'info',
            icon: '🏮',
            timestamp: now.toISOString()
          },
          {
            id: 'kr_food',
            type: 'food',
            title: '🍲 韓國美食',
            message: '推薦試下韓式燒烤、泡菜同炸雞',
            priority: 'medium',
            icon: '🥘',
            timestamp: now.toISOString()
          },
          {
            id: 'kr_transport',
            type: 'transport',
            title: '🚇 地鐵資訊',
            message: '首爾地鐵有中文標示，方便遊客使用',
            priority: 'low',
            icon: '🚇',
            timestamp: now.toISOString()
          }
        )
        break
        
      default:
        // 國際通用資訊
        baseNews.push(
          {
            id: 'int_welcome',
            type: 'local',
            title: '🌍 國際旅遊提示',
            message: '為你提供通用旅遊資訊',
            priority: 'info',
            icon: '✈️',
            timestamp: now.toISOString()
          },
          {
            id: 'int_emergency',
            type: 'safety',
            title: '🆘 緊急聯絡',
            message: `當地緊急電話：${regionInfo.emergencyNumber}`,
            priority: 'high',
            icon: '📞',
            timestamp: now.toISOString()
          },
          {
            id: 'int_currency',
            type: 'finance',
            title: '💱 貨幣提示',
            message: `當地貨幣：${regionInfo.currency}`,
            priority: 'medium',
            icon: '💰',
            timestamp: now.toISOString()
          }
        )
    }
    
    return baseNews
  }

  // 獲取區域特定優惠（包含倒數時間）
  getRegionSpecificDeals(regionInfo) {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    
    const baseDeals = []
    
    // 計算倒數時間
    const calculateTimeLeft = (expiryDate) => {
      const expiry = new Date(expiryDate)
      const diffMs = expiry - now
      
      if (diffMs <= 0) return '已過期'
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (diffDays > 0) {
        return `剩餘 ${diffDays} 天 ${diffHours} 小時`
      } else if (diffHours > 0) {
        return `剩餘 ${diffHours} 小時`
      } else {
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        return `剩餘 ${diffMinutes} 分鐘`
      }
    }
    
    switch (regionInfo.region) {
      case 'hong_kong':
        baseDeals.push(
          {
            id: 'hk_deal_1',
            type: 'deal',
            title: '🎉 香港美食節 2026',
            message: '超過200間本地及國際美食參與，多間餐廳推出限定優惠',
            priority: 'high',
            icon: '🍜',
            category: 'food',
            expiry: '2026-04-15',
            timeLeft: calculateTimeLeft('2026-04-15'),
            timestamp: now.toISOString()
          },
          {
            id: 'hk_deal_2',
            type: 'deal',
            title: '💳 AlipayHK 消費券',
            message: '用 AlipayHK 付款最高回贈 $500，指定商戶再享額外折扣',
            priority: 'medium',
            icon: '💰',
            category: 'shopping',
            expiry: '2026-04-30',
            timestamp: now.toISOString()
          },
          {
            id: 'hk_deal_3',
            title: '🛍️ 海港城春季購物節',
            message: '超過500間商店參與，最高7折優惠',
            type: 'deal',
            priority: 'medium',
            icon: '🛒',
            category: 'shopping',
            expiry: '2026-04-20',
            timestamp: now.toISOString()
          },
          {
            id: 'hk_deal_4',
            type: 'deal',
            title: '☕ 咖啡店買一送一',
            message: '指定咖啡店下午茶時段優惠 (2pm-5pm)',
            priority: 'low',
            icon: '☕',
            category: 'food',
            expiry: '2026-04-10',
            timestamp: now.toISOString()
          },
          {
            id: 'hk_deal_5',
            type: 'deal',
            title: '🚇 MTR 週末優惠',
            message: '八達通週日免費轉乘優惠，環保出行慳更多',
            priority: 'medium',
            icon: '🚇',
            category: 'transport',
            expiry: '2026-12-31',
            timestamp: now.toISOString()
          }
        )
        
        // 時間特定優惠
        if (hour >= 6 && hour <= 10) {
          baseDeals.push({
            id: 'hk_morning_deal',
            type: 'deal',
            title: '☀️ 早晨優惠',
            message: '指定茶餐廳早餐套餐 $35',
            priority: 'medium',
            icon: '🌅',
            category: 'food',
            expiry: '2026-04-30',
            timestamp: now.toISOString()
          })
        }
        
        if (hour >= 14 && hour <= 17) {
          baseDeals.push({
            id: 'hk_afternoon_deal',
            type: 'deal',
            title: '🕑 下午茶時段',
            message: '咖啡店買一送一，2pm-5pm',
            priority: 'medium',
            icon: '🕑',
            category: 'food',
            expiry: '2026-04-30',
            timestamp: now.toISOString()
          })
        }
        
        if (hour >= 18 && hour <= 22) {
          baseDeals.push({
            id: 'hk_evening_deal',
            type: 'deal',
            title: '🌃 晚餐優惠',
            message: '指定餐廳晚市8折',
            priority: 'medium',
            icon: '🌙',
            category: 'food',
            expiry: '2026-04-30',
            timestamp: now.toISOString()
          })
        }
        break
        
      case 'japan':
        baseDeals.push(
          {
            id: 'jp_deal_1',
            type: 'deal',
            title: '🎌 日本旅遊優惠',
            message: 'JR Pass 7日券特價優惠',
            priority: 'high',
            icon: '🚅',
            category: 'transport',
            expiry: '2026-12-31',
            timestamp: now.toISOString()
          },
          {
            id: 'jp_deal_2',
            type: 'deal',
            title: '🏮 溫泉旅館優惠',
            message: '指定溫泉旅館住宿連晚餐8折',
            priority: 'medium',
            icon: '♨️',
            category: 'accommodation',
            expiry: '2026-06-30',
            timestamp: now.toISOString()
          }
        )
        break
        
      case 'taiwan':
        baseDeals.push(
          {
            id: 'tw_deal_1',
            type: 'deal',
            title: '🍢 夜市美食優惠',
            message: '指定夜市攤位消費滿$100送$20',
            priority: 'medium',
            icon: '🏮',
            category: 'food',
            expiry: '2026-05-31',
            timestamp: now.toISOString()
          },
          {
            id: 'tw_deal_2',
            type: 'deal',
            title: '🚆 高鐵早鳥票',
            message: '提前14日購票享65折優惠',
            priority: 'high',
            icon: '🚄',
            category: 'transport',
            expiry: '2026-12-31',
            timestamp: now.toISOString()
          }
        )
        break
        
      default:
        // 通用優惠
        baseDeals.push({
          id: 'general_deal',
          type: 'deal',
          title: '🌍 旅遊優惠',
          message: '查看當地旅遊局網站獲取最新優惠',
          priority: 'low',
          icon: '✈️',
          category: 'travel',
          expiry: '2026-12-31',
          timestamp: now.toISOString()
        })
    }
    
    return baseDeals
  }

  // 獲取實時資訊（根據位置）
  getRealTimeNews(latitude, longitude) {
    try {
      // 獲取區域資訊
      const regionInfo = this.getRegionInfo(latitude, longitude)
      
      // 檢查區域是否改變
      const regionChanged = this.lastRegion !== regionInfo.region
      this.lastRegion = regionInfo.region
      
      // 獲取區域特定資訊
      let news = this.getRegionSpecificNews(regionInfo)
      
      // 獲取區域特定優惠
      if (this.userPreferences.showDeals) {
        const deals = this.getRegionSpecificDeals(regionInfo)
        news = [...news, ...deals]
      }
      
      // 根據用戶偏好過濾
      news = news.filter(item => {
        if (!this.userPreferences.showLocalNews && item.type === 'local') return false
        if (!this.userPreferences.showDeals && item.type === 'deal') return false
        if (!this.userPreferences.showEvents && item.type === 'event') return false
        if (!this.userPreferences.showWeather && item.type === 'weather') return false
        if (!this.userPreferences.showTraffic && item.type === 'transport') return false
        return true
      })
      
      // 根據優先級排序
      const priorityOrder = { high: 3, medium: 2, low: 1, info: 0 }
      news.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      
      // 限制數量
      news = news.slice(0, 12)
      
      // 添加時間標記
      news = news.map(item => ({
        ...item,
        region: regionInfo.region,
        regionName: regionInfo.name,
        isNew: regionChanged
      }))
      
      return news
    } catch (error) {
      console.warn('⚠️ 獲取實時資訊失敗:', error)
      return []
    }
  }

  // 獲取緊急資訊
  getEmergencyInfo(regionInfo) {
    return {
      id: 'emergency',
      type: 'safety',
      title: '🆘 緊急聯絡',
      message: `當地緊急電話：${regionInfo.emergencyNumber}`,
      priority: 'high',
      icon: '🚨',
      timestamp: new Date().toISOString(),
      region: regionInfo.region,
      regionName: regionInfo.name
    }
  }

  // 獲取天氣資訊
  getWeatherInfo(regionInfo) {
    const weatherConditions = ['晴朗', '多雲', '間中有雨', '天晴', '陰天', '雷暴']
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    
    return {
      id: 'weather',
      type: 'weather',
      title: '🌤️ 天氣預報',
      message: `今日天氣：${randomWeather}，氣溫${Math.floor(Math.random() * 15 + 15)}-${Math.floor(Math.random() * 15 + 25)}°C`,
      priority: 'medium',
      icon: '⛅',
      timestamp: new Date().toISOString(),
      region: regionInfo.region,
      regionName: regionInfo.name
    }
  }

  // 獲取交通資訊
  getTransportInfo(regionInfo) {
    const transportMessages = {
      'hong_kong': '港鐵服務正常，巴士班次頻密',
      'japan': '新幹線運行正常，地鐵班次頻密',
      'taiwan': '捷運服務正常，公車班次穩定',
      'china': '地鐵運行正常，建議避開高峰時段',
      'korea': '地鐵服務正常，巴士班次穩定',
      'international': '建議使用當地公共交通App'
    }
    
    return {
      id: 'transport',
      type: 'transport',
      title: '🚇 交通狀況',
      message: transportMessages[regionInfo.region] || '建議查看當地交通資訊',
      priority: 'low',
      icon: '🚇',
      timestamp: new Date().toISOString(),
      region: regionInfo.region,
      regionName: regionInfo.name
    }
  }

  // 更新用戶偏好
  updatePreferences(updates) {
    try {
      this.userPreferences = {
        ...this.userPreferences,
        ...updates
      }
      this.savePreferences()
    } catch (error) {
      console.warn('⚠️ 更新資訊偏好失敗:', error)
    }
  }

  // 重置所有偏好
  resetPreferences() {
    try {
      this.userPreferences = {
        showLocalNews: true,
        showDeals: true,
        showEvents: true,
        showWeather: true,
        showTraffic: true,
        notificationSound: false,
        vibration: true,
        priorityLevel: 'medium'
      }
      this.savePreferences()
    } catch (error) {
      console.error('❌ 重置偏好失敗:', error)
    }
  }
}

// 導出單例實例
const newsService = new NewsService()
export default newsService