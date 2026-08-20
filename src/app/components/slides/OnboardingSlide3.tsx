import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constant';
import Icon from '../IconResolver';
import PaginationDots from '../PaginationDots';
import { Button, Card, Text, View } from '../UI';

interface OnboardingSlide3Props {
  onNext?: () => void;
  onSkip?: () => void;
  onDotPress?: (index: number) => void;
}

export default function OnboardingSlide3({
  onSkip,
  onDotPress,
}: OnboardingSlide3Props) {
  const insets = useSafeAreaInsets();
  const [selectedWorkspace, setSelectedWorkspace] = useState<'acme' | 'vortex'>('acme');

  return (
    <View variant="screenDark" style={[styles.container, { paddingTop: Math.max(insets.top + 16, 40) }]}>
      {/* Visual Workspaces Card */}
      <View variant="preview" style={styles.previewContainer}>
        <View variant="topSection" style={styles.topSection}>
          <View variant="row" style={styles.logoRow}>
            <Icon name="logoLight" size={40} />
            <Text variant="heading" color="light" style={styles.brandTitle}>
              ReniSocial
            </Text>
          </View>
          <Text variant="heading" color="light" style={styles.heading}>
            It keeps your brands organized, giving each its own workspace.
          </Text>
        </View>

        <Card variant="glass" style={styles.workspaceWrapper}>
          <Text variant="label" color="mutedLight" style={styles.selectLabel}>
            SELECT ACTIVE WORKSPACE
          </Text>

          {/* Card 1: Acme Corp Global */}
          <Card
            variant="interactive"
            active={selectedWorkspace === 'acme'}
            onPress={() => setSelectedWorkspace('acme')}
          >
            <View
              style={[
                styles.avatarBox,
                selectedWorkspace === 'acme'
                  ? styles.activeAvatarBox
                  : styles.inactiveAvatarBox,
              ]}
            >
              <Text variant="bodyBold" color="white" style={styles.avatarText}>
                A
              </Text>
            </View>
            <View style={styles.workspaceInfo}>
              <Text
                variant="bodyBold"
                color={selectedWorkspace === 'acme' ? 'dark' : 'light'}
                style={styles.workspaceName}
              >
                Acme Corp Global
              </Text>
              <Text
                variant="caption"
                color={selectedWorkspace === 'acme' ? 'muted' : 'mutedDark'}
              >
                4 social profiles connected
              </Text>
            </View>
            {selectedWorkspace === 'acme' && (
              <View style={styles.checkCircle}>
                <Feather name="check" size={14} color={Colors.white} />
              </View>
            )}
          </Card>

          {/* Card 2: Vortex Media */}
          <Card
            variant="interactive"
            active={selectedWorkspace === 'vortex'}
            onPress={() => setSelectedWorkspace('vortex')}
          >
            <View
              style={[
                styles.avatarBox,
                selectedWorkspace === 'vortex'
                  ? styles.activeAvatarBox
                  : styles.inactiveAvatarBox,
              ]}
            >
              <Text variant="bodyBold" color="white" style={styles.avatarText}>
                V
              </Text>
            </View>
            <View style={styles.workspaceInfo}>
              <Text
                variant="bodyBold"
                color={selectedWorkspace === 'vortex' ? 'dark' : 'light'}
                style={styles.workspaceName}
              >
                Vortex Media
              </Text>
              <Text
                variant="caption"
                color={selectedWorkspace === 'vortex' ? 'muted' : 'mutedDark'}
              >
                2 social profiles connected
              </Text>
            </View>
            {selectedWorkspace === 'vortex' && (
              <View style={styles.checkCircle}>
                <Feather name="check" size={14} color={Colors.white} />
              </View>
            )}
          </Card>
        </Card>
      </View>

      {/* Bottom Section */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <PaginationDots activeIndex={2} theme="dark" onDotPress={onDotPress} />

        <Button
          variant="ghost"
          title="Skip"
          fullWidth={false}
          onPress={onSkip}
          style={styles.skipButton}
          textStyle={styles.skipButtonText}
        />
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
    paddingTop: 8,
    marginBottom: 28,
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
    alignSelf: 'center',
    marginVertical: 'auto',
    width: '90%',
  },
  workspaceWrapper: {
    width: '100%',
    backgroundColor: Colors.glass06,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glass12,
  },
  selectLabel: {
    fontSize: 10.5,
    marginBottom: 14,
    marginLeft: 4,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeAvatarBox: {
    backgroundColor: Colors.brandPrimary,
  },
  inactiveAvatarBox: {
    backgroundColor: Colors.glass15,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    fontSize: 14,
    marginBottom: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  skipButton: {
    marginTop: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: Colors.glass85,
    fontSize: 14,
    fontWeight: '600',
  },
});
