/**
 * 应用主题颜色配置
 */

export const Colors = {
  light: {
    // 基础颜色
    background: '#FFFFFF',
    secondaryBackground: '#F8F9FA',
    cardBackground: '#FFFFFF',

    // 文本颜色
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textDisabled: '#C7C7CC',

    // 主题色
    primary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',

    // 边框和分隔线
    border: '#E5E5EA',
    separator: '#C6C6C8',

    // 进度环颜色
    progressBackground: '#E0E0E0',
    progressLow: '#9E9E9E',        // < 50%
    progressMedium: '#FF9800',     // 50-75%
    progressHigh: '#2196F3',       // 75-100%
    progressComplete: '#4CAF50',   // 100%+

    // 快捷按钮
    quickButtonBackground: '#E3F2FD',
    quickButtonBorder: '#90CAF9',
    quickButtonText: '#1976D2',

    // 记录列表
    logItemBackground: '#F5F5F5',

    // Switch
    switchTrackOff: '#D1D1D6',
    switchTrackOn: '#34C759',
    switchThumb: '#FFFFFF',

    // 警告和提示
    warningBackground: '#FFF3CD',
    warningText: '#856404',
    infoBackground: '#D1ECF1',
    infoText: '#0C5460',

    // 成就徽章
    achievementUnlocked: '#FFD700',
    achievementLocked: '#E0E0E0',
  },

  dark: {
    // 基础颜色
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    cardBackground: '#1C1C1E',

    // 文本颜色
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    textDisabled: '#48484A',

    // 主题色
    primary: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',

    // 边框和分隔线
    border: '#38383A',
    separator: '#48484A',

    // 进度环颜色
    progressBackground: '#3A3A3C',
    progressLow: '#8E8E93',
    progressMedium: '#FF9F0A',
    progressHigh: '#0A84FF',
    progressComplete: '#30D158',

    // 快捷按钮
    quickButtonBackground: '#1C3A52',
    quickButtonBorder: '#2D5A7B',
    quickButtonText: '#5AC8FA',

    // 记录列表
    logItemBackground: '#2C2C2E',

    // Switch
    switchTrackOff: '#39393D',
    switchTrackOn: '#30D158',
    switchThumb: '#FFFFFF',

    // 警告和提示
    warningBackground: '#3D2F00',
    warningText: '#FFD60A',
    infoBackground: '#0A2E3D',
    infoText: '#5AC8FA',

    // 成就徽章
    achievementUnlocked: '#FFD700',
    achievementLocked: '#48484A',
  },
};

export type ColorScheme = 'light' | 'dark';
