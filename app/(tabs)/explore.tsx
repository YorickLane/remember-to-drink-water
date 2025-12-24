/**
 * 设置页面
 */

import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { requestNotificationPermissions, sendTestNotification } from '@/lib/notifications';
import { TimePicker } from '@/components/TimePicker';
import { changeLanguage, getCurrentLanguageSetting } from '@/locales';
import { exportAsJson, exportAsCsv, getDataSummary } from '@/lib/dataExport';
import { importFromFile } from '@/lib/dataImport';
import * as Haptics from 'expo-haptics';

type LanguageOption = 'system' | 'en' | 'zh';

export default function SettingsScreen() {
  const { colors } = useThemeColors();
  const { t, i18n } = useTranslation();
  const { settings, loadSettings, updateSetting, loadTodayData } = useWaterStore();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>('system');
  const [dataSummary, setDataSummary] = useState<{ logs: number; days: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const initializeSettings = useCallback(async () => {
    loadSettings();
    checkPermissions();
    loadLanguageSetting();
    // 加载数据摘要
    const summary = await getDataSummary();
    setDataSummary({ logs: summary.totalLogs, days: summary.totalDays });
  }, [loadSettings]);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  const checkPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
  };

  const loadLanguageSetting = async () => {
    const lang = await getCurrentLanguageSetting();
    setCurrentLanguage(lang);
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
          t('settings.reminder.permission_required_title'),
          t('settings.reminder.permission_required_message'),
          [{ text: t('common.got_it') }]
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
      Alert.alert(t('common.error'), t('settings.reminder.permission_tip'));
      return;
    }

    try {
      await sendTestNotification();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('common.success'), t('settings.reminder.test_success'));
    } catch {
      Alert.alert(t('common.error'), t('settings.reminder.test_error'));
    }
  };

  const handleLanguageChange = async (lang: LanguageOption) => {
    await changeLanguage(lang);
    setCurrentLanguage(lang);
    await updateSetting('language', lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleExportJson = async () => {
    setIsExporting(true);
    try {
      const success = await exportAsJson();
      if (success) {
        Alert.alert(t('common.success'), t('settings.data.export_success'));
      } else {
        Alert.alert(t('common.error'), t('settings.data.export_failed'));
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const success = await exportAsCsv();
      if (success) {
        Alert.alert(t('common.success'), t('settings.data.export_success'));
      } else {
        Alert.alert(t('common.error'), t('settings.data.export_failed'));
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    const result = await importFromFile();
    if (result.success) {
      Alert.alert(t('common.success'), t('settings.data.import_success', { count: result.logsImported }));
      // 刷新数据
      loadTodayData();
      const summary = await getDataSummary();
      setDataSummary({ logs: summary.totalLogs, days: summary.totalDays });
    } else if (result.error !== 'Cancelled') {
      Alert.alert(t('common.error'), t('settings.data.import_failed', { error: result.error }));
    }
  };

  const showLanguagePicker = () => {
    const options: { label: string; value: LanguageOption }[] = [
      { label: t('settings.language.system'), value: 'system' },
      { label: t('settings.language.zh'), value: 'zh' },
      { label: t('settings.language.en'), value: 'en' },
    ];

    Alert.alert(
      t('settings.language.label'),
      undefined,
      [
        ...options.map((option) => ({
          text: option.value === currentLanguage ? `✓ ${option.label}` : option.label,
          onPress: () => handleLanguageChange(option.value),
        })),
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const getLanguageLabel = (lang: LanguageOption): string => {
    switch (lang) {
      case 'system':
        return t('settings.language.system');
      case 'zh':
        return t('settings.language.zh');
      case 'en':
        return t('settings.language.en');
    }
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
      </View>

      {/* 每日目标 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.goal.title')}</Text>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.goal.label')}</Text>
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
        <Text style={[styles.hint, { color: colors.textTertiary }]}>{t('settings.goal.hint')}</Text>
      </View>

      {/* 提醒设置 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.reminder.title')}</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.reminder.enable.label')}</Text>
            <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
              {t('settings.reminder.enable.hint')}
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
                label={t('settings.reminder.start_time')}
                value={settings.reminder_start}
                onChange={(time) => updateSetting('reminder_start', time)}
              />
              <View style={styles.timePickerSpacer} />
              <TimePicker
                label={t('settings.reminder.end_time')}
                value={settings.reminder_end}
                onChange={(time) => updateSetting('reminder_end', time)}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.reminder.interval.label')}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleIntervalChange(-30)}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>
                  {settings.reminder_interval_min} {i18n.language === 'zh' ? '分钟' : 'min'}
                </Text>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleIntervalChange(30)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.hint, { color: colors.textTertiary }]}>{t('settings.reminder.interval.hint')}</Text>

            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.success }]}
              onPress={handleTestNotification}
            >
              <Text style={styles.testButtonText}>📬 {t('settings.reminder.test_button')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 语言设置 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.language.title')}</Text>
        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.logItemBackground }]}
          onPress={showLanguagePicker}
        >
          <Text style={[styles.linkButtonText, { color: colors.text }]}>
            {t('settings.language.label')}
          </Text>
          <View style={styles.languageValue}>
            <Text style={[styles.languageValueText, { color: colors.textSecondary }]}>
              {getLanguageLabel(currentLanguage)}
            </Text>
            <Text style={[styles.linkArrow, { color: colors.textDisabled }]}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 数据管理 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.data.title')}</Text>

        {dataSummary && (
          <Text style={[styles.dataSummary, { color: colors.textSecondary }]}>
            {t('settings.data.summary', { logs: dataSummary.logs, days: dataSummary.days })}
          </Text>
        )}

        <View style={styles.dataButtonsRow}>
          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: colors.primary }]}
            onPress={handleExportJson}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.dataButtonText}>📦 {t('settings.data.export_json')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: colors.success }]}
            onPress={handleExportCsv}
            disabled={isExporting}
          >
            <Text style={styles.dataButtonText}>📊 {t('settings.data.export_csv')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.logItemBackground }]}
          onPress={handleImport}
        >
          <Text style={[styles.linkButtonText, { color: colors.text }]}>
            📥 {t('settings.data.import')}
          </Text>
          <Text style={[styles.linkArrow, { color: colors.textDisabled }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.about.title')}</Text>
        <View style={styles.aboutContainer}>
          <Text style={[styles.aboutText, { color: colors.text }]}>💧 {t('settings.about.app_name')}</Text>
          <Text style={[styles.aboutVersion, { color: colors.textTertiary }]}>{t('settings.about.version', { version: '1.0.0' })}</Text>
          <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
            {t('settings.about.description')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.logItemBackground }]}
          onPress={() => {
            router.push('/privacy' as never);
          }}
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            {t('settings.about.privacy_policy')}
          </Text>
          <Text style={[styles.linkArrow, { color: colors.textDisabled }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 提示信息 */}
      {!permissionGranted && settings.reminder_enabled && (
        <View style={[styles.warningBox, { backgroundColor: colors.warningBackground }]}>
          <Text style={[styles.warningText, { color: colors.warningText }]}>
            ⚠️ {t('settings.reminder.permission_warning')}
          </Text>
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
          <Text style={[styles.infoText, { color: colors.infoText }]}>
            💡 {t('settings.ios_simulator_hint')}
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
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageValueText: {
    fontSize: 16,
    marginRight: 8,
  },
  dataSummary: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  dataButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dataButton: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  dataButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
