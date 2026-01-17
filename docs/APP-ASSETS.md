# 应用图标与启动页图片规范

本文档记录了「喝水提醒」应用的图标和启动页图片规范要求。

## 当前 assets/images 目录分析

| 文件名 | 用途 | 配置位置 |
|--------|------|----------|
| `icon.png` | iOS 应用图标 | `app.json > expo.icon` |
| `android-icon-foreground.png` | Android 自适应图标前景层 | `app.json > expo.android.adaptiveIcon.foregroundImage` |
| `android-icon-background.png` | Android 自适应图标背景层 | `app.json > expo.android.adaptiveIcon.backgroundImage` |
| `android-icon-monochrome.png` | Android 单色图标（Material You） | `app.json > expo.android.adaptiveIcon.monochromeImage` |
| `favicon.png` | Web 网站图标 | `app.json > expo.web.favicon` |
| `splash-icon.png` | 启动页中央图标 | `expo-splash-screen 插件配置` |
| `react-logo*.png` | Expo 默认模板残留 | **未使用，可删除** |
| `partial-react-logo.png` | Expo 默认模板残留 | **未使用，可删除** |

---

## 需要准备的图片清单

### 1. iOS 应用图标 (`icon.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 1024 × 1024 像素 |
| **格式** | PNG（无透明度） |
| **形状** | 正方形，iOS 会自动裁剪圆角 |
| **说明** | Expo 会自动生成所有需要的尺寸 |

**可选：iOS 18+ 深色/浅色图标**
- `ios-light.png` - 浅色模式图标
- `ios-dark.png` - 深色模式图标
- `ios-tinted.png` - 着色模式图标

---

### 2. Android 自适应图标

Android 8.0+ 使用自适应图标，由前景层和背景层组合而成。

#### 前景层 (`android-icon-foreground.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 1024 × 1024 像素 |
| **格式** | PNG（支持透明） |
| **安全区域** | 图标内容应在中心 66% 区域内（约 676×676），边缘会被裁剪 |

#### 背景层 (`android-icon-background.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 1024 × 1024 像素 |
| **格式** | PNG |
| **说明** | 可用纯色替代（配置 `backgroundColor`） |

#### 单色图标 (`android-icon-monochrome.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 1024 × 1024 像素 |
| **格式** | PNG（黑白/灰度） |
| **用途** | Material You 主题化图标 |

---

### 3. 启动页图标 (`splash-icon.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 建议 200-300 像素宽（当前配置 `imageWidth: 200`） |
| **格式** | PNG（支持透明） |
| **说明** | 居中显示在启动页背景上 |

**当前配置：**
- 浅色模式背景：`#ffffff`
- 深色模式背景：`#000000`

---

### 4. Web Favicon (`favicon.png`)

| 属性 | 要求 |
|------|------|
| **尺寸** | 48 × 48 像素（或更大） |
| **格式** | PNG |

---

## 设计建议

### 图标设计要点

1. **简洁明了** - 图标在小尺寸下仍需清晰可辨
2. **避免文字** - 小尺寸下文字难以阅读
3. **统一风格** - iOS 和 Android 图标保持视觉一致性
4. **安全边距** - Android 自适应图标需预留裁剪空间

### 推荐工作流

1. 在 Figma/Sketch 中设计 1024×1024 的主图标
2. 导出 iOS 图标（无透明背景）
3. 导出 Android 前景层（透明背景，内容在中心 66%）
4. 创建 Android 背景层或使用纯色
5. 创建单色版本用于 Material You
6. 缩小创建启动页图标和 favicon

---

## 可清理的文件

以下是 Expo 默认模板生成的文件，项目未使用，可安全删除：

- `react-logo.png`
- `react-logo@2x.png`
- `react-logo@3x.png`
- `partial-react-logo.png`

---

## 参考资源

- [Expo 官方文档 - Splash screen and app icon](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon)
- [Android 自适应图标设计指南](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Apple Human Interface Guidelines - App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
