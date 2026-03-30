import { useState } from 'react'
import { Info, CreditCard, MapPin, Clock, DollarSign, HelpCircle, BookOpen, Phone, Wifi, Smartphone, Store, Train, Bus, Coffee, ShoppingBag, ChevronRight, ExternalLink, Download, QrCode } from 'lucide-react'

// 八達通類型
const OCTOPUS_TYPES = [
  {
    id: 'adult',
    name: '成人八達通',
    icon: '👤',
    price: '$150',
    deposit: '$50',
    description: '適合12歲或以上人士使用',
    features: ['地鐵巴士優惠', '便利店購物', '餐廳付款']
  },
  {
    id: 'student',
    name: '學生八達通',
    icon: '🎓',
    price: '$100',
    deposit: '$50',
    description: '適合全日制學生使用',
    features: ['學生車費優惠', '校園設施', '圖書館借書']
  },
  {
    id: 'elder',
    name: '長者八達通',
    icon: '👴',
    price: '$70',
    deposit: '$50',
    description: '適合65歲或以上長者',
    features: ['$2乘車優惠', '長者優惠', '社區設施']
  },
  {
    id: 'child',
    name: '小童八達通',
    icon: '👶',
    price: '$70',
    deposit: '$50',
    description: '適合3-11歲小童',
    features: ['小童車費', '遊樂場設施', '學校活動']
  },
  {
    id: 'on-loan',
    name: '租用版八達通',
    icon: '🔄',
    price: '$0',
    deposit: '$50',
    description: '可退還按金',
    features: ['按金可退', '臨時使用', '遊客適用']
  },
  {
    id: 'sold',
    name: '銷售版八達通',
    icon: '🛒',
    price: '$39-$168',
    deposit: '$0',
    description: '限量版設計',
    features: ['收藏價值', '無需按金', '特別設計']
  }
]

// 充值地點
const TOPUP_LOCATIONS = [
  {
    id: 'mtr',
    name: '港鐵客務中心',
    icon: '🚇',
    count: '90+',
    description: '全線港鐵站',
    hours: '06:00-00:00',
    features: ['現金充值', '信用卡', '八達通App']
  },
  {
    id: '7eleven',
    name: '7-Eleven',
    icon: '🏪',
    count: '1000+',
    description: '全港便利店',
    hours: '24小時',
    features: ['現金充值', '最少$50', '即時生效']
  },
  {
    id: 'circle_k',
    name: 'Circle K',
    icon: '🛒',
    count: '300+',
    description: 'OK便利店',
    hours: '24小時',
    features: ['現金充值', '最少$50', '方便快捷']
  },
  {
    id: 'parknshop',
    name: '百佳超市',
    icon: '🏬',
    count: '200+',
    description: '百佳分店',
    hours: '08:00-22:00',
    features: ['現金充值', '購物時順便充值']
  },
  {
    id: 'wellcome',
    name: '惠康超市',
    icon: '🛍️',
    count: '200+',
    description: '惠康分店',
    hours: '08:00-22:00',
    features: ['現金充值', '一站式購物']
  },
  {
    id: 'octopus_app',
    name: '八達通App',
    icon: '📱',
    count: '隨時',
    description: '手機應用程式',
    hours: '24小時',
    features: ['NFC充值', '自動充值', '查詢餘額']
  }
]

// 常見問題
const FAQS = [
  {
    id: 'faq_1',
    question: '八達通點樣充值？',
    answer: '可以喺港鐵客務中心、7-Eleven、Circle K、百佳、惠康等地方用現金充值，或者用八達通App透過NFC功能充值。'
  },
  {
    id: 'faq_2',
    question: '八達通有冇有效期？',
    answer: '八達通卡本身冇有效期，但如果超過3年冇用，會被徵收$15行政費。建議至少每3年使用一次。'
  },
  {
    id: 'faq_3',
    question: '遺失八達通點算？',
    answer: '立即透過八達通App或致電八達通熱線2266 2266報失。如果已登記，可以申請補發，餘額會轉到新卡（需繳付手續費）。'
  },
  {
    id: 'faq_4',
    question: '八達通最低餘額係幾多？',
    answer: '八達通冇最低餘額要求，但乘搭交通工具時需要足夠車費。建議保持至少$20餘額以備不時之需。'
  },
  {
    id: 'faq_5',
    question: '可以退還八達通按金嗎？',
    answer: '可以！帶同八達通卡同身份證明文件去港鐵客務中心，可以退還按金同餘額（需扣除$11手續費）。'
  },
  {
    id: 'faq_6',
    question: '八達通有冇消費上限？',
    answer: '單次交易上限為$1,000，每日累積消費上限為$3,000。'
  }
]

