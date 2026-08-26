import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { Text } from './UI';
import { useAuthStore } from '../../store/authStore';

export default function DashboardHeader() {
  const { user } = useAuthStore();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoIcon}>
          <Feather name="send" size={16} color={Colors.white} />
        </View>
        <TouchableOpacity style={styles.workspaceSelector}>
          <View style={styles.workspaceAvatar}>
            <Text variant="caption" color="white" style={{ fontSize: 10 }}>AA</Text>
          </View>
          <Text variant="bodyBold" style={styles.workspaceName} numberOfLines={1} ellipsizeMode="tail">Acme Corp Global</Text>
          <Feather name="chevron-down" size={16} color={Colors.textDark} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="bell" size={18} color={Colors.textDark} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="moon" size={18} color={Colors.textDark} />
        </TouchableOpacity>
        <View style={styles.profileAvatar}>
          {/* Fallback to initials if no photo */}
          <Text variant="caption" color="white" style={{ fontSize: 12 }}>
            {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
          </Text>
        </View>
      </View>
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
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
