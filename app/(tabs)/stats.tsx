/**
 * 统计页面 - 7日趋势
 */

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-gifted-charts';
import { format, subDays } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useWaterStore } from '@/store/useWaterStore';
import { DayStats } from '@/types/models';

export default function StatsScreen() {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const { settings, loadSettings } = useWaterStore();
  const [weekStats, setWeekStats] = useState<DayStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeekStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // 获取过去7天的数据
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
  }, [settings, loadWeekStats]);

  // 计算统计数据
  const totalMl = weekStats.reduce((sum, day) => sum + day.total_ml, 0);
  const avgMl = weekStats.length > 0 ? Math.round(totalMl / weekStats.length) : 0;
  const completedDays = weekStats.filter((day) => day.percentage >= 100).length;
  const completionRate = weekStats.length > 0 ? Math.round((completedDays / weekStats.length) * 100) : 0;

  // 图表数据
  const chartData = weekStats.map((day) => ({
    value: day.total_ml,
    label: format(new Date(day.date_key), 'EEE').slice(0, 2),
    frontColor: day.percentage >= 100 ? colors.progressComplete : colors.primary,
  }));

  const goalMl = settings?.daily_goal_ml || 2000;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('stats.title')}</Text>
        </View>

        {/* 统计卡片 */}
        <View style={[styles.statsGrid, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalMl.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.total')} (ml)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{avgMl.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.average')} (ml)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.progressComplete }]}>{completedDays}/7</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.completed_days')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.progressComplete }]}>{completionRate}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.completion_rate')}</Text>
          </View>
        </View>

        {/* 7日趋势图表 */}
        <View style={[styles.chartSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('stats.week_overview')}</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
            </View>
          ) : weekStats.length > 0 ? (
            <View style={styles.chartContainer}>
              <BarChart
                data={chartData}
                width={280}
                height={200}
                barWidth={28}
                spacing={16}
                roundedTop
                roundedBottom
                xAxisThickness={1}
                yAxisThickness={0}
                xAxisColor={colors.border}
                yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
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
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('stats.chart_label')}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: colors.progressComplete }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('stats.goal')} ({goalMl} ml)
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('stats.no_data')}</Text>
              <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>{t('stats.start_tracking')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  chartSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLine: {
    width: 16,
    height: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
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
    fontSize: 16,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
  },
});
