/**
 * 成就系统类型定义
 */

export type AchievementType = 'milestone' | 'streak' | 'daily';

export interface Achievement {
  id: string;
  type: AchievementType;
  icon: string;
  progress: number;
  target: number;
  unlockedAt: number | null;
}

export interface AchievementDefinition {
  id: string;
  type: AchievementType;
  icon: string;
  target: number;
  checkCondition: (context: AchievementContext) => number; // 返回当前进度
}

export interface AchievementContext {
  totalLogs: number;           // 总记录数
  totalMl: number;             // 总饮水量
  currentStreak: number;       // 当前连续达标天数
  longestStreak: number;       // 最长连续达标天数
  todayTotal: number;          // 今日饮水量
  todayGoal: number;           // 今日目标
  daysWithRecords: number;     // 有记录的天数
}

// 预定义成就列表
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // 里程碑成就
  {
    id: 'first_drop',
    type: 'milestone',
    icon: '💧',
    target: 1,
    checkCondition: (ctx) => ctx.totalLogs >= 1 ? 1 : 0,
  },
  {
    id: 'hydration_start',
    type: 'milestone',
    icon: '🚰',
    target: 1000,
    checkCondition: (ctx) => Math.min(ctx.totalMl, 1000),
  },
  {
    id: 'ten_liters',
    type: 'milestone',
    icon: '🏆',
    target: 10000,
    checkCondition: (ctx) => Math.min(ctx.totalMl, 10000),
  },
  {
    id: 'hundred_liters',
    type: 'milestone',
    icon: '🌊',
    target: 100000,
    checkCondition: (ctx) => Math.min(ctx.totalMl, 100000),
  },

  // 连续达标成就
  {
    id: 'streak_3',
    type: 'streak',
    icon: '🔥',
    target: 3,
    checkCondition: (ctx) => Math.min(ctx.longestStreak, 3),
  },
  {
    id: 'streak_7',
    type: 'streak',
    icon: '⭐',
    target: 7,
    checkCondition: (ctx) => Math.min(ctx.longestStreak, 7),
  },
  {
    id: 'streak_30',
    type: 'streak',
    icon: '👑',
    target: 30,
    checkCondition: (ctx) => Math.min(ctx.longestStreak, 30),
  },

  // 每日成就
  {
    id: 'daily_goal',
    type: 'daily',
    icon: '✅',
    target: 1,
    checkCondition: (ctx) => ctx.todayTotal >= ctx.todayGoal ? 1 : 0,
  },
  {
    id: 'overachiever',
    type: 'daily',
    icon: '🎯',
    target: 1,
    checkCondition: (ctx) => ctx.todayTotal >= ctx.todayGoal * 1.2 ? 1 : 0,
  },
];
