/**
 * 通知调度管理
 */

import * as Notifications from 'expo-notifications';
import { AppSettings } from '@/types/models';

// 配置通知处理方式
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * 请求通知权限
 */
export async function requestNotificationPermissions(): Promise<boolean> {
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

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '该喝水啦 💧',
        body: '记得补充水分，保持健康！',
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  }

  console.log(`Scheduled ${reminderCount} daily reminders`);
}

/**
 * 取消所有提醒
 */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * 发送立即通知（测试用）
 */
export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '测试通知 💧',
      body: '通知功能正常！',
      sound: true,
    },
    trigger: {
      seconds: 1,
    },
  });
}
