/**
 * 主题颜色 Hook
 */

import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';

export function useThemeColors() {
  const colorScheme = useColorScheme() as ColorScheme;
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    colors: Colors[theme],
    isDark: theme === 'dark',
    theme,
  };
}
