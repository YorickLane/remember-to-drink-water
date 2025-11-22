/**
 * 隐私政策页面
 */

import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function PrivacyPolicyScreen() {
  const { colors } = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView>
        <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>隐私政策</ThemedText>
        <ThemedText style={styles.updateDate}>最后更新：2025年11月</ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>1. 信息收集</ThemedText>
          <ThemedText style={styles.paragraph}>
            本应用（喝水提醒）不会收集、存储或传输任何个人信息。所有数据仅保存在您的设备本地。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>2. 本地数据存储</ThemedText>
          <ThemedText style={styles.paragraph}>
            应用使用本地数据库（SQLite）存储以下信息：
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>• 每日饮水记录（时间、水量）</ThemedText>
          <ThemedText style={styles.bulletPoint}>• 应用设置（目标、提醒时间）</ThemedText>
          <ThemedText style={styles.paragraph}>
            这些数据仅保存在您的设备上，不会上传到任何服务器。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>3. 权限使用</ThemedText>
          <ThemedText style={styles.paragraph}>
            应用仅请求以下权限：
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • 通知权限：用于发送饮水提醒，您可以随时在系统设置中关闭
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            我们不会请求任何其他权限，如位置、相机、通讯录等。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>4. 数据安全</ThemedText>
          <ThemedText style={styles.paragraph}>
            由于所有数据仅保存在本地，您的数据安全完全由您的设备系统保护。
            我们建议您：
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>• 定期备份设备</ThemedText>
          <ThemedText style={styles.bulletPoint}>• 使用设备锁屏密码</ThemedText>
          <ThemedText style={styles.bulletPoint}>• 卸载应用会删除所有本地数据</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>5. 第三方服务</ThemedText>
          <ThemedText style={styles.paragraph}>
            本应用不使用任何第三方分析、广告或跟踪服务。不会与第三方共享任何数据。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>6. 儿童隐私</ThemedText>
          <ThemedText style={styles.paragraph}>
            本应用不会主动收集13岁以下儿童的信息。由于应用不收集任何数据，所有年龄段用户均可安全使用。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>7. 健康免责声明</ThemedText>
          <ThemedText style={styles.paragraph}>
            本应用仅用于记录和提醒，不提供医疗建议。饮水量建议仅供参考，具体需求请咨询医疗专业人士。
            使用本应用不能替代专业医疗建议、诊断或治疗。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>8. 隐私政策变更</ThemedText>
          <ThemedText style={styles.paragraph}>
            我们可能会不时更新本隐私政策。任何变更将通过应用更新通知您。
            建议您定期查看本政策。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>9. 联系我们</ThemedText>
          <ThemedText style={styles.paragraph}>
            如果您对本隐私政策有任何问题或建议，请联系我们：
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            邮箱：support@waterreminder.app
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            最后更新日期：2025年11月22日
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
