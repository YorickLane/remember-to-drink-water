/**
 * 快捷添加按钮组件
 */

import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => Promise<void>;
}

const PRESET_AMOUNTS = [
  { amount: 200, label: '一杯', icon: '☕' },
  { amount: 300, label: '中杯', icon: '🥤' },
  { amount: 500, label: '大杯', icon: '🍺' },
];

export function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async (amount: number) => {
    try {
      setLoading(true);
      await onAdd(amount);
      // 触觉反馈
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to add water log:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>快速记录</Text>
      <View style={styles.buttonsRow}>
        {PRESET_AMOUNTS.map(({ amount, label, icon }) => (
          <TouchableOpacity
            key={amount}
            style={styles.button}
            onPress={() => handleAdd(amount)}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#2196F3" />
            ) : (
              <>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.amount}>{amount}ml</Text>
                <Text style={styles.label}>{label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
