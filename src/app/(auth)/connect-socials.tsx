import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import Icon from '../components/IconResolver';
import {
  Button,
  Card,
  Text,
  View,
} from '../components/UI';
import { useAuth } from '../../store/authStore';

interface SocialPlatform {
  id: string;
  name: string;
  defaultHandle: string;
  iconName?: string;
  svgName?: string;
  iconBg: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    defaultHandle: 'Not connected',
    iconName: 'linkedin-in',
    iconBg: '#0077B5',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    defaultHandle: 'Not connected',
    svgName: 'x-icon',
    iconBg: '#000000',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    defaultHandle: 'Not connected',
    svgName: 'instagram-gradient',
    iconBg: '#E1306C',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    defaultHandle: 'Not connected',
    iconName: 'tiktok',
    iconBg: '#000000',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    defaultHandle: 'Not connected',
    iconName: 'facebook-f',
    iconBg: '#1877F2',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    defaultHandle: 'Not connected',
    iconName: 'pinterest-p',
    iconBg: '#BD081C',
  },
];

export default function ConnectSocialsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});

  const toggleConnect = (id: string) => {
    setConnectedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFinish = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {router.canGoBack() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color={Colors.textDark} />
          </TouchableOpacity>
        )}

        {/* Header Title Section */}
        <View style={styles.titleSection}>
          <Text variant="heading" color="dark" style={styles.heading}>
            Connect Social Accounts
          </Text>
          <Text variant="body" color="muted" style={styles.subheading}>
            Link your profiles to start scheduling posts and tracking analytics.
          </Text>
        </View>

        {/* Social Accounts List */}
        <View style={styles.platformList}>
          <FlatList
            data={SOCIAL_PLATFORMS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item: platform }) => {
              const isConnected = !!connectedMap[platform.id];

              return (
                <Card variant="solid" style={styles.platformCard}>
                  {/* Platform Icon Box */}
                  <View style={[styles.iconBox, { backgroundColor: platform.iconBg }]}>
                    {platform.svgName ? (
                      <Icon name={platform.svgName as any} size={40} />
                    ) : (
                      <FontAwesome5 name={platform.iconName} size={18} color={Colors.white} />
                    )}
                  </View>

                  {/* Platform Info */}
                  <View style={styles.platformInfo}>
                    <Text variant="bodyBold" color="dark" style={styles.platformName}>
                      {platform.name}
                    </Text>
                    <Text variant="caption" color={isConnected ? 'primary' : 'muted'} style={styles.handleText}>
                      {isConnected ? (user?.username ? `@${user.username}` : 'Connected') : platform.defaultHandle}
                    </Text>
                  </View>

                  {/* Connect / Connected Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleConnect(platform.id)}
                    style={[
                      styles.connectButton,
                      isConnected && styles.connectButtonActive,
                    ]}
                  >
                    <Text
                      variant="caption"
                      color={isConnected ? 'white' : 'dark'}
                      style={styles.connectButtonText}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            }}
          />
        </View>

        {/* Info Notice Box */}
        <View variant="row" style={styles.infoBox}>
          <View style={styles.infoIconCircle}>
            <Icon name="info" size={14} color={Colors.info} />
          </View>
          <Text variant="caption" color="muted" style={styles.infoText}>
            You can always connect more accounts later from your workspace settings.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            variant="primaryNavy"
            title="Continue to Dashboard"
            icon="arrow-right"
            onPress={handleFinish}
            style={styles.continueButton}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={handleFinish} style={styles.skipButton}>
            <Text variant="caption" color="mutedDarker" style={styles.skipText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  eyebrowRow: {
    gap: 6,
    marginBottom: 10,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brandPrimary,
  },
  eyebrowText: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  titleSection: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  platformList: {
    gap: 10,
    marginBottom: 16,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Colors.borderLight,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 14,
    marginBottom: 2,
  },
  handleText: {
    fontSize: 12,
  },
  connectButton: {
    borderWidth: 1,
    borderColor: Colors.brandPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.white,
  },
  connectButtonActive: {
    backgroundColor: Colors.brandNavy,
    borderColor: Colors.brandNavy,
  },
  connectButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoBox: {
    alignItems: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#D8EAFF',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 22,
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#334155',
  },
  actionSection: {
    alignItems: 'center',
  },
  continueButton: {
    borderRadius: 26,
    height: 52,
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
});
