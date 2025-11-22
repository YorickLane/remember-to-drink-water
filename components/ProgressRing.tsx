/**
 * 进度环形图组件
 */

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1); // 限制在 0-1 之间
  const strokeDashoffset = circumference * (1 - progress);
  const percentage = Math.round(progress * 100);

  // 根据完成度显示不同颜色
  const getColor = () => {
    if (percentage >= 100) return '#4CAF50'; // 绿色 - 已完成
    if (percentage >= 75) return '#2196F3';  // 蓝色 - 接近完成
    if (percentage >= 50) return '#FF9800';  // 橙色 - 进行中
    return '#9E9E9E';                         // 灰色 - 刚开始
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 背景圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
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
        <Text style={styles.amount}>
          {current} / {goal} ml
        </Text>
        <Text style={styles.remaining}>
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
    color: '#666',
    marginTop: 4,
  },
  remaining: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});
