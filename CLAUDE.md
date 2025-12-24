# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

喝水提醒 App - 一个离线优先的 React Native 应用，帮助用户记录每日饮水量并通过本地通知提醒饮水。数据全部存储在本地，无后端服务。

## 常用命令

```bash
# 开发
npm start           # 启动 Expo 开发服务器
npm run ios         # 在 iOS 模拟器运行
npm run android     # 在 Android 模拟器运行
npm run web         # 在浏览器运行

# 代码质量
npm run lint        # 运行 ESLint
npx tsc --noEmit    # TypeScript 类型检查
npm run pre-release-check  # lint + tsc + audit

# 构建与发布 (EAS)
eas build --profile development --platform ios
eas build --profile development --platform android
eas build --profile production --platform ios
eas build --profile production --platform android
eas submit --platform ios
eas submit --platform android
```

## 技术架构

### 技术栈
- **框架**: Expo SDK 54 + React Native 0.81 + TypeScript
- **路由**: expo-router (文件系统路由)
- **状态管理**: Zustand
- **本地存储**: expo-sqlite (移动端) / AsyncStorage (Web)
- **通知**: expo-notifications
- **图表**: react-native-gifted-charts
- **国际化**: i18next + react-i18next + expo-localization

### 目录结构

```
/app                  # expo-router 页面（文件系统路由）
  /(tabs)             # 底部 Tab 导航
    index.tsx         # 今日首页
    explore.tsx       # 设置页
  _layout.tsx         # 根布局
  privacy.tsx         # 隐私政策页
  modal.tsx           # 模态页
/components           # 可复用组件
/lib                  # 核心业务逻辑
  db.ts               # 数据库访问层入口
  notifications.ts    # 通知调度
  /storage            # 平台适配存储层
    index.ts          # 统一入口，根据平台选择适配器
    mobile.ts         # SQLite 实现 (iOS/Android)
    web.ts            # AsyncStorage 实现 (Web)
    types.ts          # 存储接口定义
/store
  useWaterStore.ts    # Zustand 全局状态
/locales              # i18n 翻译文件
  /en                 # 英文
  /zh                 # 中文
/types
  models.ts           # 核心数据模型 (WaterLog, AppSettings, DayStats)
/constants            # 主题、颜色、布局常量
/hooks                # 自定义 Hooks
/utils                # 工具函数
```

### 核心数据流

1. **存储层抽象**: `lib/storage/index.ts` 根据 `Platform.OS` 自动选择 SQLite (移动端) 或 AsyncStorage (Web)
2. **数据访问**: `lib/db.ts` 对外暴露统一 API，内部委托给 `storageAdapter`
3. **状态管理**: `useWaterStore` 调用 db 层获取/更新数据，同时管理 UI 状态
4. **通知调度**: 设置变更时自动重新调度通知 (`scheduleReminders`)

### 数据模型 (types/models.ts)

- **WaterLog**: 单条饮水记录 (id, amount_ml, timestamp, date_key)
- **AppSettings**: 应用设置 (daily_goal_ml, reminder_*, unit, language)
- **DayStats**: 日统计数据

### 国际化

支持语言: 英文 (en)、简体中文 (zh)。翻译文件按命名空间组织在 `/locales` 目录下。

### 平台特性

- iOS: 使用 SF Symbols (`IconSymbol` 组件)
- Android: 使用 Ionicons
- Web: 通知功能受限，存储使用 AsyncStorage

## 开发注意事项

- 启用了 Hermes 引擎和 React Compiler 实验性特性
- 使用 `expo-router` 的 typed routes
- 添加新依赖请使用 `npx expo install <package>` 确保版本兼容
