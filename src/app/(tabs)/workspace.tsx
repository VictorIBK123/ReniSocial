import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constant';
import { useTheme } from '../../hooks/useTheme';
import {
    useCreateWorkspaceMutation,
    useInviteWorkspaceMemberMutation,
    useRemoveWorkspaceMemberMutation,
    useUploadWorkspaceLogoMutation,
    useWorkspace,
    useWorkspaceMembersQuery,
} from '../../hooks/useWorkspace';
import { WorkspaceMember, WorkspaceRole } from '../../services/workspace.service';
import { useAuth } from '../../store/authStore';
import ActivityModal, { ActivityModalType } from '../components/ActivityModal';
import DashboardHeader from '../components/DashboardHeader';
import { Icon } from '../components/IconResolver';
import { Card, Text } from '../components/UI';
import InviteMemberModal, { TeamRole } from '../components/workspace/InviteMemberModal';

export default function WorkspaceScreen() {
    const router = useRouter();
    const currentUser = useAuth((state) => state.user);
    const { currentWorkspace } = useWorkspace();
    const {
        data: members = [],
        isLoading: isLoadingMembers,
        refetch: refetchMembers,
    } = useWorkspaceMembersQuery(currentWorkspace?.id);

    const createWorkspaceMutation = useCreateWorkspaceMutation();
    const uploadWorkspaceLogoMutation = useUploadWorkspaceLogoMutation();
    const inviteMemberMutation = useInviteWorkspaceMemberMutation();
    const removeMemberMutation = useRemoveWorkspaceMemberMutation();

    const [activeTab, setActiveTab] = useState<'Workspace Details' | 'Team Members'>('Workspace Details');
    const [brandName, setBrandName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoId, setLogoId] = useState<string | null>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [planType, setPlanType] = useState('Personal');
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [pendingInvites, setPendingInvites] = useState<{ id: string; email: string; role: string }[]>([]);

    // Activity modal state (supports confirmation with Yes/No toggle, success, error, info)
    const [activityModal, setActivityModal] = useState<{
        visible: boolean;
        type: ActivityModalType;
        title: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }>({
        visible: false,
        type: 'info',
        title: '',
        message: '',
    });

    const handlePickAndUploadLogo = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                setActivityModal({
                    visible: true,
                    type: 'error',
                    title: 'Permission Required',
                    message: 'Photo library permission is required to choose a brand logo.',
                    confirmText: 'Dismiss',
                    onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const asset = result.assets[0];
            // Immediately show preview and activity indicator
            setLogoUrl(asset.uri);
            setIsUploadingLogo(true);

            const uploadRes = await uploadWorkspaceLogoMutation.mutateAsync({
                uri: asset.uri,
                name: asset.fileName || `logo_${Date.now()}.jpg`,
                type: asset.mimeType || 'image/jpeg',
            });

            if (uploadRes.status && uploadRes.data?.id) {
                setLogoId(uploadRes.data.id);
                if (uploadRes.data.file_url) {
                    setLogoUrl(uploadRes.data.file_url);
                }
            } else {
                throw new Error(uploadRes.message || 'Failed to upload logo.');
            }
        } catch (error: any) {
            console.error('[WorkspaceScreen] Logo upload error:', error);
            const errorMsg =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to upload brand logo. Please check your network and try again.';
            setActivityModal({
                visible: true,
                type: 'error',
                title: 'Logo Upload Failed',
                message: errorMsg,
                confirmText: 'Dismiss',
                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
            });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setLogoId(null);
    };

    const executeWorkspaceCreation = () => {
        createWorkspaceMutation.mutate(
            {
                name: brandName.trim(),
                description: description.trim(),
                logo_id: logoId || undefined,
                type: (planType || 'Personal').toLowerCase(),
            },
            {
                onSuccess: (data) => {
                    // Reset creation form
                    setBrandName('');
                    setDescription('');
                    setLogoUrl('');
                    setLogoId(null);
                    setPlanType('Personal');

                    setActivityModal({
                        visible: true,
                        type: 'success',
                        title: 'Workspace Created!',
                        message:
                            data.message ||
                            `Workspace "${data.data?.name || brandName}" has been successfully created.`,
                        confirmText: 'Continue',
                        onConfirm: () => {
                            setActivityModal((prev) => ({ ...prev, visible: false }));
                        },
                    });
                },
                onError: (error: any) => {
                    const errorMsg =
                        error?.response?.data?.message ||
                        error?.message ||
                        'Failed to create workspace. Please check your network and try again.';
                    setActivityModal({
                        visible: true,
                        type: 'error',
                        title: 'Creation Failed',
                        message: errorMsg,
                        confirmText: 'Dismiss',
                        onConfirm: () => {
                            setActivityModal((prev) => ({ ...prev, visible: false }));
                        },
                    });
                },
            }
        );
    };

    const handleSaveWorkspace = () => {
        if (isUploadingLogo) {
            setActivityModal({
                visible: true,
                type: 'info',
                title: 'Logo Uploading',
                message: 'Please wait for your logo to finish uploading before saving.',
                confirmText: 'Got It',
                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
            });
            return;
        }

        if (!brandName.trim()) {
            setActivityModal({
                visible: true,
                type: 'error',
                title: 'Validation Error',
                message: 'Please enter a brand name for your workspace.',
                confirmText: 'Got It',
                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
            });
            return;
        }

        // Directly create workspace without pre-confirmation modal
        executeWorkspaceCreation();
    };

    const handleSendInvite = (email: string, role: TeamRole) => {
        if (!currentWorkspace?.id) {
            setActivityModal({
                visible: true,
                type: 'error',
                title: 'No Workspace Selected',
                message: 'Please select or create an active workspace before inviting members.',
                confirmText: 'Dismiss',
                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
            });
            return;
        }

        const backendRole: WorkspaceRole = role.toLowerCase() === 'admin' ? 'admin' : 'member';

        inviteMemberMutation.mutate(
            {
                workspaceId: currentWorkspace.id,
                payload: {
                    email: email.trim(),
                    role: backendRole,
                },
            },
            {
                onSuccess: (data) => {
                    setPendingInvites((prev) => [
                        { id: Date.now().toString(), email: email.trim(), role },
                        ...prev,
                    ]);
                    setActivityModal({
                        visible: true,
                        type: 'success',
                        title: 'Invitation Sent',
                        message: data.message || `An invitation has been sent to ${email}.`,
                        confirmText: 'Continue',
                        onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                    });
                },
                onError: (error: any) => {
                    const errorMsg =
                        error?.response?.data?.message ||
                        error?.message ||
                        'Failed to invite member. Please check the email and try again.';
                    setActivityModal({
                        visible: true,
                        type: 'error',
                        title: 'Invite Failed',
                        message: errorMsg,
                        confirmText: 'Dismiss',
                        onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                    });
                },
            }
        );
    };

    const handleRevokeInvite = (id: string) => {
        setPendingInvites((prev) => prev.filter((item) => item.id !== id));
    };

    const handleRemoveMember = (member: WorkspaceMember) => {
        if (!currentWorkspace?.id) return;
        const memberId = member.user_id || member.user?.id || member.id;
        if (!memberId) return;

        const memberName =
            member.name ||
            (member.user?.first_name || member.user?.last_name
                ? `${member.user?.first_name || ''} ${member.user?.last_name || ''}`.trim()
                : member.user?.name || member.email || 'this member');

        setActivityModal({
            visible: true,
            type: 'info',
            title: 'Remove Member',
            message: `Are you sure you want to remove ${memberName} from this workspace?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            onConfirm: () => {
                setActivityModal((prev) => ({ ...prev, visible: false }));
                removeMemberMutation.mutate(
                    { workspaceId: currentWorkspace.id, userId: memberId },
                    {
                        onSuccess: (res) => {
                            setActivityModal({
                                visible: true,
                                type: 'success',
                                title: 'Member Removed',
                                message: res.message || `${memberName} has been removed from the workspace.`,
                                confirmText: 'OK',
                                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                            });
                        },
                        onError: (err: any) => {
                            const errMsg =
                                err?.response?.data?.message || err?.message || 'Failed to remove member.';
                            setActivityModal({
                                visible: true,
                                type: 'error',
                                title: 'Removal Failed',
                                message: errMsg,
                                confirmText: 'Dismiss',
                                onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                            });
                        },
                    }
                );
            },
            onCancel: () => setActivityModal((prev) => ({ ...prev, visible: false })),
        });
    };

    const filteredMembers = (members || []).filter((m: WorkspaceMember) => {
        const memberName =
            m.name ||
            (m.user?.first_name || m.user?.last_name
                ? `${m.user?.first_name || ''} ${m.user?.last_name || ''}`.trim()
                : m.user?.name || '');
        const memberEmail = m.email || m.user?.email || '';
        return (
            memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memberEmail.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const userMember = (members || []).find(
        (m: WorkspaceMember) =>
            (currentUser?.id &&
                (m.user_id === currentUser.id || m.id === currentUser.id || m.user?.id === currentUser.id)) ||
            (currentUser?.email && (m.email === currentUser.email || m.user?.email === currentUser.email))
    );
    const yourRoleDisplay = userMember?.role
        ? userMember.role.charAt(0).toUpperCase() + userMember.role.slice(1)
        : currentWorkspace?.owner_id === currentUser?.id
        ? 'Owner'
        : 'Member';

    const renderRoleBadge = (rawRole?: string) => {
        const role = (rawRole || 'member').toLowerCase();
        switch (role) {
            case 'owner':
                return (
                    <View style={[styles.roleBadge, styles.roleOwner]}>
                        <Text style={[styles.roleText, { color: Colors.white }]}>Owner</Text>
                    </View>
                );
            case 'admin':
                return (
                    <View style={[styles.roleBadge, styles.roleAdmin]}>
                        <Text style={[styles.roleText, { color: '#3730A3' }]}>Admin</Text>
                    </View>
                );
            case 'editor':
                return (
                    <View style={[styles.roleBadge, styles.roleEditor]}>
                        <Text style={[styles.roleText, { color: '#475569' }]}>Editor</Text>
                    </View>
                );
            case 'viewer':
                return (
                    <View style={[styles.roleBadge, styles.roleViewer]}>
                        <Text style={[styles.roleText, { color: '#64748B' }]}>Viewer</Text>
                    </View>
                );
            case 'member':
            default:
                return (
                    <View style={[styles.roleBadge, styles.roleEditor]}>
                        <Text style={[styles.roleText, { color: '#475569' }]}>Member</Text>
                    </View>
                );
        }
    };

    const { colors } = useTheme();

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    activeTab === 'Team Members' ? (
                        <RefreshControl
                            refreshing={isLoadingMembers}
                            onRefresh={refetchMembers}
                            tintColor={colors.brandPrimary}
                            colors={[colors.brandPrimary]}
                        />
                    ) : undefined
                }
            >
                <DashboardHeader />

                {/* Back Button & Title */}
                <View style={styles.headerSection}>
                    <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.bgAccent }]} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={20} color={colors.brandPrimary} />
                    </TouchableOpacity>
                    <Text variant="heading" color="primary" style={styles.pageTitle}>Workspace</Text>
                    <Text variant="body" color="dark" style={styles.pageSubtitle}>
                        Manage your brand identity, team members, and connected channels.
                    </Text>
                </View>

                {/* View Toggles */}
                <View style={styles.tabsContainer}>
                    <View style={[styles.tabGroup, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Workspace Details' && [styles.tabButtonActive, { backgroundColor: colors.brandPrimary }]]}
                            onPress={() => setActiveTab('Workspace Details')}
                        >
                            <Icon
                                name="workspace"
                                size={16}
                                color={activeTab === 'Workspace Details' ? '#FFFFFF' : colors.brandPrimary}
                            />
                            <Text
                                variant="bodyBold"
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: activeTab === 'Workspace Details' ? '#FFFFFF' : colors.brandPrimary,
                                }}
                            >
                                Workspace Details
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Team Members' && [styles.tabButtonActive, { backgroundColor: colors.brandPrimary }]]}
                            onPress={() => setActiveTab('Team Members')}
                        >
                            <Icon
                                name="team-fill"
                                size={16}
                                color={activeTab === 'Team Members' ? '#FFFFFF' : colors.brandPrimary}
                            />
                            <Text
                                variant="bodyBold"
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: activeTab === 'Team Members' ? '#FFFFFF' : colors.brandPrimary,
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

                            {isUploadingLogo ? (
                                <View style={[styles.uploadBox, styles.uploadingBox, { borderColor: colors.brandPrimary, backgroundColor: colors.bgCard }]}>
                                    <ActivityIndicator size="small" color={colors.brandPrimary} />
                                    <Text style={[styles.uploadingText, { color: colors.brandPrimary }]}>
                                        Uploading logo...
                                    </Text>
                                </View>
                            ) : logoUrl ? (
                                <View style={styles.logoPreviewContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={handlePickAndUploadLogo}
                                        style={[styles.logoImageWrapper, { borderColor: colors.borderLight }]}
                                    >
                                        <Image source={{ uri: logoUrl }} style={styles.logoPreviewImage} />
                                        <View style={[styles.editIconBadge, { backgroundColor: colors.brandPrimary, borderColor: colors.bgCard }]}>
                                            <Feather name="camera" size={12} color="#FFFFFF" />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={handleRemoveLogo}
                                        style={[styles.removeLogoButton, { borderColor: colors.borderLight }]}
                                    >
                                        <Feather name="trash-2" size={13} color={Colors.danger} />
                                        <Text style={{ fontSize: 12, color: Colors.danger, marginLeft: 4 }}>Remove Logo</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handlePickAndUploadLogo}
                                    style={[styles.uploadBox, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                                >
                                    <View style={[styles.uploadIconCircle, { backgroundColor: colors.bgAccent }]}>
                                        <Icon name="upload" size={20} color={colors.brandPrimary} />
                                    </View>
                                    <Text style={[styles.uploadBoxTitle, { color: colors.textDark }]}>Upload Brand Logo</Text>
                                    <Text style={[styles.uploadBoxSubtitle, { color: colors.textMuted }]}>
                                        Tap to pick image from your device
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </Card>

                        {/* Brand Name & Description Card */}
                        <Card>
                            <Text variant="caption" weight="bold" style={styles.cardLabelText}>
                                BRAND NAME
                            </Text>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: colors.bgCard, color: colors.textDark, borderColor: colors.borderLight }]}
                                value={brandName}
                                onChangeText={setBrandName}
                                placeholder="Brand name"
                                placeholderTextColor="#94A3B8"
                            />

                            <Text variant="caption" weight="bold" style={[styles.cardLabelText, { marginTop: 16 }]}>
                                DESCRIPTION
                            </Text>
                            <TextInput
                                style={[styles.textAreaInput, { backgroundColor: colors.bgCard, color: colors.textDark, borderColor: colors.borderLight }]}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text variant="caption" weight="bold" style={[styles.cardLabelText, { marginBottom: 0 }]}>
                                    PLAN TYPE
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        setActivityModal({
                                            visible: true,
                                            type: 'info',
                                            title: 'Plan Information',
                                            message: 'The Personal plan gives you full access to post composition, scheduling, multi-channel connections, and engagement analytics.',
                                            confirmText: 'Understood',
                                            onConfirm: () => setActivityModal((prev) => ({ ...prev, visible: false })),
                                        })
                                    }
                                    style={{ padding: 4 }}
                                >
                                    <Feather name="info" size={16} color={colors.brandPrimary} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.planPill}>
                                <View style={styles.planDot} />
                                <Text variant="body" color="dark" style={styles.planText}>Personal</Text>
                            </View>
                        </Card>

                        {/* Save / Create Workspace Action */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={createWorkspaceMutation.isPending || isUploadingLogo}
                            onPress={handleSaveWorkspace}
                            style={[
                                styles.saveButton,
                                { backgroundColor: colors.brandPrimary },
                                (createWorkspaceMutation.isPending || isUploadingLogo) && { opacity: 0.7 },
                            ]}
                        >
                            {createWorkspaceMutation.isPending ? (
                                <ActivityIndicator color={Colors.white} size="small" />
                            ) : isUploadingLogo ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <ActivityIndicator color={Colors.white} size="small" />
                                    <Text variant="bodyBold" style={[styles.saveButtonText, { color: Colors.white }]}>
                                        Uploading Logo...
                                    </Text>
                                </View>
                            ) : (
                                <Text variant="bodyBold" style={[styles.saveButtonText, { color: Colors.white }]}>
                                    Create Workspace
                                </Text>
                            )}
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
                                    <Text style={styles.metricValue}>{members.length}</Text>
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
                                    <Text style={styles.metricValue}>{pendingInvites.length}</Text>
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
                                <Text style={styles.yourRoleValue}>{yourRoleDisplay}</Text>
                                <Icon name="badge" size={24} color="rgba(255, 255, 255, 0.85)" />
                            </View>
                        </View>

                        {/* No Active Workspace Warning Banner */}
                        {!currentWorkspace && (
                            <Card style={{ paddingVertical: 20, alignItems: 'center', marginBottom: 12 }}>
                                <Icon name="workspace" size={32} color={colors.brandPrimary} />
                                <Text variant="bodyBold" color="dark" style={{ marginTop: 8, textAlign: 'center' }}>
                                    No Active Workspace
                                </Text>
                                <Text variant="caption" color="muted" style={{ textAlign: 'center', marginTop: 4, marginBottom: 12 }}>
                                    Please select or create an active workspace first to view and manage team members.
                                </Text>
                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: colors.brandPrimary, height: 38, paddingHorizontal: 20, marginTop: 4 }]}
                                    onPress={() => setActiveTab('Workspace Details')}
                                >
                                    <Text variant="bodyBold" style={{ color: Colors.white, fontSize: 13 }}>
                                        Go to Create Workspace
                                    </Text>
                                </TouchableOpacity>
                            </Card>
                        )}

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
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.inviteButton}
                                onPress={() => setIsInviteModalVisible(true)}
                            >
                                <Feather name="user-plus" size={16} color={Colors.white} />
                                <Text variant="bodyBold" style={styles.inviteButtonText}>
                                    Invite
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Members List */}
                        {isLoadingMembers ? (
                            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={colors.brandPrimary} />
                                <Text variant="caption" style={{ marginTop: 8, color: colors.textMuted }}>
                                    Loading team members...
                                </Text>
                            </View>
                        ) : filteredMembers.length === 0 ? (
                            <Card style={{ paddingVertical: 24, alignItems: 'center' }}>
                                <Icon name="team-fill" size={32} color={colors.textMuted} />
                                <Text variant="bodyBold" color="dark" style={{ marginTop: 8 }}>
                                    No Members Found
                                </Text>
                                <Text variant="caption" color="muted" style={{ textAlign: 'center', marginTop: 4, paddingHorizontal: 16 }}>
                                    {searchQuery
                                        ? 'No members match your search criteria.'
                                        : 'There are no members in this workspace yet. Tap "Invite" above to add team members.'}
                                </Text>
                            </Card>
                        ) : (
                            <FlatList
                                data={filteredMembers}
                                keyExtractor={(item, index) => item.id || item.user_id || item.user?.id || String(index)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                                renderItem={({ item: member }) => {
                                    const memberName =
                                        member.name ||
                                        (member.user?.first_name || member.user?.last_name
                                            ? `${member.user?.first_name || ''} ${member.user?.last_name || ''}`.trim()
                                            : member.user?.name || member.email || 'Team Member');
                                    const memberEmail = member.email || member.user?.email || '';
                                    const initials =
                                        memberName
                                            .split(' ')
                                            .map((n: string) => n[0])
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase() || 'TM';
                                    const avatar = member.avatar || member.user?.avatar_url || member.avatar_url;
                                    const isYou = Boolean(
                                        (currentUser?.id &&
                                            (member.user_id === currentUser.id ||
                                                member.id === currentUser.id ||
                                                member.user?.id === currentUser.id)) ||
                                        (currentUser?.email &&
                                            (member.email === currentUser.email || member.user?.email === currentUser.email))
                                    );

                                    return (
                                        <Card style={styles.memberCard}>
                                            {/* Top Row: Avatar + Name & Email + More Button */}
                                            <View style={styles.memberTopRow}>
                                                {avatar ? (
                                                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                                                ) : (
                                                    <View style={styles.avatarInitials}>
                                                        <Text style={styles.avatarInitialsText}>{initials}</Text>
                                                    </View>
                                                )}

                                                <View style={styles.memberInfo}>
                                                    <View style={styles.memberNameRow}>
                                                        <Text variant="bodyBold" color="dark" style={styles.memberName}>
                                                            {memberName}
                                                        </Text>
                                                        {isYou && (
                                                            <View style={styles.youBadge}>
                                                                <Text style={styles.youBadgeText}>You</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    {memberEmail ? (
                                                        <Text variant="caption" color="muted" style={styles.memberEmail}>
                                                            {memberEmail}
                                                        </Text>
                                                    ) : null}
                                                </View>

                                                {!isYou && (
                                                    <TouchableOpacity
                                                        style={styles.moreButton}
                                                        onPress={() => handleRemoveMember(member)}
                                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                    >
                                                        <Feather name="more-horizontal" size={20} color="#64748B" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {/* Bottom Row: Role Badge directly below avatar */}
                                            <View style={styles.memberRoleContainer}>
                                                {renderRoleBadge(member.role)}
                                            </View>
                                        </Card>
                                    );
                                }}
                            />
                        )}

                        {/* Pending Invites Section */}
                        {pendingInvites.length > 0 && (
                            <>
                                <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                                    <View style={styles.pendingHeaderLeft}>
                                        <Icon name="pending" size={20} color={Colors.brandPrimary} />
                                        <Text variant="heading" color="primary" style={[styles.sectionTitle, { marginLeft: 8 }]}>
                                            Pending Invites
                                        </Text>
                                    </View>
                                    <View style={styles.countBadge}>
                                        <Text variant="caption" style={styles.countBadgeText}>
                                            {pendingInvites.length}
                                        </Text>
                                    </View>
                                </View>

                                <FlatList
                                    data={pendingInvites}
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
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => handleRevokeInvite(invite.id)}
                                                >
                                                    <Text variant="bodyBold" style={styles.revokeText}>
                                                        Revoke
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Card>
                                    )}
                                />
                            </>
                        )}

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

            <InviteMemberModal
                visible={isInviteModalVisible}
                onClose={() => setIsInviteModalVisible(false)}
                onSendInvite={handleSendInvite}
            />

            {/* Reusable ActivityModal (Confirmation Yes/No, Success, Error, Info) */}
            <ActivityModal
                visible={activityModal.visible}
                type={activityModal.type}
                title={activityModal.title}
                message={activityModal.message}
                confirmText={activityModal.confirmText}
                cancelText={activityModal.cancelText}
                onConfirm={activityModal.onConfirm}
                onCancel={activityModal.onCancel}
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
        width: '100%',
        height: 120,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
        gap: 6,
    },
    uploadingBox: {
        borderStyle: 'solid',
        gap: 8,
    },
    uploadingText: {
        fontSize: 13,
        fontFamily: Fonts.body.semiBold,
    },
    uploadIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadBoxTitle: {
        fontSize: 13.5,
        fontFamily: Fonts.body.bold,
    },
    uploadBoxSubtitle: {
        fontSize: 12,
        fontFamily: Fonts.body.regular,
    },
    logoPreviewContainer: {
        alignItems: 'center',
        marginVertical: 6,
        gap: 12,
    },
    logoImageWrapper: {
        padding: 4,
        borderRadius: 20,
        borderWidth: 1,
        position: 'relative',
    },
    logoPreviewImage: {
        width: 84,
        height: 84,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeLogoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
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
        backgroundColor: Colors.brandPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    saveButtonText: {
        fontSize: 14,
        color: Colors.white,
    },
    activeWorkspaceBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
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

