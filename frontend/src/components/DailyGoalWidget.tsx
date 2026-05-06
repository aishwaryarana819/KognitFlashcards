import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export const DailyGoalWidget = () => {
    const { activePalette } = useTheme();
    const [reviewed, setReviewed] = useState(0);
    const [goal, setGoal] = useState(20);
    const [due, setDue] = useState(0);

    const progressAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data: session } = await supabase.auth.getSession();
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/review/stats/today/`, {
                headers: { 'Authorization': `Bearer ${session.session?.access_token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setReviewed(data.cards_reviewed_today || 0);
                setGoal(data.daily_goal || 20);
                setDue(data.cards_due || 0);

                Animated.timing(progressAnim, {
                    toValue: Math.min((data.cards_reviewed_today / data.daily_goal), 1),
                    duration: 1000,
                    useNativeDriver: false,
                }).start();
            }
        } catch (error) {
            console.error("Failed to fetch daily stats", error);
        }
    };

    const widthInterpolation = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    const isComplete = reviewed >= goal;

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg2 }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name={isComplete ? "flame" : "flame-outline"} size={24} color={isComplete ? '#FF8A00' : activePalette.fg2} />
                    <Text style={[styles.title, { color: activePalette.darkest }]}>Daily Goal</Text>
                </View>
                <Text style={[styles.countText, { color: activePalette.fg2 }]}>
                    <Text style={{ color: activePalette.darkest }}>{reviewed}</Text> / {goal}
                </Text>
            </View>

            <View style={[styles.track, { backgroundColor: activePalette.lighter }]}>
                <Animated.View style={[
                    styles.fill,
                    {
                        backgroundColor: isComplete ? '#00C48C' : activePalette.regular,
                        width: widthInterpolation
                    }
                ]} />
            </View>

            <Text style={[styles.footer, { color: activePalette.fg2 }]}>
                {due > 0 ? `${due} cards currently due for review.` : "You're all caught up for now!"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontFamily: 'Urbanist-Bold',
        fontSize: 18,
    },
    countText: {
        fontFamily: 'Manrope-Medium',
        fontSize: 16,
    },
    track: {
        height: 12,
        borderRadius: 6,
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 6,
    },
    footer: {
        fontFamily: 'Manrope-Medium',
        fontSize: 14,
        marginTop: 15,
    }
});
