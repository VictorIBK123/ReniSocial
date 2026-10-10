import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import { useTheme } from '../../hooks/useTheme';
import { useWorkspace } from '../../hooks/useWorkspace';
import { usePostsQuery, usePublishPostMutation } from '../../hooks/usePost';
import { useComposerStore } from '../../store/composerStore';
import DashboardHeader from '../components/DashboardHeader';
import Icon from '../components/IconResolver';
import ActivityModal, { ActivityModalType } from '../components/ActivityModal';
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

export default function PostsScreen() {
    const { colors } = useTheme();
    const { currentWorkspace } = useWorkspace();
    const { data: serverPosts = [], isLoading, isFetching, refetch } = usePostsQuery(currentWorkspace?.id);
    const { openComposer } = useComposerStore();

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
    const publishPostMutation = usePublishPostMutation();
    const [activityModal, setActivityModal] = useState<{
        visible: boolean;
        type: ActivityModalType;
        title: string;
        message?: string;
    }>({
        visible: false,
        type: 'info',
        title: '',
    });

    const handleRetryPublish = async (postId: string) => {
        try {
            await publishPostMutation.mutateAsync({
                postId,
                workspaceId: currentWorkspace?.id,
            });
            setActivityModal({
                visible: true,
                type: 'success',
                title: 'Post Published!',
                message: 'Your post was successfully published.',
            });
            refetch();
        } catch (error: any) {
            setActivityModal({
                visible: true,
                type: 'error',
                title: 'Publish Failed',
                message: error?.response?.data?.message || error?.message || 'Failed to publish post.',
            });
        }
    };

    const handleDraftClick = () => {
        setActivityModal({
            visible: true,
            type: 'info',
            title: 'Coming Soon',
            message: 'Drafting posts is coming soon in an upcoming update.',
        });
    };

    const allPosts: PostItem[] = useMemo(() => {
        if (!serverPosts || serverPosts.length === 0) {
            return [];
        }

        return serverPosts.map((p) => {
            const rawStatus = (p.status || 'draft').toLowerCase();
            let status: 'Scheduled' | 'Draft' | 'Failed' | 'Published' = 'Draft';
            let badgeVariant: 'info' | 'warning' | 'danger' | 'success' = 'warning';

            if (rawStatus === 'scheduled') {
                status = 'Scheduled';
                badgeVariant = 'info';
            } else if (rawStatus === 'published') {
                status = 'Published';
                badgeVariant = 'success';
            } else if (rawStatus === 'failed') {
                status = 'Failed';
                badgeVariant = 'danger';
            }

            let dateText: string | undefined;
            const targetDate = p.scheduled_at || p.published_at || p.created_at;
            if (targetDate) {
                try {
                    const d = new Date(targetDate);
                    dateText = d.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                } catch {
                    dateText = targetDate;
                }
            }

            const platformNames = (p.platforms || []).map((plat) => {
                if (plat.toLowerCase() === 'x') return 'X';
                if (plat.toLowerCase() === 'linkedin') return 'LinkedIn';
                if (plat.toLowerCase() === 'instagram') return 'Instagram';
                if (plat.toLowerCase() === 'facebook') return 'Facebook';
                if (plat.toLowerCase() === 'tiktok') return 'TikTok';
                if (plat.toLowerCase() === 'pinterest') return 'Pinterest';
                return plat.charAt(0).toUpperCase() + plat.slice(1);
            });

            return {
                id: p.id,
                image: p.media_urls?.[0],
                platforms: platformNames.length > 0 ? platformNames : ['LinkedIn'],
                status,
                badgeVariant,
                text: p.content || '',
                dateText,
                isFailed: rawStatus === 'failed',
            };
        });
    }, [serverPosts]);

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

    const filteredPosts = allPosts.filter((p) => {
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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor={colors.brandPrimary}
                        colors={[colors.brandPrimary]}
                    />
                }
            >
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
                        ListEmptyComponent={
                            isLoading ? (
                                <View style={{ paddingVertical: 48, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator size="large" color={colors.brandPrimary} />
                                    <Text variant="body" color="muted" style={{ marginTop: 12 }}>Loading posts...</Text>
                                </View>
                            ) : (
                                <View style={{ paddingVertical: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
                                    <Feather name="file-text" size={44} color={colors.textMuted} style={{ marginBottom: 12, opacity: 0.6 }} />
                                    <Text variant="heading" style={{ fontSize: 18, marginBottom: 6, textAlign: 'center' }}>No posts found</Text>
                                    <Text variant="body" color="muted" style={{ textAlign: 'center', marginBottom: 20 }}>
                                        {searchQuery || activeTab !== 'All'
                                            ? 'No posts match your current search or filter criteria.'
                                            : 'Get started by creating your first post for this workspace!'}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: colors.brandDark,
                                            paddingHorizontal: 20,
                                            paddingVertical: 12,
                                            borderRadius: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                        onPress={() => openComposer()}
                                    >
                                        <Feather name="plus" size={16} color={Colors.white} />
                                        <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 14 }}>Create Post</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        renderItem={({ item, index }) => {
                            if (viewMode === 'list') {
                                const isChecked = false;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={item.status === 'Draft' ? 0.7 : 1}
                                        onPress={() => {
                                            if (item.status === 'Draft') handleDraftClick();
                                        }}
                                        style={[styles.listCardRow, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
                                    >
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
                                    </TouchableOpacity>
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
                                    <TouchableOpacity
                                        activeOpacity={item.status === 'Draft' ? 0.7 : 1}
                                        onPress={() => {
                                            if (item.status === 'Draft') handleDraftClick();
                                        }}
                                        style={styles.cardContent}
                                    >
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
                                                        <TouchableOpacity
                                                            onPress={() => handleRetryPublish(item.id)}
                                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                            disabled={publishPostMutation.isPending}
                                                        >
                                                            <Icon name="refresh-red" size={16} />
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (item.status === 'Draft') {
                                                            handleDraftClick();
                                                        } else {
                                                            setActivityModal({
                                                                visible: true,
                                                                type: 'info',
                                                                title: 'Coming Soon',
                                                                message: 'Editing existing posts is coming soon in an upcoming update.',
                                                            });
                                                        }
                                                    }}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    <Icon name="edit" size={16} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setActivityModal({
                                                            visible: true,
                                                            type: 'info',
                                                            title: 'Coming Soon',
                                                            message: 'Deleting posts is coming soon in an upcoming update.',
                                                        });
                                                    }}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    <Icon name="delete" size={16} />
                                                </TouchableOpacity>
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
                                    </TouchableOpacity>
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

            <ActivityModal
                visible={activityModal.visible}
                type={activityModal.type}
                title={activityModal.title}
                message={activityModal.message}
                confirmText="OK"
                onConfirm={() => setActivityModal((prev) => ({ ...prev, visible: false }))}
                onClose={() => setActivityModal((prev) => ({ ...prev, visible: false }))}
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
