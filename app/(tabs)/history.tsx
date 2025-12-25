/**
 * 历史页面 - 日历视图
 * 增强版：优化视觉效果、热力图颜色、今日脉冲效果
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useWaterStore } from '@/store/useWaterStore';
import { Card } from '@/components/Card';
import { Layout } from '@/constants/Layout';
import { WaterLog } from '@/types/models';
import * as Haptics from 'expo-haptics';

interface DayData {
  date: Date;
  totalMl: number;
  percentage: number;
  logs: WaterLog[];
}

export default function HistoryScreen() {
  const { colors } = useThemeColors();
  const { t, i18n } = useTranslation();
  const { settings, loadSettings } = useWaterStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<Map<string, DayData>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 今日脉冲动画
  const todayPulse = useSharedValue(1);

  useEffect(() => {
    todayPulse.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [todayPulse]);

  const todayPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: todayPulse.value }],
  }));

  const goalMl = settings?.daily_goal_ml || 2000;

  const loadMonthData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { storageAdapter } = await import('@/lib/storage');
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start, end });

      const dataMap = new Map<string, DayData>();

      for (const day of days) {
        const dateKey = format(day, 'yyyy-MM-dd');
        const logs = await storageAdapter.getLogsByDate(dateKey);
        const totalMl = logs.reduce((sum, log) => sum + log.amount_ml, 0);

        dataMap.set(dateKey, {
          date: day,
          totalMl,
          percentage: Math.round((totalMl / goalMl) * 100),
          logs,
        });
      }

      setMonthData(dataMap);
    } catch (error) {
      console.error('Failed to load month data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, goalMl]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      loadMonthData();
    }
  }, [settings, loadMonthData, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const handlePrevMonth = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleSelectDate = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(date);
  };

  // 根据完成度获取热力图颜色
  const getHeatmapColor = (percentage: number) => {
    if (percentage >= 100) return colors.progressComplete;
    if (percentage >= 75) return colors.progressExcellent;
    if (percentage >= 50) return colors.progressMedium;
    if (percentage >= 25) return colors.progressHigh;
    if (percentage > 0) return colors.progressLow;
    return 'transparent';
  };

  const getHeatmapOpacity = (percentage: number) => {
    if (percentage >= 100) return 1;
    if (percentage >= 75) return 0.85;
    if (percentage >= 50) return 0.7;
    if (percentage >= 25) return 0.5;
    if (percentage > 0) return 0.3;
    return 0;
  };

  // 生成日历网格
  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start);

    const weekDays =
      i18n.language === 'zh'
        ? ['日', '一', '二', '三', '四', '五', '六']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const paddingDays = Array(startDayOfWeek).fill(null);

    return (
      <View style={styles.calendarContainer}>
        {/* 星期标题行 */}
        <View style={styles.weekRow}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* 日期网格 */}
        <View style={styles.daysGrid}>
          {paddingDays.map((_, index) => (
            <View key={`padding-${index}`} style={styles.dayCell} />
          ))}
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = monthData.get(dateKey);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const percentage = dayData?.percentage || 0;

            const bgColor = getHeatmapColor(percentage);
            const bgOpacity = getHeatmapOpacity(percentage);
            const showDarkText = percentage >= 50;

            const DayWrapper = isToday && !isSelected ? Animated.View : View;
            const wrapperStyle = isToday && !isSelected ? todayPulseStyle : undefined;

            return (
              <TouchableOpacity
                key={dateKey}
                style={styles.dayCell}
                onPress={() => handleSelectDate(day)}
                activeOpacity={0.7}
              >
                <DayWrapper style={wrapperStyle}>
                  <View
                    style={[
                      styles.dayContent,
                      {
                        backgroundColor:
                          bgOpacity > 0
                            ? bgColor + Math.round(bgOpacity * 255).toString(16).padStart(2, '0')
                            : colors.secondaryBackground,
                      },
                      isSelected && {
                        borderWidth: 2,
                        borderColor: colors.primary,
                      },
                      isToday &&
                        !isSelected && {
                          borderWidth: 2,
                          borderColor: colors.primary,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: showDarkText ? '#fff' : colors.text },
                        isToday && { fontWeight: Layout.fontWeight.bold },
                      ]}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                </DayWrapper>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 图例 */}
        <View style={styles.legendContainer}>
          <Text style={[styles.legendLabel, { color: colors.textTertiary }]}>
            {t('history.legend_less')}
          </Text>
          <View style={styles.legendScale}>
            {[0, 25, 50, 75, 100].map((pct) => (
              <View
                key={pct}
                style={[
                  styles.legendDot,
                  {
                    backgroundColor:
                      pct === 0
                        ? colors.secondaryBackground
                        : getHeatmapColor(pct) +
                          Math.round(getHeatmapOpacity(pct) * 255)
                            .toString(16)
                            .padStart(2, '0'),
                    borderWidth: pct === 0 ? 1 : 0,
                    borderColor: colors.border,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.legendLabel, { color: colors.textTertiary }]}>
            {t('history.legend_more')}
          </Text>
        </View>
      </View>
    );
  };

  // 选中日期的详情
  const renderSelectedDayDetail = () => {
    if (!selectedDate) {
      return (
        <View style={styles.detailPlaceholder}>
          <Text style={styles.placeholderIcon}>📅</Text>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            {t('history.tap_to_view')}
          </Text>
        </View>
      );
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayData = monthData.get(dateKey);
    const percentage = dayData?.percentage || 0;

    return (
      <View style={styles.detailContent}>
        <Text style={[styles.detailDate, { color: colors.text }]}>
          {format(selectedDate, i18n.language === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy')}
        </Text>

        {/* 进度条 */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.progressBackground }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: percentage >= 100 ? colors.progressComplete : colors.primary,
                  width: `${Math.min(percentage, 100)}%`,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressPercentage,
              { color: percentage >= 100 ? colors.progressComplete : colors.primary },
            ]}
          >
            {percentage}%
          </Text>
        </View>

        <View style={styles.detailStats}>
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatValue, { color: colors.primary }]}>
              {dayData?.totalMl || 0}
            </Text>
            <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
              {t('history.total_intake')} (ml)
            </Text>
          </View>
          <View style={[styles.detailStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatValue, { color: colors.textSecondary }]}>
              {goalMl}
            </Text>
            <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
              {t('history.goal')} (ml)
            </Text>
          </View>
        </View>

        {dayData && dayData.logs.length > 0 ? (
          <View style={styles.logsList}>
            <Text style={[styles.logsTitle, { color: colors.text }]}>
              {t('history.records')} ({dayData.logs.length})
            </Text>
            {dayData.logs.slice(0, 5).map((log, index) => (
              <View
                key={log.id}
                style={[styles.logItem, { backgroundColor: colors.logItemBackground }]}
              >
                <View style={styles.logItemLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.logAmount, { color: colors.text }]}>
                    {log.amount_ml} ml
                  </Text>
                </View>
                <Text style={[styles.logTime, { color: colors.textTertiary }]}>
                  {format(new Date(log.timestamp), 'HH:mm')}
                </Text>
              </View>
            ))}
            {dayData.logs.length > 5 && (
              <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                +{dayData.logs.length - 5} {t('history.more')}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsIcon}>💧</Text>
            <Text style={[styles.noRecords, { color: colors.textTertiary }]}>
              {t('history.no_records')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('history.title')}
          </Text>
        </View>

        {/* 月份导航 */}
        <Card variant="elevated" padding="compact" style={styles.monthNav}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {format(currentMonth, i18n.language === 'zh' ? 'yyyy年M月' : 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.primary }]}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* 日历 */}
        <Card variant="elevated" style={styles.calendarSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
            </View>
          ) : (
            renderCalendar()
          )}
        </Card>

        {/* 选中日期详情 */}
        <Card variant="elevated" style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('history.selected_day')}
          </Text>
          {renderSelectedDayDetail()}
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 32,
    fontWeight: Layout.fontWeight.regular,
  },
  monthTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
  },
  calendarSection: {
    marginBottom: Layout.spacing.lg,
  },
  calendarContainer: {},
  weekRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  weekDayText: {
    fontSize: Layout.fontSize.caption,
    fontWeight: Layout.fontWeight.medium,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.sm,
  },
  dayText: {
    fontSize: Layout.fontSize.footnote,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  legendLabel: {
    fontSize: Layout.fontSize.caption,
  },
  legendScale: {
    flexDirection: 'row',
    gap: 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  detailSection: {},
  sectionTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.lg,
  },
  detailPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  placeholderText: {
    fontSize: Layout.fontSize.footnote,
  },
  detailContent: {},
  detailDate: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.medium,
    marginBottom: Layout.spacing.lg,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.bold,
    minWidth: 50,
    textAlign: 'right',
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  detailStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailStatDivider: {
    width: 1,
    height: 40,
    marginHorizontal: Layout.spacing.lg,
  },
  detailStatValue: {
    fontSize: Layout.fontSize.title2,
    fontWeight: Layout.fontWeight.bold,
  },
  detailStatLabel: {
    fontSize: Layout.fontSize.caption,
    marginTop: Layout.spacing.xs,
  },
  logsList: {
    marginTop: Layout.spacing.sm,
  },
  logsTitle: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.medium,
    marginBottom: Layout.spacing.sm,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.sm,
  },
  logItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.md,
  },
  logAmount: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.medium,
  },
  logTime: {
    fontSize: Layout.fontSize.caption,
  },
  moreText: {
    fontSize: Layout.fontSize.caption,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
  noRecordsContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  noRecordsIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  noRecords: {
    fontSize: Layout.fontSize.footnote,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
