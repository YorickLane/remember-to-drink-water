/**
 * 通用卡片组件
 * 支持多种变体：default、elevated、outlined、gradient
 */

import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient';
type CardPadding = 'none' | 'compact' | 'default' | 'large';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  style?: ViewStyle;
  gradientColors?: [string, string];
}

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  style,
  gradientColors,
}: CardProps) {
  const { colors } = useThemeColors();

  const paddingValue = {
    none: 0,
    compact: Layout.padding.cardCompact,
    default: Layout.padding.card,
    large: Layout.padding.section,
  }[padding];

  const baseStyle: ViewStyle = {
    borderRadius: Layout.borderRadius.lg,
    padding: paddingValue,
  };

  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.cardBackground,
      ...Layout.shadow.sm,
    },
    elevated: {
      backgroundColor: colors.cardElevated,
      ...Layout.shadow.md,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    gradient: {
      overflow: 'hidden',
    },
  };

  if (variant === 'gradient') {
    const defaultGradient: [string, string] = [
      colors.primaryGradientStart,
      colors.primaryGradientEnd,
    ];

    return (
      <LinearGradient
        colors={gradientColors || defaultGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, variantStyles.gradient, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[baseStyle, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

// 预设卡片样式
export function SectionCard({ children, style, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="default" {...props} style={StyleSheet.flatten([styles.sectionCard, style])}>
      {children}
    </Card>
  );
}

export function ElevatedCard({ children, style, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="elevated" {...props} style={style}>
      {children}
    </Card>
  );
}

export function GradientCard({ children, style, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="gradient" {...props} style={style}>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginHorizontal: Layout.padding.screen,
    marginBottom: Layout.spacing.lg,
  },
});
