/**
 * 排版系统 - Crystal Hydra 设计系统
 * 基于模块化比例 1.25 设计
 */

import { TextStyle } from 'react-native';

export const Typography = {
  // 字体家族
  fontFamily: {
    primary: 'System',
    monospace: 'ui-monospace',
  },

  // 字体大小层次 - 模块化比例 1.25
  fontSize: {
    '2xs': 10,
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
    '5xl': 52,
    display: 64,
    hero: 80,
  } as const,

  // 字重
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // 行高
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  } as const,

  // 字间距
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  } as const,

  // 预设文本样式
  presets: {
    // 展示型文本
    displayLarge: {
      fontSize: 64,
      fontWeight: '700',
      lineHeight: 1.1,
      letterSpacing: -1,
    } as TextStyle,

    displayMedium: {
      fontSize: 52,
      fontWeight: '700',
      lineHeight: 1.15,
      letterSpacing: -0.5,
    } as TextStyle,

    displaySmall: {
      fontSize: 40,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: -0.25,
    } as TextStyle,

    // 标题型文本
    headline: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 1.25,
      letterSpacing: -0.25,
    } as TextStyle,

    title: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 1.3,
    } as TextStyle,

    subtitle: {
      fontSize: 17,
      fontWeight: '500',
      lineHeight: 1.4,
    } as TextStyle,

    // 正文型文本
    body: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 1.5,
    } as TextStyle,

    bodyLarge: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 1.5,
    } as TextStyle,

    bodySmall: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 1.5,
    } as TextStyle,

    // 辅助型文本
    caption: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 1.4,
    } as TextStyle,

    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 1.4,
    } as TextStyle,

    // 按钮文本
    button: {
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: 0.25,
    } as TextStyle,

    buttonSmall: {
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: 0.25,
    } as TextStyle,

    buttonLarge: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: 0.25,
    } as TextStyle,

    // 标签文本
    label: {
      fontSize: 13,
      fontWeight: '500',
      lineHeight: 1.3,
      letterSpacing: 0.25,
    } as TextStyle,

    labelSmall: {
      fontSize: 11,
      fontWeight: '500',
      lineHeight: 1.3,
      letterSpacing: 0.5,
    } as TextStyle,

    // 数字/统计文本
    stat: {
      fontSize: 26,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.25,
    } as TextStyle,

    statLarge: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 1.1,
      letterSpacing: -0.5,
    } as TextStyle,
  },
} as const;

export type FontSize = keyof typeof Typography.fontSize;
export type FontWeight = keyof typeof Typography.fontWeight;
export type LineHeight = keyof typeof Typography.lineHeight;
export type LetterSpacing = keyof typeof Typography.letterSpacing;
export type TypographyPreset = keyof typeof Typography.presets;
