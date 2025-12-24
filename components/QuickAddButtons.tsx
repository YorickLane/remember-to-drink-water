/**
 * 快捷添加按钮组件
 */

import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as Haptics from 'expo-haptics';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => Promise<void>;
}

const PRESET_AMOUNTS = [
  { amount: 200, labelKey: 'home.quick_add.small', icon: '☕' },
  { amount: 300, labelKey: 'home.quick_add.medium', icon: '🥤' },
  { amount: 500, labelKey: 'home.quick_add.large', icon: '🍺' },
];

interface AnimatedButtonProps {
  amount: number;
  labelKey: string;
  icon: string;
  onAdd: (amount: number) => Promise<void>;
  colors: {
    primary: string;
    quickButtonBackground: string;
    quickButtonBorder: string;
    quickButtonText: string;
    textSecondary: string;
  };
}

function AnimatedButton({ amount, labelKey, icon, onAdd, colors }: AnimatedButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const [loading, setLoading] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = async () => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onAdd(amount);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to add water log:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.quickButtonBackground,
            borderColor: colors.quickButtonBorder,
          },
          animatedStyle,
        ]}
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
              {t(labelKey)}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t('home.quick_add.title')}</Text>
      <View style={styles.buttonsRow}>
        {PRESET_AMOUNTS.map(({ amount, labelKey, icon }) => (
          <AnimatedButton
            key={amount}
            amount={amount}
            labelKey={labelKey}
            icon={icon}
            onAdd={onAdd}
            colors={colors}
          />
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
