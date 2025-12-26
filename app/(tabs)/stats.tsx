/**
 * 统计页面 - 7日趋势
 * Crystal Hydra 设计系统 - 玻璃拟态风格
 */

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-gifted-charts';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { format, subDays } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useWaterStore } from '@/store/useWaterStore';
import { SlideInGlassCard } from '@/components/Card';
import { Layout } from '@/constants/Layout';
import { DayStats } from '@/types/models';

// SVG 图标组件
function ChartIcon({ size = 48, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <SvgLinearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </SvgLinearGradient>
      </Defs>
      <Rect x="4" y="28" width="8" height="16" rx="2" fill="url(#chartGrad)" stroke={color} strokeWidth="1.5" />
      <Rect x="16" y="18" width="8" height="26" rx="2" fill="url(#chartGrad)" stroke={color} strokeWidth="1.5" />
      <Rect x="28" y="8" width="8" height="36" rx="2" fill="url(#chartGrad)" stroke={color} strokeWidth="1.5" />
      <Path d="M4 44H44" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function TrendUpIcon({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 14L9 9L13 13L20 6M20 6V12M20 6H14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarCheckIcon({ size = 20, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2V6M16 2V6M3 10H21M9 16L11 18L15 14M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PercentIcon({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 5L5 19M7.5 6.5C7.5 7.32843 6.82843 8 6 8C5.17157 8 4.5 7.32843 4.5 6.5C4.5 5.67157 5.17157 5 6 5C6.82843 5 7.5 5.67157 7.5 6.5ZM19.5 17.5C19.5 18.3284 18.8284 19 18 19C17.1716 19 16.5 18.3284 16.5 17.5C16.5 16.6716 17.1716 16 18 16C18.8284 16 19.5 16.6716 19.5 17.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WaterDropIcon({ size = 20, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default function StatsScreen() {
  const { colors, isDark } = useThemeColors();
  const { t } = useTranslation();
  const { settings, loadSettings } = useWaterStore();
  const [weekStats, setWeekStats] = useState<DayStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadWeekStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { storageAdapter } = await import('@/lib/storage');
      const stats: DayStats[] = [];
      const goalMl = settings?.daily_goal_ml || 2000;

      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateKey = format(date, 'yyyy-MM-dd');
        const logs = await storageAdapter.getLogsByDate(dateKey);
        const totalMl = logs.reduce((sum, log) => sum + log.amount_ml, 0);

        stats.push({
          date_key: dateKey,
          total_ml: totalMl,
          goal_ml: goalMl,
          percentage: Math.round((totalMl / goalMl) * 100),
          logs_count: logs.length,
        });
      }

      setWeekStats(stats);
    } catch (error) {
      console.error('Failed to load week stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings?.daily_goal_ml]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      loadWeekStats();
    }
  }, [settings, loadWeekStats, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  // 计算统计数据
  const totalMl = weekStats.reduce((sum, day) => sum + day.total_ml, 0);
  const avgMl = weekStats.length > 0 ? Math.round(totalMl / weekStats.length) : 0;
  const completedDays = weekStats.filter((day) => day.percentage >= 100).length;
  const completionRate =
    weekStats.length > 0 ? Math.round((completedDays / weekStats.length) * 100) : 0;

  // 图表数据 - 使用渐变色
  const chartData = weekStats.map((day) => ({
    value: day.total_ml,
    label: format(new Date(day.date_key), 'EEE').slice(0, 2),
    frontColor: day.percentage >= 100 ? colors.accent : colors.primary,
    gradientColor: day.percentage >= 100 ? '#34D399' : '#38BDF8',
    topLabelComponent: () =>
      day.total_ml > 0 ? (
        <Text style={[styles.barLabel, { color: colors.textTertiary }]}>
          {day.total_ml >= 1000 ? `${(day.total_ml / 1000).toFixed(1)}L` : day.total_ml}
        </Text>
      ) : null,
  }));

  const goalMl = settings?.daily_goal_ml || 2000;

  // 统计项目数据
  const statsItems = [
    {
      value: totalMl >= 1000 ? `${(totalMl / 1000).toFixed(1)}L` : totalMl.toString(),
      label: t('stats.total'),
      icon: <WaterDropIcon size={22} color={colors.primary} />,
      color: colors.primary,
    },
    {
      value: avgMl >= 1000 ? `${(avgMl / 1000).toFixed(1)}L` : avgMl.toString(),
      label: t('stats.average'),
      icon: <TrendUpIcon size={22} color={colors.accent} />,
      color: colors.accent,
    },
    {
      value: `${completedDays}/7`,
      label: t('stats.completed_days'),
      icon: <CalendarCheckIcon size={22} color={colors.progressComplete} />,
      color: colors.progressComplete,
    },
    {
      value: `${completionRate}%`,
      label: t('stats.completion_rate'),
      icon: <PercentIcon size={22} color={colors.progressComplete} />,
      color: colors.progressComplete,
    },
  ];

  // 背景渐变色
  const backgroundGradient: [string, string] = isDark
    ? ['#0C1929', '#132337']
    : ['#F0F9FF', '#E0F2FE'];

  return (
    <LinearGradient colors={backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 标题 */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('stats.title')}
            </Text>
          </Animated.View>

          {/* 统计卡片网格 */}
          <View style={styles.statsGrid}>
            {statsItems.map((item, index) => (
              <SlideInGlassCard
                key={index}
                intensity="medium"
                animationDelay={100 + index * 80}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  {item.icon}
                </View>
                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
              </SlideInGlassCard>
            ))}
          </View>

          {/* 7日趋势图表 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={450}
            style={styles.chartSection}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('stats.week_overview')}
            </Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
              </View>
            ) : weekStats.length > 0 ? (
              <View style={styles.chartContainer}>
                <BarChart
                  data={chartData}
                  width={280}
                  height={180}
                  barWidth={26}
                  spacing={18}
                  roundedTop
                  roundedBottom
                  xAxisThickness={1}
                  yAxisThickness={0}
                  xAxisColor={isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.2)'}
                  yAxisTextStyle={{ color: colors.textTertiary, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11 }}
                  noOfSections={4}
                  maxValue={Math.max(goalMl * 1.2, ...weekStats.map((d) => d.total_ml))}
                  showReferenceLine1
                  referenceLine1Position={goalMl}
                  referenceLine1Config={{
                    color: colors.accent,
                    dashWidth: 4,
                    dashGap: 4,
                  }}
                  isAnimated
                  animationDuration={600}
                />
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <LinearGradient
                      colors={[colors.primary, '#38BDF8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.legendDot}
                    />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                      {t('stats.chart_label')}
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                      {t('stats.goal')} ({goalMl >= 1000 ? `${goalMl / 1000}L` : `${goalMl}ml`})
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <ChartIcon size={56} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('stats.no_data')}
                </Text>
                <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
                  {t('stats.start_tracking')}
                </Text>
              </View>
            )}
          </SlideInGlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Layout.padding.screen,
    paddingBottom: Layout.spacing.xxxl,
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  headerTitle: {
    fontSize: Layout.fontSize.largeTitle,
    fontWeight: Layout.fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
  },
  statIconContainer: {
    marginBottom: Layout.spacing.sm,
  },
  statValue: {
    fontSize: Layout.fontSize.title1,
    fontWeight: Layout.fontWeight.bold,
  },
  statLabel: {
    fontSize: Layout.fontSize.caption,
    marginTop: Layout.spacing.xs,
  },
  chartSection: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.lg,
    gap: Layout.spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.xs,
  },
  legendLine: {
    width: 16,
    height: 2,
    marginRight: Layout.spacing.xs,
  },
  legendText: {
    fontSize: Layout.fontSize.caption,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Layout.fontSize.callout,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  emptyHint: {
    fontSize: Layout.fontSize.footnote,
  },
});
