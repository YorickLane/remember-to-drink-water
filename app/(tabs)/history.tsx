/**
 * 历史页面 - 日历视图
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useWaterStore } from '@/store/useWaterStore';
import { WaterLog } from '@/types/models';

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

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(k => k + 1);
    }, [])
  );

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // 生成日历网格
  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start);

    // 星期标题
    const weekDays = i18n.language === 'zh'
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // 填充空白格子
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

            // 根据完成度决定背景色透明度
            let bgOpacity = 0;
            if (percentage >= 100) bgOpacity = 1;
            else if (percentage >= 75) bgOpacity = 0.7;
            else if (percentage >= 50) bgOpacity = 0.5;
            else if (percentage >= 25) bgOpacity = 0.3;
            else if (percentage > 0) bgOpacity = 0.15;

            return (
              <TouchableOpacity
                key={dateKey}
                style={[
                  styles.dayCell,
                  isSelected && { borderWidth: 2, borderColor: colors.primary },
                ]}
                onPress={() => handleSelectDate(day)}
              >
                <View
                  style={[
                    styles.dayContent,
                    {
                      backgroundColor:
                        bgOpacity > 0
                          ? `rgba(${hexToRgb(colors.primary)}, ${bgOpacity})`
                          : 'transparent',
                    },
                    isToday && !isSelected && { borderWidth: 2, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: percentage >= 75 ? '#fff' : colors.text },
                      isToday && { fontWeight: 'bold' },
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // 选中日期的详情
  const renderSelectedDayDetail = () => {
    if (!selectedDate) {
      return (
        <View style={styles.detailPlaceholder}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            {t('history.tap_to_view')}
          </Text>
        </View>
      );
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayData = monthData.get(dateKey);

    return (
      <View style={styles.detailContent}>
        <Text style={[styles.detailDate, { color: colors.text }]}>
          {format(selectedDate, i18n.language === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy')}
        </Text>

        <View style={styles.detailStats}>
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatValue, { color: colors.primary }]}>
              {dayData?.totalMl || 0} ml
            </Text>
            <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
              {t('history.total_intake')}
            </Text>
          </View>
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatValue, { color: colors.textSecondary }]}>
              {goalMl} ml
            </Text>
            <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
              {t('history.goal')}
            </Text>
          </View>
          <View style={styles.detailStatItem}>
            <Text
              style={[
                styles.detailStatValue,
                { color: (dayData?.percentage || 0) >= 100 ? colors.progressComplete : colors.primary },
              ]}
            >
              {dayData?.percentage || 0}%
            </Text>
            <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
              {t('stats.completion_rate')}
            </Text>
          </View>
        </View>

        {dayData && dayData.logs.length > 0 ? (
          <View style={styles.logsList}>
            <Text style={[styles.logsTitle, { color: colors.text }]}>
              {t('history.records')} ({dayData.logs.length})
            </Text>
            {dayData.logs.slice(0, 5).map((log) => (
              <View key={log.id} style={[styles.logItem, { backgroundColor: colors.logItemBackground }]}>
                <Text style={[styles.logAmount, { color: colors.text }]}>{log.amount_ml} ml</Text>
                <Text style={[styles.logTime, { color: colors.textSecondary }]}>
                  {format(new Date(log.timestamp), 'HH:mm')}
                </Text>
              </View>
            ))}
            {dayData.logs.length > 5 && (
              <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                +{dayData.logs.length - 5} more
              </Text>
            )}
          </View>
        ) : (
          <Text style={[styles.noRecords, { color: colors.textTertiary }]}>{t('history.no_records')}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('history.title')}</Text>
        </View>

        {/* 月份导航 */}
        <View style={[styles.monthNav, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {format(currentMonth, i18n.language === 'zh' ? 'yyyy年M月' : 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.primary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 日历 */}
        <View style={[styles.calendarSection, { backgroundColor: colors.cardBackground }]}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
            </View>
          ) : (
            renderCalendar()
          )}
        </View>

        {/* 选中日期详情 */}
        <View style={[styles.detailSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('history.selected_day')}</Text>
          {renderSelectedDayDetail()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 辅助函数：将 hex 颜色转换为 rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '74, 144, 226'; // 默认蓝色
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 32,
    fontWeight: '300',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  calendarContainer: {},
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
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
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  detailSection: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
  detailContent: {},
  detailDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  logsList: {
    marginTop: 8,
  },
  logsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  logTime: {
    fontSize: 14,
  },
  moreText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  noRecords: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
