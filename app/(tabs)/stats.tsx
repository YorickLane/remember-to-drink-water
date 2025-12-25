/**
 * 统计页面 - 7日趋势
 * 增强版：优化视觉效果和布局
 */

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-gifted-charts';
import { format, subDays } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useWaterStore } from '@/store/useWaterStore';
import { Card } from '@/components/Card';
import { Layout } from '@/constants/Layout';
import { DayStats } from '@/types/models';

export default function StatsScreen() {
  const { colors } = useThemeColors();
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

  // 图表数据
  const chartData = weekStats.map((day) => ({
    value: day.total_ml,
    label: format(new Date(day.date_key), 'EEE').slice(0, 2),
    frontColor: day.percentage >= 100 ? colors.progressComplete : colors.primary,
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
      color: colors.primary,
    },
    {
      value: avgMl >= 1000 ? `${(avgMl / 1000).toFixed(1)}L` : avgMl.toString(),
      label: t('stats.average'),
      color: colors.primary,
    },
    {
      value: `${completedDays}/7`,
      label: t('stats.completed_days'),
      color: colors.progressComplete,
    },
    {
      value: `${completionRate}%`,
      label: t('stats.completion_rate'),
      color: colors.progressComplete,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('stats.title')}
          </Text>
        </View>

        {/* 统计卡片网格 */}
        <View style={styles.statsGrid}>
          {statsItems.map((item, index) => (
            <Card key={index} variant="elevated" padding="compact" style={styles.statCard}>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* 7日趋势图表 */}
        <Card variant="elevated" style={styles.chartSection}>
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
                xAxisColor={colors.border}
                yAxisTextStyle={{ color: colors.textTertiary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11 }}
                noOfSections={4}
                maxValue={Math.max(goalMl * 1.2, ...weekStats.map((d) => d.total_ml))}
                showReferenceLine1
                referenceLine1Position={goalMl}
                referenceLine1Config={{
                  color: colors.progressComplete,
                  dashWidth: 4,
                  dashGap: 4,
                }}
                isAnimated
                animationDuration={600}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('stats.chart_label')}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendLine, { backgroundColor: colors.progressComplete }]}
                  />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('stats.goal')} ({goalMl >= 1000 ? `${goalMl / 1000}L` : `${goalMl}ml`})
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('stats.no_data')}
              </Text>
              <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
                {t('stats.start_tracking')}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    width: 10,
    height: 10,
    borderRadius: 5,
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.md,
  },
  emptyText: {
    fontSize: Layout.fontSize.callout,
    marginBottom: Layout.spacing.xs,
  },
  emptyHint: {
    fontSize: Layout.fontSize.footnote,
  },
});
