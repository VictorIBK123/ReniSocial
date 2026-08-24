import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constant';
import Icon from '../IconResolver';
import PaginationDots from '../PaginationDots';
import { PaperPlaneIcon } from '../ReniSocialLogo';
import { Button, Text, View } from '../UI';

interface OnboardingSlide5Props {
  onComplete: () => void;
  onSignIn?: () => void;
  onDotPress?: (index: number) => void;
}

export default function OnboardingSlide5({
  onComplete,
  onSignIn,
  onDotPress,
}: OnboardingSlide5Props) {
  const insets = useSafeAreaInsets();

  return (
    <View variant="screenDark" style={[styles.container, { paddingTop: Math.max(insets.top + 16, 40) }]}>

      {/* Visual Content — centered as one group */}
      <View variant="preview" style={styles.previewContainer}>
        <View variant="topSection" style={styles.topSection}>
          <View variant="row" style={styles.logoRow}>
            <Icon name="logoLight" size={40} />
            <Text variant="heading" color="light" style={styles.brandTitle}>
              ReniSocial
            </Text>
          </View>
          <Text variant="heading" color="light" style={styles.heading}>
            Ready to take control of your{'\n'}social presence?
          </Text>
        </View>

        <View style={styles.orbitStage}>
          {/* Outer Ring */}
          <View style={styles.outerRing}>
            {/* Top-Right: Video/Camera Badge */}
            <View style={styles.videoBadge}>
              <Feather name="video" size={16} color={Colors.white} />
            </View>

            {/* Bottom-Right: LinkedIn Badge */}
            <View style={styles.linkedInBadge}>
              <Icon name="linkedin" size={16} color={Colors.white} />
            </View>
          </View>

          {/* Inner Ring */}
          <View style={styles.innerRing}>
            {/* Top-Left: Instagram Badge */}
            <View style={styles.instagramBadge}>
              <Feather name="instagram" size={15} color={Colors.white} />
            </View>
          </View>

          {/* Center ReniSocial Logo Badge */}
          <View style={styles.centerBadge}>
            <PaperPlaneIcon size={34} color={Colors.brandPrimary} />
          </View>
        </View>
      </View>

      {/* Bottom White Container */}
      <View
        variant="bottomCard"
        style={[
          styles.bottomCard,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <PaginationDots activeIndex={4} theme="light" onDotPress={onDotPress} />

        <Button
          variant="primary"
          title="Create Free Workspace"
          icon="arrow-right"
          onPress={onComplete}
          style={styles.primaryButton}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSignIn}
          style={styles.signInContainer}
        >
          <Text variant="caption" color="muted" style={styles.footerMutedText}>
            Have an account?{' '}
            <Text variant="link" style={styles.footerHighlightText}>
              Sign in
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  logoRow: {
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
    width: '100%',
  },
  orbitStage: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 226,
    height: 226,
    borderRadius: 113,
    borderWidth: 1.5,
    borderColor: Colors.glass12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 1.5,
    borderColor: Colors.glass18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  instagramBadge: {
    position: 'absolute',
    top: 6,
    left: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.instagram,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBadge: {
    position: 'absolute',
    top: 14,
    right: 28,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedInBadge: {
    position: 'absolute',
    bottom: 22,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.linkedin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCard: {
    width: '100%',
  },
  primaryButton: {
    marginTop: 20,
  },
  signInContainer: {
    marginTop: 16,
    paddingVertical: 4,
  },
  footerMutedText: {
    fontSize: 12.5,
  },
  footerHighlightText: {
    fontWeight: '700',
  },
});
