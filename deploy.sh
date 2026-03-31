#!/bin/bash
echo "🚀 開始部署香港生活地圖到GitHub Pages..."

# 確保構建成功
echo "📦 構建項目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 構建失敗，請檢查錯誤"
    exit 1
fi

echo "✅ 構建成功"

# 提交更改
echo "📝 提交更改..."
git add .
git commit -m "自動部署更新 $(date '+%Y-%m-%d %H:%M:%S')" || true

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main

echo ""
echo "📊 部署狀態："
echo "🌐 網站網址：https://adrian00213.github.io/hk-local-map/"
echo "⏰ 部署需要2-5分鐘完成"
echo "🔄 請稍後訪問網站查看更新"
echo ""
echo "🔍 檢查部署："
echo "1. 訪問 https://github.com/adrian00213/hk-local-map/actions"
echo "2. 查看最新工作流狀態"
echo "3. 等待綠色勾號（成功）"
echo ""
echo "🧪 測試建議："
echo "1. 使用無痕模式訪問"
echo "2. 按 Ctrl+F5 強制刷新"
echo "3. 等待幾分鐘後再試"