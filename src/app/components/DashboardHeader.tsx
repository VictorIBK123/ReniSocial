import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { Text } from './UI';
import { useAuthStore } from '../../store/authStore';
import ProfileDropdown from './dashboard/ProfileDropdown';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardHeader() {
  const { user } = useAuthStore();
  const { colors, isDark, setThemePreference } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={[styles.logoIcon, { backgroundColor: colors.brandPrimary }]}>
          <Feather name="send" size={16} color={Colors.white} />
        </View>
        <TouchableOpacity style={[styles.workspaceSelector, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
          <View style={[styles.workspaceAvatar, { backgroundColor: colors.brandPrimary }]}>
            <Text variant="caption" color="white" style={{ fontSize: 10 }}>AA</Text>
          </View>
          <Text variant="bodyBold" style={[styles.workspaceName, { color: colors.textDark }]} numberOfLines={1} ellipsizeMode="tail">Acme Corp Global</Text>
          <Feather name="chevron-down" size={16} color={colors.textDark} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
          <Feather name="bell" size={18} color={colors.textDark} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerIcon, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
          onPress={() => setThemePreference(isDark ? 'light' : 'dark')}
          activeOpacity={0.7}
        >
          <Feather name={isDark ? "sun" : "moon"} size={18} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsProfileMenuOpen(true)}
          style={[styles.profileAvatarWrapper, { borderColor: colors.borderLight }]}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            }}
            style={styles.profileAvatarImg}
          />
        </TouchableOpacity>
      </View>

      {/* Switcher Pill / Profile Dropdown Menu */}
      <ProfileDropdown
        visible={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  profileAvatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
});
