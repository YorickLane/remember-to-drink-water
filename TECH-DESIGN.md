# TECH-DESIGN.md — 技术方案 / 架构

## 1. 技术栈

- Expo + React Native + TypeScript
- expo-router（或 react-navigation）
- 状态：Zustand
- 本地存储：expo-sqlite
- 通知：expo-notifications
- 图表：react-native-gifted-charts（或 victory-native）
- 构建上架：EAS Build + Submit

## 2. 目录结构建议

```
/app
  /(tabs)
    index.tsx            # 今日Home
    stats.tsx            # 统计
    history.tsx          # 历史
    settings.tsx         # 设置
  /add.tsx               # 快速记录
/components
  ProgressRing.tsx
  QuickAddButtons.tsx
  WaterLogList.tsx
  Charts.tsx
/lib
  db.ts                  # sqlite封装
  notifications.ts       # 通知调度
/store
  useWaterStore.ts
/types
  models.ts
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

## 4. 通知调度策略

- 每次设置变更 -> 取消旧通知 -> 重建新日程
- 避免默认过频（<30min）
- iOS/Android 权限都要显式请求

[Expo 通知能力](https://docs.expo.dev/versions/latest/sdk/notifications/)走官方库即可。

## 5. 统计计算

- 今日总量：sum(amount_ml where date_key=today)
- 7天趋势：group by date_key
- 完成率：daily_sum / daily_goal_ml
