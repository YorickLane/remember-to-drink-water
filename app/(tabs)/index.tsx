/**
 * Home 页面 - 今日饮水记录
 * Crystal Hydra 设计系统 - 玻璃拟态风格
 */

import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProgressRing } from '@/components/ProgressRing';
import { QuickAddButtons } from '@/components/QuickAddButtons';
import { WaterLogList } from '@/components/WaterLogList';
import { AchievementBadge } from '@/components/AchievementBadge';
import { GlassCard } from '@/components/Card';
import { checkAchievements, getUnlockedAchievements } from '@/lib/achievements';
import { Achievement } from '@/types/achievements';
import { Layout } from '@/constants/Layout';

export default function HomeScreen() {
  const { colors, isDark } = useThemeColors();
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

  // 柔和渐变背景色
  const backgroundGradient = isDark
    ? ['#0C1929', '#132337']
    : ['#F0F9FF', '#E0F2FE'];

  // 进度区域渐变色
  const progressGradient = isDark
    ? ['rgba(56, 189, 248, 0.15)', 'rgba(34, 211, 238, 0.1)']
    : ['rgba(14, 165, 233, 0.08)', 'rgba(6, 182, 212, 0.05)'];

  return (
    <View style={styles.container}>
      {/* 全屏渐变背景 */}
      <LinearGradient
        colors={backgroundGradient as [string, string]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
          {/* 进度区域 - 玻璃卡片包裹 */}
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.progressSection}
          >
            <LinearGradient
              colors={progressGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.progressGradient}
            >
              <View style={styles.progressContainer}>
                <ProgressRing current={todayTotal} goal={goalMl} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* 快捷添加按钮 */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <QuickAddButtons onAdd={handleAddLog} />
          </Animated.View>

          {/* 今日记录列表 */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.logsSection}
          >
            <WaterLogList logs={todayLogs} onDelete={handleDeleteLog} />
          </Animated.View>

          {/* 成就预览 */}
          {recentAchievements.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <GlassCard
                intensity="medium"
                animated={false}
                style={styles.achievementsSection}
              >
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
              </GlassCard>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xxxl,
  },
  progressSection: {
    paddingTop: Layout.spacing.lg,
    paddingHorizontal: Layout.padding.screen,
  },
  progressGradient: {
    borderRadius: Layout.borderRadius['3xl'],
    paddingVertical: Layout.spacing.xxl,
    paddingHorizontal: Layout.padding.screen,
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
