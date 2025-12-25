/**
 * 布局和样式常量
 * 统一管理圆角、间距、字体大小、阴影等样式值
 */

import { Platform } from 'react-native';

export const Layout = {
  // 圆角 - 更现代的层次
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    xxl: 36,
    round: 9999,
  },

  // 间距 - 8px 网格系统
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // 内边距
  padding: {
    screen: 20,
    screenCompact: 16,
    card: 20,
    cardCompact: 16,
    button: 16,
    buttonLarge: 20,
    section: 24,
  },

  // 字体大小 - 更明显的层次
  fontSize: {
    caption: 11,
    footnote: 13,
    body: 15,
    callout: 16,
    subheadline: 17,
    headline: 18,
    title3: 20,
    title2: 24,
    title1: 28,
    largeTitle: 34,
    display: 56,
    hero: 72,
    // 兼容旧版
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    title: 32,
  },

  // 字重
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // 图标大小
  iconSize: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
    xxl: 48,
  },

  // 阴影预设 - 跨平台兼容
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#0077B6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#0077B6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0077B6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#0077B6',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  // 动画时长
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },

  // 触摸响应尺寸
  hitSlop: {
    sm: { top: 8, bottom: 8, left: 8, right: 8 },
    md: { top: 12, bottom: 12, left: 12, right: 12 },
    lg: { top: 16, bottom: 16, left: 16, right: 16 },
  },

  // 组件特定尺寸
  component: {
    buttonHeight: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    inputHeight: 48,
    cardMinHeight: 80,
    progressRingSize: 240,
    quickButtonMinHeight: 100,
  },
} as const;

// 导出类型
export type LayoutType = typeof Layout;
export type ShadowLevel = keyof typeof Layout.shadow;
export type FontSize = keyof typeof Layout.fontSize;
