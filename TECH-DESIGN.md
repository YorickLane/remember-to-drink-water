# TECH-DESIGN.md — 技术方案 / 架构

## 1. 技术栈

- **框架**: Expo SDK 54 + React Native 0.81 + TypeScript
- **路由**: expo-router（文件系统路由）
- **状态管理**: Zustand
- **本地存储**: expo-sqlite (移动端) / AsyncStorage (Web)
- **通知**: expo-notifications
- **图表**: react-native-gifted-charts
- **国际化**: i18next + react-i18next + expo-localization
- **构建上架**: EAS Build + Submit

## 2. 目录结构

```
/app                     # expo-router 页面（文件系统路由）
  /(tabs)                # 底部 Tab 导航
    index.tsx            # 今日首页
    stats.tsx            # 统计图表
    history.tsx          # 历史日历
    explore.tsx          # 设置页
    _layout.tsx          # Tab 导航布局
  _layout.tsx            # 根布局
  privacy.tsx            # 隐私政策页
  modal.tsx              # 模态页
/components              # 可复用组件
  ProgressRing.tsx
  QuickAddButtons.tsx
  WaterLogList.tsx
  ErrorBoundary.tsx
/lib                     # 核心业务逻辑
  db.ts                  # 数据库访问层入口
  notifications.ts       # 通知调度
  /storage               # 平台适配存储层
    index.ts             # 统一入口
    mobile.ts            # SQLite 实现 (iOS/Android)
    web.ts               # AsyncStorage 实现 (Web)
    types.ts             # 存储接口定义
/store
  useWaterStore.ts       # Zustand 全局状态
/types
  models.ts              # 核心数据模型
/locales                 # i18n 翻译文件
  /en                    # 英文
  /zh                    # 中文
/constants               # 主题、颜色、布局常量
/hooks                   # 自定义 Hooks
/utils                   # 工具函数
```

## 3. 数据设计（SQLite）

### 3.1 water_logs

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | UUID |
| amount_ml | INTEGER | 喝水量 |
| timestamp | INTEGER | ms |
| date_key | TEXT | YYYY-MM-DD |

索引：date_key

### 3.2 settings

| key | value |
|-----|-------|
| daily_goal_ml | 2000 |
| reminder_enabled | true |
| reminder_start | "08:00" |
| reminder_end | "22:00" |
| reminder_interval_min | 120 |
| unit | "ml" |
| language | "system" / "en" / "zh" |

## 4. 通知调度策略

- 每次设置变更 -> 取消旧通知 -> 重建新日程
- 避免默认过频（<30min）
- iOS/Android 权限都要显式请求

[Expo 通知能力](https://docs.expo.dev/versions/latest/sdk/notifications/)走官方库即可。

## 5. 统计计算

- 今日总量：sum(amount_ml where date_key=today)
- 7天趋势：group by date_key
- 完成率：daily_sum / daily_goal_ml
