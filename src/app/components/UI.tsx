import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View as RNView,
  ViewProps as RNViewProps,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

/* ==========================================================================
   Design Tokens & Constants
   ========================================================================== */

export const colors = {
  // Brand
  brandPrimary: '#08299B',
  brandDark: '#0D1B3E',
  brandNavy: '#091E42',
  
  // Surfaces & Backgrounds
  bgLight: '#F0F4FA',
  bgCardSubtle: '#FAFBFD',
  bgCardActive: '#FFFFFF',
  bgDark: '#08299B',
  
  // Glass / Translucent
  glassBg: 'rgba(255, 255, 255, 0.08)',
  glassBgSubtle: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.08)',
  glassTagBg: 'rgba(255, 255, 255, 0.14)',
  
  // Text
  textDark: '#091E42',
  textLight: '#FFFFFF',
  textMuted: '#64748B',
  textMutedDark: 'rgba(255, 255, 255, 0.65)',
  textMutedLight: 'rgba(255, 255, 255, 0.85)',
  
  // Borders
  borderLight: '#E2E8F0',
  borderSubtle: '#EEF2F6',
  
  // Status & Badges
  success: '#16A34A',
  successBg: '#DCFCE7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  purple: '#8B5CF6',
  purpleBg: '#EDE9FE',
};

/* ==========================================================================
   1. Text Component
   ========================================================================== */

export type TextVariant =
  | 'heading'
  | 'subheading'
  | 'eyebrow'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'label'
  | 'link';

