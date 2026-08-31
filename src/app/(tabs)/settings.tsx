import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Badge, Button } from '../components/UI';
import { Colors, Fonts } from '../../constant';
import { Feather } from '@expo/vector-icons';
import { Icon } from '../components/IconResolver';
import DashboardHeader from '../components/DashboardHeader';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Profile & Security');

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />
                
                {/* Back Button & Title */}
                <View style={styles.headerSection}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={20} color={Colors.brandPrimary} />
                    </TouchableOpacity>
                    <Text variant="heading" color="primary" style={styles.pageTitle}>Settings</Text>
                    <Text variant="body" color="dark" style={styles.pageSubtitle}>
                        Manage your personal profile, account security, and workspace preferences.
                    </Text>
                </View>

                {/* View Toggles */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tabGroup}>
                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'Profile & Security' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Profile & Security')}
                        >
                            <Icon name="human" size={14} color={activeTab === 'Profile & Security' ? Colors.white : Colors.brandPrimary} />
                            <Text variant="bodyBold" style={{ marginLeft: 6, fontSize: 13, color: activeTab === 'Profile & Security' ? Colors.white : Colors.brandPrimary }}>Profile & Security</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'Preferences & Theme' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Preferences & Theme')}
                        >
                            <Icon name="preference" size={14} color={activeTab === 'Preferences & Theme' ? Colors.white : Colors.brandPrimary} />
                            <Text variant="bodyBold" style={{ marginLeft: 6, fontSize: 13, color: activeTab === 'Preferences & Theme' ? Colors.white : Colors.brandPrimary }}>Preferences & Theme</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'Profile & Security' && (
                    <View style={styles.cardsContainer}>
                        {/* User Summary Card */}
                        <Card>
                            <View style={styles.userSummaryHeader}>
                                <View style={styles.avatarContainer}>
                                    <Image 
                                        source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }} 
                                        style={styles.avatar} 
                                    />
                                    <View style={styles.activeBadgeIcon}>
                                        <Feather name="check" size={12} color={Colors.white} />
                                    </View>
                                </View>
                                <View style={styles.userSummaryInfo}>
                                    <View style={styles.userSummaryTitleRow}>
                                        <Text variant="body" color="primary" style={styles.userName} numberOfLines={1}>Adetiba Adedotun</Text>
                                        <Badge variant="success" label="ACTIVE" style={{ borderWidth: 1, borderColor: '#A7F3D0', flexShrink: 0 }} />
                                    </View>
                                    <Text variant="caption" color="dark" style={styles.userEmail}>adetibaadedotun4@gmail.com</Text>
                                    <View style={styles.memberSinceRow}>
                                        <Feather name="calendar" size={12} color={Colors.textDark} />
                                        <Text variant="caption" color="dark" style={{ marginLeft: 6 }}>Member since July 19, 2026</Text>
                                    </View>
                                </View>
                            </View>
                            <Button variant="primary" icon="edit-2" iconPosition="left" title="Edit Profile" />
                        </Card>

                        {/* Full Name Card */}
                        <Card>
                            <View style={styles.cardLabelRow}>
                                <Icon name="human" size={14} color={Colors.textDark} />
                                <Text variant="caption" weight="bold" style={styles.cardLabelText}>FULL NAME</Text>
                            </View>
                            <Text variant="body" color="primary" style={styles.cardValue}>Adetiba Adedotun</Text>
                        </Card>

                        {/* Email Card */}
                        <Card>
                            <View style={styles.cardLabelRowBetween}>
                                <View style={styles.cardLabelInnerRow}>
                                    <Feather name="mail" size={14} color={Colors.textDark} />
                                    <Text variant="caption" weight="bold" style={styles.cardLabelText}>EMAIL ADDRESS</Text>
                                </View>
                                <Feather name="copy" size={16} color={Colors.textDark} />
                            </View>
                            <Text variant="body" color="primary" style={styles.cardValue}>adetibaadedotun4@gmail.com</Text>
                        </Card>

                        {/* Security Card */}
                        <Card>
                            <View style={styles.securityHeaderRow}>
                                <View style={styles.securityIconBox}>
                                    <Feather name="shield" size={20} color={Colors.brandPrimary} />
                                </View>
                                <View style={styles.securityHeaderText}>
                                    <Text variant="heading" style={styles.securityTitle}>Security & Authentication</Text>
                                    <Text variant="body" color="dark" style={styles.securitySubtitle}>
                                        Managed securely via Clerk Authentication
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.protectedPill}>
                                <Icon name="lock" size={12} color={Colors.textDark} />
                                <Text variant="caption" weight="bold" color="dark" style={{ marginLeft: 6 }}>Protected</Text>
                            </View>
                            <View style={styles.divider} />
                            <Text variant="body" color="dark" style={styles.securityDesc}>
                                Need to change your password, update security factors, or connected logins?
                            </Text>
                            <TouchableOpacity style={styles.manageSecurityButton}>
                                <Icon name="key" size={14} color={Colors.brandPrimary} />
                                <Text variant="bodyBold" style={{ color: Colors.brandPrimary, marginHorizontal: 8 }}>Manage Security</Text>
                                <Feather name="external-link" size={14} color={Colors.brandPrimary} />
                            </TouchableOpacity>
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
        marginTop: -12, // Pulls closer to DashboardHeader
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8, // Reduced space below arrow button
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
});
