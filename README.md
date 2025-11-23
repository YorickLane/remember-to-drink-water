# 💧 喝水提醒 - Water Reminder

健康饮水，轻松记录。一款简洁实用的饮水提醒应用，支持 iOS、Android 和 Web 三端。

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## ✨ 功能特性

### 核心功能
- 📊 **智能进度追踪** - 直观的环形进度图，实时显示饮水进度
- ⚡ **快捷记录** - 一键添加 200/300/500ml，支持自定义
- 📝 **历史记录** - 查看和管理今日所有饮水记录
- ⏰ **智能提醒** - 自定义时间段和间隔，定时提醒补水

### 高级功能
- 🌙 **深色模式** - 完整支持，自动跟随系统
- ✨ **流畅动画** - React Native Reanimated 驱动的60fps动画
- 📱 **触觉反馈** - 增强的交互体验
- 🔒 **隐私安全** - 数据仅本地存储，不上传任何信息

### 跨平台支持
- 📱 **iOS** - SQLite 存储 + 本地通知
- 🤖 **Android** - SQLite 存储 + 本地通知
- 🌐 **Web** - IndexedDB 存储 + 浏览器通知

---

## 📚 文档索引

### 项目规划文档
- [PRD.md](./PRD.md) - 产品需求文档（背景、目标、功能范围）
- [TECH-DESIGN.md](./TECH-DESIGN.md) - 技术方案和架构设计
- [DEV-CHECKLIST.md](./DEV-CHECKLIST.md) - 开发执行清单

### 开发指南
- [README-START.md](./README-START.md) - 环境搭建和项目初始化
- [SUGGESTIONS.md](./SUGGESTIONS.md) - 开发建议和最佳实践
- [MCP-SETUP.md](./.claude/MCP-SETUP.md) - MCP 服务器配置说明

### 发布相关
- [RELEASE-GUIDE.md](./RELEASE-GUIDE.md) - 应用发布完整指南（EAS Build 说明）
- [STORE-RELEASE.md](./STORE-RELEASE.md) - 应用商店上架材料和合规清单
- [STORE-DESCRIPTION.md](./STORE-DESCRIPTION.md) - 商店描述、关键词、截图要求
- [WEB-DEPLOYMENT.md](./WEB-DEPLOYMENT.md) - Web 版本部署指南

### 下一步行动
- [NEXT-STEPS.md](./NEXT-STEPS.md) - 当前进度和下一步计划 📍

---

## 🚀 快速开始

### 前置要求
- Node.js 20+ (LTS)
- npm 或 yarn
- iOS: Xcode（macOS）
- Android: Android Studio

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npx expo start
```

### 在模拟器中运行
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

---

## 🏗️ 项目结构

```
├── app/                    # Expo Router 页面
│   ├── (tabs)/            # Tab 导航页面
│   │   ├── index.tsx     # 今日页面（主页）
│   │   └── explore.tsx   # 设置页面
│   ├── privacy.tsx        # 隐私政策页面
│   └── _layout.tsx        # 根布局
├── components/            # 可复用组件
│   ├── ProgressRing.tsx   # 进度环形图
│   ├── QuickAddButtons.tsx # 快捷记录按钮
│   ├── WaterLogList.tsx   # 记录列表
│   └── TimePicker.tsx     # 时间选择器
├── lib/                   # 核心逻辑
│   ├── storage/          # 存储层（支持多平台）
│   │   ├── mobile.ts     # SQLite 适配器
│   │   ├── web.ts        # IndexedDB 适配器
│   │   └── index.ts      # 平台自动选择
│   ├── db.ts             # 数据库接口
│   └── notifications.ts   # 通知管理
├── store/                 # 状态管理
│   └── useWaterStore.ts   # Zustand store
├── types/                 # TypeScript 类型
│   └── models.ts          # 数据模型
├── constants/             # 常量配置
│   └── Colors.ts          # 主题颜色
└── hooks/                 # 自定义 Hooks
    └── useThemeColors.ts  # 主题颜色 Hook
```

---

## 🛠️ 技术栈

### 核心框架
- **Expo SDK 54** - React Native 开发框架
- **React Native 0.81** - 跨平台移动开发
- **TypeScript** - 类型安全（100% 覆盖，0 个 any）
- **Expo Router** - 文件系统路由

### 状态和数据
- **Zustand** - 轻量级状态管理
- **SQLite** - 移动端本地数据库
- **IndexedDB** - Web 端本地存储

### UI 和动画
- **React Native Reanimated** - 高性能动画
- **React Native SVG** - 矢量图形
- **Expo Haptics** - 触觉反馈

### 开发工具
- **EAS Build** - 云端构建服务
- **Context7 MCP** - 最新文档查询
- **ESLint + TypeScript** - 代码质量保证

---

## 📱 构建和发布

### 开发构建
```bash
# 内部测试版（可直接安装）
eas build --profile preview --platform all
```

### 生产构建
```bash
# 商店提交版
eas build --profile production --platform all
```

### 提交商店
```bash
# iOS App Store
eas submit --platform ios

# Google Play
eas submit --platform android
```

### Web 部署
```bash
# 导出静态文件
npx expo export --platform web

# 部署到 Vercel/Netlify 或你的服务器
```

---

## 🧪 开发脚本

```bash
# 启动开发服务器
npm start

# 代码检查
npm run lint

# 类型检查
npx tsc --noEmit

# 上架前检查
npm run pre-release-check

# 生成图标
npm run generate-icons
```

---

## 📊 项目状态

### 功能完成度
- ✅ 核心功能（记录、提醒、设置）100%
- ✅ 深色模式 100%
- ✅ UI 动画 100%
- ✅ 跨平台支持（iOS/Android/Web）100%
- ✅ 上架准备（图标、文档、配置）100%

### 代码质量
- ✅ TypeScript 严格模式
- ✅ 0 个 any 类型
- ✅ 0 个安全漏洞
- ✅ ESLint 通过
- ✅ 上架前检查 100分

### 构建状态
- ✅ Android APK 已构建（preview）
- ⏳ iOS 构建等待 Apple 账号
- ✅ Web 版本已导出

---

## 🔧 故障排查

### 常见问题

**Q: 通知不工作？**
- iOS 模拟器不支持通知，请使用真机测试
- 确保已允许通知权限

**Q: 数据丢失？**
- 检查是否卸载了应用
- 数据仅本地存储，不会云端同步

**Q: Web 版本通知不工作？**
- Web 版本默认禁用通知
- 可以使用浏览器通知 API（需额外实现）

---

## 📄 License

MIT License - 详见 LICENSE 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📮 联系方式

- GitHub Issues: [提交问题](https://github.com/fengxiu/remember-to-drink-water/issues)
- 隐私政策: [查看](https://fengxiu.github.io/remember-to-drink-water/privacy.html)

---

**💧 保持水分，保持健康！**
