/**
 * 社區服務 - 用戶發佈同分享附近資訊
 * 即時新聞、用戶生成內容、社交互動
 */

class CommunityService {
  constructor() {
    this.userPosts = this.loadPosts()
    this.userInteractions = this.loadInteractions()
    
    console.log('👥 社區服務已啟動 - 分享你身邊嘅新鮮事')
  }

  // 加載用戶發佈
  loadPosts() {
    try {
      const saved = localStorage.getItem('hk_community_posts')
      if (saved) {
        return JSON.parse(saved)
      }
      
      // 默認示例數據
      return [
        {
          id: 'post_1',
          userId: 'user_123',
          username: '香港遊客',
          userAvatar: '👤',
          content: '銅鑼灣時代廣場有pop-up市集，好多手作同美食！',
          location: { lat: 22.2799, lng: 114.1837 },
          locationName: '銅鑼灣',
          category: 'event',
          images: [],
          likes: 15,
          comments: 3,
          shares: 2,
          timestamp: '2026-03-31T10:30:00',
          isVerified: false,
          distance: 0.5 // 公里
        },
        {
          id: 'post_2',
          userId: 'user_456',
          username: '美食達人',
          userAvatar: '🍜',
          content: '旺角新開嘅泰國餐廳，冬陰功湯好正宗！',
          location: { lat: 22.3193, lng: 114.1694 },
          locationName: '旺角',
          category: 'food',
          images: [],
          likes: 28,
          comments: 5,
          shares: 1,
          timestamp: '2026-03-31T09:15:00',
          isVerified: true,
          distance: 1.2
        },
        {
          id: 'post_3',
          userId: 'user_789',
          username: '交通觀察員',
          userAvatar: '🚗',
          content: '紅隧往香港方向車龍長，建議使用東隧',
          location: { lat: 22.3000, lng: 114.1800 },
          locationName: '紅磡',
          category: 'traffic',
          images: [],
          likes: 42,
          comments: 8,
          shares: 12,
          timestamp: '2026-03-31T08:45:00',
          isVerified: true,
          distance: 2.5
        },
        {
          id: 'post_4',
          userId: 'user_101',
          username: '文化愛好者',
          userAvatar: '🎨',
          content: 'M+博物館今日有免費導賞團，仲有得睇新展覽',
          location: { lat: 22.3036, lng: 114.1610 },
          locationName: '西九文化區',
          category: 'culture',
          images: [],
          likes: 31,
          comments: 4,
          shares: 3,
          timestamp: '2026-03-31T11:00:00',
          isVerified: false,
          distance: 3.0
        },
        {
          id: 'post_5',
          userId: 'user_202',
          username: '購物達人',
          userAvatar: '🛍️',
          content: '海港城春季購物節開始啦，好多品牌都有折扣',
          location: { lat: 22.2950, lng: 114.1667 },
          locationName: '尖沙咀',
          category: 'shopping',
          images: [],
          likes: 19,
          comments: 2,
          shares: 1,
          timestamp: '2026-03-31T10:00:00',
          isVerified: false,
          distance: 4.0
        }
      ]
    } catch (error) {
      console.warn('⚠️ 加載社區發佈失敗:', error)
      return []
    }
  }

  // 加載用戶互動
  loadInteractions() {
    try {
      const saved = localStorage.getItem('hk_user_interactions')
      return saved ? JSON.parse(saved) : {
        likedPosts: [],
        commentedPosts: [],
        sharedPosts: []
      }
    } catch (error) {
      console.warn('⚠️ 加載用戶互動失敗:', error)
      return { likedPosts: [], commentedPosts: [], sharedPosts: [] }
    }
  }

  // 保存數據
  saveData() {
    try {
      localStorage.setItem('hk_community_posts', JSON.stringify(this.userPosts))
      localStorage.setItem('hk_user_interactions', JSON.stringify(this.userInteractions))
    } catch (error) {
      console.error('❌ 保存社區數據失敗:', error)
    }
  }

  // 獲取附近發佈
  getNearbyPosts(userLat, userLng, radiusKm = 10, limit = 20) {
    try {
      const nearbyPosts = this.userPosts.filter(post => {
        if (!post.location) return false
        
        // 計算距離（簡單版本）
        const latDiff = Math.abs(post.location.lat - userLat)
        const lngDiff = Math.abs(post.location.lng - userLng)
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 // 粗略轉換為公里
        
        post.distance = Math.round(distance * 10) / 10
        return distance <= radiusKm
      })
      
      // 按時間排序（最新優先）
      nearbyPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      // 限制數量
      return nearbyPosts.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取附近發佈失敗:', error)
      return []
    }
  }

