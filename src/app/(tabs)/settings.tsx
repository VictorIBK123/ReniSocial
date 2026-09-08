import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Badge, Button } from '../components/UI';
import { Colors, Fonts } from '../../constant';
import { Feather } from '@expo/vector-icons';
import { Icon } from '../components/IconResolver';
import DashboardHeader from '../components/DashboardHeader';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

/* ==========================================================================
   1. Header Component
   ========================================================================== */
interface SettingsHeaderProps {
    onBack: () => void;
}

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => {
    const { colors } = useTheme();
    return (
        <View style={styles.headerSection}>
            <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.bgAccent }]} onPress={onBack}>
                <Feather name="arrow-left" size={20} color={colors.brandPrimary} />
            </TouchableOpacity>
            <Text variant="heading" color="primary" style={styles.pageTitle}>Settings</Text>
            <Text variant="body" color="dark" style={styles.pageSubtitle}>
                Manage your personal profile, account security, and workspace preferences.
            </Text>
        </View>
    );
};

/* ==========================================================================
   2. Tab Switcher Component
   ========================================================================== */
export type SettingsTabType = 'Profile & Security' | 'Preferences & Theme';

interface SettingsTabSwitcherProps {
    activeTab: SettingsTabType;
    onTabChange: (tab: SettingsTabType) => void;
}

export const SettingsTabSwitcher = ({ activeTab, onTabChange }: SettingsTabSwitcherProps) => {
    const { colors } = useTheme();
    return (
        <View style={styles.tabsContainer}>
            <View style={[styles.tabGroup, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Profile & Security' && [styles.tabButtonActive, { backgroundColor: colors.brandPrimary }]]}
                    onPress={() => onTabChange('Profile & Security')}
                >
                    <Icon
                        name="human"
                        size={14}
                        color={activeTab === 'Profile & Security' ? '#FFFFFF' : colors.brandPrimary}
                    />
                    <Text
                        variant="bodyBold"
                        style={{
                            marginLeft: 6,
                            fontSize: 13,
                            color: activeTab === 'Profile & Security' ? '#FFFFFF' : colors.brandPrimary,
                        }}
                    >
                        Profile & Security
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Preferences & Theme' && [styles.tabButtonActive, { backgroundColor: colors.brandPrimary }]]}
                    onPress={() => onTabChange('Preferences & Theme')}
                >
                    <Icon
                        name="preference"
                        size={14}
                        color={activeTab === 'Preferences & Theme' ? '#FFFFFF' : colors.brandPrimary}
                    />
                    <Text
                        variant="bodyBold"
                        style={{
                            marginLeft: 6,
                            fontSize: 13,
                            color: activeTab === 'Preferences & Theme' ? '#FFFFFF' : colors.brandPrimary,
                        }}
                    >
                        Preferences & Theme
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/* ==========================================================================
   3. Profile & Security Sub-Components
   ========================================================================== */

export const UserSummaryCard = () => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.userSummaryHeader}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }}
                        style={styles.avatar}
                    />
                    <View style={[styles.activeBadgeIcon, { backgroundColor: colors.brandPrimary }]}>
                        <Feather name="check" size={12} color="#FFFFFF" />
                    </View>
                </View>
                <View style={styles.userSummaryInfo}>
                    <View style={styles.userSummaryTitleRow}>
                        <Text variant="body" color="primary" style={styles.userName} numberOfLines={1}>
                            Adetiba Adedotun
                        </Text>
                        <Badge variant="success" label="ACTIVE" style={{ borderWidth: 1, borderColor: '#A7F3D0', flexShrink: 0 }} />
                    </View>
                    <Text variant="caption" color="dark" style={styles.userEmail}>
                        adetibaadedotun4@gmail.com
                    </Text>
                    <View style={styles.memberSinceRow}>
                        <Feather name="calendar" size={12} color={colors.textDark} />
                        <Text variant="caption" color="dark" style={{ marginLeft: 6 }}>
                            Member since July 19, 2026
                        </Text>
                    </View>
                </View>
            </View>
            <Button variant="primary" icon="edit-2" iconPosition="left" title="Edit Profile" />
        </Card>
    );
};

