import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Text } from '../UI';
import { Fonts } from '../../../constant';
import { useTheme } from '../../../hooks/useTheme';
import Icon from '../IconResolver';

export type PostChannel =
  | 'X / Twitter'
  | 'LinkedIn'
  | 'Instagram'
  | 'Tiktok'
  | 'Facebook'
  | 'Pinterest';

export type PostStatus = 'Scheduled' | 'Draft' | 'Published' | 'Failed';

interface PostFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedChannels: string[];
  onToggleChannel: (channel: PostChannel) => void;
  selectedStatuses: string[];
  onToggleStatus: (status: PostStatus) => void;
}

export default function PostFilterModal({
  visible,
  onClose,
  selectedChannels,
  onToggleChannel,
  selectedStatuses,
  onToggleStatus,
}: PostFilterModalProps) {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
              {/* Header Action Bar */}
              <View style={styles.headerRow}>
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: isDark ? colors.bgCardSubtle : '#F1F5F9' }]}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <Feather name="x" size={18} color={colors.textDark} />
                </TouchableOpacity>

                <View style={[styles.filterIconBadge, { borderColor: colors.borderLight }]}>
                  <Icon name="filter" size={16} color={colors.textMuted} />
                </View>
              </View>

              {/* Section 1: TARGET CHANNELS */}
              <View style={[styles.sectionBox, { backgroundColor: isDark ? colors.bgCardSubtle : '#FFFFFF', borderColor: colors.borderLight }]}>
                <Text style={styles.sectionLabel}>TARGET CHANNELS</Text>

                <View style={styles.channelsGrid}>
                  {/* Row 1: X / Twitter & LinkedIn */}
                  <View style={styles.channelsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('X / Twitter')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('X / Twitter')
                          ? styles.channelPillXActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <Icon name="x-icon" size={14} color={selectedChannels.includes('X / Twitter') ? '#FFFFFF' : colors.textMuted} />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('X / Twitter') ? '#FFFFFF' : colors.textMuted },
                        ]}
                      >
                        X / Twitter
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('LinkedIn')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('LinkedIn')
                          ? styles.channelPillLinkedInActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <FontAwesome5
                        name="linkedin-in"
                        size={14}
                        color={selectedChannels.includes('LinkedIn') ? '#0A66C2' : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('LinkedIn') ? '#0A66C2' : colors.textMuted },
                        ]}
                      >
                        LinkedIn
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Row 2: Instagram & Tiktok */}
                  <View style={styles.channelsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('Instagram')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('Instagram')
                          ? styles.channelPillInstagramActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <Icon
                        name="instagram"
                        size={16}
                        color={selectedChannels.includes('Instagram') ? '#FFFFFF' : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('Instagram') ? '#FFFFFF' : colors.textMuted },
                        ]}
                      >
                        Instagram
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('Tiktok')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('Tiktok')
                          ? styles.channelPillTiktokActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <FontAwesome5
                        name="tiktok"
                        size={14}
                        color={selectedChannels.includes('Tiktok') ? '#FFFFFF' : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('Tiktok') ? '#FFFFFF' : colors.textMuted },
                        ]}
                      >
                        Tiktok
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Row 3: Facebook & Pinterest */}
                  <View style={styles.channelsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('Facebook')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('Facebook')
                          ? styles.channelPillFacebookActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <FontAwesome5
                        name="facebook-f"
                        size={14}
                        color={selectedChannels.includes('Facebook') ? '#1877F2' : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('Facebook') ? '#1877F2' : colors.textMuted },
                        ]}
                      >
                        Facebook
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onToggleChannel('Pinterest')}
                      style={[
                        styles.channelPill,
                        selectedChannels.includes('Pinterest')
                          ? styles.channelPillPinterestActive
                          : [styles.channelPillInactive, { borderColor: colors.borderLight }],
                      ]}
                    >
                      <FontAwesome5
                        name="pinterest"
                        size={15}
                        color={selectedChannels.includes('Pinterest') ? '#E60023' : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.channelPillText,
                          { color: selectedChannels.includes('Pinterest') ? '#E60023' : colors.textMuted },
                        ]}
                      >
                        Pinterest
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Section 2: Status */}
              <View style={[styles.sectionBox, { backgroundColor: isDark ? colors.bgCardSubtle : '#FFFFFF', borderColor: colors.borderLight }]}>
                <Text style={[styles.statusTitle, { color: colors.textDark }]}>Status</Text>

                <View style={styles.statusList}>
                  {/* Scheduled */}
                  <TouchableOpacity
                    style={styles.statusItemRow}
                    activeOpacity={0.7}
                    onPress={() => onToggleStatus('Scheduled')}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedStatuses.includes('Scheduled')
                          ? styles.checkboxChecked
                          : [styles.checkboxUnchecked, { borderColor: colors.borderLight }],
                      ]}
                    >
                      {selectedStatuses.includes('Scheduled') && (
                        <Feather name="check" size={13} color="#FFFFFF" />
                      )}
                    </View>

                    <View style={styles.scheduledBadge}>
                      <View style={styles.scheduledDot} />
                      <Text style={styles.scheduledText}>Scheduled</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Draft */}
                  <TouchableOpacity
                    style={styles.statusItemRow}
                    activeOpacity={0.7}
                    onPress={() => onToggleStatus('Draft')}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedStatuses.includes('Draft')
                          ? styles.checkboxChecked
                          : [styles.checkboxUnchecked, { borderColor: colors.borderLight }],
                      ]}
                    >
                      {selectedStatuses.includes('Draft') && (
                        <Feather name="check" size={13} color="#FFFFFF" />
                      )}
                    </View>

                    <View style={styles.draftBadge}>
                      <View style={styles.draftDot} />
                      <Text style={styles.draftText}>Draft</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Published */}
                  <TouchableOpacity
                    style={styles.statusItemRow}
                    activeOpacity={0.7}
                    onPress={() => onToggleStatus('Published')}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedStatuses.includes('Published')
                          ? styles.checkboxChecked
                          : [styles.checkboxUnchecked, { borderColor: colors.borderLight }],
                      ]}
                    >
                      {selectedStatuses.includes('Published') && (
                        <Feather name="check" size={13} color="#FFFFFF" />
                      )}
                    </View>

                    <View style={styles.publishedBadge}>
                      <View style={styles.publishedDot} />
                      <Text style={styles.publishedText}>Published</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Failed */}
                  <TouchableOpacity
                    style={styles.statusItemRow}
                    activeOpacity={0.7}
                    onPress={() => onToggleStatus('Failed')}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedStatuses.includes('Failed')
                          ? styles.checkboxChecked
                          : [styles.checkboxUnchecked, { borderColor: colors.borderLight }],
                      ]}
                    >
                      {selectedStatuses.includes('Failed') && (
                        <Feather name="check" size={13} color="#FFFFFF" />
                      )}
                    </View>

                    <View style={styles.failedBadge}>
                      <View style={styles.failedDot} />
                      <Text style={styles.failedText}>Failed</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },

  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Section Boxes */
  sectionBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.body.bold,
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 14,
  },

  /* Target Channels */
  channelsGrid: {
    gap: 10,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  channelPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 8,
  },
  channelPillText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
  },
  channelPillInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    opacity: 0.5,
  },
  channelPillXActive: {
    backgroundColor: '#000000',
  },
  channelPillLinkedInActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0A66C2',
  },
  channelPillInstagramActive: {
    backgroundColor: '#D92662',
  },
  channelPillTiktokActive: {
    backgroundColor: '#000000',
  },
  channelPillFacebookActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1877F2',
  },
  channelPillPinterestActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E60023',
  },

  /* Status Section */
  statusTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.body.bold,
    marginBottom: 14,
  },
  statusList: {
    gap: 12,
  },
  statusItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  /* Checkbox */
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#001E88',
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },

  /* Status Badges */
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  scheduledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 6,
  },
  scheduledText: {
    fontSize: 12.5,
    fontFamily: Fonts.body.semiBold,
    color: '#2563EB',
  },

  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  draftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C',
    marginRight: 6,
  },
  draftText: {
    fontSize: 12.5,
    fontFamily: Fonts.body.semiBold,
    color: '#EA580C',
  },

  publishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  publishedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  publishedText: {
    fontSize: 12.5,
    fontFamily: Fonts.body.semiBold,
    color: '#16A34A',
  },

  failedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  failedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },
  failedText: {
    fontSize: 12.5,
    fontFamily: Fonts.body.semiBold,
    color: '#DC2626',
  },
});
