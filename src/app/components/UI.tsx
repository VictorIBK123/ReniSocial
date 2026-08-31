import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Pressable,
  Text as RNText,
  TextProps as RNTextProps,
  View as RNView,
  ViewProps as RNViewProps,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Colors, Fonts } from '../../constant';
import Icon from './IconResolver';

/* ==========================================================================
   Re-export Colors for backward compat
   ========================================================================== */

export const colors = {
  brandPrimary: Colors.brandPrimary,
  brandDark: Colors.brandDark,
  brandNavy: Colors.brandNavy,
  bgLight: Colors.bgLight,
  bgCardSubtle: Colors.bgCardSubtle,
  bgCardActive: Colors.white,
  bgDark: Colors.brandPrimary,
  glassBg: Colors.glass08,
  glassBgSubtle: Colors.glass06,
  glassBorder: Colors.glass15,
  glassBorderSubtle: Colors.glass08,
  glassTagBg: Colors.glass14,
  textDark: Colors.textDark,
  textLight: Colors.white,
  textMuted: Colors.textMuted,
  textMutedDark: Colors.glass65,
  textMutedLight: Colors.glass85,
  borderLight: Colors.borderLight,
  borderSubtle: Colors.borderSubtle,
  success: Colors.success,
  successBg: Colors.successBg,
  danger: Colors.danger,
  dangerBg: Colors.dangerBg,
  info: Colors.info,
  infoBg: Colors.infoBg,
  warning: Colors.warning,
  warningBg: Colors.warningBg,
  purple: Colors.purple,
  purpleBg: Colors.purpleBg,
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

  // Resolve font weight → fontFamily
  const resolvedFontFamily = weight ? fontFamilyMap[weight] : undefined;

  return (
    <RNText
      style={[
        variantStyle,
        resolvedColor ? { color: resolvedColor } : undefined,
        align ? { textAlign: align } : undefined,
        resolvedFontFamily ? { fontFamily: resolvedFontFamily } : undefined,
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
  white: Colors.white,
  muted: colors.textMuted,
  mutedDark: colors.textMutedDark,
  success: colors.success,
  danger: colors.danger,
};

/** Maps the `weight` prop to a specific fontFamily (body family by default) */
const fontFamilyMap: Record<
  'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold',
  string
> = {
  normal: Fonts.body.regular,
  medium: Fonts.body.medium,
  semibold: Fonts.body.semiBold,
  bold: Fonts.body.bold,
  extrabold: Fonts.heading.extraBold,
};

const textVariantStyles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontFamily: Fonts.heading.extraBold,
    color: colors.textDark,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 15,
    fontFamily: Fonts.body.medium,
    color: colors.textMuted,
    lineHeight: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: Fonts.alt.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: colors.textDark,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontFamily: Fonts.body.bold,
    color: colors.textDark,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontFamily: Fonts.body.medium,
    color: colors.textMuted,
    lineHeight: 16,
  },
  label: {
    fontSize: 10.5,
    fontFamily: Fonts.alt.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  link: {
    fontSize: 13,
    fontFamily: Fonts.body.bold,
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 16,
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
    backgroundColor: Colors.white,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: Colors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  interactive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  interactiveActive: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
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
  const defaultIconColor = iconColor || (isPrimary ? Colors.white : Colors.brandPrimary);
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
          color={isPrimary ? Colors.white : Colors.brandPrimary}
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
  },
  primaryNavy: {
    backgroundColor: colors.brandDark,
  },
  secondary: {
    backgroundColor: Colors.bgAccent,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pill: {
    backgroundColor: Colors.glass14,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    fontFamily: Fonts.heading.bold,
  },
  primary: {
    color: Colors.white,
  },
  primaryNavy: {
    color: Colors.white,
  },
  secondary: {
    color: colors.brandPrimary,
  },
  ghost: {
    color: colors.textMutedLight,
    fontFamily: Fonts.body.semiBold,
  },
  pill: {
    color: Colors.glass90,
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
  },
  outline: {
    color: colors.brandPrimary,
    fontSize: 9.5,
    fontFamily: Fonts.alt.bold,
    letterSpacing: 0.6,
  },
  link: {
    color: colors.brandPrimary,
    fontFamily: Fonts.body.bold,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
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
    backgroundColor: Colors.bgAccent,
  },
});

const badgeTextStyles = StyleSheet.create({
  base: {
    fontSize: 11,
    fontFamily: Fonts.body.bold,
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
    color: Colors.glass90,
    fontFamily: Fonts.body.semiBold,
  },
  subtle: {
    color: colors.brandPrimary,
  },
});

/* ==========================================================================
   6. Input / TextField Component
   ========================================================================== */

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentProps<typeof Feather>['name'];
  rightIcon?: React.ComponentProps<typeof Feather>['name'];
  onRightIconPress?: () => void;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword,
  containerStyle,
  inputStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resolvedLeftIcon = isPassword && !leftIcon ? 'lock' : leftIcon;
  const resolvedRightIcon = isPassword ? (showPassword ? 'eye-off' : 'eye') : rightIcon;
  const handleRightPress = isPassword ? () => setShowPassword(!showPassword) : onRightIconPress;

  return (
    <RNView style={[inputStyles.wrapper, containerStyle, style]}>
      {label ? (
        <RNText style={[inputStyles.label, !!error && inputStyles.labelError]}>
          {label}
        </RNText>
      ) : null}

      <RNView
        style={[
          inputStyles.inputBox,
          isFocused && inputStyles.inputBoxFocused,
          !!error && inputStyles.inputBoxError,
        ]}
      >
        {resolvedLeftIcon ? (
          <RNView style={inputStyles.iconLeft}>
            <Feather
              name={resolvedLeftIcon}
              size={18}
              color={error ? Colors.danger : isFocused ? Colors.brandPrimary : Colors.textMuted}
            />
          </RNView>
        ) : null}

        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[
            inputStyles.textInput,
            resolvedLeftIcon ? { paddingLeft: 6 } : undefined,
            resolvedRightIcon ? { paddingRight: 6 } : undefined,
            inputStyle,
          ]}
          {...props}
        />

        {resolvedRightIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!handleRightPress}
            onPress={handleRightPress}
            style={inputStyles.iconRight}
          >
            <Feather
              name={resolvedRightIcon}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </RNView>

      {error ? <RNText style={inputStyles.errorText}>{error}</RNText> : null}
    </RNView>
  );
};

const inputStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.body.bold,
    color: Colors.textDark,
    marginBottom: 6,
  },
  labelError: {
    color: Colors.danger,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputBoxFocused: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.white,
  },
  inputBoxError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFF8F8',
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Fonts.body.medium,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
    padding: 4,
  },
  errorText: {
    fontSize: 11.5,
    fontFamily: Fonts.body.medium,
    color: Colors.danger,
    marginTop: 5,
    marginLeft: 2,
  },
});

/* ==========================================================================
   7. Checkbox Component
   ========================================================================== */

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  children,
  style,
}) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={[checkboxStyles.container, style]}
    >
      <RNView style={[checkboxStyles.box, checked && checkboxStyles.boxChecked]}>
        {checked && <Feather name="check" size={13} color={Colors.white} />}
      </RNView>
      {label ? (
        <RNText style={checkboxStyles.label}>{label}</RNText>
      ) : (
        <RNView style={checkboxStyles.childrenContainer}>{children}</RNView>
      )}
    </Pressable>
  );
};

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  boxChecked: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  label: {
    fontSize: 12.5,
    fontFamily: Fonts.body.medium,
    color: Colors.textMutedDarker,
  },
  childrenContainer: {
    flex: 1,
  },
});

/* ==========================================================================
   8. Divider Component
   ========================================================================== */

