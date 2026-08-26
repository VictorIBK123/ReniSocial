import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import Icon from '../components/IconResolver';
import {
  Text,
  View
} from '../components/UI';

export default function WelcomeSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoDashboard = () => {
    router.replace('/(tabs)/dashboard');
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
          <Text align="center" variant="heading" color="light" style={styles.brandTitle}>
            ReniSocial
          </Text>
        </View>

        {/* Center Illustration Stage */}
        <View style={styles.centerStage}>
          {/* Empty Ring */}
          <View style={styles.avatarOuterRing} />

          {/* Heading & Subheading */}
          <Text variant="heading" color="light" style={styles.heading}>
            You're all set!
          </Text>
          <Text variant="body" color="mutedDark" style={styles.subheading}>
            Your Renisocial account is ready. Let's set up your first workspace.
          </Text>

          {/* Dashboard Preview Card */}
          <Icon
            name="calendar-dashboard"
            width="100%" 
            height={250} 
            style={styles.dashboardCardImage} 
          />
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
    justifyContent: "center",
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
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  dotsMenu: {
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  pillBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoBg,
    gap: 4,
    paddingHorizontal: 6,
  },
  pillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    gap: 4,
    paddingHorizontal: 6,
  },
  pillYellow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningBg,
    gap: 4,
    paddingHorizontal: 6,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  schedBadge: {
    backgroundColor: Colors.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  schedBadgeText: {
    color: Colors.info,
    fontSize: 10,
    fontWeight: '700',
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
  dashboardCardImage: {
    width: '100%',
    height: 250,
  },
});
