# Store Assets / 商店资源

Google Play 和 App Store 上架所需的图形资源。

## 文件说明

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `icon-512.png` | 512x512 | Google Play 应用图标 |
| `feature-graphic.png` | 1024x500 | Google Play 特色图片 |
| `generate-assets.sh` | - | 资源生成脚本 |

---

## Google Play 发布流程

### 1. 构建 App Bundle

```bash
eas build --platform android
```

构建完成后下载 `.aab` 文件。

### 2. Google Play Console 操作

#### Store listings (商店列表)

| 字段 | 内容 |
|------|------|
| **App name** | SipRemind |
| **Short description** | Track your daily water intake and stay hydrated with smart reminders. |
| **Full description** | 见下方 |

<details>
<summary>Full description 完整描述</summary>

```
Stay healthy and hydrated with SipRemind - your personal water intake tracker and reminder app.

KEY FEATURES

• Water Tracking
Log your water intake with just one tap. Track glasses, bottles, or custom amounts throughout the day.

• Smart Reminders
Set personalized reminder schedules to help you drink water regularly. Never forget to hydrate again.

• Daily Goals
Set your daily hydration goal based on your needs. Watch your progress with a beautiful visual indicator.

• Statistics & History
View your drinking history and track your hydration habits over time with intuitive charts.

• Multiple Units
Support for both metric (ml) and imperial (oz) measurement units.

• Offline First
All your data is stored locally on your device. No account required, no cloud sync, complete privacy.

• Clean Design
Simple, intuitive interface that makes tracking effortless.

Start building healthier hydration habits today with SipRemind!
```

</details>

#### Graphics (图形资源)

上传 `assets/store/` 目录下的文件：
- **App icon**: `icon-512.png`
- **Feature graphic**: `feature-graphic.png`

#### App category (应用分类)

- **Category**: Health & Fitness
- **Tags**: Activity tracker, Nutrition and weight management

#### Health apps (健康应用声明)

选择 **Other**，填写：
```
Water intake tracking and hydration reminders. The app helps users log daily water consumption, set personalized hydration goals, and receive scheduled notifications to remind them to drink water throughout the day. All data is stored locally on the device.
```

### 3. 创建 Release

**Production** → **Create new release** → 上传 App Bundle

**Release notes**:
```xml
<en-US>
Initial release of SipRemind - Water Reminder App

Features:
• Track your daily water intake
• Set personalized hydration goals
• Receive smart drinking reminders
• View your hydration history and statistics
</en-US>
```

### 4. 提交审核

选择国家/地区 → Review release → Start rollout to Production

---

## Google Play 图标规范

参考: [Icon Design Specifications](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)

- **尺寸**: 512 x 512 px
- **格式**: 32位 PNG (sRGB)
- **最大文件大小**: 1024 KB
- **形状**: 完整正方形（不要自己加圆角，Google Play 动态处理）
- **圆角**: Google Play 自动应用 20% 圆角半径（约 102px）
- **阴影**: 不要添加投影，Google Play 会动态添加

---

## 重新生成资源

如果更新了源图标 (`assets/images/icon.png`) 或应用名称，运行：

```bash
cd assets/store
./generate-assets.sh
```

### 依赖

- ImageMagick: `brew install imagemagick`

### 自定义

编辑 `generate-assets.sh` 中的变量：

```bash
BACKGROUND_COLOR="#5BC4F1"    # 图标背景色
GRADIENT_START="#0EA5E9"      # Feature Graphic 渐变起始色
GRADIENT_END="#06B6D4"        # Feature Graphic 渐变结束色
```

修改应用名称：找到 `-annotate +0+100 "SipRemind"` 行。

---

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
  -annotate +0+100 "SipRemind" \
  -gravity center -font Helvetica -pointsize 28 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+160 "Stay Hydrated, Stay Healthy" \
  assets/store/feature-graphic.png
```

---

## 账号类型与测试要求

| 账号类型 | 封闭测试要求 |
|----------|--------------|
| 个人账号 (2023.11.13 后创建) | 需要 12 人测试 14 天 |
| 组织账号 (公司账号) | 不需要，可直接发布 |
| 个人账号 (2023.11.13 前创建) | 不需要 |

参考: [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
