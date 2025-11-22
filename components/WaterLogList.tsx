/**
 * 饮水记录列表组件
 */

import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutRight,
  Layout,
} from 'react-native-reanimated';
import { WaterLog } from '@/types/models';
import { format } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as Haptics from 'expo-haptics';

interface WaterLogListProps {
  logs: WaterLog[];
  onDelete: (id: string) => Promise<void>;
}

export function WaterLogList({ logs, onDelete }: WaterLogListProps) {
  const { colors } = useThemeColors();

  const handleDelete = (log: WaterLog) => {
    Alert.alert(
      '删除记录',
      `确定要删除这条 ${log.amount_ml}ml 的记录吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await onDelete(log.id);
          },
        },
      ]
    );
  };

  const renderLogItem = (item: WaterLog, index: number) => {
    const time = format(item.timestamp, 'HH:mm');

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 50).springify()}
        exiting={FadeOutRight.duration(300)}
        layout={Layout.springify()}
        style={[styles.logItem, { backgroundColor: colors.logItemBackground }]}
      >
        <View style={styles.logContent}>
          <Text style={styles.dropIcon}>💧</Text>
          <View style={styles.logInfo}>
            <Text style={[styles.amount, { color: colors.text }]}>{item.amount_ml} ml</Text>
            <Text style={[styles.time, { color: colors.textTertiary }]}>{time}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💧</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>今天还没有记录</Text>
        <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>点击上方按钮开始记录吧！</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>今日记录 ({logs.length})</Text>
      <View style={styles.logsList}>
        {logs.map((log, index) => renderLogItem(log, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  logsList: {
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  logContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
  },
});
