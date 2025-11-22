/**
 * 饮水记录列表组件
 */

import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WaterLog } from '@/types/models';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

interface WaterLogListProps {
  logs: WaterLog[];
  onDelete: (id: string) => Promise<void>;
}

export function WaterLogList({ logs, onDelete }: WaterLogListProps) {
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

  const renderLogItem = (item: WaterLog) => {
    const time = format(item.timestamp, 'HH:mm');

    return (
      <View key={item.id} style={styles.logItem}>
        <View style={styles.logContent}>
          <Text style={styles.dropIcon}>💧</Text>
          <View style={styles.logInfo}>
            <Text style={styles.amount}>{item.amount_ml} ml</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💧</Text>
        <Text style={styles.emptyText}>今天还没有记录</Text>
        <Text style={styles.emptyHint}>点击上方按钮开始记录吧！</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>今日记录 ({logs.length})</Text>
      <View style={styles.logsList}>
        {logs.map(renderLogItem)}
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
    color: '#333',
  },
  logsList: {
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
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
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
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
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
});
