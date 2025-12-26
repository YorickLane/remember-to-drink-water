/**
 * 设置页面
 * Crystal Hydra 设计系统 - 玻璃拟态风格
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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle as SvgCircle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useWaterStore } from '@/store/useWaterStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { requestNotificationPermissions, sendTestNotification } from '@/lib/notifications';
import { TimePicker } from '@/components/TimePicker';
import { SlideInGlassCard } from '@/components/Card';
import { Layout } from '@/constants/Layout';
import { changeLanguage, getCurrentLanguageSetting } from '@/locales';
import { exportAsJson, exportAsCsv, getDataSummary } from '@/lib/dataExport';
import { importFromFile } from '@/lib/dataImport';
import * as Haptics from 'expo-haptics';

type LanguageOption = 'system' | 'en' | 'zh';

// SVG 图标组件
function TargetIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <SvgCircle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
      <SvgCircle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

function BellIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GlobeIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <Path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DatabaseIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4z"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path d="M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4" stroke={color} strokeWidth="1.5" />
      <Path d="M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

function InfoIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function WaterDropIcon({ size = 24, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgLinearGradient id="dropGradSettings" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#dropGradSettings)"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 20, color = '#94A3B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MinusIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export default function SettingsScreen() {
  const { colors, isDark } = useThemeColors();
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

  // 背景渐变色
  const backgroundGradient: [string, string] = isDark
    ? ['#0C1929', '#132337']
    : ['#F0F9FF', '#E0F2FE'];

  // 玻璃效果背景
  const glassBackground = isDark
    ? 'rgba(30, 58, 95, 0.4)'
    : 'rgba(255, 255, 255, 0.5)';

  if (!settings) {
    return (
      <LinearGradient colors={backgroundGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 标题 */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('settings.title')}
            </Text>
          </Animated.View>

          {/* 每日目标 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={100}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <TargetIcon size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('settings.goal.title')}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.goal.label')}
              </Text>
              <View style={styles.counterContainer}>
                <Pressable
                  onPress={() => handleGoalChange(-100)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    pressed && styles.counterButtonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, '#38BDF8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.counterButtonGradient}
                  >
                    <MinusIcon size={18} />
                  </LinearGradient>
                </Pressable>
                <Text style={[styles.counterValue, { color: colors.text }]}>
                  {settings.daily_goal_ml} ml
                </Text>
                <Pressable
                  onPress={() => handleGoalChange(100)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    pressed && styles.counterButtonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, '#38BDF8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.counterButtonGradient}
                  >
                    <PlusIcon size={18} />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
            <Text style={[styles.hint, { color: colors.textTertiary }]}>
              {t('settings.goal.hint')}
            </Text>
          </SlideInGlassCard>

          {/* 提醒设置 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={200}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <BellIcon size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('settings.reminder.title')}
              </Text>
            </View>

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
                trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
                thumbColor={settings.reminder_enabled ? '#fff' : colors.switchThumb}
                ios_backgroundColor={colors.switchTrackOff}
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
                      onPress={() => handleIntervalChange(-30)}
                      style={({ pressed }) => [
                        styles.counterButton,
                        pressed && styles.counterButtonPressed,
                      ]}
                    >
                      <LinearGradient
                        colors={[colors.primary, '#38BDF8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.counterButtonGradient}
                      >
                        <MinusIcon size={18} />
                      </LinearGradient>
                    </Pressable>
                    <Text style={[styles.counterValue, { color: colors.text }]}>
                      {settings.reminder_interval_min} {i18n.language === 'zh' ? '分钟' : 'min'}
                    </Text>
                    <Pressable
                      onPress={() => handleIntervalChange(30)}
                      style={({ pressed }) => [
                        styles.counterButton,
                        pressed && styles.counterButtonPressed,
                      ]}
                    >
                      <LinearGradient
                        colors={[colors.primary, '#38BDF8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.counterButtonGradient}
                      >
                        <PlusIcon size={18} />
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
                <Text style={[styles.hint, { color: colors.textTertiary }]}>
                  {t('settings.reminder.interval.hint')}
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.testButton,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={handleTestNotification}
                >
                  <LinearGradient
                    colors={[colors.accent, '#34D399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.testButtonGradient}
                  >
                    <Text style={styles.testButtonText}>
                      {t('settings.reminder.test_button')}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </>
            )}
          </SlideInGlassCard>

          {/* 通用设置 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={300}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <GlobeIcon size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('settings.language.title')}
              </Text>
            </View>
            <Pressable
              style={[styles.listItem, { backgroundColor: glassBackground }]}
              onPress={showLanguagePicker}
            >
              <Text style={[styles.listItemLabel, { color: colors.text }]}>
                {t('settings.language.label')}
              </Text>
              <View style={styles.listItemRight}>
                <Text style={[styles.listItemValue, { color: colors.textSecondary }]}>
                  {getLanguageLabel(currentLanguage)}
                </Text>
                <ChevronRightIcon size={18} color={colors.textTertiary} />
              </View>
            </Pressable>
          </SlideInGlassCard>

          {/* 数据管理 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={400}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <DatabaseIcon size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('settings.data.title')}
              </Text>
            </View>

            {dataSummary && (
              <Text style={[styles.dataSummary, { color: colors.textSecondary }]}>
                {t('settings.data.summary', { logs: dataSummary.logs, days: dataSummary.days })}
              </Text>
            )}

            <View style={styles.dataButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.dataButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={handleExportJson}
                disabled={isExporting}
              >
                <LinearGradient
                  colors={[colors.primary, '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dataButtonGradient}
                >
                  {isExporting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.dataButtonText}>{t('settings.data.export_json')}</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.dataButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={handleExportCsv}
                disabled={isExporting}
              >
                <LinearGradient
                  colors={[colors.accent, '#34D399']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dataButtonGradient}
                >
                  <Text style={styles.dataButtonText}>{t('settings.data.export_csv')}</Text>
                </LinearGradient>
              </Pressable>
            </View>

            <Pressable
              style={[styles.listItem, { backgroundColor: glassBackground }]}
              onPress={handleImport}
            >
              <Text style={[styles.listItemLabel, { color: colors.text }]}>
                {t('settings.data.import')}
              </Text>
              <ChevronRightIcon size={18} color={colors.textTertiary} />
            </Pressable>
          </SlideInGlassCard>

          {/* 关于 */}
          <SlideInGlassCard
            intensity="medium"
            animationDelay={500}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <InfoIcon size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('settings.about.title')}
              </Text>
            </View>
            <View style={styles.aboutContainer}>
              <WaterDropIcon size={40} color={colors.primary} />
              <Text style={[styles.aboutTitle, { color: colors.text }]}>
                {t('settings.about.app_name')}
              </Text>
              <Text style={[styles.aboutVersion, { color: colors.textTertiary }]}>
                {t('settings.about.version', { version: '1.0.0' })}
              </Text>
              <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
                {t('settings.about.description')}
              </Text>
            </View>

            <Pressable
              style={[styles.listItem, { backgroundColor: glassBackground }]}
              onPress={() => router.push('/privacy' as never)}
            >
              <Text style={[styles.listItemLabel, { color: colors.primary }]}>
                {t('settings.about.privacy_policy')}
              </Text>
              <ChevronRightIcon size={18} color={colors.textTertiary} />
            </Pressable>
          </SlideInGlassCard>

          {/* 提示信息 */}
          {!permissionGranted && settings.reminder_enabled && (
            <Animated.View entering={FadeInDown.duration(300).delay(600)}>
              <View style={[styles.warningBox, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Text style={[styles.warningText, { color: colors.warning }]}>
                  {t('settings.reminder.permission_warning')}
                </Text>
              </View>
            </Animated.View>
          )}

          {Platform.OS === 'ios' && (
            <Animated.View entering={FadeInDown.duration(300).delay(700)}>
              <View style={[styles.infoBox, { backgroundColor: glassBackground }]}>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {t('settings.ios_simulator_hint')}
                </Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.semibold,
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  counterButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  counterButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    overflow: 'hidden',
    marginTop: Layout.spacing.lg,
  },
  testButtonGradient: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
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
    gap: Layout.spacing.xs,
  },
  listItemValue: {
    fontSize: Layout.fontSize.callout,
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
    overflow: 'hidden',
  },
  dataButtonGradient: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
  },
  dataButtonText: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.semibold,
    color: '#fff',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.xs,
  },
  aboutTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    marginTop: Layout.spacing.sm,
  },
  aboutVersion: {
    fontSize: Layout.fontSize.footnote,
  },
  aboutDescription: {
    fontSize: Layout.fontSize.footnote,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Layout.spacing.xs,
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
