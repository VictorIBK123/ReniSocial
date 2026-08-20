import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../IconResolver';
import PaginationDots from '../PaginationDots';
import { Button, Text, View } from '../UI';

interface OnboardingSlide4Props {
  onNext?: () => void;
  onSkip?: () => void;
  onDotPress?: (index: number) => void;
}

export default function OnboardingSlide4({
  onSkip,
  onDotPress,
}: OnboardingSlide4Props) {
  const insets = useSafeAreaInsets();
  const [approved, setApproved] = useState(false);

  return (
    <View variant="screen" style={[styles.container, { paddingTop: Math.max(insets.top + 16, 40) }]}>
      {/* Visual Collaboration & Approval Flow */}
      <View variant="preview" style={styles.previewContainer}>
        <View variant="topSection" style={styles.topSection}>
          <View variant="row" style={styles.logoRow}>
            <Icon name="logoDark" size={40} />
            <Text variant="heading" color="dark" style={styles.brandTitle}>
              ReniSocial
            </Text>
          </View>
          <Text variant="heading" color="dark" style={styles.heading}>
            Your whole team, connected.{'\n'}Approvals are just a tap away.
          </Text>
        </View>

        <View variant="row" style={styles.illustrationCard}>
          {/* Left Avatar: JD (Designer) */}
          <View variant="column" style={styles.userColumn}>
            <View style={styles.designerAvatar}>
              <Text variant="bodyBold" color="white" style={styles.avatarText}>
                JD
              </Text>
            </View>
            <Text variant="caption" color="muted" style={styles.userRole}>
              Designer
            </Text>
          </View>

          {/* Center Action Button */}
          <Button
            variant="outline"
            title="TAP TO APPROVE"
            fullWidth={false}

            style={styles.approveButton}
            textStyle={styles.approveButtonText}
          />

          {/* Right Avatar: SC (Manager) */}
          <View variant="column" style={styles.userColumn}>
            <View style={styles.managerAvatar}>
              <Text variant="bodyBold" color="white" style={styles.avatarText}>
                SC
              </Text>
            </View>
            <Text variant="caption" color="muted" style={styles.userRole}>
              Manager
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <PaginationDots activeIndex={3} theme="light" onDotPress={onDotPress} />

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
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  logoRow: {
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 10,
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
  illustrationCard: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 36,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  userColumn: {
    alignItems: 'center',
  },
  designerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#08299B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#08299B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  managerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#091E42',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  userRole: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#08299B',
    borderRadius: 18,
    height: 40,
    width: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  approveButtonText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#08299B',
    letterSpacing: 0.6,
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
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
