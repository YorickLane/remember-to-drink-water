/**
 * 隐私政策页面
 */

import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function PrivacyPolicyScreen() {
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>{t('privacy.title')}</ThemedText>
          <ThemedText style={styles.updateDate}>{t('privacy.last_updated', { date: '2025-11' })}</ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>1. {t('privacy.sections.collection.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.collection.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>2. {t('privacy.sections.storage.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.storage.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>3. {t('privacy.sections.permissions.title')}</ThemedText>
            <ThemedText style={styles.bulletPoint}>• {t('privacy.sections.permissions.notification')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>4. {t('privacy.sections.security.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.security.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>5. {t('privacy.sections.third_party.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.third_party.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>6. {t('privacy.sections.children.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.children.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>7. {t('privacy.sections.health.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.health.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>8. {t('privacy.sections.changes.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.changes.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>9. {t('privacy.sections.contact.title')}</ThemedText>
            <ThemedText style={styles.paragraph}>{t('privacy.sections.contact.content')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>
              {t('privacy.last_updated', { date: '2025-11-22' })}
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
  title: {
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