export const FullNameCard = () => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.cardLabelRow}>
                <Icon name="human" size={14} color={colors.textDark} />
                <Text variant="caption" weight="bold" style={styles.cardLabelText}>FULL NAME</Text>
            </View>
            <Text variant="body" color="primary" style={styles.cardValue}>Adetiba Adedotun</Text>
        </Card>
    );
};

export const EmailAddressCard = () => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.cardLabelRowBetween}>
                <View style={styles.cardLabelInnerRow}>
                    <Feather name="mail" size={14} color={colors.textDark} />
                    <Text variant="caption" weight="bold" style={styles.cardLabelText}>EMAIL ADDRESS</Text>
                </View>
                <Feather name="copy" size={16} color={colors.textDark} />
            </View>
            <Text variant="body" color="primary" style={styles.cardValue}>adetibaadedotun4@gmail.com</Text>
        </Card>
    );
};

export const SecurityAuthenticationCard = () => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.securityHeaderRow}>
                <View style={[styles.securityIconBox, { backgroundColor: colors.bgAccent, borderColor: colors.borderAccent }]}>
                    <Feather name="shield" size={20} color={colors.brandPrimary} />
                </View>
                <View style={styles.securityHeaderText}>
                    <Text variant="heading" style={styles.securityTitle}>Security & Authentication</Text>
                    <Text variant="body" color="dark" style={styles.securitySubtitle}>
                        Managed securely via Clerk Authentication
                    </Text>
                </View>
            </View>
            <View style={[styles.protectedPill, { backgroundColor: colors.bgCardSubtle, borderColor: colors.borderLight }]}>
                <Icon name="lock" size={12} color={colors.textDark} />
                <Text variant="caption" weight="bold" color="dark" style={{ marginLeft: 6 }}>Protected</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <Text variant="body" color="dark" style={styles.securityDesc}>
                Need to change your password, update security factors, or connected logins?
            </Text>
            <TouchableOpacity style={[styles.manageSecurityButton, { backgroundColor: colors.bgAccent, borderColor: colors.borderAccent }]}>
                <Icon name="key" size={14} color={colors.brandPrimary} />
                <Text variant="bodyBold" style={{ color: colors.brandPrimary, marginHorizontal: 8 }}>Manage Security</Text>
                <Feather name="external-link" size={14} color={colors.brandPrimary} />
            </TouchableOpacity>
        </Card>
    );
};

export const ProfileAndSecurityTab = () => (
    <View style={styles.cardsContainer}>
        <UserSummaryCard />
        <FullNameCard />
        <EmailAddressCard />
        <SecurityAuthenticationCard />
    </View>
);

/* ==========================================================================
   4. Preferences & Theme Sub-Components
   ========================================================================== */

export type ThemeOption = 'light' | 'dark' | 'system';

interface InterfaceThemeCardProps {
    selectedTheme: ThemeOption;
    onSelectTheme: (theme: ThemeOption) => void;
}

