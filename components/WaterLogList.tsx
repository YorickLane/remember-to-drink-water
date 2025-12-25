/**
 * 饮水记录列表组件 - 增强版
 * 支持滑动删除和时间线效果
 */

import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutRight,
  Layout as ReanimatedLayout,
} from 'react-native-reanimated';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { WaterLog } from '@/types/models';
import { format } from 'date-fns';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';

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

function LogItem({ item, index, isFirst, isLast, onDelete }: LogItemProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);
  const time = format(item.timestamp, 'HH:mm');

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

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(18)}
      exiting={FadeOutRight.duration(300)}
      layout={ReanimatedLayout.springify()}
    >
      <View style={styles.timelineContainer}>
        {/* 时间线 */}
        <View style={styles.timeline}>
          {!isFirst && (
            <View style={[styles.lineTop, { backgroundColor: colors.border }]} />
          )}
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          {!isLast && (
            <View style={[styles.lineBottom, { backgroundColor: colors.border }]} />
          )}
        </View>

        {/* 记录卡片 */}
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
          onSwipeableOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          containerStyle={styles.swipeableContainer}
        >
          <View style={[styles.logItem, { backgroundColor: colors.logItemBackground }]}>
            <View style={styles.logContent}>
              <Text style={styles.dropIcon}>💧</Text>
              <View style={styles.logInfo}>
                <Text style={[styles.amount, { color: colors.text }]}>
                  {item.amount_ml} ml
                </Text>
                <Text style={[styles.time, { color: colors.textTertiary }]}>{time}</Text>
              </View>
            </View>
            <View style={[styles.swipeHint, { backgroundColor: colors.border }]} />
          </View>
        </Swipeable>
      </View>
    </Animated.View>
  );
}

export function WaterLogList({ logs, onDelete }: WaterLogListProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💧</Text>
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
        <Text style={[styles.count, { color: colors.textTertiary }]}>
          {t('home.log_list.count', { count: logs.length })}
        </Text>
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
    alignItems: 'baseline',
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
  },
  count: {
    fontSize: Layout.fontSize.footnote,
    marginLeft: Layout.spacing.sm,
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
    width: 24,
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  lineTop: {
    width: 2,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lineBottom: {
    width: 2,
    flex: 1,
  },
  swipeableContainer: {
    flex: 1,
    marginBottom: Layout.spacing.sm,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    ...Layout.shadow.sm,
  },
  logContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropIcon: {
    fontSize: 24,
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
    marginTop: Layout.spacing.xxs,
  },
  swipeHint: {
    width: 4,
    height: 20,
    borderRadius: 2,
    opacity: 0.5,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: Layout.borderRadius.md,
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: Layout.spacing.lg,
  },
  emptyText: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.medium,
    marginBottom: Layout.spacing.sm,
  },
  emptyHint: {
    fontSize: Layout.fontSize.footnote,
  },
});
