import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Fonts } from '../../constant';

interface ReniSocialLogoProps {
  variant?: 'light' | 'dark' | 'badge';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const PaperPlaneIcon = ({ size = 20, color = Colors.brandPrimary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 2.5L2 10.5L10 14L13.5 22L21.5 2.5Z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 14L21.5 2.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function ReniSocialLogo({
  variant = 'light',
  size = 'medium',
  showText = true,
}: ReniSocialLogoProps) {
  const isDark = variant === 'dark';

  if (variant === 'badge') {
    return (
      <View style={styles.badgeContainer}>
        <View style={styles.badgeCircle}>
          <PaperPlaneIcon size={24} color={Colors.brandPrimary} />
        </View>
      </View>
    );
  }

  const iconBgColor = isDark ? Colors.white : Colors.brandPrimary;
  const iconPlaneColor = isDark ? Colors.brandPrimary : Colors.white;
  const textColor = isDark ? Colors.white : Colors.brandNavy;

  const iconBoxSize = size === 'large' ? 44 : size === 'small' ? 32 : 38;
  const iconSize = size === 'large' ? 22 : size === 'small' ? 16 : 19;
  const fontSize = size === 'large' ? 24 : size === 'small' ? 17 : 21;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: iconBoxSize,
            height: iconBoxSize,
            borderRadius: iconBoxSize * 0.28,
            backgroundColor: iconBgColor,
          },
        ]}
      >
        <PaperPlaneIcon size={iconSize} color={iconPlaneColor} />
      </View>
      {showText && (
        <Text style={[styles.brandText, { color: textColor, fontSize }]}>
          ReniSocial
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandText: {
    fontFamily: Fonts.heading.extraBold,
    letterSpacing: -0.5,
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
