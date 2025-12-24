/**
 * 成就系统逻辑
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, subDays, differenceInDays } from 'date-fns';
import { Achievement, AchievementContext, ACHIEVEMENT_DEFINITIONS } from '@/types/achievements';
import { storageAdapter } from '@/lib/storage';

const ACHIEVEMENTS_KEY = 'achievements';

/**
 * 获取所有成就状态
 */
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to get achievements:', error);
  }

  // 初始化成就列表
  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    id: def.id,
    type: def.type,
    icon: def.icon,
    progress: 0,
    target: def.target,
    unlockedAt: null,
  }));
}

/**
 * 保存成就状态
 */
async function saveAchievements(achievements: Achievement[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
}

/**
 * 计算成就上下文
 */
export async function calculateAchievementContext(): Promise<AchievementContext> {
  const settings = await storageAdapter.getSettings();
  const todayGoal = settings.daily_goal_ml;
  const today = format(new Date(), 'yyyy-MM-dd');

  // 获取今日数据
  const todayLogs = await storageAdapter.getLogsByDate(today);
  const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount_ml, 0);

  // 计算总量和总记录数（过去90天）
  let totalMl = 0;
  let totalLogs = 0;
  const daysChecked = new Set<string>();

  for (let i = 0; i < 90; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const logs = await storageAdapter.getLogsByDate(date);
    if (logs.length > 0) {
      daysChecked.add(date);
      totalLogs += logs.length;
      totalMl += logs.reduce((sum, log) => sum + log.amount_ml, 0);
    }
  }

  // 计算连续达标天数
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < 90; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const logs = await storageAdapter.getLogsByDate(date);
    const dayTotal = logs.reduce((sum, log) => sum + log.amount_ml, 0);

    if (dayTotal >= todayGoal) {
      tempStreak++;
      if (i === 0 || currentStreak > 0) {
        currentStreak = tempStreak;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (i === 0) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  return {
    totalLogs,
    totalMl,
    currentStreak,
    longestStreak,
    todayTotal,
    todayGoal,
    daysWithRecords: daysChecked.size,
  };
}

/**
 * 检查并更新成就
 * 返回新解锁的成就列表
 */
export async function checkAchievements(): Promise<Achievement[]> {
  const achievements = await getAchievements();
  const context = await calculateAchievementContext();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of achievements) {
    const definition = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === achievement.id);
    if (!definition) continue;

    const progress = definition.checkCondition(context);
    achievement.progress = progress;

    // 检查是否新解锁
    if (progress >= achievement.target && !achievement.unlockedAt) {
      achievement.unlockedAt = Date.now();
      newlyUnlocked.push(achievement);
    }
  }

  await saveAchievements(achievements);
  return newlyUnlocked;
}

/**
 * 获取已解锁的成就
 */
export async function getUnlockedAchievements(): Promise<Achievement[]> {
  const achievements = await getAchievements();
  return achievements.filter((a) => a.unlockedAt !== null);
}

/**
 * 获取进行中的成就（未解锁且有进度）
 */
export async function getInProgressAchievements(): Promise<Achievement[]> {
  const achievements = await getAchievements();
  return achievements.filter((a) => a.unlockedAt === null && a.progress > 0);
}
