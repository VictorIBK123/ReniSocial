import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
  ScrollView,
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
import Svg, { Circle } from 'react-native-svg';
import { Fonts } from '../../constant';
import { Text } from './UI';
import { useTheme } from '../../hooks/useTheme';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Workspace } from '../../services/workspace.service';

export interface WorkspaceDropdownProps {
  visible: boolean;
  onClose: () => void;
  anchor?: { x: number; y: number; width: number; height: number } | null;
}

export default function WorkspaceDropdown({
  visible,
  onClose,
  anchor,
}: WorkspaceDropdownProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { workspaces = [], currentWorkspace, setActiveWorkspaceId } = useWorkspace();

  const [isExpanded, setIsExpanded] = useState(true);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) });
      setIsExpanded(true);
    } else {
      opacity.value = withTiming(0, { duration: 90 });
    }
  }, [visible, opacity]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(visible ? 0 : -4, { duration: 100 }) }],
  }));

  if (!visible) return null;

  const brandNavy = isDark ? colors.textDark : '#001E88';

  const getInitials = (name?: string, fallback = 'AA') => {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (name.length >= 2) {
      return name.slice(0, 2).toUpperCase();
    }
    return fallback;
  };

  const formatType = (type?: string) => {
    if (!type) return 'Personal';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const activeWs: Workspace = currentWorkspace || (workspaces.length > 0 ? workspaces[0] : {
    id: 'default',
    name: 'Acme Corp Global',
    description: '',
    logo_url: '',
    owner_id: '',
    slug: 'acme-corp',
    type: 'Personal',
    created_at: '',
  });

  const otherWorkspaces = useMemo(() => {
    return workspaces.filter((w) => w.id !== activeWs.id);
  }, [workspaces, activeWs.id]);

  const handleSelectWorkspace = (ws: Workspace) => {
    if (ws.id && ws.id !== 'default') {
      setActiveWorkspaceId(ws.id);
    }
    onClose();
  };

  const handleAddWorkspace = () => {
    onClose();
    router.push('/(tabs)/workspace');
  };

  const cardTop = anchor?.y !== undefined ? anchor.y - 4 : Math.max(insets.top, 16) + 12;
  const cardLeft = anchor?.x !== undefined ? anchor.x - 2 : 56;
  const cardWidth = anchor?.width ? Math.max(anchor.width + 4, 210) : 212;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuCard,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderLight,
                  top: cardTop,
                  left: cardLeft,
                  width: cardWidth,
                },
                animatedCardStyle,
              ]}
            >
              {/* Workspaces Section */}
              <View style={styles.workspacesContainer}>
                {/* 1. Active Workspace Pill */}
                <TouchableOpacity
                  style={[
                    styles.workspacePill,
                    {
                      backgroundColor: colors.bgCard,
                      borderColor: colors.borderLight,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => {
                    if (otherWorkspaces.length > 0) {
                      setIsExpanded((prev) => !prev);
                    }
                  }}
                >
                  {/* Circle Badge */}
                  {activeWs.logo_url ? (
                    <Image source={{ uri: activeWs.logo_url }} style={styles.workspaceAvatar} />
                  ) : (
                    <View style={[styles.workspaceAvatar, { backgroundColor: brandNavy }]}>
                      <Text style={styles.initialsText}>
                        {getInitials(activeWs.name, 'AA')}
                      </Text>
                    </View>
                  )}

                  {/* Name and Type */}
                  <View style={styles.workspaceInfo}>
                    <Text
                      style={[styles.workspaceName, { color: brandNavy }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {activeWs.name || 'Acme Corp Global'}
                    </Text>
                    <Text style={[styles.workspaceType, { color: colors.textMuted }]} numberOfLines={1}>
                      {formatType(activeWs.type)}
                    </Text>
                  </View>

                  {/* Dropdown Chevron */}
                  <Feather
                    name={isExpanded && otherWorkspaces.length > 0 ? 'chevron-up' : 'chevron-down'}
                    size={15}
                    color={brandNavy}
                  />
                </TouchableOpacity>

                {/* 2. Other Workspaces (if multiple) */}
                {isExpanded && otherWorkspaces.length > 0 && (
                  <ScrollView
                    style={styles.otherWorkspacesList}
                    contentContainerStyle={{ gap: 6 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                  >
                    {otherWorkspaces.map((ws) => (
                      <TouchableOpacity
                        key={ws.id}
                        style={[
                          styles.workspacePill,
                          {
                            backgroundColor: colors.bgCard,
                            borderColor: colors.borderLight,
                          },
                        ]}
                        activeOpacity={0.75}
                        onPress={() => handleSelectWorkspace(ws)}
                      >
                        {ws.logo_url ? (
                          <Image source={{ uri: ws.logo_url }} style={styles.workspaceAvatar} />
                        ) : (
                          <View style={[styles.workspaceAvatar, { backgroundColor: brandNavy }]}>
                            <Text style={styles.initialsText}>
                              {getInitials(ws.name, 'WS')}
                            </Text>
                          </View>
                        )}
                        <View style={styles.workspaceInfo}>
                          <Text
                            style={[styles.workspaceName, { color: brandNavy }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {ws.name}
                          </Text>
                          <Text style={[styles.workspaceType, { color: colors.textMuted }]} numberOfLines={1}>
                            {formatType(ws.type)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* 3. Add Workspace Pill */}
              <TouchableOpacity
                style={[
                  styles.addWorkspacePill,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: colors.borderLight,
                  },
                ]}
                activeOpacity={0.75}
                onPress={handleAddWorkspace}
              >
                <View style={styles.dashedCircleWrapper}>
                  <Svg width={26} height={26} style={StyleSheet.absoluteFill}>
                    <Circle
                      cx="13"
                      cy="13"
                      r="11.5"
                      stroke={brandNavy}
                      strokeWidth={1.3}
                      strokeDasharray="3 2.5"
                      fill="none"
                    />
                  </Svg>
                  <Feather name="plus" size={13} color={brandNavy} />
                </View>
                <Text style={[styles.addWorkspaceText, { color: colors.textMuted }]}>
                  Add Workspace
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuCard: {
    position: 'absolute',
    borderRadius: 20,
    padding: 6,
    gap: 6,
    borderWidth: 1,
    // Removed shadows as requested
  },
  workspacesContainer: {
    gap: 6,
  },
  otherWorkspacesList: {
    maxHeight: 160,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    gap: 8,
  },
  workspaceAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 11.5,
    fontFamily: Fonts.body.bold,
    color: '#FFFFFF',
  },
  workspaceInfo: {
    flex: 1,
    justifyContent: 'center',
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
  addWorkspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    gap: 8,
  },
  dashedCircleWrapper: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWorkspaceText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
  },
});
