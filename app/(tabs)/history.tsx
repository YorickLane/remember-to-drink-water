/**
 * 历史页面 - 日历视图
 * Crystal Hydra 设计系统 - 玻璃拟态风格
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
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
import { SlideInGlassCard } from '@/components/Card';
import { Layout } from '@/constants/Layout';
import { WaterLog } from '@/types/models';
import * as Haptics from 'expo-haptics';

// SVG 图标组件
function CalendarIcon({ size = 32, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WaterDropIcon({ size = 20, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgLinearGradient id="dropGradHistory" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#dropGradHistory)"
      />
    </Svg>
  );
}

function ChevronLeftIcon({ size = 28, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 28, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface DayData {
  date: Date;
  totalMl: number;
  percentage: number;
  logs: WaterLog[];
}

export default function HistoryScreen() {
  const { colors, isDark } = useThemeColors();
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
      withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
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
    if (percentage >= 100) return colors.accent;
    if (percentage >= 75) return colors.progressExcellent;
    if (percentage >= 50) return colors.progressMedium;
    if (percentage >= 25) return colors.primary;
    if (percentage > 0) return colors.progressLow;
    return 'transparent';
  };

  const getHeatmapOpacity = (percentage: number) => {
    if (percentage >= 100) return 1;
    if (percentage >= 75) return 0.85;
    if (percentage >= 50) return 0.7;
    if (percentage >= 25) return 0.55;
    if (percentage > 0) return 0.35;
    return 0;
  };

  // 背景渐变色
  const backgroundGradient: [string, string] = isDark
    ? ['#0C1929', '#132337']
    : ['#F0F9FF', '#E0F2FE'];

  // 玻璃效果背景
  const glassBackground = isDark
    ? 'rgba(30, 58, 95, 0.4)'
    : 'rgba(255, 255, 255, 0.5)';

  // 生成日历网格
  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start);

    const weekDays =
      i18n.language === 'zh'
        ? ['日', '一', '二', '三', '四', '五', '六']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
            const showLightText = percentage >= 50;

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
                            : glassBackground,
                      },
                      isSelected && {
                        borderWidth: 2,
                        borderColor: colors.primary,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 4,
                      },
                      isToday &&
                        !isSelected && {
                          borderWidth: 2,
                          borderColor: colors.accent,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: showLightText ? '#fff' : colors.text },
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
                        ? glassBackground
                        : getHeatmapColor(pct) +
                          Math.round(getHeatmapOpacity(pct) * 255)
                            .toString(16)
                            .padStart(2, '0'),
                    borderWidth: pct === 0 ? 1 : 0,
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.2)',
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
          <CalendarIcon size={40} color={colors.textTertiary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            {t('history.tap_to_view')}
          </Text>
        </View>
      );
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayData = monthData.get(dateKey);
    const percentage = dayData?.percentage || 0;

    // 进度条渐变色
    const progressGradient: [string, string] = percentage >= 100
      ? [colors.accent, '#34D399']
      : [colors.primary, '#38BDF8'];

    return (
      <View style={styles.detailContent}>
        <Text style={[styles.detailDate, { color: colors.text }]}>
          {format(selectedDate, i18n.language === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy')}
        </Text>

        {/* 进度条 - 渐变色 */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.progressBackground }]}>
            <LinearGradient
              colors={progressGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${Math.min(percentage, 100)}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressPercentage,
              { color: percentage >= 100 ? colors.accent : colors.primary },
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
          <View style={[styles.detailStatDivider, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.2)' }]} />
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
            {dayData.logs.slice(0, 5).map((log) => (
              <View
                key={log.id}
                style={[styles.logItem, { backgroundColor: glassBackground }]}
              >
                <View style={styles.logItemLeft}>
                  <WaterDropIcon size={16} color={colors.primary} />
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
            <WaterDropIcon size={36} color={colors.textTertiary} />
            <Text style={[styles.noRecords, { color: colors.textTertiary }]}>
              {t('history.no_records')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 标题 */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('history.title')}
            </Text>
          </Animated.View>

          {/* 月份导航 */}
          <SlideInGlassCard
            intensity="light"
            animationDelay={100}
            padding="compact"
            style={styles.monthNav}
          >
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <ChevronLeftIcon size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: colors.text }]}>
              {format(currentMonth, i18n.language === 'zh' ? 'yyyy年M月' : 'MMMM yyyy')}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <ChevronRightIcon size={24} color={colors.primary} />
            </TouchableOpacity>
          </SlideInGlassCard>

          {/* 日历 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={200}
            style={styles.calendarSection}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
              </View>
            ) : (
              renderCalendar()
            )}
          </SlideInGlassCard>

          {/* 选中日期详情 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={300}
            style={styles.detailSection}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('history.selected_day')}
            </Text>
            {renderSelectedDayDetail()}
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
    borderRadius: Layout.borderRadius.md,
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
    borderRadius: 4,
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
    gap: Layout.spacing.sm,
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
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
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
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  logItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
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
    gap: Layout.spacing.sm,
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
