import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constant';
import { Icon } from '../IconResolver';
import PaginationDots from '../PaginationDots';
import { Badge, Button, Card, Text, View } from '../UI';

interface OnboardingSlide1Props {
  onNext: () => void;
  onSignIn?: () => void;
  onDotPress?: (index: number) => void;
}

export default function OnboardingSlide1({
  onNext,
  onSignIn,
  onDotPress,
}: OnboardingSlide1Props) {
  const insets = useSafeAreaInsets();
  return (
    <View variant="screenDark" style={[styles.container, { paddingTop: Math.max(insets.top + 16, 40) }]}>
      {/* Visual Workspace Card */}
      <View variant="preview" style={styles.previewContainer}>
        <View variant="topSection" style={styles.topSection}>
          <Icon name="logoLight" size={40} />

          <Text variant="heading" color="light" style={styles.heading}>
            Your social media, managed{'\n'}from one calm workspace.
          </Text>
        </View>

        <Card variant="glass" style={styles.windowCard}>
          {/* Window bar */}
          <View variant="row" style={styles.windowHeader}>
            <View variant="row" style={styles.windowDots}>
              <View style={styles.miniDot} />
              <View style={styles.miniDot} />
              <View style={styles.miniDot} />
            </View>
            <Badge variant="glass" label="@acmebrand" />
          </View>

          {/* Post Item 1: Instagram (Active / Ready) */}
          <Card variant="post" style={styles.activePostCard}>
            <View style={styles.postIconContainer}>
              <Icon name="instagram" size={15} color={Colors.brandPrimary} />
            </View>
            <View style={styles.postDetails}>
              <Text variant="bodyBold" color="dark" style={styles.activePostTitle}>
                Instagram Campaign
              </Text>
              <Text variant="caption" color="muted">
                Scheduled for 10:00 AM
              </Text>
            </View>
            <Badge variant="success" label="Ready" />
          </Card>

          {/* Post Item 2: Twitter Thread (Draft) */}
          <View style={styles.draftPostCard}>
            <View style={styles.draftIconContainer}>
              <Icon name="twitter" size={14} color={Colors.white} />
            </View>
            <View style={styles.postDetails}>
              <Text variant="bodyBold" color="light" style={styles.draftPostTitle}>
                Weekly Wrap-up Thread
              </Text>
              <Text variant="caption" color="mutedDark">
                Draft
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Bottom White Container */}
      <View
        variant="bottomCard"
        style={[
          styles.bottomCard,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <PaginationDots activeIndex={0} theme="light" onDotPress={onDotPress} />

        <Button
          variant="primaryNavy"
          title="Get Started"
          icon="arrow-right"
          onPress={onNext}
          style={styles.primaryButton}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSignIn}
          style={styles.signInContainer}
        >
          <Text variant="caption" color="muted" style={styles.footerMutedText}>
            Already on Renisocial?{' '}
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
  heading: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 'auto',
    width: '100%',
  },
  windowCard: {
    marginTop: 24,
    width: '90%',
  },
  windowHeader: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  windowDots: {
    gap: 5,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.glass40,
  },
  activePostCard: {
    marginBottom: 10,
  },
  postIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postDetails: {
    flex: 1,
  },
  activePostTitle: {
    fontSize: 13.5,
    marginBottom: 2,
  },
  draftPostCard: {
    backgroundColor: Colors.glass09,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass08,
  },
  draftIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.glass12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  draftPostTitle: {
    fontSize: 13.5,
    marginBottom: 2,
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
