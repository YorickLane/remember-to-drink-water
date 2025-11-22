/**
 * 通知调度管理
 * Web 平台禁用通知功能（浏览器通知需要额外实现）
 */

import { Platform } from 'react-native';
import { AppSettings } from '@/types/models';

// 条件导入：仅在非 Web 平台导入 expo-notifications
let Notifications: typeof import('expo-notifications') | null = null;

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
}

// 扩展 Expo Notifications 类型定义
type CalendarTriggerInput = {
  type: any;
  hour: number;
  minute: number;
  repeats: boolean;
};

type TimeIntervalTriggerInput = {
  type: any;
  seconds: number;
  repeats?: boolean;
};

// 配置通知处理方式（仅移动端）
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Web 平台暂不支持
  if (Platform.OS === 'web') {
    return false;
  }

  if (!Notifications) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * 调度提醒通知
 */
export async function scheduleReminders(settings: AppSettings): Promise<void> {
  // Web 平台暂不支持
  if (Platform.OS === 'web' || !Notifications) {
    return;
  }

  if (!settings.reminder_enabled) {
    await cancelAllReminders();
    return;
  }

  // 取消所有现有通知
  await cancelAllReminders();

  // 解析开始和结束时间
  const [startHour, startMinute] = settings.reminder_start.split(':').map(Number);
  const [endHour, endMinute] = settings.reminder_end.split(':').map(Number);

  // 计算一天内的提醒次数
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const totalMinutes = endMinutes - startMinutes;
  const reminderCount = Math.floor(totalMinutes / settings.reminder_interval_min);

  // 调度每个提醒
  for (let i = 0; i < reminderCount; i++) {
    const reminderMinutes = startMinutes + i * settings.reminder_interval_min;
    const hour = Math.floor(reminderMinutes / 60);
    const minute = reminderMinutes % 60;

    // 使用 CalendarTriggerInput 确保只在指定时间触发，不会立即弹出
    const trigger: CalendarTriggerInput = {
      type: Notifications!.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    };

    await Notifications!.scheduleNotificationAsync({
      content: {
        title: '该喝水啦 💧',
        body: '记得补充水分，保持健康！',
        sound: true,
      },
      trigger,
    });
  }

  if (__DEV__) {
    console.log(`Scheduled ${reminderCount} daily reminders from ${settings.reminder_start} to ${settings.reminder_end}`);
  }
}

/**
 * 取消所有提醒
 */
export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * 发送立即通知（测试用）
 */
export async function sendTestNotification(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) {
    // Web 平台使用浏览器通知（可选）
    if (Platform.OS === 'web' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('测试通知 💧', {
          body: '通知功能正常！',
          icon: '/favicon.png',
        });
      }
    }
    return;
  }

  const trigger: TimeIntervalTriggerInput = {
    type: Notifications!.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 1,
  };

  await Notifications!.scheduleNotificationAsync({
    content: {
      title: '测试通知 💧',
      body: '通知功能正常！',
      sound: true,
    },
    trigger,
  });
}
