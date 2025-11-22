/**
 * Home 页面 - 今日饮水记录
 */

import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProgressRing } from '@/components/ProgressRing';
import { QuickAddButtons } from '@/components/QuickAddButtons';
import { WaterLogList } from '@/components/WaterLogList';

export default function HomeScreen() {
  const { colors } = useThemeColors();
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

  // 初始加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([loadTodayData(), loadSettings()]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleAddLog = async (amount: number) => {
    await addLog(amount);
  };

  const handleDeleteLog = async (id: string) => {
    await deleteLog(id);
  };

  const goalMl = settings?.daily_goal_ml || 2000;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
      </ScrollView>
    </View>
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
});