export const InterfaceThemeCard = ({ selectedTheme, onSelectTheme }: InterfaceThemeCardProps) => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.themeHeaderRow}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyBold" style={[styles.themeSectionTitle, { color: colors.textDark }]}>Interface Theme</Text>
                    <Text variant="caption" color="dark" style={styles.themeSectionSubtitle}>
                        Choose your preferred visual aesthetic for Renisocial.
                    </Text>
                </View>
                <View style={[styles.activeBadgePill, { backgroundColor: colors.bgHighlight }]}>
                    <Text style={[styles.activeBadgeText, { color: colors.brandPrimary }]}>ACTIVE: {selectedTheme.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.themeOptionsRow}>
                {/* Light Option */}
                <TouchableOpacity
                    style={[
                        styles.themeCard,
                        { backgroundColor: colors.bgCard, borderColor: colors.borderLight },
                        selectedTheme === 'light' && [styles.themeCardActive, { borderColor: colors.brandPrimary, backgroundColor: colors.bgHighlight }]
                    ]}
                    onPress={() => onSelectTheme('light')}
                    activeOpacity={0.7}
                >
                    <Feather name="sun" size={24} color={colors.textDark} />
                    <View style={[styles.lightCapsule, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
                        <View style={styles.lightCapsuleDot} />
                        <View style={styles.lightCapsuleBar} />
                    </View>
                    <Text style={[styles.themeCardLabel, { color: colors.textDark }]}>Light</Text>
                </TouchableOpacity>

                {/* Dark Option */}
                <TouchableOpacity
                    style={[
                        styles.themeCard,
                        { backgroundColor: colors.bgCard, borderColor: colors.borderLight },
                        selectedTheme === 'dark' && [styles.themeCardActive, { borderColor: colors.brandPrimary, backgroundColor: colors.bgHighlight }]
                    ]}
                    onPress={() => onSelectTheme('dark')}
                    activeOpacity={0.7}
                >
                    <Feather name="moon" size={24} color={colors.textDark} />
                    <View style={styles.darkCapsule}>
                        <View style={styles.darkCapsuleDot} />
                        <View style={styles.darkCapsuleBar} />
                    </View>
                    <Text style={[styles.themeCardLabel, { color: colors.textDark }]}>Dark</Text>
                </TouchableOpacity>

                {/* System Option */}
                <TouchableOpacity
                    style={[
                        styles.themeCard,
                        { backgroundColor: colors.bgCard, borderColor: colors.borderLight },
                        selectedTheme === 'system' && [styles.themeCardActive, { borderColor: colors.brandPrimary, backgroundColor: colors.bgHighlight }]
                    ]}
                    onPress={() => onSelectTheme('system')}
                    activeOpacity={0.7}
                >
                    <Icon name="system-theme" size={22} color={colors.textDark} />
                    <View style={styles.systemCapsule}>
                        <View style={styles.systemLeftHalf} />
                        <View style={styles.systemRightHalf} />
                    </View>
                    <Text style={[styles.themeCardLabel, { color: colors.textDark }]}>System</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (val: boolean) => void;
}

export const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 22],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E2E8F0', '#2563EB'],
    });

    const checkmarkOpacity = animatedValue.interpolate({
        inputRange: [0.4, 1],
        outputRange: [0, 1],
    });

    const checkmarkScale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onValueChange(!value)}
        >
            <Animated.View style={[styles.customSwitchTrack, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.customSwitchThumb,
                        { transform: [{ translateX }] },
                    ]}
                >
                    <Animated.View
                        style={{
                            opacity: checkmarkOpacity,
                            transform: [{ scale: checkmarkScale }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Feather name="check" size={11} color="#2563EB" />
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
};

interface ToggleRowProps {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}

export const ToggleRow = ({ title, subtitle, value, onValueChange }: ToggleRowProps) => {
    const { colors } = useTheme();
    return (
        <View style={styles.toggleRow}>
            <View style={styles.toggleTextContainer}>
                <Text variant="bodyBold" style={[styles.toggleTitle, { color: colors.textDark }]}>{title}</Text>
                <Text variant="caption" color="dark" style={styles.toggleSubtitle}>{subtitle}</Text>
            </View>
            <CustomSwitch value={value} onValueChange={onValueChange} />
        </View>
    );
};

interface NotificationAlertsCardProps {
    notifAlerts: boolean;
    setNotifAlerts: (v: boolean) => void;
    publishAlerts: boolean;
    setPublishAlerts: (v: boolean) => void;
    channelWarnings: boolean;
    setChannelWarnings: (v: boolean) => void;
    teamActivity: boolean;
    setTeamActivity: (v: boolean) => void;
}

export const NotificationAlertsCard = ({
    notifAlerts,
    setNotifAlerts,
    publishAlerts,
    setPublishAlerts,
    channelWarnings,
    setChannelWarnings,
    teamActivity,
    setTeamActivity,
}: NotificationAlertsCardProps) => {
    const { colors } = useTheme();
    return (
        <Card>
            <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIconBox, { backgroundColor: colors.bgAccent }]}>
                    <Feather name="bell" size={20} color={colors.brandPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyBold" style={[styles.themeSectionTitle, { color: colors.textDark }]}>Notification Alerts</Text>
                    <Text variant="caption" color="dark" style={styles.themeSectionSubtitle}>
                        Configure how and when you receive workspace updates.
                    </Text>
                </View>
            </View>

            <ToggleRow
                title="Weekly Email Performance Digest"
                subtitle="Receive weekly summary reports on post reach and channel engagement."
                value={notifAlerts}
                onValueChange={setNotifAlerts}
            />
            <View style={[styles.toggleDivider, { backgroundColor: colors.borderLight }]} />

            <ToggleRow
                title="Post Publishing & Error Alerts"
                subtitle="Get notified immediately when scheduled posts succeed or fail to publish."
                value={publishAlerts}
                onValueChange={setPublishAlerts}
            />
            <View style={[styles.toggleDivider, { backgroundColor: colors.borderLight }]} />

            <ToggleRow
                title="Channel Connection Warnings"
                subtitle="Alerts when a social channel authorization token expires or requires reconnection."
                value={channelWarnings}
                onValueChange={setChannelWarnings}
            />
            <View style={[styles.toggleDivider, { backgroundColor: colors.borderLight }]} />

            <ToggleRow
                title="Team Activity"
                subtitle="Updates on team member actions"
                value={teamActivity}
                onValueChange={setTeamActivity}
            />
        </Card>
    );
};

interface DropdownSelectProps {
    label: string;
    value: string;
    options: string[];
    expanded: boolean;
    onToggle: () => void;
    onSelect: (option: string) => void;
}

export const DropdownSelect = ({ label, value, options, expanded, onToggle, onSelect }: DropdownSelectProps) => {
    const { colors } = useTheme();
    return (
        <View style={styles.dropdownContainer}>
            <Text variant="caption" weight="bold" style={[styles.dropdownLabel, { color: colors.textDark }]}>{label}</Text>
            <TouchableOpacity
                style={[styles.dropdownButton, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text variant="body" style={[styles.dropdownValue, { color: colors.textDark }]}>{value}</Text>
                <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
            </TouchableOpacity>
            {expanded && (
                <View style={[styles.dropdownList, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.dropdownOption,
                                { borderBottomColor: colors.borderLight },
                                option === value && [styles.dropdownOptionActive, { backgroundColor: colors.bgHighlight }],
                            ]}
                            onPress={() => onSelect(option)}
                        >
                            <Text
                                variant="body"
                                style={[
                                    styles.dropdownOptionText,
                                    { color: colors.textDark },
                                    option === value && { color: colors.textDark, fontFamily: Fonts.body.bold },
                                ]}
                            >
                                {option}
                            </Text>
                            {option === value && (
                                <Feather name="check" size={16} color={colors.brandPrimary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

interface DisplayPreferencesCardProps {
    landingView: string;
    setLandingView: (v: string) => void;
    timeFormat: string;
    setTimeFormat: (v: string) => void;
    expandedDropdown: string | null;
    toggleDropdown: (name: string) => void;
}

export const DisplayPreferencesCard = ({
    landingView,
    setLandingView,
    timeFormat,
    setTimeFormat,
    expandedDropdown,
    toggleDropdown,
}: DisplayPreferencesCardProps) => {
    const landingViewOptions = ['Content Calendar', 'Posts List', 'Ideas Board', 'Dashboard'];
    const timeFormatOptions = ['12-Hour Clock (1:30 PM)', '24-Hour Clock (13:30)'];

    return (
        <Card>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconBox}>
                    <Icon name="views" size={20} color={Colors.brandPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyBold" style={styles.themeSectionTitle}>
                        Display & Regional Preferences
                    </Text>
                    <Text variant="caption" color="dark" style={styles.themeSectionSubtitle}>
                        Customize default views and time formats.
                    </Text>
                </View>
            </View>

            <DropdownSelect
                label="DEFAULT WORKSPACE LANDING VIEW"
                value={landingView}
                options={landingViewOptions}
                expanded={expandedDropdown === 'landingView'}
                onToggle={() => toggleDropdown('landingView')}
                onSelect={(option) => {
                    setLandingView(option);
                    toggleDropdown('landingView');
                }}
            />

            <DropdownSelect
                label="TIME DISPLAY FORMAT"
                value={timeFormat}
                options={timeFormatOptions}
                expanded={expandedDropdown === 'timeFormat'}
                onToggle={() => toggleDropdown('timeFormat')}
                onSelect={(option) => {
                    setTimeFormat(option);
                    toggleDropdown('timeFormat');
                }}
            />
        </Card>
    );
};

export const SavePreferencesButton = () => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.brandNavy }]} activeOpacity={0.85}>
            <Text variant="bodyBold" style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
    );
};

interface PreferencesAndThemeTabProps {
    selectedTheme: ThemeOption;
    setSelectedTheme: (t: ThemeOption) => void;
    notifAlerts: boolean;
    setNotifAlerts: (v: boolean) => void;
    publishAlerts: boolean;
    setPublishAlerts: (v: boolean) => void;
    channelWarnings: boolean;
    setChannelWarnings: (v: boolean) => void;
    teamActivity: boolean;
    setTeamActivity: (v: boolean) => void;
    landingView: string;
    setLandingView: (v: string) => void;
    timeFormat: string;
    setTimeFormat: (v: string) => void;
    expandedDropdown: string | null;
    toggleDropdown: (name: string) => void;
}

export const PreferencesAndThemeTab = ({
    selectedTheme,
    setSelectedTheme,
    notifAlerts,
    setNotifAlerts,
    publishAlerts,
    setPublishAlerts,
    channelWarnings,
    setChannelWarnings,
    teamActivity,
    setTeamActivity,
    landingView,
    setLandingView,
    timeFormat,
    setTimeFormat,
    expandedDropdown,
    toggleDropdown,
}: PreferencesAndThemeTabProps) => (
    <View style={styles.cardsContainer}>
        <InterfaceThemeCard selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
        <NotificationAlertsCard
            notifAlerts={notifAlerts}
            setNotifAlerts={setNotifAlerts}
            publishAlerts={publishAlerts}
            setPublishAlerts={setPublishAlerts}
            channelWarnings={channelWarnings}
            setChannelWarnings={setChannelWarnings}
            teamActivity={teamActivity}
            setTeamActivity={setTeamActivity}
        />
        <DisplayPreferencesCard
            landingView={landingView}
            setLandingView={setLandingView}
            timeFormat={timeFormat}
            setTimeFormat={setTimeFormat}
            expandedDropdown={expandedDropdown}
            toggleDropdown={toggleDropdown}
        />
        <SavePreferencesButton />
    </View>
);

/* ==========================================================================
   5. Main Screen Component
   ========================================================================== */

export default function SettingsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ tab?: string }>();
    const { themePreference, setThemePreference, colors } = useTheme();

    const [activeTab, setActiveTab] = useState<SettingsTabType>(
        params.tab === 'Preferences & Theme' ? 'Preferences & Theme' : 'Profile & Security'
    );

    useEffect(() => {
        if (params.tab === 'Preferences & Theme' || params.tab === 'Profile & Security') {
            setActiveTab(params.tab as SettingsTabType);
        }
    }, [params.tab]);

    // Notification toggles
    const [notifAlerts, setNotifAlerts] = useState(true);
    const [publishAlerts, setPublishAlerts] = useState(true);
    const [channelWarnings, setChannelWarnings] = useState(false);
    const [teamActivity, setTeamActivity] = useState(false);

    // Display preferences
    const [landingView, setLandingView] = useState('Content Calendar');
    const [timeFormat, setTimeFormat] = useState('12-Hour Clock (1:30 PM)');
    const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setExpandedDropdown(expandedDropdown === name ? null : name);
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />
                <SettingsHeader onBack={() => router.back()} />
                <SettingsTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'Profile & Security' ? (
                    <ProfileAndSecurityTab />
                ) : (
                    <PreferencesAndThemeTab
                        selectedTheme={themePreference}
                        setSelectedTheme={setThemePreference}
                        notifAlerts={notifAlerts}
                        setNotifAlerts={setNotifAlerts}
                        publishAlerts={publishAlerts}
                        setPublishAlerts={setPublishAlerts}
                        channelWarnings={channelWarnings}
                        setChannelWarnings={setChannelWarnings}
                        teamActivity={teamActivity}
                        setTeamActivity={setTeamActivity}
                        landingView={landingView}
                        setLandingView={setLandingView}
                        timeFormat={timeFormat}
                        setTimeFormat={setTimeFormat}
                        expandedDropdown={expandedDropdown}
                        toggleDropdown={toggleDropdown}
                    />
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

/* ==========================================================================
   Styles
   ========================================================================== */

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
        paddingHorizontal: 8,
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

    /* User Summary */
    userSummaryHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
    },
    activeBadgeIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    userSummaryInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userSummaryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
        flexWrap: 'nowrap',
        overflow: 'hidden',
    },
    userName: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        flexShrink: 1,
    },
    userEmail: {
        fontSize: 13,
        marginBottom: 6,
    },
    memberSinceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    /* Info Cards */
    cardLabelRowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabelInnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabelText: {
        fontSize: 11.5,
        fontFamily: Fonts.alt.bold,
        marginLeft: 8,
        color: Colors.textDark,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    cardValue: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
    },

    /* Security */
    securityHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    securityIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    securityHeaderText: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 2,
    },
    securitySubtitle: {
        fontSize: 12,
        lineHeight: 16,
    },
    protectedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginBottom: 16,
    },
    securityDesc: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
    },
    manageSecurityButton: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Interface Theme */
    themeHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    themeSectionTitle: {
        fontSize: 15,
        fontFamily: Fonts.body.bold,
        color: '#111827',
        marginBottom: 2,
    },
    themeSectionSubtitle: {
        fontSize: 12,
        lineHeight: 17,
    },
    activeBadgePill: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    activeBadgeText: {
        fontSize: 10.5,
        fontFamily: Fonts.alt.medium,
        color: Colors.brandPrimary,
        letterSpacing: 0.5,
    },
    themeOptionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    themeCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 6,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        backgroundColor: Colors.white,
        gap: 12,
    },
    themeCardActive: {
        borderColor: '#2563EB',
        backgroundColor: '#DBEAFE',
    },
    themeCardLabel: {
        fontSize: 13.5,
        fontFamily: Fonts.body.bold,
        color: '#111827',
    },
    lightCapsule: {
        width: 48,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 3,
        gap: 3,
    },
    lightCapsuleDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#001E88',
    },
    lightCapsuleBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E2E8F0',
    },
    darkCapsule: {
        width: 48,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 3,
        gap: 3,
    },
    darkCapsuleDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#2563EB',
    },
    darkCapsuleBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#334155',
    },
    systemCapsule: {
        width: 48,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        overflow: 'hidden',
        flexDirection: 'row',
    },
    systemLeftHalf: {
        flex: 1,
        backgroundColor: '#E2E8F0',
    },
    systemRightHalf: {
        flex: 1,
        backgroundColor: '#000000',
    },

    /* Section Icon Header */
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    /* Toggle Rows */
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    toggleTextContainer: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 14,
        fontFamily: Fonts.body.bold,
        color: '#111827',
        marginBottom: 2,
    },
    toggleSubtitle: {
        fontSize: 12,
        lineHeight: 17,
    },
    toggleDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 14,
    },

    /* Custom Switch */
    customSwitchTrack: {
        width: 48,
        height: 26,
        borderRadius: 13,
        padding: 3,
        justifyContent: 'center',
    },
    customSwitchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },

    /* Dropdowns */
    dropdownContainer: {
        marginBottom: 16,
    },
    dropdownLabel: {
        fontSize: 11,
        fontFamily: Fonts.body.bold,
        color: '#111827',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    dropdownValue: {
        fontSize: 14,
        fontFamily: Fonts.body.medium,
        color: '#111827',
    },
    dropdownList: {
        marginTop: 6,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        overflow: 'hidden',
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    dropdownOptionActive: {
        backgroundColor: '#F0F4FF',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: Colors.textDark,
    },

    /* Save Button */
    saveButton: {
        backgroundColor: Colors.brandPrimary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: Fonts.body.bold,
    },
});
