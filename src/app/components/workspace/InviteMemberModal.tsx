import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '../UI';
import { Fonts } from '../../../constant';
import { useTheme } from '../../../hooks/useTheme';

export type TeamRole = 'Admin' | 'Editor' | 'Viewer';

interface InviteMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSendInvite: (email: string, role: TeamRole) => void;
}

const ROLES: TeamRole[] = ['Admin', 'Editor', 'Viewer'];

export default function InviteMemberModal({
  visible,
  onClose,
  onSendInvite,
}: InviteMemberModalProps) {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<TeamRole>('Editor');
  const [errorMessage, setErrorMessage] = useState('');

  if (!visible) return null;

  const handleSend = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setErrorMessage('');
    setEmail('');
    setSelectedRole('Editor');
    onSendInvite(trimmedEmail, selectedRole);
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setSelectedRole('Editor');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalCard,
                  {
                    backgroundColor: isDark ? colors.bgCard : '#FFFFFF',
                    borderColor: isDark ? colors.borderLight : '#E2E8F0',
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? colors.textDark : '#0F172A' },
                    ]}
                  >
                    Invite Member
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={styles.closeButton}
                  >
                    <Feather
                      name="x"
                      size={22}
                      color={isDark ? colors.textDark : '#475569'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Top Divider */}
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? colors.borderLight : '#E5E7EB' },
                  ]}
                />

                {/* Body Content */}
                <View style={styles.body}>
                  {/* EMAIL ADDRESS */}
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.label,
                        { color: isDark ? colors.textMutedDarker : '#475569' },
                      ]}
                    >
                      EMAIL ADDRESS
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          borderColor: errorMessage
                            ? '#EF4444'
                            : isDark
                            ? colors.borderLight
                            : '#CBD5E1',
                          backgroundColor: isDark
                            ? colors.bgCardSubtle
                            : '#FFFFFF',
                          color: isDark ? colors.textDark : '#1E293B',
                        },
                      ]}
                      placeholder="colleague@example.com"
                      placeholderTextColor={
                        isDark ? colors.textPlaceholder : '#94A3B8'
                      }
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : (
                      <Text
                        style={[
                          styles.helperText,
                          { color: isDark ? colors.textMuted : '#475569' },
                        ]}
                      >
                        The user must have a Renisocial account to be invited.
                      </Text>
                    )}
                  </View>

                  {/* SELECT ROLE */}
                  <View style={styles.roleSection}>
                    <Text
                      style={[
                        styles.label,
                        { color: isDark ? colors.textMutedDarker : '#475569' },
                      ]}
                    >
                      SELECT ROLE
                    </Text>
                    <View style={styles.rolesRow}>
                      {ROLES.map((role) => {
                        const isSelected = selectedRole === role;
                        return (
                          <TouchableOpacity
                            key={role}
                            activeOpacity={0.8}
                            onPress={() => setSelectedRole(role)}
                            style={[
                              styles.rolePill,
                              isSelected
                                ? [
                                    styles.rolePillSelected,
                                    {
                                      backgroundColor: colors.brandPrimary,
                                      borderColor: colors.brandPrimary,
                                    },
                                  ]
                                : [
                                    styles.rolePillUnselected,
                                    {
                                      borderColor: isDark
                                        ? colors.borderLight
                                        : '#64748B',
                                      backgroundColor: isDark
                                        ? colors.bgCardSubtle
                                        : '#FFFFFF',
                                    },
                                  ],
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleText,
                                isSelected
                                  ? styles.roleTextSelected
                                  : [
                                      styles.roleTextUnselected,
                                      {
                                        color: isDark
                                          ? colors.textDark
                                          : '#475569',
                                      },
                                    ],
                              ]}
                            >
                              {role}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>

                {/* Bottom Divider */}
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? colors.borderLight : '#E5E7EB' },
                  ]}
                />

                {/* Footer */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleClose}
                    activeOpacity={0.7}
                    style={styles.cancelButton}
                  >
                    <Text
                      style={[
                        styles.cancelText,
                        { color: isDark ? colors.textMuted : '#64748B' },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSend}
                    activeOpacity={0.85}
                    style={[
                      styles.sendButton,
                      { backgroundColor: colors.brandPrimary },
                    ]}
                  >
                    <Text style={styles.sendButtonText}>Send invite</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  keyboardAvoid: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: 2,
  },

  /* Divider */
  divider: {
    height: 1,
    width: '100%',
  },

  /* Body */
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 26,
  },
  section: {},
  label: {
    fontSize: 11.5,
    fontFamily: Fonts.alt.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: Fonts.body.regular,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Fonts.body.regular,
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: Fonts.body.medium,
    marginTop: 6,
  },

  /* Role Selection */
  roleSection: {
    marginTop: 22,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rolePill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePillSelected: {
    borderWidth: 1.5,
  },
  rolePillUnselected: {
    borderWidth: 1.5,
  },
  roleText: {
    fontSize: 15,
  },
  roleTextSelected: {
    color: '#FFFFFF',
    fontFamily: Fonts.body.semiBold,
  },
  roleTextUnselected: {
    fontFamily: Fonts.body.medium,
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
  },
  sendButton: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
  },
});
