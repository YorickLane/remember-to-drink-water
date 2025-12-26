/**
 * 通用卡片组件 - Crystal Hydra 设计系统
 * 支持多种变体：default, elevated, outlined, gradient, glass
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
type CardPadding = 'none' | 'compact' | 'default' | 'large';
type GlassIntensity = 'light' | 'medium' | 'strong';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  glassIntensity?: GlassIntensity;
  glow?: boolean;
  animated?: boolean;
  animationDelay?: number;
  style?: ViewStyle;
  gradientColors?: [string, string];
}

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  glassIntensity = 'medium',
  glow = false,
  animated = false,
  animationDelay = 0,
  style,
  gradientColors,
}: CardProps) {
  const { colors, isDark } = useThemeColors();

  const paddingValue = {
    none: 0,
    compact: Layout.padding.cardCompact,
    default: Layout.padding.card,
    large: Layout.padding.section,
  }[padding];

  // 玻璃效果配置
  const glassConfig = isDark
    ? {
        light: {
          background: 'rgba(30, 58, 95, 0.5)',
          border: 'rgba(56, 189, 248, 0.15)',
        },
        medium: {
          background: 'rgba(30, 58, 95, 0.65)',
          border: 'rgba(56, 189, 248, 0.2)',
        },
        strong: {
          background: 'rgba(30, 58, 95, 0.8)',
          border: 'rgba(56, 189, 248, 0.25)',
        },
      }
    : {
        light: {
          background: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(255, 255, 255, 0.4)',
        },
        medium: {
          background: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(255, 255, 255, 0.5)',
        },
        strong: {
          background: 'rgba(255, 255, 255, 0.88)',
          border: 'rgba(255, 255, 255, 0.6)',
        },
      };

  const baseStyle: ViewStyle = {
    borderRadius: Layout.borderRadius.xl,
    padding: paddingValue,
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.cardBackground,
          ...Layout.shadow.sm,
        };
      case 'elevated':
        return {
          backgroundColor: colors.cardElevated,
          ...Layout.shadow.md,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'gradient':
        return {
          overflow: 'hidden',
        };
      case 'glass':
        const glass = glassConfig[glassIntensity];
        return {
          backgroundColor: glass.background,
          borderWidth: 1,
          borderColor: glass.border,
          ...Layout.shadow.md,
          ...(glow ? Layout.shadow.glow.primary : {}),
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();
  const containerStyle = [baseStyle, variantStyles, style];

  // 渐变变体
  if (variant === 'gradient') {
    const defaultGradient: [string, string] = [
      colors.primaryGradientStart,
      colors.primaryGradientEnd,
    ];

    const content = (
      <LinearGradient
        colors={gradientColors || defaultGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, variantStyles, style]}
      >
        {children}
      </LinearGradient>
    );

    if (animated) {
      return (
        <Animated.View entering={FadeIn.duration(300).delay(animationDelay)}>
          {content}
        </Animated.View>
      );
    }

    return content;
  }

  // 其他变体
  if (animated) {
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(animationDelay)}
        style={containerStyle}
      >
        {children}
      </Animated.View>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

// 预设卡片样式
export function SectionCard({
  children,
  style,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card
      variant="default"
      {...props}
      style={StyleSheet.flatten([styles.sectionCard, style])}
    >
      {children}
    </Card>
  );
}

export function ElevatedCard({
  children,
  style,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="elevated" {...props} style={style}>
      {children}
    </Card>
  );
}

export function GradientCard({
  children,
  style,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="gradient" {...props} style={style}>
      {children}
    </Card>
  );
}

export function GlassCard({
  children,
  intensity = 'medium',
  glow = false,
  animated = true,
  style,
  ...props
}: Omit<CardProps, 'variant' | 'glassIntensity'> & {
  intensity?: GlassIntensity;
}) {
  return (
    <Card
      variant="glass"
      glassIntensity={intensity}
      glow={glow}
      animated={animated}
      {...props}
      style={style}
    >
      {children}
    </Card>
  );
}

// 带滑入动画的玻璃卡片
export function SlideInGlassCard({
  children,
  intensity = 'medium',
  animationDelay = 0,
  style,
  ...props
}: Omit<CardProps, 'variant' | 'glassIntensity' | 'animated'> & {
  intensity?: GlassIntensity;
}) {
  const { isDark } = useThemeColors();

  const paddingValue = {
    none: 0,
    compact: Layout.padding.cardCompact,
    default: Layout.padding.card,
    large: Layout.padding.section,
  }[props.padding || 'default'];

  const glassConfig = isDark
    ? {
        light: { background: 'rgba(30, 58, 95, 0.5)', border: 'rgba(56, 189, 248, 0.15)' },
        medium: { background: 'rgba(30, 58, 95, 0.65)', border: 'rgba(56, 189, 248, 0.2)' },
        strong: { background: 'rgba(30, 58, 95, 0.8)', border: 'rgba(56, 189, 248, 0.25)' },
      }
    : {
        light: { background: 'rgba(255, 255, 255, 0.6)', border: 'rgba(255, 255, 255, 0.4)' },
        medium: { background: 'rgba(255, 255, 255, 0.75)', border: 'rgba(255, 255, 255, 0.5)' },
        strong: { background: 'rgba(255, 255, 255, 0.88)', border: 'rgba(255, 255, 255, 0.6)' },
      };

  const glass = glassConfig[intensity];

  const containerStyle: ViewStyle = {
    borderRadius: Layout.borderRadius.xl,
    padding: paddingValue,
    backgroundColor: glass.background,
    borderWidth: 1,
    borderColor: glass.border,
    ...Layout.shadow.md,
    ...(props.glow ? Layout.shadow.glow.primary : {}),
    ...(style as ViewStyle),
  };

  return (
    <Animated.View
      entering={SlideInDown.duration(400)
        .delay(animationDelay)
        .springify()
        .damping(18)
        .stiffness(180)}
      style={containerStyle}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginHorizontal: Layout.padding.screen,
    marginBottom: Layout.spacing.lg,
  },
});
