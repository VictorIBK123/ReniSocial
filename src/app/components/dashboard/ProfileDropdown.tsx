import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../../constant';
import { Text } from '../UI';
import { useAuthStore } from '../../../store/authStore';
import { useTheme } from '../../../hooks/useTheme';

interface ProfileDropdownProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ visible, onClose }: ProfileDropdownProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) });
    } else {
      opacity.value = withTiming(0, { duration: 100 });
    }
  }, [visible, opacity]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const handleAccountSettings = () => {
    onClose();
    router.push({ pathname: '/(tabs)/settings', params: { tab: 'Profile & Security' } });
  };

  const handlePreferences = () => {
    onClose();
    router.push({ pathname: '/(tabs)/settings', params: { tab: 'Preferences & Theme' } });
  };

  const handleProfile = () => {
    onClose();
    router.push('/(tabs)/workspace');
  };

  const handleSignOut = () => {
    onClose();
    logout();
    router.replace('/(auth)/sign-in');
  };

  const displayName =
    user?.fullName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Adetiba Adedotun');
  const displayEmail = user?.email || 'user123456789@gmail.com';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            backdropAnimatedStyle,
            { paddingTop: Math.max(insets.top, 16) + 68 },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.menuCard, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }, animatedCardStyle]}>
              {/* 1. User Profile Pill */}
              <TouchableOpacity
                style={[styles.userPill, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                activeOpacity={0.7}
                onPress={handleProfile}
              >
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
                  }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textDark }]} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={[styles.userEmail, { color: colors.textMuted }]} numberOfLines={1}>
                    {displayEmail}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 2. Account Settings Pill */}
              <TouchableOpacity
                style={[styles.menuPill, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                activeOpacity={0.7}
                onPress={handleAccountSettings}
              >
                <Feather name="settings" size={16} color={colors.textDark} />
                <Text style={[styles.menuPillText, { color: colors.textDark }]}>Account Settings</Text>
              </TouchableOpacity>

              {/* 3. Preferences & Theme Pill */}
              <TouchableOpacity
                style={[styles.menuPill, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                activeOpacity={0.7}
                onPress={handlePreferences}
              >
                <Feather name="sliders" size={16} color={colors.textDark} />
                <Text style={[styles.menuPillText, { color: colors.textDark }]}>Preferences & Theme</Text>
              </TouchableOpacity>

              {/* 4. Profile Pill */}
              <TouchableOpacity
                style={[styles.menuPill, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                activeOpacity={0.7}
                onPress={handleProfile}
              >
                <Feather name="briefcase" size={16} color={colors.textDark} />
                <Text style={[styles.menuPillText, { color: colors.textDark }]}>Profile</Text>
              </TouchableOpacity>

              {/* 5. Sign out */}
              <TouchableOpacity
                style={styles.signOutBtn}
                activeOpacity={0.7}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuCard: {
    width: 205,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    gap: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.white,
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
  },
  userName: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: Fonts.body.bold,
    color: '#001464',
  },
  userEmail: {
    fontSize: 9.5,
    lineHeight: 11.5,
    fontFamily: Fonts.body.regular,
    color: '#94A3B8',
  },
  menuPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8.5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.white,
    gap: 10,
  },
  menuPillText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: '#334155',
  },
  signOutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    marginTop: 1,
  },
  signOutText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: '#EF4444',
  },
});
