/**
 * Home 页面 - 今日饮水记录
 * 增强版：渐变背景、优化布局
 */

import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProgressRing } from '@/components/ProgressRing';
import { QuickAddButtons } from '@/components/QuickAddButtons';
import { WaterLogList } from '@/components/WaterLogList';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Card } from '@/components/Card';
import { checkAchievements, getUnlockedAchievements } from '@/lib/achievements';
import { Achievement } from '@/types/achievements';
import { Layout } from '@/constants/Layout';

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
    const unlocked = await getUnlockedAchievements();
    setRecentAchievements(unlocked.slice(-4));
  }, [loadTodayData, loadSettings]);

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 渐变背景进度区域 */}
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressSection}
        >
          <View style={styles.progressContainer}>
            <ProgressRing current={todayTotal} goal={goalMl} />
          </View>
        </LinearGradient>

        {/* 快捷添加按钮 */}
        <QuickAddButtons onAdd={handleAddLog} />

        {/* 今日记录列表 */}
        <View style={styles.logsSection}>
          <WaterLogList logs={todayLogs} onDelete={handleDeleteLog} />
        </View>

        {/* 成就预览 */}
        {recentAchievements.length > 0 && (
          <Card variant="elevated" style={styles.achievementsSection}>
            <Text style={[styles.achievementsTitle, { color: colors.text }]}>
              {t('achievements.unlocked')}
            </Text>
            <View style={styles.achievementsGrid}>
              {recentAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="small"
                />
              ))}
            </View>
          </Card>
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
    paddingBottom: Layout.spacing.xl,
  },
  progressSection: {
    paddingVertical: Layout.spacing.xxxl,
    paddingHorizontal: Layout.padding.screen,
    borderBottomLeftRadius: Layout.borderRadius.xxl,
    borderBottomRightRadius: Layout.borderRadius.xxl,
  },
  progressContainer: {
    alignItems: 'center',
  },
  logsSection: {
    flex: 1,
    minHeight: 250,
  },
  achievementsSection: {
    marginHorizontal: Layout.padding.screen,
    marginTop: Layout.spacing.lg,
  },
  achievementsTitle: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
