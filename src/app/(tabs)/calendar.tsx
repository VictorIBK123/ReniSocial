import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import DashboardHeader from '../components/DashboardHeader';
import Icon from '../components/IconResolver';
import { Text, View, Card, Badge } from '../components/UI';
import { useComposerStore } from '../../store/composerStore';

const DAYS = [
    { day: 'MO', date: '17' },
    { day: 'TU', date: '18' },
    { day: 'WE', date: '19', active: true },
    { day: 'TH', date: '20' },
    { day: 'FR', date: '21', hasPost: true },
    { day: 'SA', date: '22' },
    { day: 'SU', date: '23' },
];

export default function CalendarScreen() {
    const [activeView, setActiveView] = useState<'Day' | 'Week' | 'Month'>('Day');
    const { openComposer } = useComposerStore();

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DashboardHeader />

                {/* Search Bar Area */}
                <View style={styles.searchSection}>
                    <View style={styles.searchInputContainer}>
                        <Feather name="search" size={18} color={Colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search scheduled posts..."
                            placeholderTextColor={Colors.textMuted}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="filter" size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Date Navigator */}
                <View style={styles.dateNavSection}>
                    <Text variant="heading" style={styles.currentMonth}>August 2026</Text>
                    <View style={styles.dateNavControls}>
                        <TouchableOpacity style={styles.navArrow}>
                            <Feather name="chevron-left" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.todayButton}>
                            <Text variant="caption" style={styles.todayText}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navArrow}>
                            <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.postButton}
                        activeOpacity={0.8}
                        onPress={() => openComposer('Composer')}
                    >
                        <Feather name="plus" size={16} color={Colors.white} />
                        <Text variant="bodyBold" color="white" style={{ marginLeft: 4 }}>Post</Text>
                    </TouchableOpacity>
                </View>

                {/* View Toggle */}
                <View style={styles.toggleContainer}>
                    {['Day', 'Week', 'Month'].map((view) => (
                        <TouchableOpacity
                            key={view}
                            style={[styles.toggleButton, activeView === view && styles.toggleButtonActive]}
                            onPress={() => setActiveView(view as any)}
                        >
                            <Text
                                variant="bodyBold"
                                color={activeView === view ? 'white' : 'muted'}
                            >
                                {view}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Horizontal Calendar Strip */}
                <View style={styles.calendarStrip}>
                    {DAYS.map((d, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dayContainer, d.active && styles.dayContainerActive]}
                        >
                            <Text variant="caption" color={d.active ? 'white' : 'muted'} style={styles.dayLabel}>{d.day}</Text>
                            <Text variant="bodyBold" color={d.active ? 'white' : 'dark'} style={styles.dateLabel}>{d.date}</Text>
                            {d.hasPost && <View style={styles.postDot} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Timeline View */}
                <View style={styles.timelineSection}>

                    {/* Section: Wed, Aug 19 */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionDateBadge}>
                            <Text variant="bodyBold" color="primary">Wed, Aug 19</Text>
                        </View>
                        <View style={styles.sectionLine} />
                    </View>

                    {/* Post 1 */}
                    <Card style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <View style={styles.timeColumn}>
                                <Text variant="bodyBold" color="dark">09:00</Text>
                                <Text variant="caption" color="muted">AM</Text>
                            </View>
                            <View style={styles.postContent}>
                                <View style={styles.postCardHeader}>
                                    <View style={styles.platformIcons}>
                                        <View style={styles.platformIconBgBlack}>
                                            <Icon name="x-icon" size={16} color="#FFF" />
                                        </View>
                                        <View style={styles.platformIconBgBlue}>
                                            <Icon name="linkedin" size={16} color="#FFF" />
                                        </View>
                                    </View>
                                    <Badge variant="info" label="Scheduled" />
                                </View>
                                <Text variant="body" color="dark" style={styles.postText}>
                                    Excited to announce our new feature rollout for Q3! We've been working hard
                                </Text>
                                <View style={styles.imagePlaceholder}>
                                    <Feather name="image" size={16} color={Colors.textMuted} />
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Post 2 */}
                    <Card style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <View style={styles.timeColumn}>
                                <Text variant="bodyBold" color="dark">02:30</Text>
                                <Text variant="caption" color="muted">PM</Text>
                            </View>
                            <View style={styles.postContent}>
                                <View style={styles.postCardHeader}>
                                    <View style={styles.platformIcons}>
                                        <View style={styles.platformIconBgPink}>
                                            <Icon name="instagram-gradient" size={16} color="#FFF" />
                                        </View>
                                    </View>
                                    <Badge variant="warning" label="Draft" />
                                </View>
                                <Text variant="body" color="muted" style={[styles.postText, { fontStyle: 'italic' }]}>
                                    Behind the scenes at the office today... (need to finalize photo selection)
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Section: Fri, Aug 21 */}
                    <View style={styles.sectionHeader}>
                        <Text variant="bodyBold" color="muted">Fri, Aug 21</Text>
                        <View style={styles.sectionLine} />
                    </View>

                    {/* Post 3 */}
                    <Card style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <View style={styles.timeColumn}>
                                <Text variant="bodyBold" color="dark">10:00</Text>
                                <Text variant="caption" color="muted">AM</Text>
                            </View>
                            <View style={styles.postContent}>
                                <View style={styles.postCardHeader}>
                                    <View style={styles.platformIcons}>
                                        <View style={styles.platformIconBgBlue}>
                                            <Icon name="linkedin" size={16} color="#FFF" />
                                        </View>
                                    </View>
                                    <Badge variant="info" label="Scheduled" />
                                </View>
                                <Text variant="body" color="dark" style={styles.postText}>
                                    5 tips for optimizing your workflow this Friday. 🚀 Read our latest blog post
                                </Text>
                            </View>
                        </View>
                    </Card>

                </View>

                {/* Bottom spacer */}
                <View style={{ height: 100 }} />
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
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
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
    dateNavSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    currentMonth: {
        fontSize: 20,
    },
    dateNavControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    navArrow: {
        width: 22,
        height: 22,
        borderRadius: 16,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 16,
    },
    todayText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.textDark,
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.brandPrimary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 4,
        marginBottom: 24,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 7,
        alignItems: 'center',
        borderRadius: 14,
    },
    toggleButtonActive: {
        backgroundColor: Colors.brandPrimary,
    },
    calendarStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    dayContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 16,
        minWidth: 46,
    },
    dayContainerActive: {
        backgroundColor: Colors.brandPrimary,
    },
    dayLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    dateLabel: {
        fontSize: 16,
    },
    postDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.brandPrimary,
        marginTop: 4,
    },
    timelineSection: {
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    sectionDateBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.borderLight,
    },
    timeColumn: {
        width: 48,
        alignItems: 'flex-end',
        paddingTop: 4,
    },
    postContent: {
        flex: 1,
    },
    postCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    platformIcons: {
        flexDirection: 'row',
        gap: -8, // overlap effect
    },
    platformIconBgBlack: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    platformIconBgBlue: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0A66C2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    platformIconBgPink: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E1306C',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    postText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
