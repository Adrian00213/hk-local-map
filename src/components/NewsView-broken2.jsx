        {/* Search Bar */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索附近資訊..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Posts List */}
        <div className="p-4">
          {communityPosts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <div className={`w-20 h-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
                <MessageCircle className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {searchQuery ? '無搜索結果' : '附近暫無發佈'}
              </h3>
              <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                {searchQuery ? '試下其他關鍵詞' : '成為第一個分享嘅人！'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowPostForm(true)}
                  className={`mt-4 px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  發佈新資訊
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}
                >
                  <div className="p-5">
                    {/* User Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                          {post.userAvatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                              {post.username}
                            </span>
                            {post.isVerified && (
                              <span className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                已驗證
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`} />
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                              {post.locationName} • {post.distance}km • {new Date(post.timestamp).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>

                    {/* Content */}
                    <p className={`${darkMode ? 'text-gray-300' : 'text-zinc-600'} mb-4`}>
                      {post.content}
                    </p>

                    {/* Interactions */}
                    <div className="flex items-center justify-between pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-zinc-500 hover:text-red-500'}`}
                        >
                          <Heart className={`w-5 h-5 ${userInteractions.likedPosts?.includes(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-zinc-500 hover:text-blue-500'}`}>
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400 hover:text-green-400' : 'text-zinc-500 hover:text-green-500'}`}>
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.shares}</span>
                        </button>
                      </div>
                      <button className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-zinc-500 hover:text-zinc-700'}`}>
                        更多
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 主界面
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
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                  {activeTab === 'news' ? '官方資訊' : '用戶分享'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'community' && (
              <button
                onClick={() => setShowPostForm(true)}
                className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-100 hover:bg-green-200'} flex items-center justify-center transition-colors active:scale-95`}
              >
                <Plus className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </button>
            )}
            <button 
              onClick={handleRefresh}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} flex items-center justify-center transition-colors active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
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
            <div className="flex items-center justify-center gap-2">
              <Newspaper className="w-4 h-4" />
              官方資訊
            </div>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'community'
                ? darkMode ? 'border-green-500 text-green-400' : 'border-green-500 text-green-600'
                : darkMode ? 'border-gray-700 text-gray-400' : 'border-zinc-200 text-zinc-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              即時新聞
            </div>
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
      {activeTab === 'news' ? renderNewsList() : renderCommunityList()}

      {/* Footer */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'} px-5 py-3`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
          {activeTab === 'news' 
            ? `${newsItems.length} 則資訊 • ${currentRegion}`
            : `${communityPosts.length} 則發佈 • ${currentRegion}`
          }
        </div>
      </div>

      {/* Post Form Modal */}
      {renderPostForm()}
    </div>
  )
}