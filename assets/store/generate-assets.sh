#!/bin/bash
# Google Play Store Assets Generator
# 生成符合 Google Play 规范的商店资源
#
# 依赖: ImageMagick (brew install imagemagick)
# 用法: ./generate-assets.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
SOURCE_ICON="$PROJECT_ROOT/assets/images/icon.png"
OUTPUT_DIR="$SCRIPT_DIR"

# 应用主题色
BACKGROUND_COLOR="#5BC4F1"
GRADIENT_START="#0EA5E9"
GRADIENT_END="#06B6D4"

echo "🎨 Google Play Store Assets Generator"
echo "======================================"

# 检查依赖
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ 错误: 需要安装 ImageMagick"
    echo "   运行: brew install imagemagick"
    exit 1
fi

# 使用 magick 或 convert
MAGICK_CMD="magick"
if ! command -v magick &> /dev/null; then
    MAGICK_CMD="convert"
fi

# 检查源图标
if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ 错误: 找不到源图标: $SOURCE_ICON"
    exit 1
fi

echo "📁 源图标: $SOURCE_ICON"
echo "📁 输出目录: $OUTPUT_DIR"
echo ""

# 1. 生成 App Icon (512x512)
# Google Play 规范: 完整正方形，不要自己加圆角，Google Play 会动态处理
echo "📱 生成 App Icon (512x512)..."
$MAGICK_CMD "$SOURCE_ICON" \
    -background "$BACKGROUND_COLOR" \
    -flatten \
    -resize 512x512 \
    "$OUTPUT_DIR/icon-512.png"
echo "   ✅ icon-512.png"

# 2. 生成 Feature Graphic (1024x500)
echo "🖼️  生成 Feature Graphic (1024x500)..."
$MAGICK_CMD -size 1024x500 \
    gradient:"$GRADIENT_START"-"$GRADIENT_END" \
    \( "$SOURCE_ICON" -resize 200x200 \) \
    -gravity center -geometry +0-50 -composite \
    -gravity center -font Helvetica-Bold -pointsize 72 -fill white \
    -annotate +0+100 "SipRemind" \
    -gravity center -font Helvetica -pointsize 28 -fill 'rgba(255,255,255,0.9)' \
    -annotate +0+160 "Stay Hydrated, Stay Healthy" \
    "$OUTPUT_DIR/feature-graphic.png"
echo "   ✅ feature-graphic.png"

echo ""
echo "======================================"
echo "✅ 完成! 生成的文件:"
ls -lh "$OUTPUT_DIR"/*.png
echo ""
echo "📋 Google Play 上传指南:"
echo "   - App icon: 512x512 PNG, 用于商店列表图标"
echo "   - Feature graphic: 1024x500 PNG, 用于商店特色图片"
