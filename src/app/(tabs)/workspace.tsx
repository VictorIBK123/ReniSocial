import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Badge, Button } from '../components/UI';
import { Colors, Fonts } from '../../constant';
import { Feather } from '@expo/vector-icons';
import { Icon } from '../components/IconResolver';
import DashboardHeader from '../components/DashboardHeader';
import { useRouter } from 'expo-router';

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
    isYou?: boolean;
    avatar?: string;
    initials?: string;
}

const MEMBERS: Member[] = [
    {
        id: '1',
        name: 'Adetiba Adedotun',
        email: 'adetiba@renisocial.com',
        role: 'Owner',
        isYou: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    },
    {
        id: '2',
        name: 'Sarah Jenkins',
        email: 'sarah.j@renisocial.com',
        role: 'Admin',
        initials: 'SJ',
    },
    {
        id: '3',
        name: 'Marcus Chen',
        email: 'm.chen@agency.com',
        role: 'Editor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    },
    {
        id: '4',
        name: 'Elena Rodriguez',
        email: 'elena@freelance.co',
        role: 'Editor',
        initials: 'EL',
    },
    {
        id: '5',
        name: 'David Smith',
        email: 'd.smith@client.com',
        role: 'Viewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
];

const PENDING_INVITES = [
    { id: '1', email: 'alex@example.com', role: 'Editor' },
    { id: '2', email: 'client@brand.com', role: 'Viewer' },
];

export default function WorkspaceScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Workspace Details' | 'Team Members'>('Workspace Details');
    const [brandName, setBrandName] = useState('Acme Corp Global');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = MEMBERS.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderRoleBadge = (role: Member['role']) => {
        switch (role) {
            case 'Owner':
                return (
                    <View style={[styles.roleBadge, styles.roleOwner]}>
                        <Text style={[styles.roleText, { color: Colors.white }]}>Owner</Text>
                    </View>
                );
            case 'Admin':
                return (
                    <View style={[styles.roleBadge, styles.roleAdmin]}>
                        <Text style={[styles.roleText, { color: '#3730A3' }]}>Admin</Text>
                    </View>
                );
            case 'Editor':
                return (
                    <View style={[styles.roleBadge, styles.roleEditor]}>
                        <Text style={[styles.roleText, { color: '#475569' }]}>Editor</Text>
                    </View>
                );
            case 'Viewer':
                return (
                    <View style={[styles.roleBadge, styles.roleViewer]}>
                        <Text style={[styles.roleText, { color: '#64748B' }]}>Viewer</Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />

                {/* Back Button & Title */}
                <View style={styles.headerSection}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={20} color={Colors.brandPrimary} />
                    </TouchableOpacity>
                    <Text variant="heading" color="primary" style={styles.pageTitle}>Workspace</Text>
                    <Text variant="body" color="dark" style={styles.pageSubtitle}>
                        Manage your brand identity, team members, and connected channels.
                    </Text>
                </View>

                {/* View Toggles */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tabGroup}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Workspace Details' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Workspace Details')}
                        >
                            <Icon
                                name="workspace"
                                size={16}
                                color={activeTab === 'Workspace Details' ? Colors.white : Colors.brandPrimary}
                            />
                            <Text
                                variant="bodyBold"
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: activeTab === 'Workspace Details' ? Colors.white : Colors.brandPrimary,
                                }}
                            >
                                Workspace Details
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Team Members' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Team Members')}
                        >
                            <Icon
                                name="team-fill"
                                size={16}
                                color={activeTab === 'Team Members' ? Colors.white : Colors.brandPrimary}
                            />
                            <Text
                                variant="bodyBold"
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: activeTab === 'Team Members' ? Colors.white : Colors.brandPrimary,
                                }}
                            >
                                Team Members
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'Workspace Details' ? (
                    <View style={styles.cardsContainer}>
                        {/* Brand Logo Card */}
                        <Card>
                            <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                BRAND LOGO
                            </Text>

                            {/* Upload Area */}
                            <TouchableOpacity activeOpacity={0.7} style={styles.uploadBox}>
                                <Icon name="upload" size={24} color="#475569" />
                                <Text style={styles.uploadText}>UPLOAD</Text>
                            </TouchableOpacity>

                            <Text variant="body" color="dark" style={styles.logoHint}>
                                Personalize your workspace with a brand logo. Recommended: 512x512px (PNG, JPG)
                            </Text>

                            <TouchableOpacity activeOpacity={0.7} style={styles.chooseFileButton}>
                                <Text variant="bodyBold" style={styles.chooseFileText}>Choose File</Text>
                            </TouchableOpacity>
                        </Card>

                        {/* Brand Name & Description Card */}
                        <Card>
                            <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                BRAND NAME
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={brandName}
                                onChangeText={setBrandName}
                                placeholder="Brand name"
                                placeholderTextColor="#94A3B8"
                            />

                            <Text variant="caption" weight="bold" style={[styles.cardLabelText, { marginTop: 16 }]}>
                                DESCRIPTION
                            </Text>
                            <TextInput
                                style={styles.textAreaInput}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Tell us a bit about what your brand does"
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </Card>

                        {/* Plan Type Card */}
                        <Card>
                            <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                PLAN TYPE
                            </Text>
                            <View style={styles.planPill}>
                                <View style={styles.planDot} />
                                <Text variant="body" color="dark" style={styles.planText}>Personal</Text>
                            </View>
                        </Card>

                        {/* Save Changes Action */}
                        <TouchableOpacity activeOpacity={0.7} style={styles.saveButton}>
                            <Text variant="bodyBold" style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Team Members View */
                    <View style={styles.cardsContainer}>
                        {/* Total Members Metric Card */}
                        <Card>
                            <View style={styles.metricCardContent}>
                                <View>
                                    <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                        TOTAL MEMBERS
                                    </Text>
                                    <Text style={styles.metricValue}>5</Text>
                                </View>
                                <Icon name="members" size={30} color={Colors.brandPrimary} />
                            </View>
                        </Card>

                        {/* Pending Invites Metric Card */}
                        <Card>
                            <View style={styles.metricCardContent}>
                                <View>
                                    <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                        PENDING INVITES
                                    </Text>
                                    <Text style={styles.metricValue}>2</Text>
                                </View>
                                <Feather name="mail" size={28} color={Colors.brandPrimary} />
                            </View>
                        </Card>

                        {/* Your Role Card */}
                        <View style={styles.yourRoleCard}>
                            <View style={styles.yourRoleBackgroundIcon}>
                                <Icon name="badge" size={110} color="rgba(255, 255, 255, 0.08)" />
                            </View>
                            <Text variant="caption" weight="bold" style={styles.yourRoleLabel}>
                                YOUR ROLE
                            </Text>
                            <View style={styles.yourRoleBottomRow}>
                                <Text style={styles.yourRoleValue}>Owner</Text>
                                <Icon name="badge" size={24} color="rgba(255, 255, 255, 0.85)" />
                            </View>
                        </View>

                        {/* Team Members Section */}
                        <View style={styles.sectionHeaderRow}>
                            <Text variant="heading" color="primary" style={styles.sectionTitle}>
                                Team Members
                            </Text>
                            <View style={styles.countBadge}>
                                <Text variant="caption" style={styles.countBadgeText}>
                                    {filteredMembers.length}
                                </Text>
                            </View>
                        </View>

                        {/* Search & Invite Row */}
                        <View style={styles.searchRow}>
                            <View style={styles.searchInputContainer}>
                                <Feather name="search" size={18} color="#94A3B8" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search members..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                            <TouchableOpacity activeOpacity={0.8} style={styles.inviteButton}>
                                <Feather name="user-plus" size={16} color={Colors.white} />
                                <Text variant="bodyBold" style={styles.inviteButtonText}>
                                    Invite
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Members List */}
                        <FlatList
                            data={filteredMembers}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            renderItem={({ item: member }) => (
                                <Card style={styles.memberCard}>
                                    {/* Top Row: Avatar + Name & Email + More Button */}
                                    <View style={styles.memberTopRow}>
                                        {member.avatar ? (
                                            <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
                                        ) : (
                                            <View style={styles.avatarInitials}>
                                                <Text style={styles.avatarInitialsText}>{member.initials}</Text>
                                            </View>
                                        )}

                                        <View style={styles.memberInfo}>
                                            <View style={styles.memberNameRow}>
                                                <Text variant="bodyBold" color="dark" style={styles.memberName}>
                                                    {member.name}
                                                </Text>
                                                {member.isYou && (
                                                    <View style={styles.youBadge}>
                                                        <Text style={styles.youBadgeText}>You</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text variant="caption" color="muted" style={styles.memberEmail}>
                                                {member.email}
                                            </Text>
                                        </View>

                                        <TouchableOpacity style={styles.moreButton}>
                                            <Feather name="more-horizontal" size={20} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Bottom Row: Role Badge directly below avatar */}
                                    <View style={styles.memberRoleContainer}>
                                        {renderRoleBadge(member.role)}
                                    </View>
                                </Card>
                            )}
                        />

                        {/* Pending Invites Section */}
                        <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                            <View style={styles.pendingHeaderLeft}>
                                <Icon name="pending" size={20} color={Colors.brandPrimary} />
                                <Text variant="heading" color="primary" style={[styles.sectionTitle, { marginLeft: 8 }]}>
                                    Pending Invites
                                </Text>
                            </View>
                            <View style={styles.countBadge}>
                                <Text variant="caption" style={styles.countBadgeText}>
                                    {PENDING_INVITES.length}
                                </Text>
                            </View>
                        </View>

                        <FlatList
                            data={PENDING_INVITES}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            renderItem={({ item: invite }) => (
                                <Card>
                                    <View style={styles.inviteCardContent}>
                                        <View>
                                            <Text variant="bodyBold" color="dark" style={styles.inviteEmail}>
                                                {invite.email}
                                            </Text>
                                            <Text variant="caption" color="muted" style={styles.inviteSubtext}>
                                                Invited as {invite.role}
                                            </Text>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.7}>
                                            <Text variant="bodyBold" style={styles.revokeText}>
                                                Revoke
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            )}
                        />

                        {/* Role Permissions Card */}
                        <Card style={{ marginTop: 4 }}>
                            <Text variant="heading" color="dark" style={styles.permissionsTitle}>
                                Role Permissions
                            </Text>

                            {/* Owner & Admin */}
                            <View style={styles.permissionItem}>
                                <View style={styles.permissionTitleRow}>
                                    <View style={[styles.permissionDot, { backgroundColor: Colors.brandPrimary }]} />
                                    <Text variant="bodyBold" color="dark" style={styles.permissionRoleName}>
                                        Owner & Admin
                                    </Text>
                                </View>
                                <Text variant="caption" color="muted" style={styles.permissionDesc}>
                                    Full access to settings, billing, and all workspace content. Can manage members.
                                </Text>
                            </View>

                            {/* Editor */}
                            <View style={styles.permissionItem}>
                                <View style={styles.permissionTitleRow}>
                                    <View style={[styles.permissionDot, { backgroundColor: '#64748B' }]} />
                                    <Text variant="bodyBold" color="dark" style={styles.permissionRoleName}>
                                        Editor
                                    </Text>
                                </View>
                                <Text variant="caption" color="muted" style={styles.permissionDesc}>
                                    Can create, edit, and schedule posts. Cannot manage workspace settings or members.
                                </Text>
                            </View>

                            {/* Viewer */}
                            <View style={styles.permissionItem}>
                                <View style={styles.permissionTitleRow}>
                                    <View style={[styles.permissionDot, { backgroundColor: '#94A3B8' }]} />
                                    <Text variant="bodyBold" color="dark" style={styles.permissionRoleName}>
                                        Viewer
                                    </Text>
                                </View>
                                <Text variant="caption" color="muted" style={styles.permissionDesc}>
                                    Read-only access to calendar and published content. Cannot edit or comment.
                                </Text>
                            </View>
                        </Card>
                    </View>
                )}

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
    headerSection: {
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: -12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    pageTitle: {
        fontSize: 22,
        fontFamily: Fonts.heading.bold,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 13,
        lineHeight: 20,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tabGroup: {
        flexDirection: 'row',
        height: 52,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: 4,
        gap: 4,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    tabButtonActive: {
        backgroundColor: Colors.brandPrimary,
    },
    cardsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    cardLabelText: {
        fontSize: 11.5,
        fontFamily: Fonts.alt.bold,
        color: Colors.textDark,
        letterSpacing: 0.6,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    uploadBox: {
        width: 140,
        height: 110,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 14,
    },
    uploadText: {
        fontSize: 11,
        fontFamily: Fonts.alt.bold,
        color: '#475569',
        letterSpacing: 0.8,
        marginTop: 6,
    },
    logoHint: {
        fontSize: 13,
        lineHeight: 18,
        color: '#475569',
        marginBottom: 14,
    },
    chooseFileButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
    chooseFileText: {
        fontSize: 13,
        color: Colors.textDark,
    },
    textInput: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: Colors.white,
        paddingHorizontal: 14,
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textDark,
    },
    textAreaInput: {
        minHeight: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: Colors.white,
        padding: 14,
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textDark,
    },
    planPill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#DCFCE7',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    planDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    planText: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#111827',
    },
    saveButton: {
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    saveButtonText: {
        fontSize: 14,
        color: '#4338CA',
    },
    // Team Members Styles
    metricCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 34,
        lineHeight: 42,
        fontFamily: Fonts.heading.bold,
        fontWeight: '800',
        color: Colors.textDark,
        marginTop: 4,
        includeFontPadding: false,
    },
    yourRoleCard: {
        backgroundColor: Colors.brandPrimary,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    yourRoleBackgroundIcon: {
        position: 'absolute',
        right: -10,
        bottom: -20,
    },
    yourRoleLabel: {
        fontSize: 11,
        fontFamily: Fonts.alt.bold,
        color: 'rgba(255, 255, 255, 0.75)',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    yourRoleBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    yourRoleValue: {
        fontSize: 26,
        lineHeight: 34,
        fontFamily: Fonts.heading.bold,
        fontWeight: '800',
        color: Colors.white,
        includeFontPadding: false,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
    },
    countBadge: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    countBadgeText: {
        color: '#475569',
        fontSize: 12,
        fontFamily: Fonts.body.semiBold,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginVertical: 6,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: Fonts.body.medium,
        color: Colors.textDark,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.brandPrimary,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 44,
        gap: 6,
    },
    inviteButtonText: {
        color: Colors.white,
        fontSize: 14,
    },
    memberCard: {
        padding: 16,
    },
    memberTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    avatarInitials: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#EEF2F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitialsText: {
        fontSize: 15,
        fontFamily: Fonts.heading.bold,
        color: '#1E293B',
    },
    memberInfo: {
        flex: 1,
        marginLeft: 12,
    },
    memberNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    memberName: {
        fontSize: 15,
    },
    youBadge: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    youBadgeText: {
        fontSize: 11,
        fontFamily: Fonts.body.medium,
        color: '#64748B',
    },
    memberEmail: {
        fontSize: 13,
        marginTop: 2,
    },
    memberRoleContainer: {
        marginTop: 12,
        alignItems: 'flex-start',
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    roleOwner: {
        backgroundColor: Colors.brandPrimary,
    },
    roleAdmin: {
        backgroundColor: '#EEF2FF',
    },
    roleEditor: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    roleViewer: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    roleText: {
        fontSize: 12,
        fontFamily: Fonts.body.semiBold,
    },
    moreButton: {
        padding: 4,
    },
    pendingHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inviteCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inviteEmail: {
        fontSize: 14,
    },
    inviteSubtext: {
        fontSize: 13,
        marginTop: 2,
    },
    revokeText: {
        fontSize: 13,
        color: Colors.brandPrimary,
    },
    permissionsTitle: {
        fontSize: 18,
        marginBottom: 14,
    },
    permissionItem: {
        marginBottom: 14,
    },
    permissionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    permissionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    permissionRoleName: {
        fontSize: 14,
    },
    permissionDesc: {
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 16,
        marginTop: 4,
    },
});

