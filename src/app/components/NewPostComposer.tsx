import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Fonts } from '../../constant';
import { Text } from './UI';
import { Icon } from './IconResolver';
import { useComposerStore } from '../../store/composerStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// Types & Constants
// ============================================================================

interface ChannelConfig {
  id: string;
  name: string;
  iconType: 'grid' | 'svg' | 'fa5';
  iconName?: string;
  color: string;
  bg?: string;
  outlineColor?: string;
}

const CHANNELS: ChannelConfig[] = [
  { id: 'all', name: 'All', iconType: 'grid', color: Colors.white, bg: Colors.brandPrimary },
  { id: 'x', name: 'X / Twitter', iconType: 'svg', iconName: 'x-icon', color: '#000000', outlineColor: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', iconType: 'fa5', iconName: 'linkedin-in', color: '#0A66C2', outlineColor: '#0A66C2' },
  { id: 'instagram', name: 'Instagram', iconType: 'svg', iconName: 'instagram', color: '#E1306C', outlineColor: '#E1306C' },
  { id: 'tiktok', name: 'TikTok', iconType: 'fa5', iconName: 'tiktok', color: '#000000', outlineColor: '#000000' },
  { id: 'facebook', name: 'Facebook', iconType: 'fa5', iconName: 'facebook-f', color: '#1877F2', outlineColor: '#1877F2' },
  { id: 'pinterest', name: 'Pinterest', iconType: 'svg', iconName: 'pinterest-2', color: '#E60023', outlineColor: '#E60023' },
];

const QUICK_TIMES = ['Today 5 PM', 'Tomorrow 9 AM', 'Next Monday 9 AM'];

// ============================================================================
// 1. Channel Selector Component
// ============================================================================

interface ChannelSelectorProps {
  selectedChannels: string[];
  onToggleChannel: (id: string) => void;
}

function ChannelSelector({ selectedChannels, onToggleChannel }: ChannelSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>CHANNELS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.channelsRow}
      >
        {CHANNELS.map((ch) => {
          const isActive =
            selectedChannels.includes(ch.id) ||
            (ch.id === 'all' && selectedChannels.includes('all'));

          if (ch.id === 'all') {
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => onToggleChannel('all')}
                activeOpacity={0.8}
                style={[
                  styles.channelPill,
                  isActive ? styles.channelPillAllActive : styles.channelPillInactive,
                ]}
              >
                <Feather
                  name="grid"
                  size={14}
                  color={isActive ? Colors.white : '#64748B'}
                />
                <Text
                  style={[
                    styles.channelText,
                    { color: isActive ? Colors.white : '#64748B' },
                  ]}
                >
                  {ch.name}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={ch.id}
              onPress={() => onToggleChannel(ch.id)}
              activeOpacity={0.8}
              style={[
                styles.channelPill,
                isActive
                  ? {
                      backgroundColor: Colors.white,
                      borderColor: ch.outlineColor,
                      borderWidth: 1.5,
                    }
                  : styles.channelPillInactive,
              ]}
            >
              {ch.iconType === 'svg' && ch.iconName ? (
                <Icon
                  name={ch.iconName as any}
                  size={ch.iconName === 'x-icon' ? 26 : 16}
                  color={isActive ? ch.color : '#64748B'}
                />
              ) : ch.iconType === 'fa5' && ch.iconName ? (
                <FontAwesome5
                  name={ch.iconName}
                  size={14}
                  color={isActive ? ch.color : '#64748B'}
                />
              ) : null}
              <Text
                style={[
                  styles.channelText,
                  isActive ? { color: ch.color } : { color: '#64748B' },
                ]}
              >
                {ch.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// 2. Composer / Preview Tab Toggles
// ============================================================================

interface ComposerTabsProps {
  activeTab: 'Composer' | 'Preview';
  onSelectTab: (tab: 'Composer' | 'Preview') => void;
}

function ComposerTabs({ activeTab, onSelectTab }: ComposerTabsProps) {
  return (
    <View style={styles.tabToggleWrapper}>
      <View style={styles.tabToggleRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Composer' && styles.tabButtonActive]}
          onPress={() => onSelectTab('Composer')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Composer' && styles.tabButtonTextActive,
            ]}
          >
            Composer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Preview' && styles.tabButtonActive]}
          onPress={() => onSelectTab('Preview')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Preview' && styles.tabButtonTextActive,
            ]}
          >
            Preview
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabUnderline} />
    </View>
  );
}

// ============================================================================
// 3. Post Editor Component (Composer View)
// ============================================================================

interface PostEditorProps {
  postText: string;
  onChangeText: (text: string) => void;
  selectedMedia: string[];
  onAddMedia: () => void;
  onRemoveMedia: (index: number) => void;
}

function PostEditor({
  postText,
  onChangeText,
  selectedMedia,
  onAddMedia,
  onRemoveMedia,
}: PostEditorProps) {
  const charCount = postText.length;
  const maxChar = 280;
  const charProgress = Math.min(charCount / maxChar, 1);
  const CIRCLE_RADIUS = 8;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - charProgress);

  return (
    <>
      {/* Character Count Indicator */}
      <View style={styles.charCountRow}>
        <View style={styles.circularIndicatorWrapper}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Circle
              cx={10}
              cy={10}
              r={CIRCLE_RADIUS}
              stroke="#E2E8F0"
              strokeWidth={2}
              fill="transparent"
            />
            <Circle
              cx={10}
              cy={10}
              r={CIRCLE_RADIUS}
              stroke={charCount > maxChar ? '#EF4444' : Colors.brandPrimary}
              strokeWidth={2}
              fill="transparent"
              strokeDasharray={`${CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 10 10)"
            />
          </Svg>
        </View>
        <View style={styles.charCountTextCol}>
          <Text style={styles.charCountFraction}>{`${charCount} / ${maxChar}`}</Text>
          <Text style={styles.charLimitLabel}>X / TWITTER LIMIT</Text>
        </View>
      </View>

      {/* Text Input Box with Toolbar */}
      <View style={styles.composerInputBox}>
        <TextInput
          style={styles.textInput}
          placeholder="What's happening in your creative space?"
          placeholderTextColor="#94A3B8"
          multiline
          value={postText}
          onChangeText={onChangeText}
          textAlignVertical="top"
        />

        <View style={styles.inputToolbar}>
          <TouchableOpacity style={styles.toolIconBtn}>
            <Icon name="gallery" size={18} color="#454652" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIconBtn}>
            <Feather name="smile" size={18} color="#454652" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIconBtn}>
            <Feather name="hash" size={18} color="#454652" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Media Attachment List */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MEDIA</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaRow}
          data={selectedMedia}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item: uri, index: idx }) => (
            <View style={styles.mediaThumbnailContainer}>
              <Image source={{ uri }} style={styles.mediaImage} />
              <TouchableOpacity
                style={styles.mediaRemoveBadge}
                onPress={() => onRemoveMedia(idx)}
              >
                <Feather name="x" size={14} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.mediaAddBox} onPress={onAddMedia}>
              <Feather name="image" size={22} color="#64748B" />
              <Text style={styles.mediaAddText}>ADD</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </>
  );
}

// ============================================================================
// 4. Platform Preview Cards
// ============================================================================

interface PlatformPreviewCardProps {
  postText: string;
  mediaUri: string;
}

export function XPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgeX]}>
          <Icon name="x-icon" size={32} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>X/Twitter Preview</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.xUserRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
            style={styles.xAvatar}
          />
          <View style={styles.xUserInfo}>
            <Text style={styles.xUserName}>Renisocial</Text>
            <Text style={styles.xUserHandle}>@renisocial · 1m</Text>
          </View>
        </View>
        <Text style={styles.xPostText}>
          {postText ||
            'Excited to announce our new operational studio dashboard! Streamlining your social media management has never been easier. Check out the clean new interface. 🚀 #ProductLaunch #SaaS'}
        </Text>
        <Image
          source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }}
          style={styles.xMediaImage}
        />
        <View style={styles.xActionBar}>
          <View style={styles.xActionItem}>
            <Icon name="comment" size={14} />
            <Text style={styles.xActionCount}>12</Text>
          </View>
          <View style={styles.xActionItem}>
            <Icon name="repost" size={14} />
            <Text style={styles.xActionCount}>4</Text>
          </View>
          <View style={styles.xActionItem}>
            <Feather name="heart" size={15} color="#64748B" />
            <Text style={styles.xActionCount}>48</Text>
          </View>
          <View style={styles.xActionItem}>
            <Icon name="reach" size={12} />
            <Text style={styles.xActionCount}>1.2k</Text>
          </View>
          <View style={styles.xActionItem}>
            <Icon name="send" size={14} color="#64748B" />
          </View>
        </View>
      </View>
    </View>
  );
}

export function LinkedInPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgeLinkedin]}>
          <FontAwesome5 name="linkedin-in" size={15} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>Linkedin Preview</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.linkedInHeaderRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200' }}
            style={styles.linkedInAvatar}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.linkedInAuthorName}>Renisocial Studio</Text>
            <Text style={styles.linkedInAuthorSub}>Digital Marketing Agency</Text>
            <Text style={styles.linkedInTimeRow}>Just now • 🌐</Text>
          </View>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="more-horizontal" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.linkedInPostText}>
          {postText ||
            'How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!'}
        </Text>
        <Image
          source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' }}
          style={styles.linkedInMediaImage}
        />
        <View style={styles.linkedInActionBar}>
          <TouchableOpacity style={styles.linkedInActionBtn} activeOpacity={0.7}>
            <Icon name="like" size={17} />
            <Text style={styles.linkedInActionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedInActionBtn} activeOpacity={0.7}>
            <Icon name="comment-linkedin" size={17} />
            <Text style={styles.linkedInActionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedInActionBtn} activeOpacity={0.7}>
            <Icon name="repost-linkedin" size={16} />
            <Text style={styles.linkedInActionText}>Repost</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedInActionBtn} activeOpacity={0.7}>
            <Icon name="send-linkedin" size={16} />
            <Text style={styles.linkedInActionText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function InstagramPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgeInstagram]}>
          <Icon name="instagram" size={18} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>Instagram Preview</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.instaHeaderRow}>
          <View style={styles.instaAvatarBadge}>
            <Text style={styles.instaAvatarLetter}>R</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.instaAuthorName}>Renisocial</Text>
            <Text style={styles.instaSponsoredText}>Sponsored</Text>
          </View>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="more-horizontal" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }}
          style={styles.instaMediaImage}
        />
        <View style={styles.instaActionBar}>
          <View style={styles.instaActionLeft}>
            <Feather name="heart" size={22} color="#0F172A" style={{ marginRight: 16 }} />
            <Icon name="comment" size={18} color="#0F172A" style={{ marginRight: 16 }} />
            <Icon name="send-ig" size={18} />
          </View>
          <Feather name="bookmark" size={22} color="#0F172A" />
        </View>
        <View style={styles.instaCaptionBlock}>
          <Text style={styles.instaCaptionText}>
            <Text style={styles.instaCaptionName}>Renisocial </Text>
            {postText ||
              "Exciting news! We're launching our new digital art collection featuring stunning generative geometric shapes. Perfect for your modern minimalist spaces. 🎨✨"}
          </Text>
          <Text style={styles.instaHashtagText}>#digitalart #generative #minimalism</Text>
        </View>
      </View>
    </View>
  );
}

export function TikTokPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgeTiktok]}>
          <FontAwesome5 name="tiktok" size={14} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>Tiktok Preview</Text>
      </View>
      <View style={styles.tiktokCardWrapper}>
        <View style={styles.tiktokCard}>
          <Image
            source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800' }}
            style={styles.tiktokBgImage}
          />
          <View style={styles.tiktokDarkOverlay} />
          <View style={styles.tiktokRightCol}>
            <View style={styles.tiktokAvatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                style={styles.tiktokAvatar}
              />
              <View style={styles.tiktokPlusBadge}>
                <Feather name="plus" size={10} color="#FFF" />
              </View>
            </View>
            <View style={styles.tiktokStatBtn}>
              <FontAwesome5 name="heart" size={22} color="#FFF" solid />
              <Text style={styles.tiktokStatCount}>0</Text>
            </View>
            <View style={styles.tiktokStatBtn}>
              <Icon name="comment" size={20} color="#FFF" />
              <Text style={styles.tiktokStatCount}>0</Text>
            </View>
            <View style={styles.tiktokStatBtn}>
              <FontAwesome5 name="bookmark" size={20} color="#FFF" solid />
              <Text style={styles.tiktokStatCount}>0</Text>
            </View>
            <View style={styles.tiktokStatBtn}>
              <FontAwesome5 name="share" size={20} color="#FFF" />
              <Text style={styles.tiktokStatCount}>0</Text>
            </View>
            <View style={styles.tiktokDiscContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                style={styles.tiktokDiscImage}
              />
            </View>
          </View>
          <View style={styles.tiktokBottomInfo}>
            <Text style={styles.tiktokHandle}>@renisocial</Text>
            <Text style={styles.tiktokText} numberOfLines={3}>
              {postText || 'Excited to announce our new update! Managing your workflows just got 10x easier. 🚀'}
            </Text>
            <View style={styles.tiktokMusicRow}>
              <FontAwesome5 name="music" size={12} color="#FFF" />
              <Text style={styles.tiktokMusicText}>Original Audio - Renisocial</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export function FacebookPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgeFacebook]}>
          <FontAwesome5 name="facebook-f" size={15} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>Facebook Preview</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.fbHeaderRow}>
          <View style={styles.fbSquareBadge}>
            <Text style={styles.fbSquareLetter}>R</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.fbAuthorName}>Renisocial</Text>
              <Icon name="verified" size={13} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <Text style={styles.fbSubtext}>Sponsored •</Text>
              <Icon name="global" size={11} />
            </View>
          </View>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="more-horizontal" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.fbPostText}>
          {postText ||
            'Excited to launch our new operational dashboard! 🚀 Streamline your data workflows and regain control of your metrics today. #Renisocial #DataOps'}
        </Text>
        <Image
          source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800' }}
          style={styles.fbMediaImage}
        />
        <View style={styles.fbEngagementRow}>
          <View style={styles.fbEngagementLeft}>
            <View style={styles.fbBubbleLike}>
              <FontAwesome5 name="thumbs-up" size={9} color="#FFF" solid />
            </View>
            <View style={styles.fbBubbleHeart}>
              <FontAwesome5 name="heart" size={9} color="#FFF" solid />
            </View>
            <Text style={styles.fbEngageText}>You and 124 others</Text>
          </View>
          <Text style={styles.fbEngageText}>12 Comments   4 Shares</Text>
        </View>
        <View style={styles.fbDivider} />
        <View style={styles.fbActionBar}>
          <TouchableOpacity style={styles.fbActionBtn} activeOpacity={0.7}>
            <Feather name="thumbs-up" size={16} color="#64748B" />
            <Text style={styles.fbActionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fbActionBtn} activeOpacity={0.7}>
            <Feather name="message-square" size={16} color="#64748B" />
            <Text style={styles.fbActionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fbActionBtn} activeOpacity={0.7}>
            <Feather name="share-2" size={16} color="#64748B" />
            <Text style={styles.fbActionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function PinterestPreviewCard({ postText, mediaUri }: PlatformPreviewCardProps) {
  return (
    <View style={styles.socialCard}>
      <View style={styles.platformHeaderBar}>
        <View style={[styles.previewPlatformBadge, styles.previewPlatformBadgePinterest]}>
          <Icon name="pinterest-2" size={18} color="#FFF" />
        </View>
        <Text style={styles.platformHeaderTitle}>Pinterest Preview</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.pinterestMediaContainer}>
          <Image
            source={{ uri: mediaUri || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800' }}
            style={styles.pinterestImage}
          />
          <View style={styles.pinterestSaveBadge}>
            <Text style={styles.pinterestSaveText}>Save</Text>
          </View>
          <View style={styles.pinterestLinkPill}>
            <Icon name="link" size={14} color="#1E293B" />
            <Text style={styles.pinterestLinkText}>renisocial.com/workflow</Text>
          </View>
        </View>
        <View style={styles.pinterestInfoBlock}>
          <Text style={styles.pinterestTitle}>Streamline Your Social Workflow</Text>
          <Text style={styles.pinterestDesc}>
            {postText ||
              'Discover the ultimate strategies to organize, plan, and execute your social media campaigns efficiently. Learn how our systematic approach...'}
          </Text>
          <View style={styles.pinterestDivider} />
          <Text style={styles.pinterestCounter}>214 / 500</Text>
        </View>
      </View>
    </View>
  );
}

interface PlatformPreviewListProps {
  selectedChannels: string[];
  postText: string;
  mediaUri: string;
}

function PlatformPreviewList({ selectedChannels, postText, mediaUri }: PlatformPreviewListProps) {
  const isVisible = (channelId: string) => {
    return selectedChannels.includes('all') || selectedChannels.includes(channelId);
  };

  return (
    <View style={styles.previewContainer}>
      {isVisible('x') && <XPreviewCard postText={postText} mediaUri={mediaUri} />}
      {isVisible('linkedin') && <LinkedInPreviewCard postText={postText} mediaUri={mediaUri} />}
      {isVisible('instagram') && <InstagramPreviewCard postText={postText} mediaUri={mediaUri} />}
      {isVisible('tiktok') && <TikTokPreviewCard postText={postText} mediaUri={mediaUri} />}
      {isVisible('facebook') && <FacebookPreviewCard postText={postText} mediaUri={mediaUri} />}
      {isVisible('pinterest') && <PinterestPreviewCard postText={postText} mediaUri={mediaUri} />}
    </View>
  );
}

// ============================================================================
// 5. Schedule Section Component
// ============================================================================

interface ScheduleSectionProps {
  scheduleTime: string;
  scheduleNote: string;
  onSelectTime: (time: string) => void;
}

function ScheduleSection({ scheduleTime, scheduleNote, onSelectTime }: ScheduleSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>SCHEDULE</Text>

      {/* Schedule Card */}
      <TouchableOpacity activeOpacity={0.8} style={styles.scheduleCard}>
        <View style={styles.scheduleLeft}>
          <Icon name="schedule" size={24} color="#001E88" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.scheduleCardTime}>{scheduleTime}</Text>
            <Text style={styles.scheduleCardNote}>{scheduleNote}</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#64748B" />
      </TouchableOpacity>

      {/* Quick Time Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickTimeRow}
      >
        {QUICK_TIMES.map((time) => {
          const isActive = scheduleTime.includes(time.split(' ')[0]);

          return (
            <TouchableOpacity
              key={time}
              activeOpacity={0.7}
              style={[
                styles.quickTimePill,
                isActive ? styles.quickTimePillActive : styles.quickTimePillInactive,
              ]}
              onPress={() => onSelectTime(time)}
            >
              <Text
                style={[
                  styles.quickTimeText,
                  isActive ? styles.quickTimeTextActive : styles.quickTimeTextInactive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// 6. Bottom Actions Component
// ============================================================================

interface BottomActionButtonsProps {
  onDraft: () => void;
  onSchedule: () => void;
  onPublishNow: () => void;
}

function BottomActionButtons({
  onDraft,
  onSchedule,
  onPublishNow,
}: BottomActionButtonsProps) {
  return (
    <View style={styles.bottomActionsContainer}>
      {/* Top Row: Draft + Schedule Post */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.draftButton}
          activeOpacity={0.8}
          onPress={onDraft}
        >
          <Icon name="draft" size={18} />
          <Text style={styles.draftButtonText}>Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scheduleButton}
          activeOpacity={0.8}
          onPress={onSchedule}
        >
          <Icon name="send" size={18} />
          <Text style={styles.scheduleButtonText}>Schedule Post</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Row: Publish Now */}
      <TouchableOpacity
        style={styles.publishNowButton}
        activeOpacity={0.8}
        onPress={onPublishNow}
      >
        <Feather name="play" size={20} color={Colors.white} />
        <Text style={styles.publishNowButtonText}>Publish Now</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// 7. Main Component: NewPostComposer
// ============================================================================

export default function NewPostComposer() {
  const { isOpen, activeTab, closeComposer, setActiveTab } = useComposerStore();
  const [isRendered, setIsRendered] = useState(false);

  // Form State
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['all']);
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500',
  ]);
  const [scheduleTime, setScheduleTime] = useState('Tomorrow, 9:00 AM');
  const [scheduleNote, setScheduleNote] = useState('Optimal time for social engagement');

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  const handleClose = useCallback(() => {
    'worklet';
    opacity.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 300, easing: Easing.in(Easing.ease) },
      () => {
        runOnJS(closeComposer)();
      }
    );
  }, [closeComposer, opacity, translateY]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 24,
        stiffness: 220,
        mass: 0.9,
      });
    } else if (isRendered) {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
        runOnJS(setIsRendered)(false);
      });
    }
  }, [isOpen, isRendered, opacity, translateY]);

  useEffect(() => {
    if (!isOpen) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => backHandler.remove();
  }, [isOpen, handleClose]);

  const toggleChannel = (channelId: string) => {
    if (channelId === 'all') {
      setSelectedChannels(['all']);
      return;
    }

    let updated: string[];
    if (selectedChannels.includes('all')) {
      updated = [channelId];
    } else if (selectedChannels.includes(channelId)) {
      updated = selectedChannels.filter((c) => c !== channelId);
      if (updated.length === 0) updated = ['all'];
    } else {
      updated = [...selectedChannels, channelId];
    }

    setSelectedChannels(updated);
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const addMedia = () => {
    setSelectedMedia((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
    ]);
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isRendered && !isOpen) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
      </TouchableWithoutFeedback>

      {/* Modal Bottom Sheet */}
      <Animated.View style={[styles.sheetContainer, sheetAnimatedStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather name="x" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Main Scrollable Form */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. Target Channels */}
            <ChannelSelector
              selectedChannels={selectedChannels}
              onToggleChannel={toggleChannel}
            />

            {/* 2. Composer / Preview Tabs */}
            <ComposerTabs activeTab={activeTab} onSelectTab={setActiveTab} />

            {/* 3. Tab Content */}
            {activeTab === 'Composer' ? (
              <PostEditor
                postText={postText}
                onChangeText={setPostText}
                selectedMedia={selectedMedia}
                onAddMedia={addMedia}
                onRemoveMedia={removeMedia}
              />
            ) : (
              <PlatformPreviewList
                selectedChannels={selectedChannels}
                postText={postText}
                mediaUri={selectedMedia[0]}
              />
            )}

            {/* 4. Schedule Section */}
            <ScheduleSection
              scheduleTime={scheduleTime}
              scheduleNote={scheduleNote}
              onSelectTime={(time) => {
                setScheduleTime(time);
                setScheduleNote('Optimal time for LinkedIn');
              }}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* 5. Sticky Bottom Action Buttons */}
          <BottomActionButtons
            onDraft={handleClose}
            onSchedule={handleClose}
            onPublishNow={handleClose}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.bold,
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  channelPillAllActive: {
    backgroundColor: '#0F172A',
  },
  channelPillInactive: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  channelText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
  },
  tabToggleWrapper: {
    marginBottom: 16,
  },
  tabToggleRow: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabButtonActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.brandPrimary,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: Colors.brandPrimary,
    fontFamily: Fonts.body.bold,
  },
  tabUnderline: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: -1,
  },
  charCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  circularIndicatorWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charCountTextCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  charCountFraction: {
    fontSize: 13.5,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
    lineHeight: 17,
  },
  charLimitLabel: {
    fontSize: 9.5,
    fontFamily: Fonts.body.bold,
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  composerInputBox: {
    backgroundColor: Colors.white,
    paddingHorizontal: 2,
    marginBottom: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: '#0F172A',
    minHeight: 80,
    lineHeight: 22,
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  toolIconBtn: {
    padding: 4,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  mediaThumbnailContainer: {
    width: 84,
    height: 84,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaRemoveBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaAddBox: {
    width: 84,
    height: 84,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mediaAddText: {
    fontSize: 11,
    fontFamily: Fonts.body.bold,
    color: '#64748B',
  },
  previewContainer: {
    marginBottom: 20,
    gap: 16,
  },
  platformHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: Colors.white,
    height: 36,
  },
  previewPlatformBadge: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlatformBadgeX: {
    backgroundColor: '#000000',
  },
  previewPlatformBadgeLinkedin: {
    backgroundColor: '#0A66C2',
  },
  previewPlatformBadgeInstagram: {
    backgroundColor: '#E1306C',
  },
  previewPlatformBadgeTiktok: {
    backgroundColor: '#000000',
  },
  previewPlatformBadgeFacebook: {
    backgroundColor: '#1877F2',
  },
  previewPlatformBadgePinterest: {
    backgroundColor: '#E60023',
  },
  platformHeaderTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.body.semiBold,
    color: '#334155',
    marginLeft: 10,
  },
  socialCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardBody: {
    padding: 16,
  },
  tiktokCardWrapper: {
    padding: 12,
  },
  xUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  xAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  xUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  xUserName: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  xUserHandle: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
    marginLeft: 4,
  },
  xPostText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: '#1E293B',
    lineHeight: 21,
    marginBottom: 12,
  },
  xMediaImage: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    marginBottom: 12,
  },
  xActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  xActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  xActionCount: {
    fontSize: 13,
    fontFamily: Fonts.body.medium,
    color: '#64748B',
  },
  linkedInHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkedInAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  linkedInAuthorName: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  linkedInAuthorSub: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
  },
  linkedInTimeRow: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: '#94A3B8',
    marginTop: 1,
  },
  linkedInPostText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: '#1E293B',
    lineHeight: 21,
    marginBottom: 12,
  },
  linkedInMediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 14,
  },
  linkedInActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  linkedInActionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  linkedInActionText: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: '#475569',
  },
  instaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instaAvatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instaAvatarLetter: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Colors.white,
  },
  instaAuthorName: {
    fontSize: 14,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  instaSponsoredText: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
  },
  instaMediaImage: {
    width: '100%',
    height: 300,
    borderRadius: 4,
    marginBottom: 12,
  },
  instaActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  instaActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instaCaptionBlock: {
    gap: 4,
  },
  instaCaptionText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#0F172A',
    lineHeight: 19,
  },
  instaCaptionName: {
    fontFamily: Fonts.body.bold,
  },
  instaHashtagText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: '#0A66C2',
  },
  tiktokCard: {
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  tiktokBgImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  tiktokDarkOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tiktokRightCol: {
    position: 'absolute',
    right: 12,
    bottom: 60,
    alignItems: 'center',
    gap: 16,
  },
  tiktokAvatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  tiktokAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  tiktokPlusBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tiktokStatBtn: {
    alignItems: 'center',
    gap: 2,
  },
  tiktokStatCount: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: '#FFF',
  },
  tiktokDiscContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#0F172A',
  },
  tiktokDiscImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  tiktokBottomInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 70,
    gap: 6,
  },
  tiktokHandle: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
    color: '#FFF',
  },
  tiktokText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#FFF',
    lineHeight: 18,
  },
  tiktokMusicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  tiktokMusicText: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: '#FFF',
  },
  fbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fbSquareBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbSquareLetter: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: '#0F172A',
  },
  fbAuthorName: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  fbSubtext: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
  },
  fbPostText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 12,
  },
  fbMediaImage: {
    width: '100%',
    height: 220,
    borderRadius: 4,
    marginBottom: 10,
  },
  fbEngagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  fbEngagementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fbBubbleLike: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  fbBubbleHeart: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
    zIndex: 1,
  },
  fbEngageText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
    marginLeft: 6,
  },
  fbDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  fbActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
  },
  fbActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  fbActionText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: '#64748B',
  },
  pinterestMediaContainer: {
    position: 'relative',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 12,
  },
  pinterestImage: {
    width: '100%',
    height: 280,
  },
  pinterestSaveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E60023',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  pinterestSaveText: {
    fontSize: 13,
    fontFamily: Fonts.body.bold,
    color: '#FFF',
  },
  pinterestLinkPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinterestLinkText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: '#1E293B',
  },
  pinterestInfoBlock: {
    gap: 8,
  },
  pinterestTitle: {
    fontSize: 17,
    fontFamily: Fonts.heading.bold,
    color: '#0F172A',
  },
  pinterestDesc: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#475569',
    lineHeight: 19,
  },
  pinterestDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 4,
  },
  pinterestCounter: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: '#94A3B8',
    textAlign: 'right',
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleCardTime: {
    fontSize: 15,
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  scheduleCardNote: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#64748B',
    marginTop: 2,
  },
  quickTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickTimePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickTimePillActive: {
    backgroundColor: '#EEF2F6',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickTimePillInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickTimeText: {
    fontSize: 13,
    fontFamily: Fonts.body.medium,
  },
  quickTimeTextInactive: {
    color: '#0F172A',
  },
  quickTimeTextActive: {
    fontFamily: Fonts.body.bold,
    color: '#0F172A',
  },
  bottomActionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: Colors.white,
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#001464',
    backgroundColor: Colors.white,
  },
  draftButtonText: {
    fontSize: 16,
    fontFamily: Fonts.body.bold,
    color: '#001464',
  },
  scheduleButton: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#001464',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontFamily: Fonts.body.bold,
    color: Colors.white,
  },
  publishNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#001464',
  },
  publishNowButtonText: {
    fontSize: 16,
    fontFamily: Fonts.body.bold,
    color: Colors.white,
  },
});
