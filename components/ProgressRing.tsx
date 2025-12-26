/**
 * 进度环形图组件 - Crystal Hydra 设计系统
 * 支持渐变色、外发光效果、完成庆祝动画、数字跳动
 */

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@/constants/Layout';
import { Animations } from '@/constants/Animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  current,
  goal,
  size = Layout.component.progressRingSize,
  strokeWidth = 24,
}: ProgressRingProps) {
  const { colors, isDark } = useThemeColors();
  const { t } = useTranslation();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const percentage = Math.round(progress * 100);
  const prevCurrent = useRef(current);

  // 动画显示的数字
  const [displayPercentage, setDisplayPercentage] = useState(percentage);

  // 动画值
  const animatedProgress = useSharedValue(0);
  const animatedPercentage = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const innerGlowOpacity = useSharedValue(0);

  // Crystal Hydra 渐变色配置
  const getGradientColors = () => {
    if (percentage >= 100) {
      // 完成：薄荷绿渐变
      return { start: '#34D399', end: '#10B981' };
    }
    if (percentage >= 75) {
      // 高：天蓝到青蓝
      return { start: '#38BDF8', end: '#0EA5E9' };
    }
    if (percentage >= 50) {
      // 中：琥珀到天蓝
      return { start: '#FBBF24', end: '#38BDF8' };
    }
    if (percentage >= 25) {
      // 低中：淡蓝灰到天蓝
      return { start: '#7DD3FC', end: '#38BDF8' };
    }
    // 低：灰蓝
    return { start: '#94A3B8', end: '#64748B' };
  };

  // 文字颜色
  const getTextColor = () => {
    if (percentage >= 100) return colors.progressComplete;
    if (percentage >= 75) return colors.progressExcellent;
    if (percentage >= 50) return colors.progressHigh;
    if (percentage >= 25) return colors.progressMedium;
    return colors.progressLow;
  };

  // 更新显示百分比
  const updateDisplayPercentage = (value: number) => {
    setDisplayPercentage(Math.round(value));
  };

  // 更新进度时触发动画
  useEffect(() => {
    // 进度动画
    animatedProgress.value = withSpring(progress, Animations.spring.default);

    // 百分比数字动画
    animatedPercentage.value = withTiming(
      percentage,
      { duration: 600, easing: Easing.out(Easing.cubic) },
      () => {
        runOnJS(updateDisplayPercentage)(percentage);
      }
    );

    // 只有在数值增加时才触发动画
    if (current > prevCurrent.current) {
      // 缩放脉冲动画
      scale.value = withSequence(
        withSpring(1.06, Animations.spring.snappy),
        withSpring(1, Animations.spring.default)
      );

      // 外发光动画
      glowOpacity.value = withSequence(
        withTiming(0.7, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) })
      );

      // 内发光动画
      innerGlowOpacity.value = withSequence(
        withTiming(0.4, { duration: 150 }),
        withTiming(0.15, { duration: 400 })
      );
    }

    // 完成目标时的庆祝效果
    if (percentage >= 100 && prevCurrent.current < goal) {
      scale.value = withSequence(
        withSpring(1.12, Animations.spring.bouncy),
        withSpring(0.94, Animations.spring.snappy),
        withSpring(1.06, Animations.spring.default),
        withSpring(1, Animations.spring.gentle)
      );

      // 持续发光
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.3, { duration: 800 })
      );
    }

    prevCurrent.current = current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, goal, progress, percentage]);

  // 动画进度圆环属性
  const animatedProps = useAnimatedProps(() => {
    const animatedStrokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset: animatedStrokeDashoffset,
    };
  });

  // 容器缩放动画
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 外发光动画样式
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // 内发光动画样式
  const innerGlowStyle = useAnimatedStyle(() => ({
    opacity: innerGlowOpacity.value,
  }));

  const gradientColors = getGradientColors();

  // 玻璃效果背景
  const glassBackground = isDark
    ? 'rgba(30, 58, 95, 0.4)'
    : 'rgba(255, 255, 255, 0.5)';

  const glassBorder = isDark
    ? 'rgba(56, 189, 248, 0.15)'
    : 'rgba(255, 255, 255, 0.6)';

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* 外发光效果 */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 48,
            height: size + 48,
            borderRadius: (size + 48) / 2,
            backgroundColor: percentage >= 100 ? colors.accent : colors.primary,
          },
          glowStyle,
        ]}
      />

      {/* 玻璃效果背景圈 */}
      <View
        style={[
          styles.glassBackground,
          {
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
            backgroundColor: glassBackground,
            borderColor: glassBorder,
          },
        ]}
      />

      {/* 内发光效果 */}
      <Animated.View
        style={[
          styles.innerGlow,
          {
            width: size - strokeWidth * 2,
            height: size - strokeWidth * 2,
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor: percentage >= 100 ? colors.accent : colors.primary,
          },
          innerGlowStyle,
        ]}
      />

      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
        </Defs>

        {/* 背景圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.progressBackground}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* 进度圆环 - 带渐变 */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* 中心文本 */}
      <View style={styles.textContainer}>
        <Text style={[styles.percentage, { color: getTextColor() }]}>
          {displayPercentage}%
        </Text>
        <Text style={[styles.amount, { color: colors.textSecondary }]}>
          {current} / {goal} ml
        </Text>
        <Text style={[styles.remaining, { color: colors.textTertiary }]}>
          {goal - current > 0
            ? t('home.progress.remaining', { amount: goal - current })
            : `${t('home.progress.completed')} `}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
  },
  glassBackground: {
    position: 'absolute',
    borderWidth: 1,
  },
  innerGlow: {
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  amount: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.medium,
    marginTop: Layout.spacing.xs,
  },
  remaining: {
    fontSize: Layout.fontSize.footnote,
    marginTop: Layout.spacing.xxs,
  },
});
