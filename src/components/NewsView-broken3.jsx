import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, MessageCircle, Heart, Share2, MapPin, User, Plus, Search, X, Globe, AlertCircle } from 'lucide-react'
import { useMap } from '../context/MapContext'
import newsService from '../services/NewsService'
import communityService from '../services/CommunityService'

export default function NewsView({ darkMode }) {
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [newsItems, setNewsItems] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [currentRegion, setCurrentRegion] = useState('未知地區')
  const [activeTab, setActiveTab] = useState('news')
  const [showPostForm, setShowPostForm] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (activeTab === 'news') {
      loadNews()
    } else {
      loadCommunityPosts()
    }
  }, [userLocation, activeTab])

  const loadNews = () => {
    setRefreshing(true)
    try {
      let news = []
      if (userLocation && !locationError) {
        news = newsService.getRealTimeNews(userLocation.lat, userLocation.lng)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        news = [{
          id: 'no_location',
          type: 'info',
          title: '📍 等待位置資訊',
          message: '請允許位置權限以獲取本地資訊',
          priority: 'info',
          icon: '📍',
          timestamp: new Date().toISOString()
        }]
        setCurrentRegion('未知地區')
      }
      setNewsItems(news)
    } catch (error) {
      console.error('❌ 加載資訊失敗:', error)
      setNewsItems([{
        id: 'error',
        type: 'error',
        title: '❌ 加載失敗',
        message: '無法加載資訊，請稍後再試',
        priority: 'high',
        icon: '⚠️',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setRefreshing(false)
    }
  }

  const loadCommunityPosts = () => {
    setRefreshing(true)
    try {
      let posts = []
      if (userLocation && !locationError) {
        posts = communityService.getNearbyPosts(userLocation.lat, userLocation.lng, 10, 20)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        posts = communityService.getPopularPosts(10)
        setCurrentRegion('附近')
      }
      if (searchQuery.trim()) {
        posts = posts.filter(post => 
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.locationName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setCommunityPosts(posts)
    } catch (error) {
      console.error('❌ 加載社區發佈失敗:', error)
      setCommunityPosts([])
    } finally {
      setRefreshing(false)
    }
  }

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) {
      alert('請輸入內容')
      return
    }
    try {
      const postData = {
        content: newPostContent,
        category: 'general',
        location: userLocation || { lat: 22.3193, lng: 114.1694 },
        locationName: currentRegion,
        username: '我',
        userAvatar: '👤'
      }
      communityService.createPost(postData)
      setNewPostContent('')
      setShowPostForm(false)
      loadCommunityPosts()
      alert('發佈成功！')
    } catch (error) {
      console.error('❌ 發佈失敗:', error)
      alert('發佈失敗，請稍後再試')
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      local: 'from-blue-500 to-cyan-500',
      weather: 'from-sky-500 to-blue-500',
      transport: 'from-emerald-500 to-teal-500',
      food: 'from-orange-500 to-amber-500',
      event: 'from-purple-500 to-violet-500',
      deal: 'from-pink-500 to-rose-500',
      info: 'from-gray-500 to-slate-500'
    }
    return colors[type] || 'from-gray-500 to-slate-500'
  }

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-orange-100 text-orange-700',
      traffic: 'bg-blue-100 text-blue-700',
      event: 'bg-purple-100 text-purple-700',
      culture: 'bg-emerald-100 text-emerald-700',
      shopping: 'bg-pink-100 text-pink-700',
      general: 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getCategoryLabel = (category) => {
    const labels = {
      food: '飲食',
      traffic: '交通',
      event: '活動',
      culture: '文化',
      shopping: '購物',
      general: '一般'
    }
    return labels[category] || category
  }

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {activeTab === 'news' ? '智能資訊' : '即時新聞'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Globe className="w-3 h-3" />
                  <span>{currentRegion}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'community' && (
              <button
                onClick={() => setShowPostForm(true)}
                className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center`}
              >
                <Plus className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </button>
            )}
            <button 
              onClick={activeTab === 'news' ? loadNews : loadCommunityPosts}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'news'
                ? darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600'
                : darkMode ? 'border-gray-700 text-gray-400' : 'border-zinc-200 text-zinc-500'
            }`}
          >
            官方資訊
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'community'
                ? darkMode ? 'border-green-500 text-green-400' : 'border-green-500 text-green-600'
                : darkMode ? 'border-gray-700 text-gray-400' : 'border-zinc-200 text-zinc-500'
            }`}
          >
            即時新聞
          </button>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className={`mx-4 mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${darkMode ? 'border-red-800' : 'border-red-200'}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <div className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>位置權限問題</div>
              <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                請啟用位置權限以獲取本地資訊
              </div>
            </div>
            <button
              onClick={refreshUserLocation}
              className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-red-700' : 'bg-red-600'} text-white`}
            >
              重試
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'news' ? (
          <div className="p-4 space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'} p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center text-white`}>
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>
                      {item.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-3`}>
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-zinc-600'}`}>
                        {item.type === 'deal' ? '優惠' : '資訊'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                        {new Date(item.timestamp).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Search */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索附近資訊..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-zinc-900'
                  } border ${darkMode ? 'border-gray-600' : 'border-zinc-200'}`}
                />
              </div>
            </div>

            {/* Posts */}
            <div className="p-4 space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                        {post.userAvatar}
                      </div>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                          {post.username}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`} />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                            {post.locationName} • {post.distance}km
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-4`}>
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
                    <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-md mx-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>發佈新資訊</h2>
                <button onClick={() => setShowPostForm(false)}>
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="分享你身邊發生嘅事..."
                className={`w-full h-32 p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-zinc-900'} border ${darkMode ? 'border-gray-600' : 'border-zinc-200'}`}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowPostForm(false)}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${darkMode ? 'text-white' : 'text-zinc-700'}`}
                >
                  取消
                </button>
                <button
                  onClick={handlePostSubmit}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}
                >
                  發佈
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*