# Store Assets / 商店资源

Google Play 和 App Store 上架所需的图形资源。

## 文件说明

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `icon-512.png` | 512x512 | Google Play 应用图标 |
| `feature-graphic.png` | 1024x500 | Google Play 特色图片 |

## Google Play 图标规范

参考: [Icon Design Specifications](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)

- **尺寸**: 512 x 512 px
- **格式**: 32位 PNG (sRGB)
- **最大文件大小**: 1024 KB
- **形状**: 完整正方形（不要自己加圆角，Google Play 动态处理）
- **圆角**: Google Play 自动应用 20% 圆角半径（约 102px）
- **阴影**: 不要添加投影，Google Play 会动态添加

## 重新生成资源

如果更新了源图标 (`assets/images/icon.png`)，运行以下脚本重新生成：

```bash
cd assets/store
./generate-assets.sh
```

### 依赖

- ImageMagick: `brew install imagemagick`

### 自定义

编辑 `generate-assets.sh` 中的变量可自定义：

```bash
BACKGROUND_COLOR="#5BC4F1"    # 图标背景色
GRADIENT_START="#0EA5E9"      # Feature Graphic 渐变起始色
GRADIENT_END="#06B6D4"        # Feature Graphic 渐变结束色
```

## 手动生成命令

### App Icon (512x512)

```bash
magick assets/images/icon.png \
  -background '#5BC4F1' \
  -flatten \
  -resize 512x512 \
  assets/store/icon-512.png
```

### Feature Graphic (1024x500)

```bash
magick -size 1024x500 \
  gradient:'#0EA5E9'-'#06B6D4' \
  \( assets/images/icon.png -resize 200x200 \) \
  -gravity center -geometry +0-50 -composite \
  -gravity center -font Helvetica-Bold -pointsize 72 -fill white \
  -annotate +0+100 "Hydrate" \
  -gravity center -font Helvetica -pointsize 28 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+160 "Stay Hydrated, Stay Healthy" \
  assets/store/feature-graphic.png
```
