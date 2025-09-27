/**
 * Themed components for Dopamind Web
 * Based on mobile app's ThemedView and ThemedText components
 */

import React from 'react';
import { useThemeColor, useThemeColors } from '@/hooks/useThemeColor';
import { cn } from '@/lib/utils';

// ThemedView Props
export type ThemedViewProps = React.HTMLAttributes<HTMLDivElement> & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card' | 'subtle';
};

// ThemedView Component
export function ThemedView({
  className,
  lightColor,
  darkColor,
  variant = 'default',
  style,
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemeColors();
  const themedBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  const backgroundColor = (lightColor || darkColor)
    ? themedBackgroundColor
    : variant === 'card'
      ? colors.card.background
      : variant === 'subtle'
        ? colors.border
        : colors.background;

  return (
    <div
      className={cn('transition-colors duration-300', className)}
      style={{
        backgroundColor,
        ...style
      }}
      {...otherProps}
    />
  );
}

// ThemedText Props
export type ThemedTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'secondary' | 'muted';
  type?: 'default' | 'title' | 'subtitle' | 'link';
};

// ThemedText Component
export function ThemedText({
  className,
  lightColor,
  darkColor,
  variant = 'default',
  type = 'default',
  style,
  ...otherProps
}: ThemedTextProps) {
  const colors = useThemeColors();
  const themedTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  const color = (lightColor || darkColor)
    ? themedTextColor
    : variant === 'secondary'
      ? colors.textSecondary
      : variant === 'muted'
        ? colors.tabIconDefault
        : colors.text;

  const getTypeClasses = () => {
    switch (type) {
      case 'title':
        return 'text-2xl font-bold';
      case 'subtitle':
        return 'text-lg font-semibold';
      case 'link':
        return 'underline hover:opacity-80';
      default:
        return '';
    }
  };

  return (
    <span
      className={cn(
        'transition-colors duration-300',
        getTypeClasses(),
        className
      )}
      style={{
        color,
        ...style
      }}
      {...otherProps}
    />
  );
}

// ThemedButton Props
export type ThemedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

// ThemedButton Component
export function ThemedButton({
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  style,
  ...otherProps
}: ThemedButtonProps) {
  const colors = useThemeColors();

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };

    const sizeStyles = {
      sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
      md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
      lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    const variantStyles = {
      primary: {
        backgroundColor: colors.button.primary,
        color: colors.button.text,
        border: 'none',
      },
      secondary: {
        backgroundColor: colors.button.secondary,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text,
        border: 'none',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <button
      className={cn('transition-all duration-300', className)}
      style={{
        ...getButtonStyles(),
        ...style,
      }}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
}
