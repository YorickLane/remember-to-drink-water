/**
 * GlassView 组件 - 玻璃拟态容器
 * Crystal Hydra 设计系统的核心视觉元素
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';

type GlassIntensity = 'light' | 'medium' | 'strong';
type GlassPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type GlassShadow = 'none' | 'sm' | 'md' | 'lg';

interface GlassViewProps {
  children: React.ReactNode;
  intensity?: GlassIntensity;
  padding?: GlassPadding;
  shadow?: GlassShadow;
  borderRadius?: number;
  glow?: boolean;
  animated?: boolean;
  animationDelay?: number;
  style?: ViewStyle;
}

export function GlassView({
  children,
  intensity = 'medium',
  padding = 'md',
  shadow = 'md',
  borderRadius = Layout.borderRadius.xl,
  glow = false,
  animated = true,
  animationDelay = 0,
  style,
}: GlassViewProps) {
  const { isDark } = useThemeColors();

  // 内边距配置
  const paddingValue = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
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

  const glass = glassConfig[intensity];

  // 阴影配置
  const shadowStyle = shadow !== 'none' ? Layout.shadow[shadow] : {};

  // 发光效果
  const glowStyle = glow ? Layout.shadow.glow.primary : {};

  const containerStyle: ViewStyle = {
    backgroundColor: glass.background,
    borderWidth: 1,
    borderColor: glass.border,
    borderRadius,
    padding: paddingValue,
    ...shadowStyle,
    ...glowStyle,
    ...style,
  };

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

// 带滑入动画的玻璃容器
interface AnimatedGlassViewProps extends GlassViewProps {
  slideDistance?: number;
}

export function SlideInGlassView({
  children,
  slideDistance = 20,
  animationDelay = 0,
  ...props
}: AnimatedGlassViewProps) {
  const { isDark } = useThemeColors();

  // 内边距配置
  const paddingValue = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  }[props.padding || 'md'];

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

  const glass = glassConfig[props.intensity || 'medium'];
  const shadowStyle = props.shadow !== 'none' ? Layout.shadow[props.shadow || 'md'] : {};
  const glowStyle = props.glow ? Layout.shadow.glow.primary : {};

  const containerStyle: ViewStyle = {
    backgroundColor: glass.background,
    borderWidth: 1,
    borderColor: glass.border,
    borderRadius: props.borderRadius || Layout.borderRadius.xl,
    padding: paddingValue,
    ...shadowStyle,
    ...glowStyle,
    ...props.style,
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

// 简化版玻璃卡片
export function GlassCard({
  children,
  style,
  ...props
}: Omit<GlassViewProps, 'padding'> & { style?: ViewStyle }) {
  return (
    <GlassView padding="lg" shadow="md" {...props} style={style}>
      {children}
    </GlassView>
  );
}
