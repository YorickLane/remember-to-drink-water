/**
 * 设置页面
 */

import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useWaterStore } from '@/store/useWaterStore';
import { requestNotificationPermissions, sendTestNotification } from '@/lib/notifications';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { settings, loadSettings, updateSetting } = useWaterStore();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
  };

  const handleGoalChange = (increment: number) => {
    if (!settings) return;
    const newGoal = Math.max(500, Math.min(5000, settings.daily_goal_ml + increment));
    updateSetting('daily_goal_ml', newGoal);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReminderToggle = async (value: boolean) => {
    if (value && !permissionGranted) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          '需要通知权限',
          '请在系统设置中允许通知权限，以便接收饮水提醒。',
          [{ text: '知道了' }]
        );
        return;
      }
      setPermissionGranted(true);
    }
    await updateSetting('reminder_enabled', value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleIntervalChange = (increment: number) => {
    if (!settings) return;
    const newInterval = Math.max(30, Math.min(240, settings.reminder_interval_min + increment));
    updateSetting('reminder_interval_min', newInterval);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTestNotification = async () => {
    if (!permissionGranted) {
      Alert.alert('提示', '请先开启提醒功能');
      return;
    }

    try {
      await sendTestNotification();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('成功', '测试通知已发送！请查看通知栏。');
    } catch (error) {
      Alert.alert('错误', '发送测试通知失败');
    }
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      {/* 每日目标 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>每日目标</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>目标水量</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleGoalChange(-100)}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{settings.daily_goal_ml} ml</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleGoalChange(100)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.hint}>范围：500ml - 5000ml</Text>
      </View>

      {/* 提醒设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>提醒设置</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>启用提醒</Text>
            <Text style={styles.settingDescription}>
              定时提醒你补充水分
            </Text>
          </View>
          <Switch
            value={settings.reminder_enabled}
            onValueChange={handleReminderToggle}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>

        {settings.reminder_enabled && (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>提醒时间段</Text>
                <Text style={styles.settingDescription}>
                  {settings.reminder_start} - {settings.reminder_end}
                </Text>
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>提醒间隔</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIntervalChange(-30)}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{settings.reminder_interval_min} 分钟</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIntervalChange(30)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.hint}>范围：30 - 240 分钟</Text>

            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Text style={styles.testButtonText}>📬 发送测试通知</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>💧 喝水提醒</Text>
          <Text style={styles.aboutVersion}>版本 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            帮助你养成健康的饮水习惯，{'\n'}
            数据仅保存在本地，安全可靠。
          </Text>
        </View>
      </View>

      {/* 提示信息 */}
      {!permissionGranted && settings.reminder_enabled && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ 通知权限未授予，请在系统设置中开启
          </Text>
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 iOS 模拟器不支持通知，请在真机上测试
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 100,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  testButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#D1ECF1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#0C5460',
    textAlign: 'center',
  },
});
