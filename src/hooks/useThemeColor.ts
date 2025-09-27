/**
 * Custom hook for getting theme-aware colors in Dopamind Web
 * Based on the mobile app's useThemeColor implementation
 */

import Colors, { type Theme, type ColorKey } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeColors = typeof Colors.light;
type SimpleColorKey = {
  [K in keyof ThemeColors]: ThemeColors[K] extends string ? K : never;
}[keyof ThemeColors];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: SimpleColorKey
): string {
  const { actualTheme } = useTheme();
  const colorFromProps = props[actualTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[actualTheme][colorName] as string;
  }
}

/**
 * Get a specific color value from the theme
 */
export function useThemeColors() {
  const { actualTheme } = useTheme();
  return Colors[actualTheme];
}

/**
 * Get the current theme colors object
 */
export function getThemeColor(theme: Theme, colorName: ColorKey) {
  return Colors[theme][colorName];
}
