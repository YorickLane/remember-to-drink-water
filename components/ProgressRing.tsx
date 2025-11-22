/**
 * 进度环形图组件
 */

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1); // 限制在 0-1 之间
  const strokeDashoffset = circumference * (1 - progress);
  const percentage = Math.round(progress * 100);

  // 根据完成度显示不同颜色
  const getColor = () => {
    if (percentage >= 100) return colors.progressComplete;
    if (percentage >= 75) return colors.progressHigh;
    if (percentage >= 50) return colors.progressMedium;
    return colors.progressLow;
  };

  return (
    <View style={styles.container}>
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
        {/* 进度圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
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
          {goal - current > 0 ? `还差 ${goal - current} ml` : '目标达成！🎉'}
        </Text>
      </View>
    </View>
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
