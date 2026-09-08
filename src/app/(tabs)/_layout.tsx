import React from 'react';
import { Tabs, useSegments, useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { View, StyleSheet, TouchableOpacity, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { Icon } from '../components/IconResolver';
import NewPostComposer from '../components/NewPostComposer';
import { useComposerStore } from '../../store/composerStore';
import { useTheme } from '../../hooks/useTheme';

function TabBarIcon({ name, color }: { name: any; color: any }) {
  return <Feather size={24} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const { openComposer } = useComposerStore();
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const currentRoute = segments[segments.length - 1];
  const isMoreActive = currentRoute === 'settings' || currentRoute === 'workspace';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <Tabs
        initialRouteName="dashboard"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brandPrimary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.bgCard,
            borderTopWidth: 1,
            borderTopColor: colors.borderLight,
            height: 80,
            paddingBottom: 24,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: 'PlusJakartaSans_600SemiBold',
          }
        }}
      >
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="posts"
          options={{
            title: 'Posts',
            tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Icon name="icon-analytics" size={24} color={color as string} style={{ marginBottom: -3 }} />,
          }}
        />
        <Tabs.Screen
          name="ideas"
          options={{
            title: 'Ideas',
            tabBarIcon: ({ color }) => <Icon name="icon-lightbulb" size={24} color={color as string} style={{ marginBottom: -3 }} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="workspace"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => (
              <View style={isMoreActive ? [styles.activeMoreIconWrapper, { backgroundColor: colors.bgAccent }] : null}>
                <Feather 
                  name="settings" 
                  color={isMoreActive ? colors.brandPrimary : color} 
                  size={24} 
                  style={{ marginBottom: -3 }} 
                />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <Text style={[styles.tabLabel, { color: isMoreActive ? colors.brandPrimary : color }]}>
                More
              </Text>
            )
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsMoreMenuVisible(!isMoreMenuVisible);
            },
          }}
        />
      </Tabs>

      {/* More Menu Overlay */}
      {isMoreMenuVisible && (
        <Pressable 
          style={styles.overlay} 
          onPress={() => setIsMoreMenuVisible(false)}
        >
          <View style={[styles.moreMenuContainer, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
            <TouchableOpacity 
              style={[styles.moreMenuItem, { borderColor: colors.borderLight }]}
              onPress={() => {
                setIsMoreMenuVisible(false);
                router.navigate('/workspace');
              }}
            >
              <Icon name="workspace" size={18} color={colors.textDark} />
              <View style={styles.moreMenuTextContainer}>
                <View style={styles.moreMenuTextWrapper}>
                  <Text style={[styles.moreMenuText, { color: colors.textDark }]}>Workspace</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.moreMenuItem, { borderColor: colors.borderLight }]}
              onPress={() => {
                setIsMoreMenuVisible(false);
                router.navigate('/settings');
              }}
            >
              <Feather name="settings" size={18} color={colors.textDark} />
              <View style={styles.moreMenuTextContainer}>
                <View style={styles.moreMenuTextWrapper}>
                  <Text style={[styles.moreMenuText, { color: colors.textDark }]}>Settings</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      {/* FAB Overlay */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => openComposer('Composer')}
        >
          <Feather name="plus" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Global New Post Composer Bottom Sheet */}
      <NewPostComposer />
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  moreMenuContainer: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    width: 200,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  moreMenuTextContainer: {
    marginLeft: 12,
  },
  moreMenuTextWrapper: {
    justifyContent: 'center',
  },
  moreMenuText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  activeMoreIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginTop: 5,
  }
});
