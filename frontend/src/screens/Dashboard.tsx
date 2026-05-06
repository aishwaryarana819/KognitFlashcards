import React, {useState, useEffect} from 'react';
import { View, DeviceEventEmitter, StyleSheet, ScrollView, Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getTypography } from '../theme/typography';
import { BREAKPOINTS } from '../theme/breakpoints';
import { TodayAtGlance } from '../components/dashboard/TodayAtGlance';
import { DeckStates } from '../components/dashboard/DeckStates';
import {useFocusEffect} from "@react-navigation/native";
import {Scratchpad} from "../components/dashboard/Scratchpad";
import {Heatmap} from "../components/dashboard/Heatmap";

export const Dashboard = () => {
    const { activePalette } = useTheme();
    const { session } = useAuth();
    const { width } = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const isLargeDesktop = width >= BREAKPOINTS.DESKTOP_LARGE_MIN;
    const typography = getTypography(width);

    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardStats = React.useCallback(async () => {
        if (!session?.access_token) return;
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/dashboard/stats/`, {
                headers: {'Authorization': `Bearer ${session.access_token}`}
            });
            if (res.ok) {
                setStats(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useFocusEffect(
        React.useCallback(() => {
            fetchDashboardStats();
        }, [fetchDashboardStats])
    );

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('library_updated', fetchDashboardStats);
        const sub2 = DeviceEventEmitter.addListener('review_completed', fetchDashboardStats);
        return () => { sub.remove(); sub2.remove(); };
    }, [fetchDashboardStats]);



    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: 'transparent', justifyContent: 'center',paddingBottom: 100 }]}>
                <ActivityIndicator size="large" color={activePalette.darkest} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor: 'transparent'}]}
                    contentContainerStyle={{padding: 7}}
                    showsVerticalScrollIndicator={false}>

            {isLargeDesktop ? (
                <>
                    <View style={[styles.grid, {alignItems: 'stretch'}]}>
                        <View style={[styles.column, {width: 400}]}>
                            <TodayAtGlance data={stats?.today} deckStates={stats?.states}/>
                        </View>
                        <View style={[styles.column, {flex: 1}]}>
                            <DeckStates states={stats?.states}/>
                        </View>
                    </View>

                    <View style={styles.spacer}/>

                    <View style={[styles.grid, {alignItems: 'stretch'}]}>
                        <View style={[styles.column, {width: 400}]}>
                            <Heatmap data={stats?.heatmap} streak={stats?.streak}/>
                        </View>
                        <View style={[styles.column, {flex: 1}]}>
                            <Scratchpad fillHeight/>
                        </View>
                    </View>
                </>
            ) : (
                <View style={[styles.grid, styles.gridMobile, { alignItems: 'flex-start' }]}>
                    <View style={[styles.column, { flex: 1 }]}>
                        <TodayAtGlance data={stats?.today} deckStates={stats?.states} />
                        <View style={styles.spacer} />
                        <DeckStates states={stats?.states} />
                        <View style={styles.spacer} />
                        <Heatmap data={stats?.heatmap} streak={stats?.streak} />
                        <View style={styles.spacer} />
                        <Scratchpad />
                    </View>
                </View>
            )}

            <View style={{height: isMobile ? 150 : 100}}/>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'stretch'
    },
    gridMobile: {
        flexDirection: 'column',
    },
    column: {
        flexDirection: 'column',
        width: '100%',
    },
    spacer: {
        height: 24,
    },
    placeholderCard: {
        borderRadius: 24,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 160,
    }
});
