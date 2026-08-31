import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { Text, View, Card, Badge, Button } from '../components/UI';
import DashboardHeader from '../components/DashboardHeader';
import { Icon } from '../components/IconResolver';
import { useComposerStore } from '../../store/composerStore';

export default function IdeasScreen() {
    const { openComposer } = useComposerStore();

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <Text variant="heading" weight="bold" style={styles.pageTitle}>Ideas Board</Text>
                        <View style={styles.titleBadge}>
                            <Text variant="caption" style={styles.titleBadgeText}>12</Text>
                        </View>
                    </View>
                    <Text variant="body" color="muted" style={styles.pageSubtitle}>
                        Organize content concepts and drag cards across priority stages.
                    </Text>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsRow}>
                    <View style={styles.searchInputContainer}>
                        <Feather name="search" size={18} color={Colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            placeholderTextColor={Colors.textMuted}
                        />
                    </View>
                    <View style={styles.actionsRight}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Icon name="filter" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                        <View style={styles.viewToggleGroup}>
                            <TouchableOpacity style={[styles.viewToggleButton, styles.viewToggleButtonActive]}>
                                <Icon name="board" size={18} color={Colors.brandPrimary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewToggleButton}>
                                <Icon name="table" size={18} color={Colors.textDark} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewToggleButton}>
                                <Icon name="grid" size={18} color={Colors.textDark} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Board Lanes */}
                <View style={styles.boardContainer}>
                    
                    {/* Lane: Hot Priority */}
                    <Card>
                        <View style={styles.laneHeader}>
                            <View style={styles.laneHeaderLeft}>
                                <Badge variant="danger" label="● 🔥 Hot Priority" />
                                <View style={styles.laneCountBadge}>
                                    <Text variant="caption" style={styles.laneCountText}>3</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => openComposer('Composer')}>
                                <Feather name="plus" size={20} color={Colors.textDark} />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Idea Card 1 */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text variant="bodyBold" color="dark" style={styles.ideaCardTitle}>AI Trend Report Infographic</Text>
                            <Text variant="body" color="muted" style={styles.ideaCardDesc}>
                                Summarize the Q3 AI benchmarks into a carousel graphic for LinkedIn and Twitter.
                            </Text>
                            <View style={styles.ideaCardFooter}>
                                <View style={styles.footerDate}>
                                    <Feather name="calendar" size={14} color={Colors.textDark} />
                                    <Text variant="caption" color="dark">Tomorrow</Text>
                                </View>
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }} 
                                    style={styles.avatarSmall} 
                                />
                            </View>
                        </Card>

                        {/* Idea Card 2 */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text variant="bodyBold" color="dark" style={styles.ideaCardTitle}>Founder Video Teaser</Text>
                            <Text variant="body" color="muted" style={styles.ideaCardDesc}>
                                Short 30-sec talking head clip addressing community questions from the launch.
                            </Text>
                            <View style={styles.ideaCardFooter}>
                                <View style={styles.footerDate}>
                                    <Feather name="calendar" size={14} color={Colors.textDark} />
                                    <Text variant="caption" color="dark">Oct 12</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Idea Card 3 */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text variant="bodyBold" color="dark" style={styles.ideaCardTitle}>Update Brand Guidelines</Text>
                            <Text variant="body" color="muted" style={styles.ideaCardDesc}>
                                Integrate new color palettes and typography rules into the core...
                            </Text>
                            <View style={styles.ideaCardFooter}>
                                <View style={styles.footerDate}>
                                    <Feather name="calendar" size={14} color={Colors.textDark} />
                                    <Text variant="caption" color="dark">Oct 15</Text>
                                </View>
                            </View>
                        </Card>

                        <Button
                            variant="ghost"
                            icon="plus"
                            iconPosition="left"
                            title="Add Idea"
                            iconColor={Colors.textMuted}
                            textStyle={{ color: Colors.textMuted }}
                            onPress={() => openComposer('Composer')}
                        />
                    </Card>

                    {/* Lane: Exploring */}
                    <Card>
                        <View style={styles.laneHeader}>
                            <View style={styles.laneHeaderLeft}>
                                <Badge variant="success" label="● ⚡ Exploring" />
                                <View style={styles.laneCountBadge}>
                                    <Text variant="caption" style={styles.laneCountText}>2</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => openComposer('Composer')}>
                                <Feather name="plus" size={20} color={Colors.textDark} />
                            </TouchableOpacity>
                        </View>
                        
                        <Card style={{ marginBottom: 12 }}>
                            <Text variant="bodyBold" color="dark" style={styles.ideaCardTitle}>Podcast Series Concept</Text>
                            <Text variant="body" color="muted" style={styles.ideaCardDesc}>
                                Outline potential topics and guests for a bi-weekly industry insights podcast.
                            </Text>
                        </Card>

                        <Button
                            variant="ghost"
                            icon="plus"
                            iconPosition="left"
                            title="Add Idea"
                            iconColor={Colors.textMuted}
                            textStyle={{ color: Colors.textMuted }}
                            onPress={() => openComposer('Composer')}
                        />
                    </Card>

                    {/* Lane: Someday */}
                    <Card>
                        <View style={styles.laneHeader}>
                            <View style={styles.laneHeaderLeft}>
                                <Badge variant="warning" label="● 📦 Someday" />
                                <View style={styles.laneCountBadge}>
                                    <Text variant="caption" style={styles.laneCountText}>0</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => openComposer('Composer')}>
                                <Feather name="plus" size={20} color={Colors.textDark} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.emptyDropZone}>
                            <Text variant="body" color="muted">Drop ideas here</Text>
                        </View>

                        <Button
                            variant="ghost"
                            icon="plus"
                            iconPosition="left"
                            title="Add Idea"
                            iconColor={Colors.textMuted}
                            textStyle={{ color: Colors.textMuted }}
                            onPress={() => openComposer('Composer')}
                        />
                    </Card>

                    {/* Lane: Backlog / Unassigned */}
                    <Card>
                        <View style={styles.laneHeader}>
                            <View style={styles.laneHeaderLeft}>
                                <Badge variant="info" label="● 💡 Backlog / Unassigned" />
                                <View style={styles.laneCountBadge}>
                                    <Text variant="caption" style={styles.laneCountText}>0</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => openComposer('Composer')}>
                                <Feather name="plus" size={20} color={Colors.textDark} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.emptyDropZone}>
                            <Text variant="body" color="muted">Drop ideas here</Text>
                        </View>

                        <Button
                            variant="ghost"
                            icon="plus"
                            iconPosition="left"
                            title="Add Idea"
                            iconColor={Colors.textMuted}
                            textStyle={{ color: Colors.textMuted }}
                            onPress={() => openComposer('Composer')}
                        />
                    </Card>
                </View>

                {/* Bottom spacer for FAB */}
                <View style={{ height: 120 }} />
            </ScrollView>
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    pageTitle: {
        fontSize: 20,
        color: Colors.brandPrimary,
    },
    titleBadge: {
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 12,
    },
    titleBadgeText: {
        color: '#4B5563',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    pageSubtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    actionsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        alignItems: 'center',
        gap: 8,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: Colors.textDark,
    },
    actionsRight: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
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
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    viewTogglesContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    viewToggleGroup: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: 4,
        gap: 4,
    },
    viewToggleButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    viewToggleButtonActive: {
        backgroundColor: Colors.brandPrimary,
    },
    boardContainer: {
        paddingHorizontal: 16,
        gap: 20,
    },
    laneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    laneHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    laneCountBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    laneCountText: {
        color: '#6B7280',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    ideaCardTitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    ideaCardDesc: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    ideaCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerDate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    avatarSmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    emptyDropZone: {
        height: 80,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.brandPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
});
