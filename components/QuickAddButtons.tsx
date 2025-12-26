/**
 * 快捷添加按钮组件 - Crystal Hydra 设计系统
 * 2x2 网格布局，玻璃拟态按钮，SVG 图标
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
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Layout } from '@/constants/Layout';
import { Animations } from '@/constants/Animations';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => Promise<void>;
}

type ButtonType = 'small' | 'medium' | 'large' | 'custom';

interface PresetButton {
  type: ButtonType;
  amount: number;
  labelKey: string;
}

const PRESET_AMOUNTS: PresetButton[] = [
  { type: 'small', amount: 200, labelKey: 'home.quick_add.small' },
  { type: 'medium', amount: 300, labelKey: 'home.quick_add.medium' },
  { type: 'large', amount: 500, labelKey: 'home.quick_add.large' },
  { type: 'custom', amount: 0, labelKey: 'home.quick_add.custom' },
];

// 水滴图标组件
function WaterDropIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        fill="url(#dropGradient)"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14a4 4 0 0 0 4 4"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 杯子图标组件
function CupIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 8H19C20.1046 8 21 8.89543 21 10V11C21 12.1046 20.1046 13 19 13H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M5 8H17V16C17 18.2091 15.2091 20 13 20H9C6.79086 20 5 18.2091 5 16V8Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M5 4H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 瓶子图标组件
function BottleIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V10Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M8 8V6H16V8"
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  );
}

// 编辑图标组件
function EditIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 获取图标组件
function getIcon(type: ButtonType, color: string) {
  const size = 28;
  switch (type) {
    case 'small':
      return <WaterDropIcon color={color} size={size} />;
    case 'medium':
      return <CupIcon color={color} size={size} />;
    case 'large':
      return <BottleIcon color={color} size={size} />;
    case 'custom':
      return <EditIcon color={color} size={size} />;
  }
}

interface AnimatedButtonProps {
  type: ButtonType;
  amount: number;
  labelKey: string;
  onPress: () => void;
  loading?: boolean;
  buttonColors: { bg: string; border: string; text: string; icon: string };
  index: number;
}

function AnimatedButton({
  type,
  amount,
  labelKey,
  onPress,
  loading = false,
  buttonColors,
  index,
}: AnimatedButtonProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, Animations.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animations.spring.snappy);
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // 成功发光动画
    glowOpacity.value = withSequence(
      withTiming(0.6, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );
    scale.value = withSequence(
      withSpring(1.05, Animations.spring.snappy),
      withSpring(1, Animations.spring.default)
    );
    onPress();
  };

  // 玻璃效果配置
  const glassBackground = isDark
    ? buttonColors.bg
    : buttonColors.bg;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
      style={styles.buttonWrapper}
    >
      <Animated.View
        entering={FadeIn.duration(300).delay(index * 50)}
        style={[
          styles.button,
          {
            backgroundColor: glassBackground,
            borderColor: buttonColors.border,
          },
          animatedStyle,
        ]}
      >
        {/* 发光效果层 */}
        <Animated.View
          style={[
            styles.buttonGlow,
            { backgroundColor: buttonColors.icon },
            glowStyle,
          ]}
        />

        {loading ? (
          <ActivityIndicator size="small" color={buttonColors.icon} />
        ) : (
          <>
            <View style={styles.iconContainer}>
              {getIcon(type, buttonColors.icon)}
            </View>
            <Text style={[styles.amount, { color: buttonColors.text }]}>
              {type === 'custom' ? '...' : `${amount}ml`}
            </Text>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
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
  const { colors, isDark } = useThemeColors();
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

  // 玻璃效果背景
  const modalBackground = isDark
    ? 'rgba(30, 58, 95, 0.95)'
    : 'rgba(255, 255, 255, 0.95)';

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
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: modalBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('home.quick_add.custom_title')}
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(56, 189, 248, 0.1)'
                  : 'rgba(14, 165, 233, 0.08)',
                borderColor: colors.primary,
              },
            ]}
          >
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
            <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>
              ml
            </Text>
          </View>

          <Text style={[styles.inputHint, { color: colors.textTertiary }]}>
            {t('home.quick_add.custom_hint')}
          </Text>

          <View style={styles.modalButtons}>
            <Pressable
              style={[
                styles.modalButton,
                styles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={handleClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <View style={styles.confirmButtonGradient}>
                <Text style={styles.confirmButtonText}>{t('common.confirm')}</Text>
              </View>
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
      <Text style={[styles.title, { color: colors.text }]}>
        {t('home.quick_add.title')}
      </Text>

      {/* 2x2 网格布局 */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          {PRESET_AMOUNTS.slice(0, 2).map((preset, index) => (
            <AnimatedButton
              key={preset.type}
              type={preset.type}
              amount={preset.amount}
              labelKey={preset.labelKey}
              onPress={() => handleAdd(preset.type, preset.amount)}
              loading={loadingButton === preset.type}
              buttonColors={getButtonColors(preset.type)}
              index={index}
            />
          ))}
        </View>
        <View style={styles.gridRow}>
          {PRESET_AMOUNTS.slice(2, 4).map((preset, index) => (
            <AnimatedButton
              key={preset.type}
              type={preset.type}
              amount={preset.amount}
              labelKey={preset.labelKey}
              onPress={() => handleAdd(preset.type, preset.amount)}
              loading={loadingButton === preset.type}
              buttonColors={getButtonColors(preset.type)}
              index={index + 2}
            />
          ))}
        </View>
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
    marginBottom: Layout.spacing.lg,
  },
  // 2x2 网格布局
  grid: {
    gap: Layout.spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    borderRadius: Layout.borderRadius.xl,
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Layout.borderRadius.xl,
  },
  iconContainer: {
    marginBottom: Layout.spacing.sm,
  },
  amount: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.bold,
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
    borderWidth: 1,
    ...Layout.shadow.xl,
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
    borderRadius: Layout.borderRadius.lg,
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
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#0EA5E9',
  },
  confirmButtonGradient: {
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
  },
  confirmButtonText: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.semibold,
    color: '#FFFFFF',
  },
});
