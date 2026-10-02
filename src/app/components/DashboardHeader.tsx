import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../../constant';
import { Text } from './UI';
import { useAuth } from '../../store/authStore';
import { useWorkspace } from '../../hooks/useWorkspace';
import ProfileDropdown from './ProfileDropdown';
import WorkspaceDropdown from './WorkspaceDropdown';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { colors, isDark, setThemePreference } = useTheme();
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const workspaceSelectorRef = React.useRef<View>(null);

  const brandNavy = isDark ? colors.textDark : '#001E88';

  const formatType = (type?: string) => {
    if (!type) return 'Personal';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const workspaceName = currentWorkspace?.name || 'Acme Corp Global';
  const workspaceInitials = currentWorkspace?.name
    ? currentWorkspace.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AA';

  const handleOpenWorkspaceMenu = () => {
    if (workspaceSelectorRef.current) {
      workspaceSelectorRef.current.measureInWindow((x, y, width, height) => {
        setAnchor({ x, y, width, height });
        setIsWorkspaceMenuOpen(true);
      });
    } else {
      setIsWorkspaceMenuOpen(true);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={[styles.logoIcon, { backgroundColor: colors.brandPrimary }]}
          activeOpacity={0.7}
          onPress={() => router.push('/connect-socials' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="send" size={16} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          ref={workspaceSelectorRef as any}
          style={[styles.workspaceSelector, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
          activeOpacity={0.75}
          onPress={handleOpenWorkspaceMenu}
          onLayout={() => {
            workspaceSelectorRef.current?.measureInWindow((x, y, width, height) => {
              if (x > 0 || y > 0) {
                setAnchor({ x, y, width, height });
              }
            });
          }}
        >
          {currentWorkspace?.logo_url ? (
            <Image source={{ uri: currentWorkspace.logo_url }} style={styles.workspaceAvatar} />
          ) : (
            <View style={[styles.workspaceAvatar, { backgroundColor: brandNavy }]}>
              <Text style={styles.initialsText}>{workspaceInitials}</Text>
            </View>
          )}
          <View style={styles.workspaceHeaderInfo}>
            <Text style={[styles.workspaceName, { color: brandNavy }]} numberOfLines={1} ellipsizeMode="tail">
              {workspaceName}
            </Text>
            <Text style={[styles.workspaceType, { color: colors.textMuted }]} numberOfLines={1}>
              {formatType(currentWorkspace?.type)}
            </Text>
          </View>
          <Feather name="chevron-down" size={15} color={brandNavy} />
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
          {user?.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              style={styles.profileAvatarImg}
            />
          ) : (
            <View style={[styles.profileAvatarImg, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgAccent }]}>
              <Feather name="user" size={18} color={colors.brandPrimary} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Workspace Switcher Dropdown (when clicking workspace info) */}
      <WorkspaceDropdown
        visible={isWorkspaceMenuOpen}
        onClose={() => setIsWorkspaceMenuOpen(false)}
        anchor={anchor}
      />

      {/* User Profile Dropdown (when clicking user profile avatar) */}
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    gap: 8,
    maxWidth: 205,
  },
  workspaceAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 11.5,
    fontFamily: Fonts.body.bold,
    color: '#FFFFFF',
  },
  workspaceHeaderInfo: {
    justifyContent: 'center',
    maxWidth: 115,
  },
  workspaceName: {
    fontSize: 12.5,
    fontFamily: Fonts.body.bold,
    lineHeight: 15,
  },
  workspaceType: {
    fontSize: 10.5,
    fontFamily: Fonts.body.regular,
    lineHeight: 13,
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
