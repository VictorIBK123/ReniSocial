import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PaginationDots from '../PaginationDots';
import ReniSocialLogo, { PaperPlaneIcon } from '../ReniSocialLogo';
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
      {/* Top Header Section */}
      <View variant="topSection" style={styles.topSection}>
        <ReniSocialLogo variant="dark" size="medium" />
        <Text variant="heading" color="light" style={styles.heading}>
          Ready to take control of your{'\n'}social presence?
        </Text>
      </View>

      {/* Visual Orbit Illustration */}
      <View variant="preview" style={styles.previewContainer}>
        <View style={styles.orbitStage}>
          {/* Outer Ring */}
          <View style={styles.outerRing}>
            {/* Top-Right: Video/Camera Badge */}
            <View style={styles.videoBadge}>
              <Feather name="video" size={16} color="#FFFFFF" />
            </View>

            {/* Bottom-Right: LinkedIn Badge */}
            <View style={styles.linkedInBadge}>
              <FontAwesome5 name="linkedin-in" size={15} color="#FFFFFF" />
            </View>
          </View>

          {/* Inner Ring */}
          <View style={styles.innerRing}>
            {/* Top-Left: Instagram Badge */}
            <View style={styles.instagramBadge}>
              <Feather name="instagram" size={15} color="#FFFFFF" />
            </View>
          </View>

          {/* Center ReniSocial Logo Badge */}
          <View style={styles.centerBadge}>
            <PaperPlaneIcon size={34} color="#08299B" />
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
    backgroundColor: '#08299B',
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
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
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  instagramBadge: {
    position: 'absolute',
    top: 6,
    left: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1306C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  videoBadge: {
    position: 'absolute',
    top: 14,
    right: 28,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  linkedInBadge: {
    position: 'absolute',
    bottom: 22,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0A66C2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A66C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
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
