import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { ROUTES } from '../navigation/routes';
import { supabase } from '../lib/supabase';
import {BREAKPOINTS} from "../theme/breakpoints";
import {getTypography} from "../theme/typography";
import {Urbanist_600SemiBold} from "@expo-google-fonts/urbanist";
import {Manrope_400Regular} from "@expo-google-fonts/manrope";

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.REVIEW_SESSION>;

export const ReviewSession = ({ navigation, route }: Props) => {
    const { activePalette, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const typography = getTypography(width);

    const [queue, setQueue] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchQueue();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

            if (isLoading || queue.length === 0 || currentIndex >= queue.length) return;

            if (!isFlipped && event.code === 'Space') {
                event.preventDefault();
                handleFlip();
            } else if (isFlipped) {
                switch (event.key) {
                    case '1': handleGrade(1); break;
                    case '2': handleGrade(2); break;
                    case '3': handleGrade(3); break;
                    case '4': handleGrade(4); break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, currentIndex, queue, isLoading]);

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            const { data: session } = await supabase.auth.getSession();
            const params = route.params as { deckId?: number } | undefined;
            const deckIdParam = params?.deckId ? `?deck_id=${params.deckId}` : '';

            const response = await fetch(`http://127.0.0.1:8000/api/review/queue/${deckIdParam}`, {
                headers: { 'Authorization': `Bearer ${session.session?.access_token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setQueue(data.cards || []);
            }
        } catch (error) {
            console.error("Failed to fetch queue:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFlip = () => {
        if (isFlipped) return;

        Animated.spring(flipAnim, {
            toValue: 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start(() => {
            setIsFlipped(true);
        });
    };

    const handleGrade = async (rating: number) => {
        const card = queue[currentIndex];

        setIsFlipped(false);
        flipAnim.setValue(0);
        setCurrentIndex(prev => prev + 1);

        try {
            const { data: session } = await supabase.auth.getSession();
            await fetch(`http://127.0.0.1:8000/api/review/submit/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.session?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ card_id: card.id, rating })
            }).then(response => {
                if (!response.ok) {
                    console.error("Submission failed, consider adding retry logic.");
                }
            });
        } catch (error) {
            console.error("Network error submitting rating:", error);
        }
    };

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg']
    });

    const currentCard = queue[currentIndex];

    if (!isLoading && queue.length > 0 && currentIndex >= queue.length) {
        return (
            <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
                <Ionicons name="checkmark-circle" size={80} color={activePalette.darker} />
                <Text style={[{fontFamily: typography.fontFamilies.main,
                    fontWeight: typography.fontWeights.semibold,
                    fontSize: typography.fontSizes.heading,
                    color: activePalette.darkest, marginTop: 20
                }]}>
                    Session Complete!
                </Text>
                <Text style={[{
                    color: activePalette.fg2,
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyL,
                    marginTop: 20
                }]}>
                    You reviewed {queue.length} cards today.
                </Text>
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: activePalette.darker }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.doneButtonText, {color: activePalette.lightest, fontFamily: typography.fontFamilies.main}]}>Return to Library</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
            <View style={[
                styles.topBar,
                queue.length > 0 && { borderBottomWidth: 0, borderBottomColor: activePalette.lighter }
            ]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color={activePalette.darker} />
                </TouchableOpacity>

                {(queue.length > 0 || isLoading) && (
                    <View style={styles.progressContainer}>
                        <Text style={[styles.progressText, { fontFamily: typography.fontFamilies.main, color: activePalette.darker }]}>
                            {isLoading ? 'Loading...' : `${currentIndex + 1} / ${queue.length}`}
                        </Text>
                        <View style={[styles.progressBarBg, { backgroundColor: activePalette.lighter,
                        borderWidth: 1, borderColor: activePalette.lightest }]}>
                            <View style={[styles.progressBarFill, {
                                backgroundColor: activePalette.regular,
                                width: queue.length > 0 ? `${(currentIndex / queue.length) * 100}%` : '0%'
                            }]} />
                        </View>
                    </View>
                )}
            </View>


            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={activePalette.regular} />
                ) : queue.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cafe-outline" size={64} color={activePalette.fg2} />
                        <Text style={[{fontFamily: typography.fontFamilies.main,
                            fontWeight: typography.fontWeights.semibold,
                            fontSize: typography.fontSizes.heading,
                            color: activePalette.darkest, marginTop: 20
                        }]}>
                            Session Complete!
                        </Text>
                        <Text style={[{
                            color: activePalette.fg2,
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.bodyL,
                            marginTop: 20
                        }]}>
                            You reviewed {queue.length} cards today.
                        </Text>
                        <TouchableOpacity
                            style={[styles.doneButton, { backgroundColor: activePalette.darkest, marginTop: 30 }]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={[styles.doneButtonText, {fontFamily: typography.fontFamilies.secondary, color: activePalette.lightest}]}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cardWrapper}>
                        <Animated.View style={[
                            styles.card,
                            { backgroundColor: isDark ? activePalette.bg2 : '#ffffff', transform: [{ rotateY: frontInterpolate }] }
                        ]}>
                            <Text style={[
                                styles.cardText,
                                {
                                    color: activePalette.darkest,
                                    fontFamily: typography.fontFamilies.main,
                                    fontWeight: typography.fontWeights.semibold,
                                    fontSize: typography.fontSizes.heading
                                }
                            ]}>{currentCard.front}</Text>

                        </Animated.View>

                        <Animated.View style={[
                            styles.card,
                            styles.cardBack,
                            { backgroundColor: isDark ? activePalette.bg2 : '#ffffff', transform: [{ rotateY: backInterpolate }] }
                        ]}>
                            <Text style={[
                                styles.cardText,
                                {
                                    color: activePalette.darker,
                                    marginBottom: 20,
                                    fontFamily: typography.fontFamilies.main,
                                    fontWeight: typography.fontWeights.medium,
                                    fontSize: typography.fontSizes.bodyL
                                }
                            ]}>
                                {currentCard.front}
                            </Text>

                            <View style={[styles.divider, { borderWidth: 0.5, backgroundColor: activePalette.lighter }]} />

                            <Text style={[
                                styles.cardText,
                                {
                                    color: activePalette.darkest,
                                    fontFamily: typography.fontFamilies.secondary,
                                    fontWeight: typography.fontWeights.regular,
                                    fontSize: typography.fontSizes.bodyL
                                }
                            ]}>{currentCard.back}</Text>
                        </Animated.View>
                    </View>
                )}
            </View>

            {!isLoading && queue.length > 0 && currentIndex < queue.length && (
                <View style={[styles.controlsArea, { paddingBottom: isMobile ? 40 : 40 }]}>
                    {!isFlipped ? (
                        <TouchableOpacity
                            style={[styles.flipButton, { backgroundColor: activePalette.darkest }]}
                            onPress={handleFlip}
                        >
                            <Text style={[
                                styles.flipButtonText,
                                {
                                    fontFamily: typography.fontFamilies.main,
                                    fontWeight: typography.fontWeights.semibold,
                                    color: activePalette.lightest
                                }
                            ]}>Show Answer</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.gradingRow}>
                            <GradeButton label="Again" interval={currentCard.preview_intervals?.['1']} color="#FF4B4B" onPress={() => handleGrade(1)} />
                            <GradeButton label="Hard" interval={currentCard.preview_intervals?.['2']} color="#FF8A00" onPress={() => handleGrade(2)} />
                            <GradeButton label="Good" interval={currentCard.preview_intervals?.['3']} color="#00C48C" onPress={() => handleGrade(3)} />
                            <GradeButton label="Easy" interval={currentCard.preview_intervals?.['4']} color="#00A3FF" onPress={() => handleGrade(4)} />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const GradeButton = ({ label, interval, color, onPress }: { label: string, interval?: string, color: string, onPress: () => void }) => {
    const { isDark } = useTheme();
    return (
        <TouchableOpacity
            style={[styles.gradeBtn, { backgroundColor: isDark ? color + '20' : color + '15', borderColor: color }]}
            onPress={onPress}
        >
            {/* @ts-ignore */}
            <Text style={[styles.gradeLabel, {color, fontFamily: Manrope_400Regular }]}>{label}</Text>
            {/* @ts-ignore */}
            <Text style={[styles.gradeInterval, { color, fontFamily: Urbanist_600SemiBold }]}>{interval || '-'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topBar: { position: 'absolute', top: 0, width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 30, borderBottomWidth: 1, zIndex: 10 },
    closeBtn: { padding: 10 },
    progressContainer: { flex: 1, alignItems: 'center', marginRight: 40 },
    progressText: { fontFamily: 'Manrope-Medium', fontSize: 14, marginBottom: 8 },
    progressBarBg: { width: 200, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    content: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 },
    emptyState: { alignItems: 'center' },
    title: { fontFamily: 'Urbanist-Bold', fontSize: 28, textAlign: 'center' },
    subtitle: { fontFamily: 'Manrope-Medium', fontSize: 16, marginTop: 10, textAlign: 'center' },
    doneButton: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12, marginTop: 30 },
    doneButtonText: { color: 'white', fontFamily: 'Urbanist-Bold', fontSize: 18 },
    cardWrapper: { width: '100%', maxWidth: 600, height: 400, alignItems: 'center', justifyContent: 'center' },
    card: { position: 'absolute', width: '100%', height: '100%', borderRadius: 20, padding: 40, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
    cardBack: { top: 0 },
    cardText: { fontFamily: 'Manrope-Medium', fontSize: 24, textAlign: 'center', lineHeight: 34 },
    divider: { width: '50%', height: 1, marginVertical: 20 },
    controlsArea: { position: 'absolute', bottom: 0, width: '100%', maxWidth: 600, paddingHorizontal: 20 },
    flipButton: { width: '100%', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    flipButtonText: { color: 'white', fontFamily: 'Urbanist-Bold', fontSize: 20 },
    gradingRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    gradeBtn: { flex: 1, height: 80, borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    gradeLabel: { fontFamily: 'Urbanist-Bold', fontSize: 16, marginBottom: 5 },
    gradeInterval: { fontFamily: 'Manrope-Medium', fontSize: 14 }
});
