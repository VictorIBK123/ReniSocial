import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import { useTheme } from '../../hooks/useTheme';
import DashboardHeader from '../components/DashboardHeader';
import Icon from '../components/IconResolver';
import PostFilterModal, { PostChannel, PostStatus } from '../components/posts/PostFilterModal';
import { Badge, Card, Text, View } from '../components/UI';

const TABS = ['All', 'Draft', 'Scheduled', 'Published', 'Failed'];

interface PostItem {
    id: string;
    image?: string;
    platforms: string[];
    status: 'Scheduled' | 'Draft' | 'Failed' | 'Published';
    badgeVariant: 'info' | 'warning' | 'danger' | 'success';
    text: string;
    dateText?: string;
    editedText?: string;
    isFailed?: boolean;
}

const POSTS: PostItem[] = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800',
        platforms: ['LinkedIn', 'X'],
        status: 'Scheduled',
        badgeVariant: 'info',
        text: "We're thrilled to announce our Q3 performance results! Thanks to the...",
        dateText: 'Oct 24, 10:00 AM',
    },
    {
        id: '2',
        platforms: ['Instagram'],
        status: 'Draft',
        badgeVariant: 'warning',
        text: "[Draft] Five tips for improving your remote team's productivity without increasing...",
        editedText: 'Last edited: 2 hrs ago',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        platforms: ['Instagram', 'LinkedIn', 'X'],
        status: 'Failed',
        badgeVariant: 'danger',
        text: 'Behind the scenes: How our design team rebuilt the design system from...',
        dateText: 'Oct 22, 02:30 PM',
        isFailed: true,
    },
    {
        id: '4',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        platforms: ['LinkedIn'],
        status: 'Published',
        badgeVariant: 'success',
        text: 'New case study is live! See how we helped Acme Corp reduce their operational...',
        dateText: 'Oct 20, 09:00 AM',
    },
];

