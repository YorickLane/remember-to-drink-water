/**
 * 快捷添加按钮组件
 */

import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
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
  const { colors } = useThemeColors();
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
      <Text style={[styles.title, { color: colors.text }]}>快速记录</Text>
      <View style={styles.buttonsRow}>
        {PRESET_AMOUNTS.map(({ amount, label, icon }) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.button,
              {
                backgroundColor: colors.quickButtonBackground,
                borderColor: colors.quickButtonBorder,
              },
            ]}
            onPress={() => handleAdd(amount)}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={[styles.amount, { color: colors.quickButtonText }]}>
                  {amount}ml
                </Text>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {label}
                </Text>
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
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 2,
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
