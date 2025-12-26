/**
 * 动画系统 - Crystal Hydra 设计系统
 * 包含时长、缓动、Spring 配置等预设
 */

import { Easing } from 'react-native-reanimated';

export const Animations = {
  // === 动画时长 ===
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
    slowest: 800,
  } as const,

  // === 缓动函数 ===
  easing: {
    // 标准缓动 - 通用
    standard: Easing.bezier(0.4, 0, 0.2, 1),
    // 减速 - 元素进入
    decelerate: Easing.bezier(0, 0, 0.2, 1),
    // 加速 - 元素离开
    accelerate: Easing.bezier(0.4, 0, 1, 1),
    // 弹性
    bounce: Easing.bezier(0.34, 1.56, 0.64, 1),
    // 平滑
    smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
    // 线性
    linear: Easing.linear,
    // 缓入
    easeIn: Easing.in(Easing.ease),
    // 缓出
    easeOut: Easing.out(Easing.ease),
    // 缓入缓出
    easeInOut: Easing.inOut(Easing.ease),
  },

  // === Spring 配置预设 ===
  spring: {
    // 快速响应 - 按钮点击、微交互
    snappy: {
      damping: 15,
      stiffness: 400,
      mass: 0.8,
    },
    // 默认 - 通用动画
    default: {
      damping: 18,
      stiffness: 180,
      mass: 1,
    },
    // 柔和 - 页面过渡、大元素
    gentle: {
      damping: 20,
      stiffness: 120,
      mass: 1,
    },
    // 弹跳 - 庆祝效果、强调
    bouncy: {
      damping: 10,
      stiffness: 200,
      mass: 1,
    },
    // 精确 - 进度条、精确动画
    precise: {
      damping: 25,
      stiffness: 300,
      mass: 1,
    },
    // 慢速弹性 - 卡片展开
    slow: {
      damping: 22,
      stiffness: 80,
      mass: 1.2,
    },
  } as const,

  // === 预设动画参数 ===
  presets: {
    // 淡入
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 250,
    },
    // 淡出
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
      duration: 200,
    },
    // 缩放淡入
    scaleIn: {
      from: { opacity: 0, scale: 0.9 },
      to: { opacity: 1, scale: 1 },
      duration: 250,
    },
    // 从下方滑入
    slideUp: {
      from: { opacity: 0, translateY: 20 },
      to: { opacity: 1, translateY: 0 },
      duration: 300,
    },
    // 从上方滑入
    slideDown: {
      from: { opacity: 0, translateY: -20 },
      to: { opacity: 1, translateY: 0 },
      duration: 300,
    },
    // 脉冲效果
    pulse: {
      scales: [1, 1.05, 1],
      duration: 400,
    },
    // 心跳效果
    heartbeat: {
      scales: [1, 1.1, 1, 1.1, 1],
      duration: 600,
    },
    // 成功庆祝
    celebrate: {
      scales: [1, 1.15, 0.95, 1.05, 1],
      duration: 600,
    },
    // 摇动效果
    shake: {
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 400,
    },
    // 按下效果
    press: {
      scale: 0.96,
      duration: 100,
    },
    // 涟漪扩散
    ripple: {
      scales: [0, 1.5],
      opacities: [0.5, 0],
      duration: 400,
    },
  },

  // === 延迟预设 ===
  delay: {
    none: 0,
    short: 50,
    medium: 100,
    long: 200,
    longer: 300,
  } as const,

  // === 交错动画间隔 ===
  stagger: {
    fast: 30,
    normal: 50,
    slow: 80,
  } as const,
} as const;

export type Duration = keyof typeof Animations.duration;
export type SpringPreset = keyof typeof Animations.spring;
export type AnimationPreset = keyof typeof Animations.presets;
