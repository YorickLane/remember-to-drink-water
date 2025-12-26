/**
 * Text 组件 - 主题化文本
 * Crystal Hydra 设计系统的排版组件
 */

import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Typography, TypographyPreset } from '@/constants/Typography';

type TextVariant = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'onPrimary' | 'accent' | 'error' | 'warning';

interface TextProps extends Omit<RNTextProps, 'style'> {
  children: React.ReactNode;
  preset?: TypographyPreset;
  variant?: TextVariant;
  align?: 'left' | 'center' | 'right';
  animated?: boolean;
  animationDelay?: number;
  style?: TextStyle;
}

export function Text({
  children,
  preset = 'body',
  variant = 'primary',
  align = 'left',
  animated = false,
  animationDelay = 0,
  style,
  ...rest
}: TextProps) {
  const { colors } = useThemeColors();

  // 获取颜色
  const getColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.text;
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'muted':
        return colors.textDisabled;
      case 'onPrimary':
        return colors.textOnPrimary;
      case 'accent':
        return colors.accent;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.text;
    }
  };

  const presetStyle = Typography.presets[preset];

  const textStyle: TextStyle = {
    ...presetStyle,
    color: getColor(),
    textAlign: align,
    ...style,
  };

  if (animated) {
    return (
      <Animated.Text
        entering={FadeIn.duration(300).delay(animationDelay)}
        style={textStyle}
        {...rest}
      >
        {children}
      </Animated.Text>
    );
  }

  return (
    <RNText style={textStyle} {...rest}>
      {children}
    </RNText>
  );
}

// 预设文本组件
export function DisplayText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="displayMedium" {...props}>
      {children}
    </Text>
  );
}

export function HeadlineText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="headline" {...props}>
      {children}
    </Text>
  );
}

export function TitleText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="title" {...props}>
      {children}
    </Text>
  );
}

export function SubtitleText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="subtitle" {...props}>
      {children}
    </Text>
  );
}

export function BodyText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="body" {...props}>
      {children}
    </Text>
  );
}

export function CaptionText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="caption" variant="tertiary" {...props}>
      {children}
    </Text>
  );
}

export function StatText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="stat" {...props}>
      {children}
    </Text>
  );
}

export function LabelText({
  children,
  ...props
}: Omit<TextProps, 'preset'>) {
  return (
    <Text preset="label" variant="secondary" {...props}>
      {children}
    </Text>
  );
}
