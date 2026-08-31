import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constant';
import { Text, View, Card, Badge } from '../components/UI';
import DashboardHeader from '../components/DashboardHeader';
import Icon from '../components/IconResolver';

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
        platforms: ['Instagram'],
        status: 'Failed',
        badgeVariant: 'danger',
        isFailed: true,
        text: "[Draft] Five tips for improving your remote team's productivity without increasing...",
        editedText: 'Last edited: 2 hrs ago',
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

    const filteredPosts = POSTS.filter((p) => {
        const matchesTab = activeTab === 'All' || p.status === activeTab;
        const matchesSearch = p.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
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
                    <View style={styles.searchInputContainer}>
                        <Feather name="search" size={18} color={Colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search posts..."
                            placeholderTextColor={Colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <View style={styles.actionsRight}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Icon name="filter" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                        <View style={styles.viewToggleGroup}>
                            <TouchableOpacity style={[styles.viewToggleButton]}>
                                <Feather name="list" size={18} color={Colors.textDark} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.viewToggleButton, styles.viewToggleButtonActive]}>
                                <Feather name="grid" size={18} color={Colors.brandPrimary} />
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
                    <FlatList
                        data={filteredPosts}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                        renderItem={({ item }) => (
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
                        )}
                    />
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
});
