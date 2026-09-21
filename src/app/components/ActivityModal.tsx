import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Text } from './UI';
import { Colors, Fonts } from '../../constant';
import { useTheme } from '../../hooks/useTheme';

export type ActivityModalType = 'confirmation' | 'success' | 'error' | 'info';

export interface ActivityModalProps {
  visible: boolean;
  type: ActivityModalType;
  title: string;
  message?: string;
  confirmText?: string; // e.g. "Yes", "Continue", "Understood"
  cancelText?: string; // e.g. "No", "Cancel"
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  /** Option to preselect 'yes' or 'no' in confirmation mode */
  defaultConfirmationChoice?: 'yes' | 'no';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Reanimated icon component with physics-based spring pop-in,
 * continuous pulsing wave (success), horizontal shake wobble (error),
 * floating vertical wave (info), and spring bounce (confirmation).
 */
function AnimatedModalIcon({ type }: { type: ActivityModalType }) {
  const { colors } = useTheme();

  const scale = useSharedValue(0);
  const shake = useSharedValue(0);
  const pulse = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    // Reset values on type change / render
    scale.value = 0;
    shake.value = 0;
    pulse.value = 1;
    floatY.value = 0;

    if (type === 'success') {
      // Spring pop-in + continuous pulsing ring
      scale.value = withSpring(1, { damping: 10, stiffness: 120 });
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else if (type === 'error') {
      // Pop-in + horizontal shake sequence
      scale.value = withSpring(1, { damping: 12, stiffness: 140 });
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    } else if (type === 'info') {
      // Scale-in + gentle floating vertical wave
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      floatY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      // Confirmation - spring bounce
      scale.value = withSpring(1, { damping: 10, stiffness: 110 });
    }
  }, [type, scale, shake, pulse, floatY]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulse.value },
      { translateX: shake.value },
      { translateY: floatY.value },
    ],
  }));

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconName: 'check' as const,
          iconColor: Colors.success,
          bgColor: Colors.successBg,
          borderColor: '#86EFAC',
        };
      case 'error':
        return {
          iconName: 'alert-circle' as const,
          iconColor: Colors.danger,
          bgColor: Colors.dangerBg,
          borderColor: '#FCA5A5',
        };
      case 'info':
        return {
          iconName: 'info' as const,
          iconColor: colors.brandPrimary,
          bgColor: colors.bgAccent,
          borderColor: colors.borderAccent,
        };
      case 'confirmation':
      default:
        return {
          iconName: 'help-circle' as const,
          iconColor: colors.brandPrimary,
          bgColor: colors.bgAccent,
          borderColor: colors.borderAccent,
        };
    }
  };

  const config = getIconConfig();

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        },
        animatedIconStyle,
      ]}
    >
      <Feather name={config.iconName} size={36} color={config.iconColor} />
    </Animated.View>
  );
}

/**
 * Reusable ActivityModal component powered by react-native-reanimated.
 * Modes:
 * 1. Confirmation: User toggles / picks between "Yes" and "No" after a question is asked
 * 2. Success: Completion status with animated pulsing checkmark
 * 3. Error: Alert modal with animated horizontal shake
 * 4. Info: Notice modal with animated floating info icon
 */
export function ActivityModal({
  visible,
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  defaultConfirmationChoice = 'yes',
}: ActivityModalProps) {
  const { colors, isDark } = useTheme();
  const [confirmationToggle, setConfirmationToggle] = useState<'yes' | 'no'>(defaultConfirmationChoice);

  useEffect(() => {
    if (visible) {
      setConfirmationToggle(defaultConfirmationChoice);
    }
  }, [visible, defaultConfirmationChoice]);

  if (!visible) return null;

  const handleConfirmAction = () => {
    if (type === 'confirmation') {
      if (confirmationToggle === 'yes') {
        onConfirm?.();
      } else {
        onCancel?.();
      }
    } else {
      onConfirm?.();
      onClose();
    }
  };

  const isConfirmation = type === 'confirmation';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            styles.backdrop,
            {
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.55)',
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              {/* Close Icon in Top Corner */}
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.bgApp }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Feather name="x" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Reanimated Animated Icon */}
              <AnimatedModalIcon type={type} />

              {/* Title & Description */}
              <Text
                variant="heading"
                style={[styles.modalTitle, { color: colors.textDark }]}
              >
                {title}
              </Text>

              {message ? (
                <Text
                  variant="body"
                  style={[styles.modalMessage, { color: colors.textMutedDarker }]}
                >
                  {message}
                </Text>
              ) : null}

              {/* Confirmation Yes / No Interactive Segment Toggle */}
              {isConfirmation ? (
                <View style={styles.confirmationSection}>
                  <View
                    style={[
                      styles.toggleContainer,
                      { backgroundColor: colors.bgApp, borderColor: colors.borderLight },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.toggleOption,
                        confirmationToggle === 'yes' && [
                          styles.toggleOptionActive,
                          { backgroundColor: colors.brandPrimary },
                        ],
                      ]}
                      onPress={() => setConfirmationToggle('yes')}
                    >
                      <Feather
                        name="check"
                        size={16}
                        color={confirmationToggle === 'yes' ? Colors.white : colors.textMuted}
                      />
                      <Text
                        variant="bodyBold"
                        style={[
                          styles.toggleText,
                          {
                            color:
                              confirmationToggle === 'yes' ? Colors.white : colors.textMuted,
                          },
                        ]}
                      >
                        {confirmText || 'Yes'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.toggleOption,
                        confirmationToggle === 'no' && [
                          styles.toggleOptionActive,
                          { backgroundColor: Colors.danger },
                        ],
                      ]}
                      onPress={() => setConfirmationToggle('no')}
                    >
                      <Feather
                        name="x"
                        size={16}
                        color={confirmationToggle === 'no' ? Colors.white : colors.textMuted}
                      />
                      <Text
                        variant="bodyBold"
                        style={[
                          styles.toggleText,
                          {
                            color:
                              confirmationToggle === 'no' ? Colors.white : colors.textMuted,
                          },
                        ]}
                      >
                        {cancelText || 'No'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Submit Choice Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          confirmationToggle === 'yes' ? colors.brandPrimary : colors.borderLight,
                      },
                    ]}
                    onPress={handleConfirmAction}
                  >
                    <Text
                      variant="bodyBold"
                      style={[
                        styles.actionButtonText,
                        {
                          color:
                            confirmationToggle === 'yes' ? Colors.white : colors.textDark,
                        },
                      ]}
                    >
                      Confirm Choice ({confirmationToggle === 'yes' ? confirmText || 'Yes' : cancelText || 'No'})
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Standard Action Button for Success, Error, Info */
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          type === 'error'
                            ? Colors.danger
                            : type === 'success'
                            ? Colors.success
                            : colors.brandPrimary,
                      },
                    ]}
                    onPress={handleConfirmAction}
                  >
                    <Text
                      variant="bodyBold"
                      style={[styles.actionButtonText, { color: Colors.white }]}
                    >
                      {confirmText || (type === 'error' ? 'Dismiss' : 'Continue')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ActivityModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: Math.min(SCREEN_WIDTH - 48, 380),
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  confirmationSection: {
    width: '100%',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 6,
  },
  toggleOptionActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: Fonts.body.bold,
  },
  actionButtonsRow: {
    width: '100%',
    marginTop: 4,
  },
  actionButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
  },
});
