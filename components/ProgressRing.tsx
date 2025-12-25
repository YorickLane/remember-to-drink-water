/**
 * 进度环形图组件 - 增强版
 * 支持渐变色、外发光效果、完成庆祝动画
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
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEffect, useRef } from 'react';
import { Layout } from '@/constants/Layout';

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
  strokeWidth = 22,
}: ProgressRingProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const percentage = Math.round(progress * 100);
  const prevCurrent = useRef(current);

  // 动画值
  const animatedProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // 根据完成度获取渐变色
  const getGradientColors = () => {
    if (percentage >= 100) {
      return { start: '#06D6A0', end: '#00B4D8' }; // 完成：薄荷绿到蓝
    }
    if (percentage >= 75) {
      return { start: '#48CAE4', end: '#00B4D8' }; // 高：浅蓝到蓝
    }
    if (percentage >= 50) {
      return { start: '#FFB347', end: '#48CAE4' }; // 中：琥珀到蓝
    }
    return { start: '#8BA3C7', end: '#4A6FA5' }; // 低：灰蓝
  };

  // 根据完成度显示文字颜色
  const getTextColor = () => {
    if (percentage >= 100) return colors.progressComplete;
    if (percentage >= 75) return colors.progressExcellent;
    if (percentage >= 50) return colors.progressMedium;
    return colors.progressLow;
  };

  // 更新进度时触发动画
  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 18,
      stiffness: 80,
      mass: 1,
    });

    // 只有在数值增加时才触发动画
    if (current > prevCurrent.current) {
      // 缩放脉冲动画
      scale.value = withSequence(
        withSpring(1.08, { damping: 12, stiffness: 300 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );

      // 外发光动画
      glowOpacity.value = withSequence(
        withTiming(0.6, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
      );
    }

    // 完成目标时的庆祝效果
    if (percentage >= 100 && prevCurrent.current < goal) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 400 }),
        withSpring(0.95, { damping: 10, stiffness: 300 }),
        withSpring(1.05, { damping: 12, stiffness: 250 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }

    prevCurrent.current = current;
  }, [current, goal, progress, percentage, animatedProgress, scale, glowOpacity]);

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

  const gradientColors = getGradientColors();

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* 外发光效果 */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 40,
            height: size + 40,
            borderRadius: (size + 40) / 2,
            backgroundColor: colors.primary,
          },
          glowStyle,
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
          {percentage}%
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
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: Layout.fontSize.display,
    fontWeight: Layout.fontWeight.bold,
    letterSpacing: -1,
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