export type TextColor =
  | 'primary'
  | 'dark'
  | 'light'
  | 'white'
  | 'muted'
  | 'mutedDark'
  | 'success'
  | 'danger';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor | string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  size?: number;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  weight,
  size,
  lineHeight,
  style,
  children,
  ...props
}) => {
  const variantStyle = textVariantStyles[variant];

  // Resolve color
  let resolvedColor = color;
  if (color && textColorMap[color as TextColor]) {
    resolvedColor = textColorMap[color as TextColor];
  }

  // Resolve font weight
  const resolvedWeight = weight ? fontWeightMap[weight] : undefined;

  return (
    <RNText
      style={[
        variantStyle,
        resolvedColor ? { color: resolvedColor } : undefined,
        align ? { textAlign: align } : undefined,
        resolvedWeight ? { fontWeight: resolvedWeight } : undefined,
        size !== undefined ? { fontSize: size } : undefined,
        lineHeight !== undefined ? { lineHeight } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const textColorMap: Record<TextColor, string> = {
  primary: colors.brandPrimary,
  dark: colors.textDark,
  light: colors.textLight,
  white: '#FFFFFF',
  muted: colors.textMuted,
  mutedDark: colors.textMutedDark,
  success: colors.success,
  danger: colors.danger,
};

const fontWeightMap: Record<
  'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold',
  TextStyle['fontWeight']
> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

const textVariantStyles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 16,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brandPrimary,
  },
});

/* ==========================================================================
   2. View / Layout Component
   ========================================================================== */

export type ViewVariant =
  | 'default'
  | 'screen'
  | 'screenDark'
  | 'topSection'
  | 'preview'
  | 'bottomCard'
  | 'row'
  | 'column'
  | 'center';

export interface ViewProps extends RNViewProps {
  variant?: ViewVariant;
  gap?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  bg?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const View: React.FC<ViewProps> = ({
  variant = 'default',
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  bg,
  style,
  children,
  ...props
}) => {
  return (
    <RNView
      style={[
        viewVariantStyles[variant],
        gap !== undefined ? { gap } : undefined,
        padding !== undefined ? { padding } : undefined,
        paddingHorizontal !== undefined ? { paddingHorizontal } : undefined,
        paddingVertical !== undefined ? { paddingVertical } : undefined,
        bg ? { backgroundColor: bg } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
  );
};

const viewVariantStyles = StyleSheet.create({
  default: {},
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  screenDark: {
    flex: 1,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 20,
  },
  preview: {
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 'auto',
    width: '90%',
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ==========================================================================
   3. Card Component
   ========================================================================== */

export type CardVariant =
  | 'glass'
  | 'solid'
  | 'subtle'
  | 'outline'
  | 'interactive'
  | 'post';

export interface CardProps extends Omit<ViewProps, 'variant'> {
  variant?: CardVariant;
  active?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'solid',
  active = false,
  onPress,
  activeOpacity = 0.85,
  style,
  children,
  ...props
}) => {
  const cardStyle = [
    cardVariantStyles.base,
    cardVariantStyles[variant],
    variant === 'interactive' &&
      (active ? cardVariantStyles.interactiveActive : cardVariantStyles.interactiveInactive),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={cardStyle}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <RNView style={cardStyle} {...props}>
      {children}
    </RNView>
  );
};

const cardVariantStyles = StyleSheet.create({
  base: {
    borderRadius: 22,
  },
  glass: {
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    width: '100%',
  },
  solid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  subtle: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  interactive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  interactiveActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  interactiveInactive: {
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
});

/* ==========================================================================
   4. Button Component
   ========================================================================== */

export type ButtonVariant =
  | 'primary'
  | 'primaryNavy'
  | 'secondary'
  | 'ghost'
  | 'pill'
  | 'outline'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  icon?: keyof typeof Feather.glyphMap | React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconColor?: string;
  iconSize?: number;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  title,
  icon,
  iconPosition = 'right',
  iconColor,
  iconSize,
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
  children,
  ...props
}) => {
  const isPrimary = variant === 'primary' || variant === 'primaryNavy';
  const defaultIconColor = iconColor || (isPrimary ? '#FFFFFF' : colors.brandPrimary);
  const defaultIconSize = iconSize || (size === 'sm' ? 14 : size === 'lg' ? 20 : 18);

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return (
        <Feather
          name={icon as keyof typeof Feather.glyphMap}
          size={defaultIconSize}
          color={defaultIconColor}
        />
      );
    }
    return icon;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        buttonVariantStyles.base,
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
        fullWidth && buttonVariantStyles.fullWidth,
        disabled && buttonVariantStyles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#FFFFFF' : colors.brandPrimary}
        />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {title ? (
            <RNText
              style={[
                buttonTextStyles.base,
                buttonTextStyles[variant],
                buttonTextSizeStyles[size],
                textStyle,
              ]}
            >
              {title}
            </RNText>
          ) : (
            children
          )}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
};

const buttonVariantStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 26,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  primary: {
    backgroundColor: colors.brandPrimary,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryNavy: {
    backgroundColor: colors.brandDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  secondary: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  link: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
});

const buttonSizeStyles = StyleSheet.create({
  sm: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  md: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
  },
  lg: {
    height: 58,
    paddingHorizontal: 24,
    borderRadius: 29,
  },
});

const buttonTextStyles = StyleSheet.create({
  base: {
    fontWeight: '700',
  },
  primary: {
    color: '#FFFFFF',
  },
  primaryNavy: {
    color: '#FFFFFF',
  },
  secondary: {
    color: colors.brandPrimary,
  },
  ghost: {
    color: colors.textMutedLight,
    fontWeight: '600',
  },
  pill: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  outline: {
    color: colors.brandPrimary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  link: {
    color: colors.brandPrimary,
    fontWeight: '700',
  },
});

const buttonTextSizeStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
  },
  md: {
    fontSize: 15,
  },
  lg: {
    fontSize: 16,
  },
});

/* ==========================================================================
   5. Badge & Tag Component (Pill / Status)
   ========================================================================== */

export type BadgeVariant =
  | 'success'
  | 'danger'
  | 'info'
  | 'warning'
  | 'glass'
  | 'subtle';

export interface BadgeProps extends RNViewProps {
  variant?: BadgeVariant;
  label?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'success',
  label,
  style,
  textStyle,
  children,
  ...props
}) => {
  return (
    <RNView style={[badgeVariantStyles.base, badgeVariantStyles[variant], style]} {...props}>
      {label ? (
        <RNText style={[badgeTextStyles.base, badgeTextStyles[variant], textStyle]}>
          {label}
        </RNText>
      ) : (
        children
      )}
    </RNView>
  );
};

const badgeVariantStyles = StyleSheet.create({
  base: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: colors.successBg,
  },
  danger: {
    backgroundColor: colors.dangerBg,
  },
  info: {
    backgroundColor: colors.infoBg,
  },
  warning: {
    backgroundColor: colors.warningBg,
  },
  glass: {
    backgroundColor: colors.glassTagBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  subtle: {
    backgroundColor: '#EEF2FF',
  },
});

const badgeTextStyles = StyleSheet.create({
  base: {
    fontSize: 11,
    fontWeight: '700',
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  info: {
    color: colors.info,
  },
  warning: {
    color: colors.warning,
  },
  glass: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  subtle: {
    color: colors.brandPrimary,
  },
});

/* ==========================================================================
   6. Default Export
   ========================================================================== */

export default {
  Text,
  View,
  Card,
  Button,
  Badge,
  colors,
};
