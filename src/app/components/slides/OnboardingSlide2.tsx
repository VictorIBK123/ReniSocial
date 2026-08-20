import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constant';
import Icon from '../IconResolver';
import PaginationDots from '../PaginationDots';
import { Button, Card, Text, View } from '../UI';

interface OnboardingSlide2Props {
  onNext?: () => void;
  onSkip?: () => void;
  onDotPress?: (index: number) => void;
}

export default function OnboardingSlide2({
  onSkip,
  onDotPress,
}: OnboardingSlide2Props) {
  const insets = useSafeAreaInsets();

  return (
    <View variant="screen" style={[styles.container, { paddingTop: Math.max(insets.top + 16, 40) }]}>
      {/* Visual Calendar Schedule Card */}
      <View variant="preview" style={styles.previewContainer}>
        <View variant="topSection" style={styles.topSection}>
          <Text variant="eyebrow" color="primary" style={styles.eyebrow}>
            WE CALL IT.
          </Text>
          <View variant="row" style={styles.logoRow}>
            <Icon name="logoDark" size={40} />
            <Text variant="heading" color="dark" style={styles.brandTitle}>
              ReniSocial
            </Text>
          </View>
          <Text variant="heading" color="dark" style={styles.heading}>
            Visual scheduling that feels like second nature.
          </Text>
        </View>

        <Card variant="subtle" style={styles.calendarCard}>
          {/* Calendar Header */}
          <View variant="row" style={styles.calendarHeader}>
            <Text variant="bodyBold" color="dark" style={styles.calendarMonthText}>
              October 2026
            </Text>
            <View variant="row" style={styles.calendarNavButtons}>
              <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
                <Feather name="chevron-left" size={14} color={Colors.brandNavy} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
                <Feather name="chevron-right" size={14} color={Colors.brandNavy} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday Row */}
          <View variant="row" style={styles.weekdayRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <Text key={idx} variant="caption" color="muted" style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Event Item 1 */}
          <View variant="row" style={styles.eventItem}>
            <View style={styles.activeDateBadge}>
              <Text variant="caption" color="white" style={styles.activeDateBadgeText}>
                12
              </Text>
            </View>
            <View variant="row" style={styles.eventContent}>
              <View style={[styles.statusDot, { backgroundColor: Colors.successAlt }]} />
              <Text variant="body" color="dark" style={styles.eventTitle} numberOfLines={1}>
                Product Demo Video
              </Text>
              <Text variant="caption" color="muted" style={styles.eventTime}>
                4:00 PM
              </Text>
            </View>
          </View>

          {/* Event Item 2 */}
          <View variant="row" style={styles.eventItem}>
            <View style={styles.inactiveDateBadge}>
              <Text variant="caption" style={styles.inactiveDateBadgeText}>
                13
              </Text>
            </View>
            <View variant="row" style={styles.eventContent}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
              <Text variant="body" color="dark" style={styles.eventTitle} numberOfLines={1}>
                LinkedIn Strategy Post
              </Text>
              <Text variant="caption" color="muted" style={styles.eventTime}>
                9:15 AM
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Bottom Section */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <PaginationDots activeIndex={1} theme="light" onDotPress={onDotPress} />

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
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  logoRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  previewContainer: {
    paddingHorizontal: 22,
    alignItems: 'center',
    marginVertical: 'auto',
    width: '100%',
  },
  calendarCard: {
    width: '100%',
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  calendarHeader: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarMonthText: {
    fontSize: 15,
  },
  calendarNavButtons: {
    gap: 6,
  },
  navButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  weekdayRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomColor: Colors.borderLight,
    marginBottom: 12,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventItem: {
    alignItems: 'center',
    borderRadius: 14,
    padding: 7,
  },
  activeDateBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activeDateBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  inactiveDateBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.bgInactive,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inactiveDateBadgeText: {
    color: Colors.textMutedDarker,
    fontSize: 13,
    fontWeight: '700',
  },
  eventContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 11,
    marginLeft: 6,
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
    color: Colors.textMutedDarker,
    fontSize: 14,
    fontWeight: '600',
  },
});
