import { Feather, FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import {
  useDisconnectPlatformMutation,
  useInitiatePlatformConnectMutation,
  useSupportedPlatformsQuery,
  useWorkspace,
  useWorkspaceConnectionsQuery,
} from '../../hooks/useWorkspace';
import { useAuth } from '../../store/authStore';
import ActivityModal, { ActivityModalType } from '../components/ActivityModal';
import Icon from '../components/IconResolver';
import {
  Button,
  Card,
  Text,
  View,
} from '../components/UI';

interface PlatformVisual {
  name: string;
  iconName?: string;
  svgName?: string;
  iconBg: string;
}

const DEFAULT_PLATFORMS: { id: string; name: string }[] = [
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'x', name: 'X (Twitter)' },
  { id: 'meta', name: 'Meta (Instagram & Facebook)' },
];

const PLATFORM_VISUALS: Record<string, PlatformVisual> = {
  linkedin: {
    name: 'LinkedIn',
    iconName: 'linkedin-in',
    iconBg: '#0077B5',
  },
  x: {
    name: 'X (Twitter)',
    svgName: 'x-icon',
    iconBg: '#000000',
  },
  meta: {
    name: 'Meta (Instagram & Facebook)',
    svgName: 'instagram-gradient',
    iconBg: '#1877F2',
  },
};

const getPlatformVisual = (id: string, serverName?: string): PlatformVisual => {
  const key = id.toLowerCase();
  if (PLATFORM_VISUALS[key]) {
    return {
      ...PLATFORM_VISUALS[key],
      name: serverName || PLATFORM_VISUALS[key].name,
    };
  }
  return {
    name: serverName || id.toUpperCase(),
    iconName: 'globe',
    iconBg: '#001E88',
  };
};

