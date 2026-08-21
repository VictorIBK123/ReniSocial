import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constant';
import Icon from './components/IconResolver';
import {
  Badge,
  Button,
  Card,
  Text,
  View,
} from './components/UI';

export default function WelcomeSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoDashboard = () => {
    router.replace('/');
  };

  return (
    <View variant="screenDark" style={[styles.container, { paddingTop: Math.max(insets.top + 20, 52) }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 28) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View variant="row" style={styles.brandHeader}>
          <Icon name="logoLight" size={32} />
          <Text variant="heading" color="light" style={styles.brandTitle}>
            ReniSocial
          </Text>
        </View>

        {/* Center Illustration Stage */}
        <View style={styles.centerStage}>
          {/* Glowing Avatar Ring */}
          <View style={styles.avatarOuterRing}>
            <View style={styles.avatarInnerCircle}>
              <Feather name="check" size={36} color={Colors.white} />
            </View>
          </View>

          {/* Heading & Subheading */}
          <Text variant="heading" color="light" style={styles.heading}>
            You're all set!
          </Text>
          <Text variant="body" color="mutedLight" style={styles.subheading}>
            Your Renisocial account is ready. Let's set up your first workspace.
          </Text>

          {/* Dashboard Preview Card */}
          <Card variant="solid" style={styles.dashboardCard}>
            <View variant="row" style={styles.cardHeader}>
              <Text variant="bodyBold" color="dark" style={styles.cardTitle}>
                Dashboard
              </Text>
              <View variant="row" style={styles.pillGroup}>
                <Badge variant="subtle" style={styles.miniPill}>
                  <Text variant="caption" color="primary" style={styles.pillText}>
                    +24.5%
                  </Text>
                </Badge>
                <Badge variant="success" style={styles.miniPill}>
                  <Text variant="caption" color="success" style={styles.pillText}>
                    1.7k
                  </Text>
                </Badge>
                <Badge variant="warning" style={styles.miniPill}>
                  <Text variant="caption" color="warning" style={styles.pillText}>
                    Reach
                  </Text>
                </Badge>
              </View>
            </View>

            {/* Weekly Posts Mini Bar Chart Mockup */}
            <View style={styles.chartSection}>
              <Text variant="caption" color="muted" style={styles.chartLabel}>
                WEEKLY POSTS
              </Text>
              <View variant="row" style={styles.barsRow}>
                {[35, 55, 40, 85, 60, 95, 70].map((height, i) => (
                  <View key={i} style={styles.barColumn}>
                    <View
                      style={[
                        styles.bar,
                        { height: height * 0.45 },
                        i === 5 ? styles.barActive : styles.barInactive,
                      ]}
                    />
                    <Text variant="caption" color="muted" style={styles.barDayText}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Upcoming Post Snippet */}
            <View variant="row" style={styles.upcomingSnippet}>
              <View style={styles.postDot} />
              <View style={styles.upcomingDetails}>
                <Text variant="bodyBold" color="dark" style={styles.upcomingTitle}>
                  Upcoming Post
                </Text>
                <Text variant="caption" color="muted">
                  Today 4:00 PM • Instagram
                </Text>
              </View>
              <Badge variant="success" label="Done" />
            </View>
          </Card>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGoDashboard}
            style={styles.whiteButton}
          >
            <Text variant="bodyBold" color="dark" style={styles.whiteButtonText}>
              Go To Dashboard
            </Text>
            <Feather name="arrow-right" size={16} color={Colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/connect-socials' as any)}
            style={styles.scheduleLink}
          >
            <Text variant="caption" color="light" style={styles.scheduleText}>
              Or schedule a post now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  brandHeader: {
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  centerStage: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 'auto',
  },
  avatarOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: '90%',
  },
  dashboardCard: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
  },
  cardHeader: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
  },
  pillGroup: {
    gap: 6,
  },
  miniPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  chartSection: {
    marginBottom: 14,
  },
  chartLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  barsRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 52,
    paddingHorizontal: 6,
  },
  barColumn: {
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: 14,
    borderRadius: 4,
  },
  barActive: {
    backgroundColor: Colors.brandPrimary,
  },
  barInactive: {
    backgroundColor: Colors.borderAccent,
  },
  barDayText: {
    fontSize: 9,
    fontWeight: '600',
  },
  upcomingSnippet: {
    alignItems: 'center',
    backgroundColor: Colors.bgLight,
    padding: 10,
    borderRadius: 12,
  },
  postDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
    marginRight: 10,
  },
  upcomingDetails: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 12,
    marginBottom: 1,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  whiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 26,
    height: 52,
    width: '100%',
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  whiteButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleLink: {
    marginTop: 14,
    paddingVertical: 6,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