// 使用貼士
const TIPS = [
  {
    id: 'tip_1',
    title: '善用自動充值',
    description: '設定自動充值功能，當餘額低於設定值時自動從信用卡充值，唔使擔心冇錢搭車。',
    icon: '💳'
  },
  {
    id: 'tip_2',
    title: '每月8號八達通日',
    description: '好多商戶會喺每月8號提供特別優惠，記得留意八達通App嘅推廣資訊。',
    icon: '🎉'
  },
  {
    id: 'tip_3',
    title: '學生優惠要登記',
    description: '學生八達通需要每年重新登記先可以繼續享用學生車費優惠，記得準時辦理。',
    icon: '🎓'
  },
  {
    id: 'tip_4',
    title: '長者$2乘車優惠',
    description: '65歲或以上長者使用長者八達通可以$2乘搭大部分公共交通工具。',
    icon: '👴'
  },
  {
    id: 'tip_5',
    title: '八達通App好幫手',
    description: '下載八達通App可以查詢交易記錄、設定自動充值、報失卡片等功能。',
    icon: '📱'
  },
  {
    id: 'tip_6',
    title: '遊客八達通',
    description: '遊客可以購買租用版八達通，離開香港時可以退還按金同餘額。',
    icon: '🧳'
  }
]

export default function OctopusInfoView({ darkMode }) {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const openMTRMap = () => {
    window.open('https://www.mtr.com.hk/ch/customer/services/octopus_topup.html', '_blank')
  }

  const openOctopusApp = () => {
    window.open('https://www.octopus.com.hk/tc/consumer/octopus-app/index.html', '_blank')
  }

  const openTopupMap = () => {
    window.open('https://www.google.com/maps/search/八達通+充值+香港/', '_blank')
  }

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-5 pt-5 pb-4`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-yellow-100'} flex items-center justify-center`}>
            <BookOpen className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>八達通指南</h1>
            <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>使用指南、充值點、常見問題</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`px-5 py-3 ${darkMode ? 'bg-gray-800' : 'bg-yellow-50'} border-b ${darkMode ? 'border-gray-700' : 'border-yellow-100'}`}>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openTopupMap}
            className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-yellow-100'} transition-colors active:scale-95`}
          >
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-yellow-100'} flex items-center justify-center`}>
              <MapPin className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div className="text-left">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>搵充值點</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>最近嘅充值地點</div>
            </div>
          </button>
          
          <button
            onClick={openOctopusApp}
            className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-yellow-100'} transition-colors active:scale-95`}
          >
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-yellow-100'} flex items-center justify-center`}>
              <Download className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div className="text-left">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>八達通App</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>下載官方應用程式</div>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Octopus Types */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>八達通類型</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {OCTOPUS_TYPES.map(type => (
              <div
                key={type.id}
                className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-yellow-100'}`}
              >
                <div className="flex items-start gap-2">
                  <div className="text-2xl">{type.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {type.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>
                      {type.price}（按金{type.deposit}）
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                      {type.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topup Locations */}
        <div className={`p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>充值地點</h2>
            </div>
            <button
              onClick={openMTRMap}
              className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium flex items-center gap-1`}
            >
              查看地圖 <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {TOPUP_LOCATIONS.map(location => (
              <div
                key={location.id}
                className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} border ${darkMode ? 'border-gray-600' : 'border-yellow-100'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{location.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {location.name}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                        {location.count}個點
                      </div>
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                      {location.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                        <Clock className="w-3 h-3" />
                        {location.hours}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {location.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-lg text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>常見問題</h2>
          </div>

          <div className="space-y-2">
            {FAQS.map(faq => (
              <div
                key={faq.id}
                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                >
                  <div className={`font-medium text-left ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {faq.question}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedFaq === faq.id ? 'rotate-90' : ''} ${darkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
                </button>
                
                {expandedFaq === faq.id && (
                  <div className={`px-3 pb-3 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className={`p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Info className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>使用貼士</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TIPS.map(tip => (
              <div
                key={tip.id}
                className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} border ${darkMode ? 'border-gray-600' : 'border-yellow-100'}`}
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">{tip.icon}</div>
                  <div>
                    <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {tip.title}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                      {tip.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-5">
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-yellow-100'} border ${darkMode ? 'border-gray-700' : 'border-yellow-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <Phone className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>八達通客服</div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-600'}`}>有問題？搵我哋幫手</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>
                📞 熱線電話：<span className="font-medium">2266 2266</span>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>
                🕒 服務時間：每日 09:00 - 18:00
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>
                🌐 官方網站：<a href="https://www.octopus.com.hk" className="text-blue-500 underline">octopus.com.hk</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-5 ${darkMode ? 'text-gray-500' : 'text-zinc-400'} text-xs text-center`}>
          <p>資料更新至 2026年3月</p>
          <p className="mt-1">八達通卡有限公司擁有最終決定權</p>
        </div>
      </div>
    </div>
  )
}