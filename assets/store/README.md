# Store Assets / 商店资源

Google Play 和 App Store 上架所需的图形资源。

## 文件说明

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `icon-512.png` | 512x512 | Google Play 应用图标 |
| `feature-graphic.png` | 1024x500 | Google Play 特色图片 |
| `generate-assets.sh` | - | 资源生成脚本 |

---

## 图标规范

### iOS App Store

| 资源 | 尺寸 | 大小限制 | 说明 |
|------|------|----------|------|
| **App Icon** | 1024 × 1024 px | - | 应用图标，不含透明度 |

### Google Play

| 资源 | 尺寸 | 大小限制 | 说明 |
|------|------|----------|------|
| **App Icon** | 512 × 512 px | 最大 1 MB | 应用图标 |
| **Feature Graphic** | 1024 × 500 px | 最大 15 MB | 特色图片，商店顶部展示 |

---

## 截图规范

### iOS App Store

| 设备 | 尺寸 (px) | 说明 |
|------|-----------|------|
| **iPhone 6.5"** | 1284 × 2778 | iPhone 14 Plus, iPhone 13 Pro Max |
| **iPad 13"** | 2064 × 2752 | iPad Pro 13-inch (M4) |

### Google Play

| 类型 | 尺寸 | 比例 | 说明 |
|------|------|------|------|
| **手机截图** | 1284 × 2778 | 9:16 | 可直接复用 iOS 截图 |
| **7 英寸平板** | 1080 × 1920 | 可选 | |
| **10 英寸平板** | 1920 × 1200 | 可选 | |

> 💡 **提示**: Google Play 手机截图可直接复用 iOS 的 1284 × 2778 截图，满足 9:16 比例要求。

---

## 截图设计工具推荐

以下工具可帮助生成带设备框架、背景和文案的商店截图：

