/**
 * 快捷添加按钮组件 - 增强版
 * 支持差异化配色和自定义输入
 */

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';
import * as Haptics from 'expo-haptics';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => Promise<void>;
}

type ButtonType = 'small' | 'medium' | 'large' | 'custom';

interface PresetButton {
  type: ButtonType;
  amount: number;
  labelKey: string;
  icon: string;
}

const PRESET_AMOUNTS: PresetButton[] = [
  { type: 'small', amount: 200, labelKey: 'home.quick_add.small', icon: '☕' },
  { type: 'medium', amount: 300, labelKey: 'home.quick_add.medium', icon: '🥤' },
  { type: 'large', amount: 500, labelKey: 'home.quick_add.large', icon: '🍺' },
  { type: 'custom', amount: 0, labelKey: 'home.quick_add.custom', icon: '✏️' },
];

interface AnimatedButtonProps {
  type: ButtonType;
  amount: number;
  labelKey: string;
  icon: string;
  onPress: () => void;
  loading?: boolean;
  buttonColors: { bg: string; border: string; text: string };
  textSecondaryColor: string;
  primaryColor: string;
}

function AnimatedButton({
  type,
  amount,
  labelKey,
  icon,
  onPress,
  loading = false,
  buttonColors,
  textSecondaryColor,
  primaryColor,
}: AnimatedButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
    opacity.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withSpring(1, { damping: 12 });
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // 点击成功动画
    scale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
      style={styles.buttonWrapper}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: buttonColors.bg,
            borderColor: buttonColors.border,
          },
          animatedStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={primaryColor} />
        ) : (
          <>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.amount, { color: buttonColors.text }]}>
              {type === 'custom' ? '...' : `${amount}ml`}
            </Text>
            <Text style={[styles.label, { color: textSecondaryColor }]}>
              {t(labelKey)}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

// 自定义输入弹窗
interface CustomInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

function CustomInputModal({ visible, onClose, onConfirm }: CustomInputModalProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    const amount = parseInt(inputValue, 10);
    if (amount > 0 && amount <= 5000) {
      onConfirm(amount);
      setInputValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleClose} />
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('home.quick_add.custom_title')}
          </Text>

          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="100"
              placeholderTextColor={colors.textTertiary}
              maxLength={4}
              autoFocus
            />
            <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>ml</Text>
          </View>

          <Text style={[styles.inputHint, { color: colors.textTertiary }]}>
            {t('home.quick_add.custom_hint')}
          </Text>

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleConfirm}
            >
              <Text style={[styles.confirmButtonText, { color: colors.textOnPrimary }]}>
                {t('common.confirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const [loadingButton, setLoadingButton] = useState<ButtonType | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleAdd = async (type: ButtonType, amount: number) => {
    if (type === 'custom') {
      setShowCustomModal(true);
      return;
    }

    try {
      setLoadingButton(type);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onAdd(amount);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to add water log:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoadingButton(null);
    }
  };

  const handleCustomAdd = async (amount: number) => {
    try {
      setLoadingButton('custom');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onAdd(amount);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to add water log:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoadingButton(null);
    }
  };

  const getButtonColors = (type: ButtonType) => {
    return colors.quickButton[type];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t('home.quick_add.title')}</Text>
      <View style={styles.buttonsRow}>
        {PRESET_AMOUNTS.map(({ type, amount, labelKey, icon }) => (
          <AnimatedButton
            key={type}
            type={type}
            amount={amount}
            labelKey={labelKey}
            icon={icon}
            onPress={() => handleAdd(type, amount)}
            loading={loadingButton === type}
            buttonColors={getButtonColors(type)}
            textSecondaryColor={colors.textSecondary}
            primaryColor={colors.primary}
          />
        ))}
      </View>

      <CustomInputModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onConfirm={handleCustomAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.padding.screen,
    marginVertical: Layout.spacing.xl,
  },
  title: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    marginBottom: Layout.spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Layout.component.quickButtonMinHeight,
    borderWidth: 2,
  },
  icon: {
    fontSize: 28,
    marginBottom: Layout.spacing.xs,
  },
  amount: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.bold,
    marginTop: Layout.spacing.xs,
  },
  label: {
    fontSize: Layout.fontSize.caption,
    marginTop: Layout.spacing.xxs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 340,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.section,
    ...Layout.shadow.lg,
  },
  modalTitle: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.bold,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.title1,
    fontWeight: Layout.fontWeight.bold,
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.medium,
    marginLeft: Layout.spacing.sm,
  },
  inputHint: {
    fontSize: Layout.fontSize.footnote,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {},
  cancelButtonText: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
  },
  confirmButtonText: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
  },
});
