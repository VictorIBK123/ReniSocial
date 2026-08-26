import React from 'react';
import { Tabs } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

function TabBarIcon({ name, color }: { name: any; color: any }) {
  return <Feather size={24} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="dashboard"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.brandPrimary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: Colors.borderLight,
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
            tabBarIcon: ({ color }) => <TabBarIcon name="activity" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ideas"
          options={{
            title: 'Ideas',
            tabBarIcon: ({ color }) => <FontAwesome5 size={24} style={{ marginBottom: -3 }} name="lightbulb" color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
          }}
        />
      </Tabs>

      {/* FAB Overlay */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} disabled={true}>
          <Feather name="plus" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
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
    opacity: 0.7, // disabled look
  },
});
