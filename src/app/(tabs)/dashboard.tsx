import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import { useAuthStore } from '../../store/authStore';
import { Text, View, Card, Badge } from '../components/UI';
import Icon from '../components/IconResolver';
import DashboardHeader from '../components/DashboardHeader';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'This Week' | 'This Month'>('This Week');

  // Dummy Data for charts
  const barData = [
    { value: 20, label: 'Mon', frontColor: colors.borderLight },
    { value: 30, label: 'Tue', frontColor: colors.borderLight },
    { value: 45, label: 'Wed', frontColor: colors.borderLight },
    { value: 60, label: 'Thu', frontColor: colors.borderLight },
    { value: 90, label: 'Fri', frontColor: colors.brandPrimary },
    { value: 30, label: 'Sat', frontColor: colors.borderLight },
    { value: 25, label: 'Sun', frontColor: colors.borderLight },
  ];

  const pieData = [
    { value: 45, color: '#0A66C2', text: '45%' }, // LinkedIn
    { value: 35, color: '#E1306C', text: '35%' }, // Instagram
    { value: 20, color: colors.textDark, text: '20%' }, // X (Twitter)
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.bgApp }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <DashboardHeader />

        {/* Title & Tabs */}
        <View style={styles.titleSection}>
          <Text variant="heading" style={styles.pageTitle}>Dashboard</Text>
          <View style={styles.tabToggle}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'This Week' && styles.tabButtonActive]}
              onPress={() => setActiveTab('This Week')}
            >
              <Text variant="caption" color={activeTab === 'This Week' ? 'primary' : 'muted'} style={activeTab === 'This Week' ? styles.tabTextActive : {}}>
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'This Month' && styles.tabButtonActive]}
              onPress={() => setActiveTab('This Month')}
            >
              <Text variant="caption" color={activeTab === 'This Month' ? 'primary' : 'muted'} style={activeTab === 'This Month' ? styles.tabTextActive : {}}>
                This Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <Card style={{ flex: 1 }}>
              <View style={styles.statHeader}>
                <Text variant="caption" style={styles.statLabel}>TOTAL POSTS</Text>
                <Badge variant="success" label="↑ +12%" />
              </View>
              <Text variant="heading" style={styles.statValue}>48</Text>
            </Card>
            <Card style={{ flex: 1 }}>
              <View style={styles.statHeader}>
                <Text variant="caption" style={styles.statLabel}>SCHEDULED</Text>
                <Badge variant="info" label="Upcoming" />
              </View>
              <Text variant="heading" style={styles.statValue}>14</Text>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={{ flex: 1 }}>
              <View style={styles.statHeader}>
                <Text variant="caption" style={styles.statLabel}>DRAFT</Text>
                <Badge variant="success" label="↑ +8%" />
              </View>
              <Text variant="heading" style={styles.statValue}>10</Text>
            </Card>
            <Card style={{ flex: 1 }}>
              <View style={styles.statHeader}>
                <Text variant="caption" style={styles.statLabel}>FAILED</Text>
                <Badge variant="danger" label="↓ -25%" />
              </View>
              <Text variant="heading" style={styles.statValue}>3</Text>
            </Card>
          </View>

          <Card>
            <View style={styles.statHeader}>
              <Text variant="caption" style={styles.statLabel}>PUBLISHED</Text>
              <Badge variant="success" label="↑ +8%" />
            </View>
            <Text variant="heading" style={styles.statValue}>31</Text>
          </Card>
        </View>

        {/* Publishing Activity Chart */}
        <Card style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <Text variant="bodyBold" style={styles.sectionTitle}>Publishing Activity</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              barWidth={16}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              hideYAxisText
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: 'transparent' }}
              noOfSections={3}
              maxValue={100}
              initialSpacing={10}
              height={100}
            />
          </View>
        </Card>

        {/* Platform Distribution */}
        <Card style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <Text variant="bodyBold" style={styles.sectionTitle}>Platform Distribution</Text>
          <View style={styles.donutContainer}>
            <PieChart
              donut
              innerRadius={28}
              radius={40}
              data={pieData}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text variant="heading" style={{ fontSize: 14 }}>3</Text>
                  </View>
                );
              }}
            />
            <View style={styles.legendContainer}>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: '#0A66C2' }]} />
                  <Icon name="linkedin" size={14} color="#0A66C2" style={styles.legendIcon} />
                  <Text variant="caption">LinkedIn</Text>
                </View>
                <Text variant="bodyBold">45%</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: '#E1306C' }]} />
                  <Icon name="instagram-gradient" size={14} color="#E1306C" style={styles.legendIcon} />
                  <Text variant="caption">Instagram</Text>
                </View>
                <Text variant="bodyBold">35%</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: '#000000' }]} />
                  <Icon name="x-icon" size={14} color="#000000" style={styles.legendIcon} />
                  <Text variant="caption">X (Twitter)</Text>
                </View>
                <Text variant="bodyBold">20%</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Platform Overview */}
        <Text variant="bodyBold" style={[styles.sectionTitle, { marginLeft: 24, marginTop: 16 }]}>Platform Overview</Text>
        <View style={styles.platformGrid}>
          {/* Instagram */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#E1306C' }]}>
                <Icon name="instagram-gradient" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>INSTAGRAM</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>5</Text>
          </Card>
          {/* X */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#000000' }]}>
                <Icon name="x-icon" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>X/TWITTER</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>14</Text>
          </Card>
          {/* LinkedIn */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#0A66C2' }]}>
                <Icon name="linkedin" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>LINKEDIN</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>10</Text>
          </Card>
          {/* TikTok */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#000000' }]}>
                <FontAwesome5 name="tiktok" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>TIKTOK</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>3</Text>
          </Card>
          {/* Facebook */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#1877F2' }]}>
                <FontAwesome5 name="facebook-f" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>FACEBOOK</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>2</Text>
          </Card>
          {/* Pinterest */}
          <Card style={{ width: '48%' }}>
            <View style={styles.platformHeader}>
              <View style={[styles.platformIconBg, { backgroundColor: '#E60023' }]}>
                <Icon name="pinterest" size={14} color="#FFF" />
              </View>
              <Text variant="caption" style={styles.platformName}>PINTEREST</Text>
            </View>
            <Text variant="heading" style={styles.platformValue}>0</Text>
          </Card>
        </View>

        {/* Recent Activity */}
        <Card style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <Text variant="bodyBold" style={styles.sectionTitle}>Recent Activity</Text>

          <View style={styles.activityItem}>
            <View style={[styles.activityIconBg, { backgroundColor: '#E1306C' }]}>
              <Icon name="instagram-gradient" size={16} color="#FFF" />
            </View>
            <View style={styles.activityContent}>
              <Text variant="bodyBold" style={styles.activityTitle}>Instagram Campaign published</Text>
              <View style={styles.activityMeta}>
                <View style={[styles.statusDot, { backgroundColor: Colors.brandPrimary }]} />
                <Text variant="caption" color="muted">Published • 2h ago</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIconBg, { backgroundColor: '#0A66C2' }]}>
              <Icon name="linkedin" size={16} color="#FFF" />
            </View>
            <View style={styles.activityContent}>
              <Text variant="bodyBold" style={styles.activityTitle}>LinkedIn Strategy Post scheduled</Text>
              <View style={styles.activityMeta}>
                <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
                <Text variant="caption" color="muted">Scheduled • Tomorrow 9:00 AM</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIconBg, { backgroundColor: '#000000' }]}>
              <Icon name="x-icon" size={16} color="#FFF" />
            </View>
            <View style={styles.activityContent}>
              <Text variant="bodyBold" style={styles.activityTitle}>Weekly Wrap-up Thread failed — retry avai...</Text>
              <View style={styles.activityMeta}>
                <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
                <Text variant="caption" color="muted">Failed • 1d ago</Text>
              </View>
            </View>
          </View>

        </Card>

        {/* Bottom spacer for FAB & Tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
    flexShrink: 1,
  },
  workspaceAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceName: {
    fontSize: 12,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  statsGrid: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
    color: Colors.textDark,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 36,
    includeFontPadding: false,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 24,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendIcon: {
    width: 14,
    textAlign: 'center',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  platformIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformName: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
  },
  platformValue: {
    fontSize: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  activityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
});