export default function ConnectSocialsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const { data: serverPlatforms = [], isLoading: isLoadingPlatforms } = useSupportedPlatformsQuery();
  const { data: connections = [], refetch: refetchConnections } = useWorkspaceConnectionsQuery(currentWorkspace?.id);
  const initiateConnectMutation = useInitiatePlatformConnectMutation();
  const disconnectMutation = useDisconnectPlatformMutation();

  const [connectingPlatformId, setConnectingPlatformId] = useState<string | null>(null);

  const [activityModal, setActivityModal] = useState<{
    visible: boolean;
    type: ActivityModalType;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const platformsToDisplay = useMemo(() => {
    if (serverPlatforms.length > 0) return serverPlatforms;
    return DEFAULT_PLATFORMS;
  }, [serverPlatforms]);

  const handleConnectPress = async (platformId: string) => {
    if (!currentWorkspace?.id) {
      setActivityModal({
        visible: true,
        type: 'error',
        title: 'No Workspace Selected',
        message: 'Please select or create an active workspace before connecting social platforms.',
        confirmText: 'Dismiss',
        onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    const existingConn = connections.find(
      (c) => c.platform?.toLowerCase() === platformId.toLowerCase()
    );

    // If already connected, show an alert
    if (existingConn && existingConn.id) {
      const visual = getPlatformVisual(platformId);
      Alert.alert(
        'Disconnect Platform',
        `Are you sure you want to disconnect ${existingConn.account_name || visual.name} from this workspace?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: async () => {
              try {
                await disconnectMutation.mutateAsync({
                  workspaceId: currentWorkspace.id,
                  connectionId: existingConn.id!,
                });
                refetchConnections();
              } catch (err: any) {
                Alert.alert(
                  'Disconnect Failed',
                  err?.response?.data?.message || err?.message || 'Failed to disconnect platform.'
                );
              }
            },
          },
        ]
      );
      return;
    }

    // Initiate connect
    setConnectingPlatformId(platformId);
    try {
      const response = await initiateConnectMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        platform: platformId,
      });

      // If backend says already connected
      if (response.data && (response.data as any).already_connected) {
        const updated = await refetchConnections();
        const updatedList = updated.data || [];
        const conn = updatedList.find(
          (c) => c.platform?.toLowerCase() === platformId.toLowerCase()
        );
        const visual = getPlatformVisual(platformId);
        Alert.alert(
          'Already Connected',
          `${conn?.account_name || visual.name} is already connected to your workspace.`,
          [
            { text: 'OK' },
            {
              text: 'Go to Posts',
              onPress: () => router.replace('/(tabs)/posts'),
            },
          ]
        );
        return;
      }

      const redirectUrl = response.data?.redirect_url;
      if (!redirectUrl) {
        throw new Error(response.message || 'No redirect URL returned by the server.');
      }

      console.log('[ConnectSocials] Opening auth session for URL:', redirectUrl);
      try {
        const result = await WebBrowser.openAuthSessionAsync(redirectUrl, 'renisocial://');
        console.log('[ConnectSocials] WebBrowser auth session closed with result:', result);
      } catch (browserError) {
        console.warn('[ConnectSocials] WebBrowser fallback to Linking:', browserError);
        await Linking.openURL(redirectUrl);
      }

      // Always refetch connections once the user completes or closes the browser window
      const updated = await refetchConnections();
      const updatedList = updated.data || [];
      const newConn = updatedList.find(
        (c) => c.platform?.toLowerCase() === platformId.toLowerCase()
      );

      if (newConn) {
        const visual = getPlatformVisual(platformId);
        setActivityModal({
          visible: true,
          type: 'success',
          title: 'Connected Successfully!',
          message: `${newConn.account_name || visual.name} has been connected to your workspace.`,
          confirmText: 'Go to Posts',
          onConfirm: () => {
            setActivityModal((prev) => ({ ...prev, visible: false }));
            router.replace('/(tabs)/posts');
          },
        });
      }
    } catch (error: any) {
      console.error('[ConnectSocials] Connection initiation error:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to initiate connection. Please check your network and try again.';
      setActivityModal({
        visible: true,
        type: 'error',
        title: 'Connection Failed',
        message: errorMsg,
        confirmText: 'Dismiss',
        onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setConnectingPlatformId(null);
    }
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
          {isLoadingPlatforms && platformsToDisplay.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.brandPrimary} />
            </View>
          ) : (
            <FlatList
              data={platformsToDisplay}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              renderItem={({ item: platform }) => {
                const visual = getPlatformVisual(platform.id, platform.name);
                const existingConn = connections.find(
                  (c) => c.platform?.toLowerCase() === platform.id.toLowerCase()
                );
                const isConnected = Boolean(existingConn);
                const isConnecting = connectingPlatformId === platform.id;
                const handleText = isConnected
                  ? (existingConn?.account_name || (user?.username ? `@${user.username}` : 'Connected'))
                  : 'Not connected';

                return (
                  <Card variant="solid" style={styles.platformCard}>
                    {/* Platform Icon Box */}
                    <View style={[styles.iconBox, { backgroundColor: visual.iconBg }]}>
                      {visual.svgName ? (
                        <Icon name={visual.svgName as any} size={40} />
                      ) : (
                        <FontAwesome5 name={visual.iconName || 'globe'} size={18} color={Colors.white} />
                      )}
                    </View>

                    {/* Platform Info */}
                    <View style={styles.platformInfo}>
                      <Text variant="bodyBold" color="dark" style={styles.platformName} numberOfLines={1}>
                        {visual.name}
                      </Text>
                      <Text
                        variant="caption"
                        color={isConnected ? 'primary' : 'muted'}
                        style={styles.handleText}
                        numberOfLines={1}
                      >
                        {handleText}
                      </Text>
                    </View>

                    {/* Connect / Connected Button */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleConnectPress(platform.id)}
                      disabled={isConnecting}
                      style={[
                        styles.connectButton,
                        isConnected && styles.connectButtonActive,
                        isConnecting && { opacity: 0.8 },
                      ]}
                    >
                      {isConnecting ? (
                        <ActivityIndicator size="small" color={isConnected ? Colors.white : Colors.brandPrimary} />
                      ) : (
                        <Text
                          variant="caption"
                          color={isConnected ? 'white' : 'dark'}
                          style={styles.connectButtonText}
                        >
                          {isConnected ? 'Connected' : 'Connect'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Card>
                );
              }}
            />
          )}
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

      <ActivityModal
        visible={activityModal.visible}
        type={activityModal.type}
        title={activityModal.title}
        message={activityModal.message}
        confirmText={activityModal.confirmText}
        cancelText={activityModal.cancelText}
        onConfirm={activityModal.onConfirm}
        onCancel={() => {
          const isSuccess = activityModal.type === 'success';
          setActivityModal((prev) => ({ ...prev, visible: false }));
          if (isSuccess) {
            router.replace('/(tabs)/posts');
          }
        }}
        onClose={() => {
          const isSuccess = activityModal.type === 'success';
          setActivityModal((prev) => ({ ...prev, visible: false }));
          if (isSuccess) {
            router.replace('/(tabs)/posts');
          }
        }}
      />
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
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  platformInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  platformName: {
    fontSize: 14.5,
    marginBottom: 2,
  },
  handleText: {
    fontSize: 12,
  },
  connectButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.bgApp,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
    flexShrink: 0,
  },
  connectButtonActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  connectButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  infoIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  actionSection: {
    gap: 12,
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
