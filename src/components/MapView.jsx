import { useState, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'
import SmartRecommendationEngine from './SmartRecommendationEngine'
import RegionSelector from './RegionSelector'
import { X, Locate, Zap, Brain, Search } from 'lucide-react'
import { REGION_DETAILS, getPlaces } from '../services/MapData'
import { searchForRecommendations, initPlacesService } from '../services/GooglePlacesService'

const GOOGLE_MAPS_API_KEY = 'AIzaSyC4OsiPMTcrtqsIQB-3YGJIFcsJelBsZpw'
const containerStyle = { width: '100%', height: '100%' }

export default function MapView({ darkMode }) {
  const { markers, userLocation, locationError, selectedCategory, setSelectedCategory, refreshUserLocation } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNearby, setShowNearby] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [currentRegion, setCurrentRegion] = useState('hong_kong')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('hk_selected_region')
    if (saved) setCurrentRegion(saved)
  }, [])



  const { isLoaded } = useJsApiLoader({ 
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  // Get places for current region from sample data
  const regionPlaces = getPlaces(currentRegion, 'all')
  
  // Merge: sample data + user-added markers
  const allPlaces = [...regionPlaces, ...markers.filter(m => !m.userId)]

  useEffect(() => {
    if (userLocation && regionPlaces.length > 0) {
      const recs = regionPlaces.slice(0, 6).map(p => ({
        id: p.id,
        title: p.name,
        category: p.category,
        icon: CATEGORY_ICONS[p.category] || '📍',
        desc: p.description || (p.rating ? `⭐ ${p.rating}分` : ''),
        distance: p.price !== undefined ? (p.price > 0 ? `$${p.price}` : '免費') : '',
        lat: p.lat,
        lng: p.lng
      }))
      setRecommendations(recs)
    }
  }, [userLocation, currentRegion, regionPlaces])

  // Search places using Google Maps JavaScript API
  // FIX: Removed stale closure issue - searchNearbyPlaces defined inside effect
  // and using showNearby+mapReady as trigger (not userLocation which may be null initially)
  useEffect(() => {
    if (!showNearby) return
    if (!mapReady) return

    const doSearch = async () => {
      setIsSearching(true)
      try {
        const timeContext = getTimeContext()
        const results = await searchForRecommendations(currentRegion, timeContext, userLocation)

        if (results.length > 0) {
          console.log('✅ Google Places found:', results.length, 'places')
          const mappedResults = results.map(p => ({
            id: p.id,
            title: p.name,
            category: p.category,
            icon: CATEGORY_ICONS[p.category] || '📍',
            desc: p.rating ? `⭐ ${p.rating}分` : (p.description || ''),
            distance: '',
            lat: p.lat,
            lng: p.lng,
            place: p
          }))
          setRecommendations(mappedResults)
        }
      } catch (err) {
        console.log('Search error:', err)
      }
      setIsSearching(false)
    }

    doSearch()
  }, [showNearby, mapReady, currentRegion])

  const getTimeContext = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return 'morning'
    if (hour >= 11 && hour < 14) return 'noon'
    if (hour >= 14 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }

  const onMapLoad = (map) => {
    mapRef.current = map
    // Only set mapReady=true AFTER PlacesService is confirmed available
    if (window.google?.maps?.places) {
      initPlacesService(map)
      setMapReady(true)
      console.log('✅ Map ready with PlacesService')
    } else {
      // Wait for places library to load before setting mapReady
      window.google = window.google || {}
      const checkPlaces = setInterval(() => {
        if (window.google?.maps?.places) {
          initPlacesService(map)
          setMapReady(true)
          console.log('✅ PlacesService ready (delayed)')
          clearInterval(checkPlaces)
        }
      }, 100)
    }
  }

  const getMarkerIcon = (cat) => {
    const colors = { 
      deals: '#EF4444', 
      restaurants: '#F97316', 
      places: '#3B82F6', 
      news: '#22C55E',
      transport: '#10B981'
    }
    const icons = { 
      deals: '🛒', 
      restaurants: '🍜', 
      places: '🎯', 
      news: '📰',
      transport: '🚌'
    }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:44px;height:44px;background:${colors[cat] || '#6366F1'};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.18)">${icons[cat] || '📍'}</div>`)}`,
      scaledSize: { width: 44, height: 44 },
      anchor: { x: 22, y: 22 }
    }
  }

  const filtered = selectedCategory 
    ? allPlaces.filter(m => m.category === selectedCategory) 
    : allPlaces

  const regionInfo = REGION_DETAILS[currentRegion] || REGION_DETAILS.hong_kong
  const mapCenter = {
    hong_kong: { lat: 22.3193, lng: 114.1694 },
    china: { lat: 31.2304, lng: 121.4737 },
    taiwan: { lat: 25.0330, lng: 121.5654 },
    japan: { lat: 35.6762, lng: 139.6503 },
    korea: { lat: 37.5665, lng: 126.9780 },
    se_asia: { lat: 13.7563, lng: 100.5018 },
    europe: { lat: 48.8566, lng: 2.3522 },
    global: { lat: 22.3193, lng: 114.1694 }
  }[currentRegion] || { lat: 22.3193, lng: 114.1694 }

  if (!isLoaded) return (
    <div className={`h-full w-full flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      <div className="text-center">
        <div className="w-12 h-12 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-zinc-500'}`}>地圖緊係加载中...</p>
      </div>
    </div>
  )

  return (
    <div className={`h-full w-full relative ${darkMode ? 'bg-gray-900' : 'bg-zinc-100'}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || mapCenter}
        zoom={regionInfo.zoom || 14}
        options={{ 
          styles: darkMode ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }]
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }]
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }]
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }]
            }
          ] : [],
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
        }}
        onLoad={onMapLoad}
      >
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 10,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }}
            title="你的位置"
          />
        )}
        {/* Show all places as markers on map */}
        {filtered.length > 0 && filtered.map((m, idx) => {
          // Ensure we have lat/lng
          const lat = m.lat || m.geometry?.location?.lat()
          const lng = m.lng || m.geometry?.location?.lng()
          if (!lat || !lng) return null
          
          return (
            <Marker 
              key={m.id || `marker-${idx}`}
              position={{ lat, lng }}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="font-size:24px;text-align:center;line-height:44px">${CATEGORY_ICONS[m.category] || '📍'}</div>`)}`,
                scaledSize: { width: 44, height: 44 },
                anchor: { x: 22, y: 22 }
              }}
              onClick={() => setSelected(m.place || m)}
            />
          )
        })}
      </GoogleMap>

      {/* Region Selector - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <RegionSelector 
          currentRegion={currentRegion}
          onRegionChange={setCurrentRegion}
        />
      </div>

      {/* Category Pills */}
      <div className="absolute top-4 left-4 right-20 z-20">
        <div className="glass rounded-2xl shadow-lg border-subtle p-2 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                : 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                selectedCategory === k 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                  : 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location Permission Warning */}
      {locationError && (
        <div className="absolute top-20 left-4 right-4 z-20 animate-slide-up">
          <div className="bg-yellow-100 border border-amber-200 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-yellow-200 flex items-center justify-center shrink-0">
              <Locate className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">
                {locationError === 'denied' ? '位置權限被拒絕' : '無法取得位置'}
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">
                {locationError === 'denied'
                  ? '使用香港中心位置，允許位置存取以獲得更精準推薦'
                  : '位置服務暫時無法使用'}
              </p>
            </div>
            <button
              onClick={refreshUserLocation}
              className="px-3 py-1.5 bg-yellow-1000 text-white text-xs font-semibold rounded-lg shrink-0"
            >
              重試
            </button>
          </div>
        </div>
      )}

      {/* Search indicator */}
      {isSearching && (
        <div className="absolute top-20 left-4 z-20">
          <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl shadow-md flex items-center gap-2">
            <Search className="w-4 h-4 text-yellow-600 animate-pulse" />
            <span className="text-xs text-zinc-600">搜尋中...</span>
          </div>
        </div>
      )}

      {/* Nearby Recommendations Toggle */}
      {recommendations.length > 0 && (
        <button
          onClick={() => setShowNearby(!showNearby)}
          className="absolute left-4 bottom-32 z-20 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Zap className="w-5 h-5" />
          <span className="font-semibold text-sm">智能推薦</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{recommendations.length}</span>
        </button>
      )}

      {/* Smart Recommendations Panel */}
      {showNearby && (
        <div className="absolute left-4 right-4 bottom-36 z-20 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border-subtle overflow-hidden max-h-[60vh]">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{regionInfo.flag} {regionInfo.name} 精選</h3>
                  <p className="text-xs text-zinc-500">🔍 Google Maps 實時數據</p>
                </div>
              </div>
              <button onClick={() => setShowNearby(false)} className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors active:scale-95">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto max-h-[calc(60vh-80px)]">
              <SmartRecommendationEngine 
                places={recommendations} 
                region={currentRegion}
                userLocation={userLocation}
                mapReady={mapReady}
                onPlaceSelect={(place) => setSelected(place)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Location Button */}
      <button 
        onClick={() => refreshUserLocation?.()}
        className="absolute right-4 bottom-32 z-20 w-12 h-12 bg-white rounded-2xl shadow-lg border-subtle flex items-center justify-center active:scale-95 transition-transform"
      >
        <Locate className="w-5 h-5 text-yellow-600" />
      </button>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="absolute right-4 bottom-6 z-20 w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center text-white text-2xl font-light active:scale-95 transition-transform"
      >
        +
      </button>

      {/* Selected Place Card with Navigation */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 z-20 animate-slide-up">
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-stone-700 rounded-t-3xl" />
          
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-100/30 overflow-hidden">
            <div className="p-5">
              <div className="flex gap-4">
                {/* Icon with gradient background */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl shrink-0 shadow-md">
                  {CATEGORY_ICONS[selected.category] || '📍'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-yellow-700 text-xs font-semibold rounded-lg mb-1.5">
                    {CATEGORY_LABELS[selected.category] || selected.type}
                  </span>
                  <h3 className="font-bold text-lg text-zinc-900 leading-tight">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {selected.rating && (
                      <p className="text-sm text-yellow-600 font-medium">⭐ {selected.rating}分</p>
                    )}
                    {selected.price !== undefined && (
                      <p className="text-sm text-yellow-600 font-medium">
                        {selected.price > 0 ? `$${selected.price}` : '免費'}
                      </p>
                    )}
                  </div>
                  {selected.description && (
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{selected.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 rounded-xl bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-colors active:scale-95"
                >
                  <X className="w-4 h-4 text-yellow-600" />
                </button>
              </div>
              
              {/* Navigation Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    const lat = selected.lat || selected.geometry?.location?.lat()
                    const lng = selected.lng || selected.geometry?.location?.lng()
                    if (lat && lng) {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
                      window.open(url, '_blank')
                    }
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-amber-500/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  導航
                </button>
                {selected.address && (
                  <button
                    onClick={() => {
                      const address = encodeURIComponent(selected.address)
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                    }}
                    className="px-4 py-3.5 bg-yellow-100 text-yellow-700 font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-yellow-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    地圖
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && <MarkerForm onClose={() => setShowForm(false)} user={null} onLoginRequired={() => {}} />}
    </div>
  )
}
