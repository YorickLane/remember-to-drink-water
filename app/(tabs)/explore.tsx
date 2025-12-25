/**
 * 设置页面
 * 增强版：优化视觉效果、卡片布局、交互体验
 */

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { requestNotificationPermissions, sendTestNotification } from '@/lib/notifications';
import { TimePicker } from '@/components/TimePicker';
import { Card } from '@/components/Card';
import { Layout } from '@/constants/Layout';
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
      Alert.alert(
        t('common.success'),
        t('settings.data.import_success', { count: result.logsImported })
      );
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

    Alert.alert(t('settings.language.label'), undefined, [
      ...options.map((option) => ({
        text: option.value === currentLanguage ? `✓ ${option.label}` : option.label,
        onPress: () => handleLanguageChange(option.value),
      })),
      { text: t('common.cancel'), style: 'cancel' },
    ]);
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('settings.title')}
          </Text>
        </View>

        {/* 每日目标 */}
        <Card variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.goal.title')}
          </Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('settings.goal.label')}
            </Text>
            <View style={styles.counterContainer}>
              <Pressable
                style={[styles.counterButton, { backgroundColor: colors.primary }]}
                onPress={() => handleGoalChange(-100)}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </Pressable>
              <Text style={[styles.counterValue, { color: colors.text }]}>
                {settings.daily_goal_ml} ml
              </Text>
              <Pressable
                style={[styles.counterButton, { backgroundColor: colors.primary }]}
                onPress={() => handleGoalChange(100)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            {t('settings.goal.hint')}
          </Text>
        </Card>

        {/* 提醒设置 */}
        <Card variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.reminder.title')}
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.reminder.enable.label')}
              </Text>
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
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('settings.reminder.interval.label')}
                </Text>
                <View style={styles.counterContainer}>
                  <Pressable
                    style={[styles.counterButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleIntervalChange(-30)}
                  >
                    <Text style={styles.counterButtonText}>−</Text>
                  </Pressable>
                  <Text style={[styles.counterValue, { color: colors.text }]}>
                    {settings.reminder_interval_min} {i18n.language === 'zh' ? '分钟' : 'min'}
                  </Text>
                  <Pressable
                    style={[styles.counterButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleIntervalChange(30)}
                  >
                    <Text style={styles.counterButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={[styles.hint, { color: colors.textTertiary }]}>
                {t('settings.reminder.interval.hint')}
              </Text>

              <Pressable
                style={[styles.testButton, { backgroundColor: colors.accent }]}
                onPress={handleTestNotification}
              >
                <Text style={styles.testButtonText}>
                  {t('settings.reminder.test_button')}
                </Text>
              </Pressable>
            </>
          )}
        </Card>

        {/* 通用设置 */}
        <Card variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.language.title')}
          </Text>
          <Pressable
            style={[styles.listItem, { backgroundColor: colors.logItemBackground }]}
            onPress={showLanguagePicker}
          >
            <Text style={[styles.listItemLabel, { color: colors.text }]}>
              {t('settings.language.label')}
            </Text>
            <View style={styles.listItemRight}>
              <Text style={[styles.listItemValue, { color: colors.textSecondary }]}>
                {getLanguageLabel(currentLanguage)}
              </Text>
              <Text style={[styles.listItemArrow, { color: colors.textTertiary }]}>›</Text>
            </View>
          </Pressable>
        </Card>

        {/* 数据管理 */}
        <Card variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.data.title')}
          </Text>

          {dataSummary && (
            <Text style={[styles.dataSummary, { color: colors.textSecondary }]}>
              {t('settings.data.summary', { logs: dataSummary.logs, days: dataSummary.days })}
            </Text>
          )}

          <View style={styles.dataButtonsRow}>
            <Pressable
              style={[styles.dataButton, { backgroundColor: colors.primary }]}
              onPress={handleExportJson}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.dataButtonText}>{t('settings.data.export_json')}</Text>
              )}
            </Pressable>

            <Pressable
              style={[styles.dataButton, { backgroundColor: colors.accent }]}
              onPress={handleExportCsv}
              disabled={isExporting}
            >
              <Text style={styles.dataButtonText}>{t('settings.data.export_csv')}</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.listItem, { backgroundColor: colors.logItemBackground }]}
            onPress={handleImport}
          >
            <Text style={[styles.listItemLabel, { color: colors.text }]}>
              {t('settings.data.import')}
            </Text>
            <Text style={[styles.listItemArrow, { color: colors.textTertiary }]}>›</Text>
          </Pressable>
        </Card>

        {/* 关于 */}
        <Card variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.about.title')}
          </Text>
          <View style={styles.aboutContainer}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>
              💧 {t('settings.about.app_name')}
            </Text>
            <Text style={[styles.aboutVersion, { color: colors.textTertiary }]}>
              {t('settings.about.version', { version: '1.0.0' })}
            </Text>
            <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
              {t('settings.about.description')}
            </Text>
          </View>

          <Pressable
            style={[styles.listItem, { backgroundColor: colors.logItemBackground }]}
            onPress={() => router.push('/privacy' as never)}
          >
            <Text style={[styles.listItemLabel, { color: colors.primary }]}>
              {t('settings.about.privacy_policy')}
            </Text>
            <Text style={[styles.listItemArrow, { color: colors.textTertiary }]}>›</Text>
          </Pressable>
        </Card>

        {/* 提示信息 */}
        {!permissionGranted && settings.reminder_enabled && (
          <View style={[styles.warningBox, { backgroundColor: colors.warningBackground }]}>
            <Text style={[styles.warningText, { color: colors.warningText }]}>
              {t('settings.reminder.permission_warning')}
            </Text>
          </View>
        )}

        {Platform.OS === 'ios' && (
          <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
            <Text style={[styles.infoText, { color: colors.infoText }]}>
              {t('settings.ios_simulator_hint')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Layout.padding.screen,
    paddingBottom: Layout.spacing.xxxl,
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  headerTitle: {
    fontSize: Layout.fontSize.largeTitle,
    fontWeight: Layout.fontWeight.bold,
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  settingLabel: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.medium,
    marginBottom: Layout.spacing.xxs,
  },
  settingDescription: {
    fontSize: Layout.fontSize.footnote,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: Layout.fontWeight.semibold,
  },
  counterValue: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
    minWidth: 100,
    textAlign: 'center',
  },
  hint: {
    fontSize: Layout.fontSize.caption,
    marginTop: Layout.spacing.xs,
  },
  timePickerSection: {
    marginTop: Layout.spacing.sm,
    gap: Layout.spacing.md,
  },
  timePickerSpacer: {
    height: Layout.spacing.sm,
  },
  testButton: {
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  testButtonText: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
    color: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginTop: Layout.spacing.sm,
  },
  listItemLabel: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.medium,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemValue: {
    fontSize: Layout.fontSize.callout,
    marginRight: Layout.spacing.sm,
  },
  listItemArrow: {
    fontSize: 20,
  },
  dataSummary: {
    fontSize: Layout.fontSize.footnote,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  dataButtonsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  dataButton: {
    flex: 1,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  dataButtonText: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.semibold,
    color: '#fff',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  aboutTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.xs,
  },
  aboutVersion: {
    fontSize: Layout.fontSize.footnote,
    marginBottom: Layout.spacing.md,
  },
  aboutDescription: {
    fontSize: Layout.fontSize.footnote,
    textAlign: 'center',
    lineHeight: 20,
  },
  warningBox: {
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  warningText: {
    fontSize: Layout.fontSize.footnote,
    textAlign: 'center',
  },
  infoBox: {
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  infoText: {
    fontSize: Layout.fontSize.footnote,
    textAlign: 'center',
  },
});