export default function PostsScreen() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedChannels, setSelectedChannels] = useState<PostChannel[]>([
        'X / Twitter',
        'LinkedIn',
        'Instagram',
        'Tiktok',
        'Facebook',
        'Pinterest',
    ]);
    const [selectedStatuses, setSelectedStatuses] = useState<PostStatus[]>([
        'Scheduled',
        'Draft',
        'Published',
    ]);

    const { colors } = useTheme();

    const toggleChannel = (channel: PostChannel) => {
        setSelectedChannels((prev) =>
            prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
        );
    };

    const toggleStatus = (status: PostStatus) => {
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const filteredPosts = POSTS.filter((p) => {
        const matchesTab = activeTab === 'All' || p.status === activeTab;
        const matchesSearch = p.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatuses.includes(p.status as PostStatus);
        const matchesChannel =
            selectedChannels.length === 0 ||
            p.platforms.some((plat) => {
                if (plat === 'X' && selectedChannels.includes('X / Twitter')) return true;
                return selectedChannels.includes(plat as PostChannel);
            });

        return matchesTab && matchesSearch && matchesStatus && matchesChannel;
    });

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text variant="heading" style={styles.pageTitle}>Posts</Text>
                    <Text variant="body" color="muted" style={styles.pageSubtitle}>
                        Manage your scheduled, drafted, and published content.
                    </Text>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsRow}>
                    <View style={[styles.searchInputContainer, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
                        <Feather name="search" size={18} color={colors.textMuted} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textDark }]}
                            placeholder="Search posts..."
                            placeholderTextColor={colors.textPlaceholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <View style={styles.actionsRight}>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                { backgroundColor: colors.bgCard, borderColor: isFilterModalOpen ? colors.brandPrimary : colors.borderLight },
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setIsFilterModalOpen(true)}
                        >
                            <Icon name="filter" size={18} color={isFilterModalOpen ? colors.brandPrimary : colors.textMuted} />
                        </TouchableOpacity>
                        <View style={[styles.viewToggleGroup, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
                            <TouchableOpacity
                                style={[
                                    styles.viewToggleButton,
                                    { borderRightColor: colors.borderLight },
                                    viewMode === 'list' && [styles.viewToggleButtonActive, { backgroundColor: colors.bgAccent }]
                                ]}
                                onPress={() => setViewMode('list')}
                            >
                                <Feather name="list" size={18} color={viewMode === 'list' ? colors.brandPrimary : colors.textDark} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.viewToggleButton,
                                    viewMode === 'grid' && [styles.viewToggleButtonActive, { backgroundColor: colors.bgAccent }]
                                ]}
                                onPress={() => setViewMode('grid')}
                            >
                                <Feather name="grid" size={18} color={viewMode === 'grid' ? colors.brandPrimary : colors.textDark} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Tabs Row */}
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text
                                    variant="bodyBold"
                                    color={activeTab === tab ? 'primary' : 'dark'}
                                    style={activeTab === tab ? {} : { color: Colors.textDark }}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.tabsBottomLine} />
                </View>

                {/* Post Cards Grid/List */}
                <View style={styles.cardsContainer}>
                    {viewMode === 'list' && (
                        <View style={styles.listHeaderContainer}>
                            <View style={[styles.listHeaderRow, { borderBottomColor: colors.borderLight }]}>
                                <View style={styles.colCheckbox}>
                                    <View style={[styles.checkboxBase, { borderColor: colors.borderLight }]} />
                                </View>
                                <View style={styles.colChannel}><Text variant="bodyBold" color="dark" style={styles.listHeaderText}>Channel</Text></View>
                                <View style={styles.colContent}><Text variant="bodyBold" color="dark" style={styles.listHeaderText}>Content</Text></View>
                                <View style={styles.colStatus}><Text variant="bodyBold" color="dark" style={styles.listHeaderText}>Status</Text></View>
                                <View style={styles.colDate}><Text variant="bodyBold" color="dark" style={styles.listHeaderText}>Date/Action</Text></View>
                            </View>
                            <View style={styles.batchActionsRow}>
                                <Feather name="edit-2" size={14} color={colors.textMuted} />
                                <Feather name="trash-2" size={14} color={colors.textMuted} />
                            </View>
                        </View>
                    )}
                    <FlatList
                        data={filteredPosts}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                        renderItem={({ item, index }) => {
                            if (viewMode === 'list') {
                                // For mockup purposes, let's say the first item is checked
                                const isChecked = index === 0;
                                return (
                                    <View style={[styles.listCardRow, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
                                        <View style={styles.colCheckbox}>
                                            <View style={[
                                                styles.checkboxBase,
                                                { borderColor: isChecked ? colors.brandDark : colors.borderLight },
                                                isChecked && { backgroundColor: colors.brandDark }
                                            ]}>
                                                {isChecked && <Feather name="check" size={12} color="#FFF" />}
                                            </View>
                                        </View>
                                        <View style={styles.colChannel}>
                                            {item.platforms.slice(0, 1).map((p) => (
                                                <View key={p} style={[styles.listBadge, { backgroundColor: `${colors.info}15` }]}>
                                                    <Text variant="caption" style={{ color: p === 'Instagram' ? colors.danger : colors.info, fontSize: 10 }}>{p}</Text>
                                                </View>
                                            ))}
                                        </View>
                                        <View style={styles.colContent}>
                                            <Text
                                                variant="body"
                                                color="dark"
                                                numberOfLines={3}
                                                style={styles.listPostText}
                                            >
                                                {item.text}
                                            </Text>
                                        </View>
                                        <View style={styles.colStatus}>
                                            <View style={[styles.listStatusBadge, { borderColor: `${colors.info}30` }]}>
                                                <View style={[
                                                    styles.statusDot,
                                                    { backgroundColor: item.status === 'Draft' ? colors.warning : (item.status === 'Scheduled' ? colors.info : colors.success) }
                                                ]} />
                                                <Text variant="caption" style={{
                                                    color: item.status === 'Draft' ? colors.warning : (item.status === 'Scheduled' ? colors.info : colors.success),
                                                    fontSize: 10
                                                }}>
                                                    {item.status}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.colDate}>
                                            <Text variant="caption" color="dark" style={{ textAlign: 'center', fontSize: 10, lineHeight: 14 }}>
                                                {item.dateText ? item.dateText.replace(', ', ',\n') : item.editedText?.replace(': ', ':\n')}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            }

                            return (
                                <Card style={{ padding: 0, overflow: 'hidden' }}>
                                    {item.image && (
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.cardImage}
                                        />
                                    )}
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardBadgesRow}>
                                            <View style={styles.platformBadges}>
                                                {item.platforms.map((p) => (
                                                    <Badge key={p} variant="subtle" label={p} />
                                                ))}
                                            </View>
                                            <View style={styles.cardActionIcons}>
                                                {item.isFailed && (
                                                    <>
                                                        <Feather name="alert-triangle" size={16} color="#DC2626" />
                                                        <View style={{ width: 16 }} />
                                                        <Icon name="refresh-red" size={16} />
                                                    </>
                                                )}
                                                <Icon name="edit" size={16} />
                                                <Icon name="delete" size={16} />
                                            </View>
                                        </View>
                                        <Text
                                            variant="body"
                                            color="dark"
                                            style={[
                                                styles.postText,
                                                item.status === 'Draft' || item.status === 'Failed' ? { fontStyle: 'italic' } : null,
                                            ]}
                                        >
                                            {item.text}
                                        </Text>
                                        <View style={styles.cardFooter}>
                                            <Badge variant={item.badgeVariant} label={item.status} />
                                            {item.dateText ? (
                                                <View style={styles.footerDate}>
                                                    {item.status === 'Published' && <Icon name="done" size={14} />}
                                                    {item.status === 'Scheduled' && <Feather name="calendar" size={14} color={Colors.textDark} />}
                                                    <Text variant="caption" color="dark">{item.dateText}</Text>
                                                </View>
                                            ) : (
                                                <Text variant="caption" color="muted">{item.editedText}</Text>
                                            )}
                                        </View>
                                    </View>
                                </Card>
                            );
                        }}
                    />
                </View>

                {/* Bottom spacer for FAB */}
                <View style={{ height: 120 }} />
            </ScrollView>

            <PostFilterModal
                visible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                selectedChannels={selectedChannels}
                onToggleChannel={toggleChannel}
                selectedStatuses={selectedStatuses}
                onToggleStatus={toggleStatus}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingTop: 16,
    },
    titleSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 24,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    actionsRight: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: Colors.textDark,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewToggleGroup: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        overflow: 'hidden',
    },
    viewToggleButton: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: Colors.borderLight,
    },
    viewToggleButtonActive: {
        backgroundColor: '#EFF6FF',
        borderRightWidth: 0,
    },
    tabsWrapper: {
        marginBottom: 24,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 24,
    },
    tabButton: {
        paddingBottom: 12,
    },
    tabButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.brandPrimary,
    },
    tabsBottomLine: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: 1,
        backgroundColor: Colors.borderLight,
        zIndex: -1,
    },
    cardsContainer: {
        paddingHorizontal: 16,
        gap: 20,
    },
    postCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F3F4F6',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    cardBadgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    platformBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    cardActionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    postText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerDate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    listHeaderContainer: {
        marginBottom: 8,
    },
    listHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
    },
    batchActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 4,
    },
    listCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 3,
        borderRadius: 12,
        borderWidth: 1,
    },
    colCheckbox: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxBase: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colChannel: {
        flex: 1.7,
        paddingRight: 5,
    },
    colContent: {
        flex: 1.2,
        paddingRight: 8,
    },
    colStatus: {
        flex: 1.9,
        paddingRight: 4,
    },
    colDate: {
        flex: 1.8,
        alignItems: 'flex-end',
    },
    listHeaderText: {
        fontSize: 12,
        textAlign: 'center',
        width: '100%'
    },
    listPostText: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16,
    },
    listBadge: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'center',
    },
    listStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        alignSelf: 'flex-start',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