export interface DividerProps {
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({ text, style }) => {
  return (
    <RNView style={[dividerStyles.container, style]}>
      <RNView style={dividerStyles.line} />
      {text ? <RNText style={dividerStyles.text}>{text}</RNText> : null}
      <RNView style={dividerStyles.line} />
    </RNView>
  );
};

const dividerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  text: {
    marginHorizontal: 12,
    fontSize: 11,
    fontFamily: Fonts.body.bold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
});

/* ==========================================================================
   9. OTP Input Component (5 Digits)
   ========================================================================== */

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean | string;
  style?: StyleProp<ViewStyle>;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 5,
  value,
  onChange,
  error,
  style,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chars = value.split('');

    if (cleanText.length > 1) {
      // Handle paste
      const pasted = cleanText.slice(0, length);
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    chars[index] = cleanText;
    const newValue = chars.join('').slice(0, length);
    onChange(newValue);

    if (cleanText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <RNView style={[otpStyles.container, style]}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] || '';
        const isFilled = !!char;
        const isCurrent = i === Math.min(value.length, length - 1);

        return (
          <TextInput
            key={i}
            ref={(ref) => {
              inputRefs.current[i] = ref;
            }}
            keyboardType="default"
            autoCapitalize="characters"
            maxLength={1}
            value={char}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            style={[
              otpStyles.box,
              isFilled && otpStyles.boxFilled,
              isCurrent && otpStyles.boxCurrent,
              !!error && otpStyles.boxError,
            ]}
          />
        );
      })}
    </RNView>
  );
};

const otpStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 18,
  },
  box: {
    width: 52,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Colors.textDark,
  },
  boxFilled: {
    borderColor: Colors.borderAccent,
    backgroundColor: Colors.bgAccent,
  },
  boxCurrent: {
    borderColor: Colors.brandPrimary,
  },
  boxError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFF8F8',
  },
});

/* ==========================================================================
   10. Step Indicator Component
   ========================================================================== */

export interface StepIndicatorProps {
  totalSteps?: number;
  currentStep: number;
  style?: StyleProp<ViewStyle>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps = 3,
  currentStep = 1,
  style,
}) => {
  return (
    <RNView style={[stepStyles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isActive = idx + 1 === currentStep;
        return (
          <RNView
            key={idx}
            style={[stepStyles.pill, isActive ? stepStyles.pillActive : stepStyles.pillInactive]}
          />
        );
      })}
    </RNView>
  );
};

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  pill: {
    height: 5,
    borderRadius: 3,
  },
  pillActive: {
    width: 26,
    backgroundColor: Colors.brandPrimary,
  },
  pillInactive: {
    width: 7,
    backgroundColor: '#CBD5E1',
  },
});

/* ==========================================================================
   11. Social Auth Button Component
   ========================================================================== */

export interface SocialButtonProps extends TouchableOpacityProps {
  provider: 'google' | 'linkedin';
  title?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  title,
  compact = false,
  style,
  ...props
}) => {
  const isGoogle = provider === 'google';

  const defaultTitle = isGoogle
    ? compact
      ? 'Google'
      : 'Continue with Google'
    : compact
      ? 'LinkedIn'
      : 'Continue with LinkedIn';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        socialBtnStyles.button,
        compact && socialBtnStyles.buttonCompact,
        style,
      ]}
      {...props}
    >
      {isGoogle ? (
        <Icon name="google" size={18} style={socialBtnStyles.icon} />
      ) : (
        <Icon name="linkedin" size={18} style={socialBtnStyles.icon} />
      )}
      <RNText style={socialBtnStyles.title}>{title || defaultTitle}</RNText>
    </TouchableOpacity>
  );
};

const socialBtnStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: Colors.borderLight,
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 16,
    width: '100%',
  },
  buttonCompact: {
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 13.5,
    fontFamily: Fonts.body.bold,
    color: Colors.textDark,
  },
});

/* ==========================================================================
   12. Default Export
   ========================================================================== */

export default {
  Text,
  View,
  Card,
  Button,
  Badge,
  Input,
  Checkbox,
  Divider,
  OtpInput,
  StepIndicator,
  SocialButton,
  colors,
};
