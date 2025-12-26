/**
 * 视觉效果系统 - Crystal Hydra 设计系统
 * 包含阴影、玻璃拟态、模糊效果等
 */

import { Platform, ViewStyle } from 'react-native';

// 阴影预设类型
type ShadowStyle = ViewStyle;

// 创建跨平台阴影
const createShadow = (
  color: string,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
): ShadowStyle => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) as ShadowStyle;
};

export const Effects = {
  // === 阴影层级 ===
  shadow: {
    none: {} as ShadowStyle,

    xs: createShadow('#0EA5E9', 1, 0.05, 2, 1),
    sm: createShadow('#0EA5E9', 2, 0.08, 4, 2),
    md: createShadow('#0EA5E9', 4, 0.1, 8, 4),
    lg: createShadow('#0EA5E9', 8, 0.12, 16, 8),
    xl: createShadow('#0EA5E9', 12, 0.15, 24, 12),

    // 彩色发光阴影
    glow: {
      primary: createShadow('#0EA5E9', 0, 0.4, 20, 8),
      accent: createShadow('#10B981', 0, 0.4, 20, 8),
      warning: createShadow('#F59E0B', 0, 0.4, 20, 8),
      error: createShadow('#EF4444', 0, 0.4, 20, 8),
    },

    // 内阴影效果 (仅供参考，RN 不原生支持)
    inner: {
      sm: {
        // 使用边框模拟
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
      } as ShadowStyle,
    },
  },

  // === 玻璃拟态效果 ===
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: 1,
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.5)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: 1,
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: 1,
    },
    dark: {
      background: 'rgba(30, 58, 95, 0.65)',
      borderColor: 'rgba(56, 189, 248, 0.2)',
      borderWidth: 1,
    },
    darkStrong: {
      background: 'rgba(30, 58, 95, 0.8)',
      borderColor: 'rgba(56, 189, 248, 0.3)',
      borderWidth: 1,
    },
  },

  // === 模糊背景层级 ===
  blur: {
    none: 0,
    light: 8,
    medium: 16,
    heavy: 24,
    ultra: 40,
  } as const,

  // === 透明度层级 ===
  opacity: {
    transparent: 0,
    faint: 0.1,
    light: 0.25,
    medium: 0.5,
    heavy: 0.75,
    opaque: 1,
  } as const,

  // === 边框效果 ===
  border: {
    none: {
      borderWidth: 0,
    } as ViewStyle,
    thin: {
      borderWidth: 0.5,
    } as ViewStyle,
    default: {
      borderWidth: 1,
    } as ViewStyle,
    medium: {
      borderWidth: 1.5,
    } as ViewStyle,
    thick: {
      borderWidth: 2,
    } as ViewStyle,
  },

  // === 渐变预设方向 ===
  gradient: {
    toRight: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
    toLeft: { start: { x: 1, y: 0.5 }, end: { x: 0, y: 0.5 } },
    toBottom: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    toTop: { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
    diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  },
} as const;

export type ShadowLevel = keyof typeof Effects.shadow;
export type GlassLevel = keyof typeof Effects.glass;
export type BlurLevel = keyof typeof Effects.blur;
export type OpacityLevel = keyof typeof Effects.opacity;
