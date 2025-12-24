/**
 * Home 页面 - 今日饮水记录
 */

import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProgressRing } from '@/components/ProgressRing';
import { QuickAddButtons } from '@/components/QuickAddButtons';
import { WaterLogList } from '@/components/WaterLogList';
import { AchievementBadge } from '@/components/AchievementBadge';
import { checkAchievements, getUnlockedAchievements } from '@/lib/achievements';
import { Achievement } from '@/types/achievements';

export default function HomeScreen() {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const {
    todayLogs,
    todayTotal,
    settings,
    loadTodayData,
    loadSettings,
    addLog,
    deleteLog,
  } = useWaterStore();

  const [refreshing, setRefreshing] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  const loadInitialData = useCallback(async () => {
    await Promise.all([loadTodayData(), loadSettings()]);
    // 加载最近解锁的成就
    const unlocked = await getUnlockedAchievements();
    setRecentAchievements(unlocked.slice(-4)); // 显示最近4个
  }, [loadTodayData, loadSettings]);

  // 初始加载数据
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleAddLog = async (amount: number) => {
    await addLog(amount);
    // 检查成就
    const newlyUnlocked = await checkAchievements();
    if (newlyUnlocked.length > 0) {
      const unlocked = await getUnlockedAchievements();
      setRecentAchievements(unlocked.slice(-4));
    }
  };

  const handleDeleteLog = async (id: string) => {
    await deleteLog(id);
  };

  const goalMl = settings?.daily_goal_ml || 2000;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 进度环形图 */}
        <View style={[styles.progressSection, { backgroundColor: colors.secondaryBackground }]}>
          <ProgressRing current={todayTotal} goal={goalMl} size={220} />
        </View>

        {/* 快捷添加按钮 */}
        <QuickAddButtons onAdd={handleAddLog} />

        {/* 今日记录列表 */}
        <View style={styles.logsSection}>
          <WaterLogList logs={todayLogs} onDelete={handleDeleteLog} />
        </View>

        {/* 成就预览 */}
        {recentAchievements.length > 0 && (
          <View style={[styles.achievementsSection, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.achievementsTitle, { color: colors.text }]}>
              {t('achievements.unlocked')}
            </Text>
            <View style={styles.achievementsGrid}>
              {recentAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} size="small" />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logsSection: {
    flex: 1,
    minHeight: 300,
  },
  achievementsSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
