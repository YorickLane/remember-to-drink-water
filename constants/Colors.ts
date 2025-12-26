/**
 * 应用主题颜色配置 - Crystal Hydra 配色方案
 * 设计理念：极简 + 玻璃拟态融合，清透现代的视觉体验
 */

export const Colors = {
  light: {
    // === 主色调 - Crystal Blue 渐变 ===
    primary: '#0EA5E9',           // Sky Blue 500
    primaryLight: '#7DD3FC',       // Sky Blue 300
    primaryDark: '#0369A1',        // Sky Blue 700
    primaryGradientStart: '#0EA5E9',
    primaryGradientEnd: '#06B6D4',  // Cyan 500

    // === 辅助色 - 功能差异化 ===
    accent: '#10B981',             // Emerald 500 (薄荷绿 - 成功/完成)
    accentLight: '#A7F3D0',        // Emerald 200
    coral: '#EF4444',              // Red 500 (错误/删除)
    amber: '#F59E0B',              // Amber 500 (警告/进行中)
    purple: '#8B5CF6',             // Violet 500 (自定义)

    // === 背景色 - 分层玻璃拟态 ===
    background: '#F0F9FF',         // Sky 50 - 浅蓝白底
    secondaryBackground: '#E0F2FE', // Sky 100 - 次级背景
    cardBackground: 'rgba(255, 255, 255, 0.85)', // 玻璃卡片表面
    cardElevated: 'rgba(255, 255, 255, 0.92)',   // 提升的玻璃卡片
    surface: 'rgba(255, 255, 255, 0.7)',         // 通用玻璃表面
    overlay: 'rgba(0, 0, 0, 0.4)',               // 遮罩层

    // === 文本颜色 - 高可读性 ===
    text: '#0C4A6E',               // Sky 900
    textSecondary: '#0369A1',      // Sky 700
    textTertiary: '#7DD3FC',       // Sky 300
    textDisabled: '#BAE6FD',       // Sky 200
    textOnPrimary: '#FFFFFF',

    // === 边框和分隔线 ===
    border: 'rgba(14, 165, 233, 0.15)',
    borderStrong: 'rgba(14, 165, 233, 0.25)',
    separator: 'rgba(14, 165, 233, 0.08)',

    // === 进度环颜色 - 渐变层次 ===
    progressBackground: 'rgba(14, 165, 233, 0.12)',
    progressLow: '#94A3B8',        // Slate 400
    progressMedium: '#F59E0B',     // Amber 500
    progressHigh: '#0EA5E9',       // Sky 500
    progressExcellent: '#38BDF8',  // Sky 400
    progressComplete: '#10B981',   // Emerald 500

    // === 快捷按钮 - 差异化配色 ===
    quickButton: {
      small: {
        bg: 'rgba(14, 165, 233, 0.08)',
        border: 'rgba(14, 165, 233, 0.2)',
        text: '#0369A1',
        icon: '#0EA5E9',
      },
      medium: {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.2)',
        text: '#047857',
        icon: '#10B981',
      },
      large: {
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'rgba(245, 158, 11, 0.2)',
        text: '#B45309',
        icon: '#F59E0B',
      },
      custom: {
        bg: 'rgba(139, 92, 246, 0.08)',
        border: 'rgba(139, 92, 246, 0.2)',
        text: '#6D28D9',
        icon: '#8B5CF6',
      },
    },

    // === 兼容旧版 - 单色快捷按钮 ===
    quickButtonBackground: 'rgba(14, 165, 233, 0.08)',
    quickButtonBorder: 'rgba(14, 165, 233, 0.2)',
    quickButtonText: '#0369A1',

    // === 记录列表 ===
    logItemBackground: 'rgba(255, 255, 255, 0.6)',

    // === Switch ===
    switchTrackOff: 'rgba(14, 165, 233, 0.15)',
    switchTrackOn: '#10B981',
    switchThumb: '#FFFFFF',

    // === 状态色 ===
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    // === 警告和提示 ===
    warningBackground: 'rgba(245, 158, 11, 0.1)',
    warningText: '#B45309',
    infoBackground: 'rgba(14, 165, 233, 0.1)',
    infoText: '#0369A1',

    // === 成就徽章 ===
    achievementUnlocked: '#F59E0B',
    achievementSilver: '#94A3B8',
    achievementBronze: '#D97706',
    achievementLocked: 'rgba(14, 165, 233, 0.1)',

    // === 阴影色 ===
    shadow: 'rgba(14, 165, 233, 0.08)',
    shadowMedium: 'rgba(14, 165, 233, 0.12)',
    shadowStrong: 'rgba(14, 165, 233, 0.18)',

    // === 删除操作 ===
    deleteBackground: 'rgba(239, 68, 68, 0.1)',
    deleteText: '#EF4444',

    // === 玻璃拟态 ===
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      backgroundStrong: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(255, 255, 255, 0.5)',
      borderSubtle: 'rgba(14, 165, 233, 0.1)',
    },

    // === Tab 栏 ===
    tabIconDefault: '#7DD3FC',
    tabIconSelected: '#0EA5E9',
    tabBackground: 'rgba(255, 255, 255, 0.8)',
  },

  dark: {
    // === 主色调 ===
    primary: '#38BDF8',            // Sky 400
    primaryLight: '#0EA5E9',       // Sky 500
    primaryDark: '#7DD3FC',        // Sky 300
    primaryGradientStart: '#38BDF8',
    primaryGradientEnd: '#22D3EE', // Cyan 400

    // === 辅助色 ===
    accent: '#34D399',             // Emerald 400
    accentLight: '#10B981',        // Emerald 500
    coral: '#F87171',              // Red 400
    amber: '#FBBF24',              // Amber 400
    purple: '#A78BFA',             // Violet 400

    // === 背景色 ===
    background: '#0C1929',         // 深蓝黑
    secondaryBackground: '#132337', // 次级深蓝
    cardBackground: 'rgba(30, 58, 95, 0.75)', // 玻璃卡片
    cardElevated: 'rgba(30, 58, 95, 0.88)',   // 提升的玻璃卡片
    surface: 'rgba(30, 58, 95, 0.65)',        // 通用玻璃表面
    overlay: 'rgba(0, 0, 0, 0.6)',

    // === 文本颜色 ===
    text: '#F0F9FF',               // Sky 50
    textSecondary: '#BAE6FD',      // Sky 200
    textTertiary: '#7DD3FC',       // Sky 300
    textDisabled: '#38BDF8',       // Sky 400
    textOnPrimary: '#0C1929',

    // === 边框和分隔线 ===
    border: 'rgba(56, 189, 248, 0.2)',
    borderStrong: 'rgba(56, 189, 248, 0.35)',
    separator: 'rgba(56, 189, 248, 0.1)',

    // === 进度环颜色 ===
    progressBackground: 'rgba(56, 189, 248, 0.15)',
    progressLow: '#64748B',        // Slate 500
    progressMedium: '#FBBF24',     // Amber 400
    progressHigh: '#38BDF8',       // Sky 400
    progressExcellent: '#7DD3FC',  // Sky 300
    progressComplete: '#34D399',   // Emerald 400

    // === 快捷按钮 ===
    quickButton: {
      small: {
        bg: 'rgba(56, 189, 248, 0.12)',
        border: 'rgba(56, 189, 248, 0.25)',
        text: '#7DD3FC',
        icon: '#38BDF8',
      },
      medium: {
        bg: 'rgba(52, 211, 153, 0.12)',
        border: 'rgba(52, 211, 153, 0.25)',
        text: '#6EE7B7',
        icon: '#34D399',
      },
      large: {
        bg: 'rgba(251, 191, 36, 0.12)',
        border: 'rgba(251, 191, 36, 0.25)',
        text: '#FCD34D',
        icon: '#FBBF24',
      },
      custom: {
        bg: 'rgba(167, 139, 250, 0.12)',
        border: 'rgba(167, 139, 250, 0.25)',
        text: '#C4B5FD',
        icon: '#A78BFA',
      },
    },

    // === 兼容旧版 ===
    quickButtonBackground: 'rgba(56, 189, 248, 0.12)',
    quickButtonBorder: 'rgba(56, 189, 248, 0.25)',
    quickButtonText: '#7DD3FC',

    // === 记录列表 ===
    logItemBackground: 'rgba(30, 58, 95, 0.6)',

    // === Switch ===
    switchTrackOff: 'rgba(56, 189, 248, 0.2)',
    switchTrackOn: '#34D399',
    switchThumb: '#FFFFFF',

    // === 状态色 ===
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',

    // === 警告和提示 ===
    warningBackground: 'rgba(251, 191, 36, 0.15)',
    warningText: '#FCD34D',
    infoBackground: 'rgba(56, 189, 248, 0.15)',
    infoText: '#7DD3FC',

    // === 成就徽章 ===
    achievementUnlocked: '#FBBF24',
    achievementSilver: '#94A3B8',
    achievementBronze: '#F59E0B',
    achievementLocked: 'rgba(56, 189, 248, 0.15)',

    // === 阴影色 ===
    shadow: 'rgba(0, 0, 0, 0.35)',
    shadowMedium: 'rgba(0, 0, 0, 0.45)',
    shadowStrong: 'rgba(0, 0, 0, 0.55)',

    // === 删除操作 ===
    deleteBackground: 'rgba(248, 113, 113, 0.15)',
    deleteText: '#F87171',

    // === 玻璃拟态 ===
    glass: {
      background: 'rgba(30, 58, 95, 0.65)',
      backgroundStrong: 'rgba(30, 58, 95, 0.8)',
      border: 'rgba(56, 189, 248, 0.2)',
      borderSubtle: 'rgba(56, 189, 248, 0.1)',
    },

    // === Tab 栏 ===
    tabIconDefault: '#7DD3FC',
    tabIconSelected: '#38BDF8',
    tabBackground: 'rgba(12, 25, 41, 0.9)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
