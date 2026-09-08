import { useColorScheme } from 'react-native';
import { Colors, ThemeColors, ThemePreference } from '../constant';
import { useThemeStore } from '../store/themeStore';

export interface UseThemeReturn {
  colors: ThemeColors;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  isDark: boolean;
  activeTheme: 'light' | 'dark';
  systemColorScheme: 'light' | 'dark' | null | undefined;
}

export const useTheme = (): UseThemeReturn => {
  const { themePreference, setThemePreference } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const isDark =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
      : themePreference === 'dark';

  const activeTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';
  const colors: ThemeColors = Colors[activeTheme];

  return {
    colors,
    themePreference,
    setThemePreference,
    isDark,
    activeTheme,
    systemColorScheme,
  };
};

export default useTheme;
