/**
 * 进度环形图组件
 */

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEffect } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface ProgressRingProps {
  current: number;      // 当前值（毫升）
  goal: number;         // 目标值（毫升）
  size?: number;        // 环形图尺寸
  strokeWidth?: number; // 线条宽度
}

export function ProgressRing({
  current,
  goal,
  size = 200,
  strokeWidth = 20,
}: ProgressRingProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const percentage = Math.round(progress * 100);

  // 动画值
  const animatedProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  // 更新进度时触发动画
  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });

    // 添加时的缩放动画
    if (current > 0) {
      scale.value = withSpring(1.1, {
        damping: 10,
        stiffness: 200,
      });
      setTimeout(() => {
        scale.value = withSpring(1, {
          damping: 10,
          stiffness: 200,
        });
      }, 200);
    }
  }, [current, goal]);

  // 根据完成度显示不同颜色
  const getColor = () => {
    if (percentage >= 100) return colors.progressComplete;
    if (percentage >= 75) return colors.progressHigh;
    if (percentage >= 50) return colors.progressMedium;
    return colors.progressLow;
  };

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

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Svg width={size} height={size}>
        {/* 背景圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.progressBackground}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 进度圆环 - 带动画 */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
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
        <Text style={[styles.percentage, { color: getColor() }]}>
          {percentage}%
        </Text>
        <Text style={[styles.amount, { color: colors.textSecondary }]}>
          {current} / {goal} ml
        </Text>
        <Text style={[styles.remaining, { color: colors.textTertiary }]}>
          {goal - current > 0
            ? t('home.progress.remaining', { amount: goal - current })
            : `${t('home.progress.completed')} 🎉`}
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
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    marginTop: 4,
  },
  remaining: {
    fontSize: 14,
    marginTop: 2,
  },
});
