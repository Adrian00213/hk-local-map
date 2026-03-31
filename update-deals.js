// 更新NewsService.js中嘅優惠倒數時間
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'src/services/NewsService.js')
let content = fs.readFileSync(filePath, 'utf8')

// 計算倒數時間函數
const calculateTimeLeft = (expiryDate) => {
  const now = new Date()
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

// 更新香港優惠
content = content.replace(
  /expiry: '2026-04-15',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-15',
            timeLeft: calculateTimeLeft('2026-04-15'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-04-30',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-30',
            timeLeft: calculateTimeLeft('2026-04-30'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-04-20',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-20',
            timeLeft: calculateTimeLeft('2026-04-20'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-04-10',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-10',
            timeLeft: calculateTimeLeft('2026-04-10'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-12-31',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-12-31',
            timeLeft: calculateTimeLeft('2026-12-31'),
            timestamp: now.toISOString()`
)

// 更新日本優惠
content = content.replace(
  /expiry: '2026-05-10',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-05-10',
            timeLeft: calculateTimeLeft('2026-05-10'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-04-25',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-25',
            timeLeft: calculateTimeLeft('2026-04-25'),
            timestamp: now.toISOString()`
)

// 更新台灣優惠
content = content.replace(
  /expiry: '2026-04-18',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-18',
            timeLeft: calculateTimeLeft('2026-04-18'),
            timestamp: now.toISOString()`
)

content = content.replace(
  /expiry: '2026-05-05',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-05-05',
            timeLeft: calculateTimeLeft('2026-05-05'),
            timestamp: now.toISOString()`
)

// 更新中國優惠
content = content.replace(
  /expiry: '2026-04-28',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-04-28',
            timeLeft: calculateTimeLeft('2026-04-28'),
            timestamp: now.toISOString()`
)

// 更新韓國優惠
content = content.replace(
  /expiry: '2026-05-15',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-05-15',
            timeLeft: calculateTimeLeft('2026-05-15'),
            timestamp: now.toISOString()`
)

// 更新國際優惠
content = content.replace(
  /expiry: '2026-06-30',\s+timestamp: now\.toISOString\(\)/g,
  `expiry: '2026-06-30',
            timeLeft: calculateTimeLeft('2026-06-30'),
            timestamp: now.toISOString()`
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ 優惠倒數時間已更新')