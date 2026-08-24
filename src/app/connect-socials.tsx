import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constant';
import Icon from './components/IconResolver';
import {
  Button,
  Card,
  Text,
  View,
} from './components/UI';

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
    id: 'instagram',
    name: 'Instagram',
    defaultHandle: '@yourhandle',
    svgName: 'insta-pink',
    iconBg: 'transparent',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    defaultHandle: '@yourhandle',
    svgName: 'x-black',
    iconBg: 'transparent',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    defaultHandle: '@yourhandle',
    iconName: 'linkedin-in',
    iconBg: '#0A66C2',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    defaultHandle: '@yourhandle',
    iconName: 'tiktok',
    iconBg: '#000000',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    defaultHandle: '@yourhandle',
    iconName: 'facebook-f',
    iconBg: '#1877F2',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    defaultHandle: '@yourhandle',
    svgName: 'pinterest',
    iconBg: 'transparent',
  },
];

export default function ConnectSocialsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});

  const toggleConnect = (id: string) => {
    setConnectedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFinish = () => {
    router.replace('/');
  };

  return (
    <View variant="screen" style={[styles.container, { paddingTop: Math.max(insets.top + 20, 52) }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 28) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow Label */}
        <View variant="row" style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text variant="eyebrow" color="primary" style={styles.eyebrowText}>
            BONUS STEP
          </Text>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text variant="heading" color="dark" style={styles.heading}>
            Connect your social{'\n'}accounts
          </Text>
          <Text variant="body" color="muted" style={styles.subheading}>
            Link your profiles to start scheduling posts and tracking analytics.
          </Text>
        </View>

        {/* Social Accounts List */}
        <View style={styles.platformList}>
          {SOCIAL_PLATFORMS.map((platform) => {
            const isConnected = !!connectedMap[platform.id];

            return (
              <Card key={platform.id} variant="solid" style={styles.platformCard}>
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
                    {isConnected ? '@reniteam' : platform.defaultHandle}
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
          })}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
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
