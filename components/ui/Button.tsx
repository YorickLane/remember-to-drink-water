/**
 * Button 组件 - Crystal Hydra 设计系统
 * 支持多种变体：primary, secondary, ghost, danger
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';
import { Animations } from '@/constants/Animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type HapticType = 'light' | 'medium' | 'heavy' | 'none';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  haptic?: HapticType;
  onPress: () => void;
  style?: ViewStyle;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  haptic = 'light',
  onPress,
  style,
}: ButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, Animations.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animations.spring.snappy);
  };

  const handlePress = () => {
    if (disabled || loading) return;

    // 触觉反馈
    if (haptic !== 'none') {
      const impactStyle = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      }[haptic];
      Haptics.impactAsync(impactStyle);
    }

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 尺寸配置
  const sizeConfig = {
    sm: {
      height: Layout.component.buttonHeight.sm,
      paddingHorizontal: 12,
      fontSize: 13,
      iconSize: 16,
    },
    md: {
      height: Layout.component.buttonHeight.md,
      paddingHorizontal: 16,
      fontSize: 15,
      iconSize: 18,
    },
    lg: {
      height: Layout.component.buttonHeight.lg,
      paddingHorizontal: 20,
      fontSize: 17,
      iconSize: 20,
    },
  }[size];

  // 变体样式
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const baseContainer: ViewStyle = {
      height: sizeConfig.height,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: Layout.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseContainer,
            overflow: 'hidden',
          },
          text: {
            color: colors.textOnPrimary,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          },
        };
      case 'secondary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          },
        };
      case 'ghost':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.primary,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          },
        };
      case 'danger':
        return {
          container: {
            ...baseContainer,
            backgroundColor: colors.error,
          },
          text: {
            color: '#FFFFFF',
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    ...variantStyles.container,
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={variantStyles.text}>{children}</Text>
          {rightIcon}
        </>
      )}
    </>
  );

  // Primary 变体使用渐变背景
  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle, containerStyle]}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: Layout.borderRadius.md }]}
        />
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, containerStyle]}
    >
      {content}
    </AnimatedPressable>
  );
}

// 预设按钮样式
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="ghost" />;
}

export function DangerButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="danger" />;
}
