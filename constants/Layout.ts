/**
 * 布局和样式常量
 * 统一管理圆角、间距、字体大小等样式值
 */

export const Layout = {
  // 圆角
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },

  // 间距
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  // 内边距
  padding: {
    screen: 20,
    card: 16,
    button: 16,
  },

  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    title: 32,
    display: 48,
  },

  // 图标大小
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  },
} as const;

// 导出类型
export type LayoutType = typeof Layout;