  // 獲取熱門發佈
  getPopularPosts(limit = 10) {
    try {
      const popularPosts = [...this.userPosts]
      
      // 按互動排序（點讚+評論+分享）
      popularPosts.sort((a, b) => {
        const scoreA = a.likes + a.comments * 2 + a.shares * 3
        const scoreB = b.likes + b.comments * 2 + b.shares * 3
        return scoreB - scoreA
      })
      
      return popularPosts.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取熱門發佈失敗:', error)
      return []
    }
  }

  // 創建新發佈
  createPost(postData) {
    try {
      const newPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: postData.userId || 'anonymous',
        username: postData.username || '匿名用戶',
        userAvatar: postData.userAvatar || '👤',
        content: postData.content,
        location: postData.location,
        locationName: postData.locationName || '附近',
        category: postData.category || 'general',
        images: postData.images || [],
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        isVerified: false,
        distance: 0
      }
      
      this.userPosts.unshift(newPost)
      this.saveData()
      
      console.log('✅ 新發佈已創建:', newPost.id)
      return newPost
    } catch (error) {
      console.error('❌ 創建發佈失敗:', error)
      throw error
    }
  }

  // 點讚發佈
  likePost(postId, userId) {
    try {
      const post = this.userPosts.find(p => p.id === postId)
      if (!post) throw new Error('發佈不存在')
      
      const userLikes = this.userInteractions.likedPosts || []
      
      if (userLikes.includes(postId)) {
        // 取消點讚
        post.likes = Math.max(0, post.likes - 1)
        this.userInteractions.likedPosts = userLikes.filter(id => id !== postId)
      } else {
        // 點讚
        post.likes += 1
        this.userInteractions.likedPosts.push(postId)
      }
      
      this.saveData()
      return post.likes
    } catch (error) {
      console.warn('⚠️ 點讚操作失敗:', error)
      return 0
    }
  }

  // 添加評論
  addComment(postId, commentData) {
    try {
      const post = this.userPosts.find(p => p.id === postId)
      if (!post) throw new Error('發佈不存在')
      
      // 簡單增加評論數
      post.comments += 1
      
      // 實際應該保存評論內容
      this.saveData()
      return post.comments
    } catch (error) {
      console.warn('⚠️ 添加評論失敗:', error)
      return 0
    }
  }

  // 分享發佈
  sharePost(postId) {
    try {
      const post = this.userPosts.find(p => p.id === postId)
      if (!post) throw new Error('發佈不存在')
      
      post.shares += 1
      this.saveData()
      return post.shares
    } catch (error) {
      console.warn('⚠️ 分享操作失敗:', error)
      return 0
    }
  }

  // 獲取分類發佈
  getPostsByCategory(category, limit = 15) {
    try {
      const filtered = this.userPosts.filter(post => post.category === category)
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      return filtered.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取分類發佈失敗:', error)
      return []
    }
  }

  // 獲取用戶發佈
  getUserPosts(userId, limit = 20) {
    try {
      const userPosts = this.userPosts.filter(post => post.userId === userId)
      userPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      return userPosts.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 獲取用戶發佈失敗:', error)
      return []
    }
  }

  // 搜索發佈
  searchPosts(query, limit = 20) {
    try {
      const results = this.userPosts.filter(post => {
        const searchText = `${post.content} ${post.locationName} ${post.username} ${post.category}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
      
      results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      return results.slice(0, limit)
    } catch (error) {
      console.warn('⚠️ 搜索發佈失敗:', error)
      return []
    }
  }

  // 獲取分類統計
  getCategoryStats() {
    try {
      const stats = {}
      this.userPosts.forEach(post => {
        stats[post.category] = (stats[post.category] || 0) + 1
      })
      return stats
    } catch (error) {
      console.warn('⚠️ 獲取分類統計失敗:', error)
      return {}
    }
  }

  // 刪除發佈
  deletePost(postId, userId) {
    try {
      const postIndex = this.userPosts.findIndex(p => p.id === postId && p.userId === userId)
      if (postIndex === -1) throw new Error('發佈不存在或無權限')
      
      this.userPosts.splice(postIndex, 1)
      this.saveData()
      return true
    } catch (error) {
      console.warn('⚠️ 刪除發佈失敗:', error)
      return false
    }
  }

  // 重置所有數據
  resetAllData() {
    try {
      this.userPosts = []
      this.userInteractions = {
        likedPosts: [],
        commentedPosts: [],
        sharedPosts: []
      }
      this.saveData()
      console.log('🔄 所有社區數據已重置')
    } catch (error) {
      console.error('❌ 重置數據失敗:', error)
    }
  }
}

// 導出單例實例
const communityService = new CommunityService()
export default communityService