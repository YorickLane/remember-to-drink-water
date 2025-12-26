/**
 * 饮水记录列表组件 - Crystal Hydra 设计系统
 * 玻璃拟态卡片、渐变色时间线、SVG 图标
 */

import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutRight,
  Layout as ReanimatedLayout,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { WaterLog } from '@/types/models';
import { format } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';
import * as Haptics from 'expo-haptics';
import { useRef, useEffect } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WaterLogListProps {
  logs: WaterLog[];
  onDelete: (id: string) => Promise<void>;
}

interface LogItemProps {
  item: WaterLog;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => Promise<void>;
}

// 水滴图标组件
function WaterDropIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="logDropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        fill="url(#logDropGradient)"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14a4 4 0 0 0 4 4"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 空状态水滴图标
function EmptyWaterDropIcon({ color }: { color: string }) {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14a4 4 0 0 0 4 4"
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function LogItem({ item, index, isFirst, isLast, onDelete }: LogItemProps) {
  const { colors, isDark } = useThemeColors();
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);
  const time = format(item.timestamp, 'HH:mm');

  // 最新记录的脉冲动画
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isFirst) {
      pulseScale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleDelete = () => {
    Alert.alert(
      t('home.log_list.delete_title'),
      t('home.log_list.delete_message', { amount: item.amount_ml }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await onDelete(item.id);
          },
        },
      ]
    );
  };

  const renderRightActions = () => (
    <Pressable
      style={[styles.deleteAction, { backgroundColor: colors.deleteBackground }]}
      onPress={handleDelete}
    >
      <Text style={[styles.deleteActionText, { color: colors.deleteText }]}>
        {t('common.delete')}
      </Text>
    </Pressable>
  );

  // 玻璃效果背景
  const glassBackground = isDark
    ? 'rgba(30, 58, 95, 0.6)'
    : 'rgba(255, 255, 255, 0.7)';

  const glassBorder = isDark
    ? 'rgba(56, 189, 248, 0.15)'
    : 'rgba(255, 255, 255, 0.5)';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(18)}
      exiting={FadeOutRight.duration(300)}
      layout={ReanimatedLayout.springify()}
    >
      <View style={styles.timelineContainer}>
        {/* 时间线 */}
        <View style={styles.timeline}>
          {!isFirst && (
            <View
              style={[
                styles.lineTop,
                {
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(14, 165, 233, 0.25)',
                },
              ]}
            />
          )}
          {/* 时间点 */}
          <View style={styles.dotContainer}>
            {isFirst && (
              <Animated.View
                style={[
                  styles.dotPulse,
                  { backgroundColor: colors.primary },
                  pulseStyle,
                ]}
              />
            )}
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isFirst ? colors.primary : colors.primaryLight,
                  borderColor: isFirst ? colors.primary : 'transparent',
                  borderWidth: isFirst ? 2 : 0,
                },
              ]}
            />
          </View>
          {!isLast && (
            <View
              style={[
                styles.lineBottom,
                {
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(14, 165, 233, 0.25)',
                },
              ]}
            />
          )}
        </View>

        {/* 记录卡片 */}
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
          onSwipeableOpen={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
          containerStyle={styles.swipeableContainer}
        >
          <View
            style={[
              styles.logItem,
              {
                backgroundColor: glassBackground,
                borderColor: glassBorder,
              },
            ]}
          >
            <View style={styles.logContent}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isDark
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'rgba(14, 165, 233, 0.1)',
                  },
                ]}
              >
                <WaterDropIcon color={colors.primary} size={20} />
              </View>
              <View style={styles.logInfo}>
                <Text style={[styles.amount, { color: colors.text }]}>
                  {item.amount_ml} ml
                </Text>
                <Text style={[styles.time, { color: colors.textTertiary }]}>
                  {time}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.swipeHint,
                {
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(14, 165, 233, 0.2)',
                },
              ]}
            />
          </View>
        </Swipeable>
      </View>
    </Animated.View>
  );
}

export function WaterLogList({ logs, onDelete }: WaterLogListProps) {
  const { colors, isDark } = useThemeColors();
  const { t } = useTranslation();

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyWaterDropIcon color={colors.primary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('home.log_list.empty_title')}
        </Text>
        <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
          {t('home.log_list.empty_hint')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('home.log_list.title')}
        </Text>
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isDark
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(14, 165, 233, 0.1)',
            },
          ]}
        >
          <Text style={[styles.count, { color: colors.primary }]}>
            {logs.length}
          </Text>
        </View>
      </View>
      <Text style={[styles.swipeHintText, { color: colors.textTertiary }]}>
        {t('home.log_list.swipe_hint')}
      </Text>
      <GestureHandlerRootView style={styles.logsList}>
        {logs.map((log, index) => (
          <LogItem
            key={log.id}
            item={log}
            index={index}
            isFirst={index === 0}
            isLast={index === logs.length - 1}
            onDelete={onDelete}
          />
        ))}
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.padding.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
  },
  countBadge: {
    marginLeft: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xxs,
    borderRadius: Layout.borderRadius.full,
  },
  count: {
    fontSize: Layout.fontSize.caption,
    fontWeight: Layout.fontWeight.semibold,
  },
  swipeHintText: {
    fontSize: Layout.fontSize.caption,
    marginBottom: Layout.spacing.md,
  },
  logsList: {
    gap: 0,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timeline: {
    width: 28,
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  lineTop: {
    width: 2,
    flex: 1,
    borderRadius: 1,
  },
  dotContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotPulse: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.3,
  },
  lineBottom: {
    width: 2,
    flex: 1,
    borderRadius: 1,
  },
  swipeableContainer: {
    flex: 1,
    marginBottom: Layout.spacing.sm,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    ...Layout.shadow.sm,
  },
  logContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  logInfo: {
    flex: 1,
  },
  amount: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
  },
  time: {
    fontSize: Layout.fontSize.caption,
    marginTop: 2,
  },
  swipeHint: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: Layout.borderRadius.lg,
    marginLeft: Layout.spacing.sm,
  },
  deleteActionText: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
  },
  emptyText: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.medium,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptyHint: {
    fontSize: Layout.fontSize.footnote,
  },
});
