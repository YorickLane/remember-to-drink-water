/**
 * 应用主题颜色配置 - Ocean Breeze 配色方案
 */

export const Colors = {
  light: {
    // 主色调 - 清新水蓝系
    primary: '#00B4D8',
    primaryLight: '#90E0EF',
    primaryDark: '#0077B6',
    primaryGradientStart: '#48CAE4',
    primaryGradientEnd: '#00B4D8',

    // 辅助色
    accent: '#06D6A0',
    accentLight: '#B8F2E6',
    coral: '#FF6B6B',
    amber: '#FFB347',
    purple: '#7B68EE',

    // 背景色 - 分层设计
    background: '#F8FCFF',
    secondaryBackground: '#EDF6FF',
    cardBackground: '#FFFFFF',
    cardElevated: '#FFFFFF',

    // 文本颜色 - 优化对比度
    text: '#1A365D',
    textSecondary: '#4A6FA5',
    textTertiary: '#8BA3C7',
    textDisabled: '#C4D4E5',
    textOnPrimary: '#FFFFFF',

    // 边框和分隔线
    border: '#E2EDF7',
    separator: '#D0E3F0',

    // 进度环颜色 - 渐变层次
    progressBackground: '#E8F4F8',
    progressLow: '#8BA3C7',
    progressMedium: '#FFB347',
    progressHigh: '#48CAE4',
    progressExcellent: '#00B4D8',
    progressComplete: '#06D6A0',

    // 快捷按钮 - 差异化配色
    quickButton: {
      small: { bg: '#E8F8FF', border: '#90E0EF', text: '#0077B6' },
      medium: { bg: '#E0F8F3', border: '#B8F2E6', text: '#06997A' },
      large: { bg: '#FFF3E0', border: '#FFD699', text: '#CC7A00' },
      custom: { bg: '#F3E8FF', border: '#D4BBFF', text: '#7B68EE' },
    },

    // 兼容旧版 - 单色快捷按钮
    quickButtonBackground: '#E8F8FF',
    quickButtonBorder: '#90E0EF',
    quickButtonText: '#0077B6',

    // 记录列表
    logItemBackground: '#F0F7FF',

    // Switch
    switchTrackOff: '#D0E3F0',
    switchTrackOn: '#06D6A0',
    switchThumb: '#FFFFFF',

    // 状态色
    success: '#06D6A0',
    warning: '#FFB347',
    error: '#FF6B6B',

    // 警告和提示
    warningBackground: '#FFF8E6',
    warningText: '#CC7A00',
    infoBackground: '#E8F8FF',
    infoText: '#0077B6',

    // 成就徽章
    achievementUnlocked: '#FFD700',
    achievementSilver: '#C0C0C0',
    achievementBronze: '#CD7F32',
    achievementLocked: '#E2EDF7',

    // 阴影色
    shadow: 'rgba(0, 119, 182, 0.08)',
    shadowMedium: 'rgba(0, 119, 182, 0.12)',
    shadowStrong: 'rgba(0, 119, 182, 0.18)',

    // 删除操作
    deleteBackground: '#FFE5E5',
    deleteText: '#FF6B6B',

    // Tab 栏
    tabIconDefault: '#8BA3C7',
    tabIconSelected: '#00B4D8',
  },

  dark: {
    // 主色调 - 暗色模式
    primary: '#48CAE4',
    primaryLight: '#0077B6',
    primaryDark: '#90E0EF',
    primaryGradientStart: '#00B4D8',
    primaryGradientEnd: '#48CAE4',

    // 辅助色
    accent: '#06D6A0',
    accentLight: '#034D3A',
    coral: '#FF8A8A',
    amber: '#FFCC80',
    purple: '#9D8FFF',

    // 背景色
    background: '#0A1929',
    secondaryBackground: '#132F4C',
    cardBackground: '#1E3A5F',
    cardElevated: '#254670',

    // 文本颜色
    text: '#E8F4FF',
    textSecondary: '#B0C7E0',
    textTertiary: '#7A9BC0',
    textDisabled: '#4A6A8A',
    textOnPrimary: '#0A1929',

    // 边框和分隔线
    border: '#254670',
    separator: '#1E3A5F',

    // 进度环颜色
    progressBackground: '#1E3A5F',
    progressLow: '#4A6A8A',
    progressMedium: '#FFCC80',
    progressHigh: '#48CAE4',
    progressExcellent: '#00B4D8',
    progressComplete: '#06D6A0',

    // 快捷按钮 - 差异化配色
    quickButton: {
      small: { bg: '#0D3A52', border: '#1E5A7B', text: '#48CAE4' },
      medium: { bg: '#0D4A3A', border: '#1E6A5A', text: '#06D6A0' },
      large: { bg: '#3D2800', border: '#5D4800', text: '#FFCC80' },
      custom: { bg: '#2D1B52', border: '#4D3B72', text: '#9D8FFF' },
    },

    // 兼容旧版 - 单色快捷按钮
    quickButtonBackground: '#0D3A52',
    quickButtonBorder: '#1E5A7B',
    quickButtonText: '#48CAE4',

    // 记录列表
    logItemBackground: '#1E3A5F',

    // Switch
    switchTrackOff: '#254670',
    switchTrackOn: '#06D6A0',
    switchThumb: '#FFFFFF',

    // 状态色
    success: '#06D6A0',
    warning: '#FFCC80',
    error: '#FF8A8A',

    // 警告和提示
    warningBackground: '#3D2800',
    warningText: '#FFCC80',
    infoBackground: '#0D3A52',
    infoText: '#48CAE4',

    // 成就徽章
    achievementUnlocked: '#FFD700',
    achievementSilver: '#C0C0C0',
    achievementBronze: '#CD7F32',
    achievementLocked: '#254670',

    // 阴影色
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.4)',
    shadowStrong: 'rgba(0, 0, 0, 0.5)',

    // 删除操作
    deleteBackground: '#4A1A1A',
    deleteText: '#FF8A8A',

    // Tab 栏
    tabIconDefault: '#7A9BC0',
    tabIconSelected: '#48CAE4',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
