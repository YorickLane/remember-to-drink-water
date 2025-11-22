/**
 * 设置页面
 */

import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { requestNotificationPermissions, sendTestNotification } from '@/lib/notifications';
import { TimePicker } from '@/components/TimePicker';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors } = useThemeColors();
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
        <Text style={{ color: colors.text }}>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>设置</Text>
      </View>

      {/* 每日目标 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>每日目标</Text>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>目标水量</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.primary }]}
              onPress={() => handleGoalChange(-100)}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: colors.text }]}>{settings.daily_goal_ml} ml</Text>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.primary }]}
              onPress={() => handleGoalChange(100)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>范围：500ml - 5000ml</Text>
      </View>

      {/* 提醒设置 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>提醒设置</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>启用提醒</Text>
            <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
              定时提醒你补充水分
            </Text>
          </View>
          <Switch
            value={settings.reminder_enabled}
            onValueChange={handleReminderToggle}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
          />
        </View>

        {settings.reminder_enabled && (
          <>
            <View style={styles.timePickerSection}>
              <TimePicker
                label="开始时间"
                value={settings.reminder_start}
                onChange={(time) => updateSetting('reminder_start', time)}
              />
              <View style={styles.timePickerSpacer} />
              <TimePicker
                label="结束时间"
                value={settings.reminder_end}
                onChange={(time) => updateSetting('reminder_end', time)}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>提醒间隔</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleIntervalChange(-30)}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{settings.reminder_interval_min} 分钟</Text>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleIntervalChange(30)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.hint, { color: colors.textTertiary }]}>范围：30 - 240 分钟</Text>

            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.success }]}
              onPress={handleTestNotification}
            >
              <Text style={styles.testButtonText}>📬 发送测试通知</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 关于 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>关于</Text>
        <View style={styles.aboutContainer}>
          <Text style={[styles.aboutText, { color: colors.text }]}>💧 喝水提醒</Text>
          <Text style={[styles.aboutVersion, { color: colors.textTertiary }]}>版本 1.0.0</Text>
          <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
            帮助你养成健康的饮水习惯，{'\n'}
            数据仅保存在本地，安全可靠。
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.logItemBackground }]}
          onPress={() => {
            // 导航到隐私政策页面
            require('expo-router').router.push('/privacy');
          }}
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            隐私政策
          </Text>
          <Text style={[styles.linkArrow, { color: colors.textDisabled }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 提示信息 */}
      {!permissionGranted && settings.reminder_enabled && (
        <View style={[styles.warningBox, { backgroundColor: colors.warningBackground }]}>
          <Text style={[styles.warningText, { color: colors.warningText }]}>
            ⚠️ 通知权限未授予，请在系统设置中开启
          </Text>
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
          <Text style={[styles.infoText, { color: colors.infoText }]}>
            💡 iOS 模拟器不支持通知，请在真机上测试
          </Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
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
    minWidth: 100,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  testButton: {
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
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  warningBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  timePickerSection: {
    marginTop: 8,
    gap: 12,
  },
  timePickerSpacer: {
    height: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  linkArrow: {
    fontSize: 20,
  },
});