| 工具 | 特点 | 费用 | 链接 |
|------|------|------|------|
| **AppMockUp Studio** | 支持背景渐变、设备框架、批量导出 | 免费 | [app-mockup.com](https://app-mockup.com/) |
| **Screenshots Pro** | 支持自动本地化翻译、模板丰富 | 付费 | [screenshots.pro](https://screenshots.pro/) |
| **Previewed.app** | 100+ 模板，拖拽编辑 | 免费 | [previewed.app](https://previewed.app/) |
| **AppScreens** | 响应式设计，一次导出多尺寸 | 付费 | [appscreens.com](https://appscreens.com/) |
| **AppLaunchpad** | 快速生成多分辨率 | 免费 | [theapplaunchpad.com](https://theapplaunchpad.com/) |
| **Placeit** | 大量 Mockup 模板 | 付费 | [placeit.net](https://placeit.net/) |
| **MockUPhone** | 纯设备框架包装，简单快速 | 免费 | [mockuphone.com](https://mockuphone.com/) |

---

## 截图设计建议

### 推荐截图内容 (按顺序)

| 顺序 | 页面 | 英文标题 | 中文标题 |
|------|------|----------|----------|
| 1 | 主界面 - 今日饮水进度 | Track Your Daily Hydration | 追踪每日饮水量 |
| 2 | 记录功能 - 一键记录 | One Tap to Log | 一键记录饮水 |
| 3 | 提醒功能 - 通知设置 | Smart Reminders | 智能提醒 |
| 4 | 统计图表 - 历史数据 | View Your Progress | 查看饮水进度 |
| 5 | 设置页面 - 个性化选项 | Personalize Your Goals | 个性化目标 |

### 设计要素

- **标题文字**: 每张截图顶部添加功能标题，简洁有力
- **背景**: 使用品牌色渐变背景（推荐 `#0EA5E9` → `#06B6D4`）
- **设备框架**: 使用真实设备框架增加专业感
- **UI 截图**: 展示真实的应用界面，避免空白或占位内容
- **字体**: 使用清晰易读的无衬线字体，确保在小尺寸下仍可辨认

---

## 应用描述规范

### iOS App Store

| 字段 | 字符限制 | 说明 |
|------|----------|------|
| **应用名称** | 30 字符 | 商店中显示的名称 |
| **副标题** | 30 字符 | 名称下方的简短描述 |
| **宣传文字** | 170 字符 | 可随时更新，无需提交审核 |
| **描述** | 4000 字符 | 完整的应用描述 |
| **关键词** | 100 字符 | 逗号分隔，用于搜索优化 |
| **隐私政策 URL** | 必填 | App Store 要求 |

### Google Play

| 字段 | 字符限制 | 说明 |
|------|----------|------|
| **应用名称** | 30 字符 | 商店中显示的名称 |
| **简短描述** | 80 字符 | 应用列表中显示的简介 |
| **完整描述** | 4000 字符 | 完整的应用描述 |

### 应用描述模板

<details>
<summary>📱 iOS App Store 描述</summary>

**应用名称**: SipRemind

**副标题**: Water Tracker & Reminder

**宣传文字**:
```
Stay hydrated with smart reminders! Track your daily water intake, set personalized goals, and build healthy habits. All data stored locally - complete privacy.
```

**关键词**:
```
water,hydration,reminder,drink,tracker,health,fitness,wellness,goal,daily
```

</details>

<details>
<summary>🤖 Google Play 描述</summary>

**应用名称**: SipRemind

**简短描述**:
```
Track your daily water intake and stay hydrated with smart reminders.
```

</details>

<details>
<summary>📝 完整描述 (iOS/Android 通用)</summary>

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

<details>
<summary>📝 完整描述 (中文版)</summary>

```
使用 SipRemind 保持健康和充足的水分 - 您的个人饮水追踪和提醒应用。

主要功能

• 饮水追踪
一键记录您的饮水量。追踪杯数、瓶数或全天的自定义量。

• 智能提醒
设置个性化的提醒时间表，帮助您定时喝水。再也不会忘记补充水分。

• 每日目标
根据您的需求设定每日饮水目标。通过精美的可视化进度条查看完成情况。

• 统计与历史
通过直观的图表查看您的饮水历史记录，追踪您的饮水习惯。

• 多种单位
支持公制（毫升）和英制（盎司）计量单位。

• 离线优先
所有数据都存储在您的设备本地。无需账户，无需云同步，完全隐私。

• 简洁设计
简单直观的界面，让记录变得轻松。

立即使用 SipRemind 开始养成更健康的饮水习惯！
```

</details>

---

## Release Notes 规范

### 字符限制

| 平台 | 字符限制 | 说明 |
|------|----------|------|
| **iOS App Store** | 4000 字符 | "What's New" 字段 |
| **Google Play** | 500 字符 | 每种语言的 Release Notes |

### 写作原则

- **用户视角**: 描述用户能感知到的变化，而非技术实现细节
- **简洁明了**: 使用简短的要点列表，避免长段落
- **动词开头**: 每条更新以动词开头（Added, Fixed, Improved, Updated）
- **突出亮点**: 新功能放在最前面，Bug 修复放在后面
- **避免技术术语**: 用户不需要知道 "修复了 null pointer exception"

### Release Notes 模板

<details>
<summary>📱 iOS App Store - What's New</summary>

**首次发布:**
```
Welcome to SipRemind! Start your hydration journey today.

• Track your daily water intake with one tap
• Set personalized hydration goals
• Receive smart reminders throughout the day
• View your progress with beautiful charts
• All data stored locally for complete privacy
```

**功能更新:**
```
What's New in Version X.X:

NEW
• [New feature description]
• [Another new feature]

IMPROVED
• [Enhancement description]
• [Performance improvement]

FIXED
• [Bug fix description]
```

**小版本更新:**
```
Bug fixes and performance improvements.

• Fixed [specific issue]
• Improved [specific area]
```

</details>

<details>
<summary>🤖 Google Play - Release Notes</summary>

**首次发布:**
```xml
<en-US>
Welcome to SipRemind - your personal hydration companion!

• One-tap water logging
• Customizable daily goals
• Smart drinking reminders
• Progress tracking with charts
• 100% offline, private data storage
</en-US>

<zh-CN>
欢迎使用 SipRemind - 您的个人饮水助手！

• 一键记录饮水
• 自定义每日目标
• 智能饮水提醒
• 图表追踪进度
• 完全离线，数据私密
</zh-CN>
```

**功能更新:**
```xml
<en-US>
Version X.X brings exciting new features:

• [New feature 1]
• [New feature 2]
• Bug fixes and improvements
</en-US>

<zh-CN>
版本 X.X 带来全新功能：

• [新功能 1]
• [新功能 2]
• Bug 修复和改进
</zh-CN>
```

**小版本更新:**
```xml
<en-US>
• Fixed [issue description]
• Improved app stability
</en-US>

<zh-CN>
• 修复 [问题描述]
• 提升应用稳定性
</zh-CN>
```

</details>

### 常用更新词汇

| 英文 | 中文 | 使用场景 |
|------|------|----------|
| Added / New | 新增 | 新功能 |
| Improved / Enhanced | 优化 / 改进 | 现有功能增强 |
| Fixed | 修复 | Bug 修复 |
| Updated | 更新 | 依赖或内容更新 |
| Redesigned | 重新设计 | UI 改版 |
| Performance improvements | 性能优化 | 速度/内存优化 |
| Bug fixes | Bug 修复 | 通用修复说明 |
| Stability improvements | 稳定性提升 | 崩溃修复 |

---

## iOS App Store 发布流程

### 1. 构建 iOS 应用

```bash
# 构建 iOS 应用 (EAS 自动处理证书)
eas build --platform ios
```

构建完成后，EAS 会自动上传到 App Store Connect。

### 2. App Store Connect 设置

访问 [App Store Connect](https://appstoreconnect.apple.com/)

#### 基本信息

| 字段 | 内容 |
|------|------|
| **Bundle ID** | `com.example.sipremind` |
| **SKU** | `sipremind-001` |
| **Primary Language** | English (U.S.) |
| **Category** | Health & Fitness |
| **Secondary Category** | Lifestyle (可选) |

#### App Information (应用信息)

- **Name**: SipRemind
- **Subtitle**: Water Tracker & Reminder
- **Privacy Policy URL**: `https://your-domain.com/privacy`
- **Age Rating**: 4+ (无限制内容)

#### Pricing and Availability

- **Price**: Free
- **Availability**: 选择要发布的国家/地区

### 3. 版本信息

#### Screenshots (截图)

上传以下尺寸的截图：

| 设备 | 尺寸 | 数量 |
|------|------|------|
| iPhone 6.5" | 1284 × 2778 | 3-10 张 |
| iPad 13" | 2064 × 2752 | 3-10 张 (如支持 iPad) |

#### Promotional Text (宣传文字)

```
Stay hydrated with smart reminders! Track your daily water intake, set personalized goals, and build healthy habits. All data stored locally - complete privacy.
```

#### Description (描述)

使用上方「完整描述」模板中的内容。

#### Keywords (关键词)

```
water,hydration,reminder,drink,tracker,health,fitness,wellness,goal,daily
```

#### What's New (更新说明)

```
Initial release of SipRemind - Water Reminder App

Features:
• Track your daily water intake
• Set personalized hydration goals
• Receive smart drinking reminders
• View your hydration history and statistics
```

### 4. 提交审核

```bash
# 使用 EAS 提交到 App Store
eas submit --platform ios --latest
```

或在 App Store Connect 中：
1. 选择 Build（构建版本）
2. 填写 Export Compliance（出口合规）
3. 点击 **Submit for Review**

### 5. 审核注意事项

- **审核时间**: 通常 24-48 小时
- **常见拒审原因**:
  - 截图与实际应用不符
  - 隐私政策缺失或无法访问
  - 应用崩溃或严重 Bug
  - 描述中包含其他平台名称（如 "Android"）

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
| **Full description** | 见上方「完整描述」模板 |

#### Graphics (图形资源)

上传 `assets/store/` 目录下的文件：
- **App icon**: `icon-512.png`
- **Feature graphic**: `feature-graphic.png`
- **Screenshots**: 上传 1284 × 2778 的截图

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

```bash
# 使用 EAS 提交到 Google Play
eas submit --platform android --latest
```

或在 Google Play Console 中：

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
