import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, MessageCircle, Plus, Globe, AlertCircle, Clock, Users, TrendingUp, TrendingDown, Star, Filter, Search, MapPin, Heart } from 'lucide-react'
import { useMap } from '../context/MapContext'
import newsService from '../services/NewsService'
import communityService from '../services/CommunityService'
import queueService from '../services/QueueService'

export default function NewsView({ darkMode }) {
  const { userLocation, locationError, refreshUserLocation } = useMap()
  const [newsItems, setNewsItems] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [queueAttractions, setQueueAttractions] = useState([])
  const [activeTab, setActiveTab] = useState('news') // 'news' | 'community' | 'queue'
  const [currentRegion, setCurrentRegion] = useState('未知地區')
  const [queueSearch, setQueueSearch] = useState('')
  const [queueFilter, setQueueFilter] = useState('all') // 'all' | 'nearby' | 'popular' | 'favorites'

  useEffect(() => {
    if (activeTab === 'news') {
      loadNews()
    } else if (activeTab === 'community') {
      loadCommunityPosts()
    } else if (activeTab === 'queue') {
      loadQueueAttractions()
    }
  }, [userLocation, activeTab, queueFilter, queueSearch])

  const loadNews = () => {
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
    }
  }

  const loadCommunityPosts = () => {
    try {
      let posts = []
      if (userLocation && !locationError) {
        posts = communityService.getNearbyPosts(userLocation.lat, userLocation.lng, 10, 10)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else {
        posts = communityService.getPopularPosts(10)
        setCurrentRegion('附近')
      }
      setCommunityPosts(posts)
    } catch (error) {
      console.error('❌ 加載社區發佈失敗:', error)
    }
  }

  // 加載排隊資訊
  const loadQueueAttractions = () => {
    try {
      let attractions = []
      
      if (queueFilter === 'nearby' && userLocation && !locationError) {
        attractions = queueService.getNearbyAttractions(userLocation.lat, userLocation.lng, 20, 15)
        const regionInfo = newsService.getRegionInfo(userLocation.lat, userLocation.lng)
        setCurrentRegion(regionInfo.name)
      } else if (queueFilter === 'popular') {
        attractions = queueService.getPopularAttractions(15)
        setCurrentRegion('熱門')
      } else if (queueFilter === 'favorites') {
        attractions = queueService.getFavoriteAttractions()
        setCurrentRegion('收藏')
      } else {
        attractions = queueService.queueData.slice(0, 15)
        setCurrentRegion('全部')
      }
      
      // 搜索過濾
      if (queueSearch.trim()) {
        attractions = attractions.filter(attraction =>
          attraction.name.toLowerCase().includes(queueSearch.toLowerCase()) ||
          attraction.location.toLowerCase().includes(queueSearch.toLowerCase()) ||
          attraction.category.toLowerCase().includes(queueSearch.toLowerCase())
        )
      }
      
      setQueueAttractions(attractions)
    } catch (error) {
      console.error('❌ 加載排隊資訊失敗:', error)
      setQueueAttractions([])
    }
  }

  const handleCreatePost = () => {
    const content = prompt('分享你身邊嘅新鮮事：')
    if (!content) return
    
    try {
      const postData = {
        content: content,
        category: 'general',
        location: userLocation || { lat: 22.3193, lng: 114.1694 },
        locationName: currentRegion,
        username: '我',
        userAvatar: '👤'
      }
      communityService.createPost(postData)
      loadCommunityPosts()
      alert('發佈成功！')
    } catch (error) {
      console.error('❌ 發佈失敗:', error)
      alert('發佈失敗')
    }
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
                onClick={handleCreatePost}
                className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center`}
              >
                <Plus className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </button>
            )}
            <button 
              onClick={activeTab === 'news' ? loadNews : loadCommunityPosts}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}
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
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'news' ? (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'} p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-2xl`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>
                      {item.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <div key={post.id} className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'} p-5`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                    {post.userAvatar}
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {post.username}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'} mt-1`}>
                      {post.locationName} • {post.distance}km
                    </div>
                  </div>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-3`}>
                  {post.content}
                </p>
                <div className={`flex items-center gap-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">❤️</div>
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">💬</div>
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    <div className="text-lg">↪️</div>
                    <span className="text-sm">{post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'} px-5 py-3`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
          {activeTab === 'news' 
            ? `${newsItems.length} 則資訊 • ${currentRegion}`
            : `${communityPosts.length} 則發佈 • ${currentRegion}`
          }
        </div>
      </div>
    </div>
  )
}