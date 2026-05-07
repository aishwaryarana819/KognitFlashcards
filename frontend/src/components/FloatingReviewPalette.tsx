import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    DeviceEventEmitter,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from "../theme/typography";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {BREAKPOINTS} from "../theme/breakpoints";
import {getReviewBox1Shadow, getReviewBox2Shadow, getCreateBoxShadow} from "../theme/shadows";
import {useNavigation} from "@react-navigation/native";
import {ROUTES} from "../navigation/routes";
import {useAuth} from "../context/AuthContext";
import {useFocusEffect} from "@react-navigation/native";
import {lightPalette} from "../theme/colors";

export const FloatingReviewPalette = () => {
    const {width} = useWindowDimensions();
    const navigation = useNavigation();
    const {activePalette} = useTheme();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    const [isChevronUp, setIsChevronUp] = useState(false);

    const {session} = useAuth();
    const [dueCount, setDueCount] = useState<number | null>(null);

    const fetchDueCount = useCallback(async () => {
        if (!session?.access_token) return;
        try {
            const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/review/stats/today/?t=${Date.now()}`,
                { headers: { 'Authorization': `Bearer ${session.access_token}` } }
            );
            if (res.ok) {
                const data = await res.json();
                setDueCount(data.cards_due ?? 0);
            }
        } catch (e) {
            console.error('Failed to fetch due count', e);
        }
    }, [session]);

    useFocusEffect(
        useCallback(() => {
            fetchDueCount();
        }, [fetchDueCount])
    );

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('review_completed', fetchDueCount);
        const sub2 = DeviceEventEmitter.addListener('library_updated', fetchDueCount);
        return () => { sub.remove(); sub2.remove(); };
    }, [fetchDueCount]);

    const reviewBox1Shadow = getReviewBox1Shadow();
    const reviewBox2Shadow = getReviewBox2Shadow(activePalette);
    const createBoxShadow = getCreateBoxShadow(activePalette);

    return (
        <View style={[styles.floatingContainer,
            {
                bottom: isMobile ? 90 : 40,
                marginVertical: 10,
                left: isMobile ? 0 : (width <= BREAKPOINTS.DESKTOP_SMALL_MAX ? 102 : 211.5)
            }]}
            pointerEvents="box-none"
        >
            <View style={[styles.paletteWraper, {gap: isMobile ? 6 : 20}]}>
                <View style={styles.reviewSectionWrapper}>
                    <View style={[styles.reviewBox1, {
                        backgroundColor: activePalette.lightest+'80',
                        borderColor: activePalette.regular,
                        borderLeftWidth: 0.3,
                        borderTopWidth: 0.2,
                        borderBottomWidth: 0.2,
                        borderRightWidth: 0,
                        paddingHorizontal: isMobile ? 10 : 20,
                        paddingVertical: isMobile ? 7.75 : 12,
                    },
                        Platform.OS === 'web' && { backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'} as any,
                        createBoxShadow
                    ]}>
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: typography.fontSizes.bodyL,
                            fontWeight: typography.fontWeights.semibold,
                            color: activePalette.darkest,
                        }}>
                            Review
                        </Text>

                        <View style={[styles.pendingBadge, {backgroundColor: activePalette.darkest}]}>
                            {/* @ts-ignore */}
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.bodyL,
                                fontWeight: typography.fontWeights.bold,
                                color: activePalette.bg,
                            }}>
                                {dueCount ?? '0'}
                            </Text>

                            <View style={[styles.statusDot,
                                {
                                    backgroundColor: (dueCount ?? 0) > 0 ? activePalette.red : lightPalette.bg2,
                                    borderColor: activePalette.darkest,
                                    borderWidth: 1,
                                    width: 12, height: 12, borderRadius: 8,
                                }
                            ]}/>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.reviewBox2,
                            {
                                backgroundColor: activePalette.darker,
                                paddingHorizontal: isMobile ? 10 : 20,
                                paddingVertical: isMobile ? 12 : 16,
                            },
                            reviewBox2Shadow
                        ]}
                        onPress={() => navigation.navigate(ROUTES.REVIEW_SESSION as never)}
                    >
                        {/* @ts-ignore */}
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: typography.fontSizes.heading,
                            fontWeight: typography.fontWeights.extrabold,
                            color: activePalette.bg,
                        }}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsChevronUp(!isChevronUp)}
                    style={[
                        styles.createSection,
                        {
                            backgroundColor: activePalette.lightest+'80',
                            borderColor: activePalette.regular,
                            borderLeftWidth: 0.3,
                            borderTopWidth: 0.2,
                            borderBottomWidth: 0.2,
                            borderRightWidth: 0,
                            paddingHorizontal: isMobile ? 10 : 20,
                            paddingVertical: isMobile ? 9 : 12,
                        },
                        Platform.OS === 'web' && { backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'} as any,
                        createBoxShadow
                    ]}>
                    <Ionicons
                        name="add"
                        size={isMobile ? 24 : 28}
                        color={activePalette.darkest}
                    />
                    {/* @ts-ignore */}
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.button,
                        fontWeight: typography.fontWeights.bold,
                        color: activePalette.darkest,
                        marginLeft: 4,
                        marginRight: 12,
                    }}>
                        {isMobile ? "" : "New" }
                    </Text>

                        <View style={{
                            width: 0.6,
                            height: isMobile ? 16 : 20,
                            backgroundColor: activePalette.darker + '80',
                            marginRight: 12,
                        }}/>


                    <Ionicons
                        name={isChevronUp ? "chevron-up" : "chevron-down"}
                        size={isMobile ? 18 : 20}
                        color={activePalette.darkest}
                    />
                </TouchableOpacity>

                {isChevronUp && (
                    <View style={[
                        styles.createMenu,
                        {
                            backgroundColor: activePalette.fg + '95',
                            borderColor: activePalette.lighter,
                        },
                        Platform.OS === 'web' && {backdropFilter: 'blur(12px)',
                        WebKitBackdropFilter: 'blur(20px)'} as any
                    ]}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setIsChevronUp(false); DeviceEventEmitter.emit('open_add_card'); }}>
                            <Text style={[styles.menuText, {color: activePalette.darker, fontFamily: typography.fontFamilies.main}]}>
                                Card
                            </Text>
                            <Ionicons
                                name="documents-outline"
                                size={24}
                                color={activePalette.darker}
                                style={styles.iconShadow}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => { setIsChevronUp(false); DeviceEventEmitter.emit('open_add_deck'); }}>
                            <Text style={[styles.menuText, {color: activePalette.darker, fontFamily: typography.fontFamilies.main}]}>
                                Deck
                            </Text>
                            <Ionicons
                                name="albums-outline"
                                size={24}
                                color={activePalette.darker}
                                style={styles.iconShadow}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => { setIsChevronUp(false); DeviceEventEmitter.emit('open_add_shelf'); }}>
                            <Text style={[styles.menuText, {color: activePalette.darker, fontFamily: typography.fontFamilies.main}]}>
                                Shelf
                            </Text>
                            <Ionicons
                                name="library-outline"
                                size={24}
                                color={activePalette.darker}
                                style={styles.iconShadow}
                            />
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        zIndex: 100,
        paddingHorizontal: 20
    },
    createMenu: {
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: 12,
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        gap: 4,
        minWidth: 150,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    menuText: {
        fontWeight: '800',
        fontSize: 16,
        marginRight: 16,
    },
    iconShadow: {
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2,
        opacity: 0.6
    },
    paletteWraper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        maxWidth: '100%',
    },
    reviewSectionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewBox1: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        gap: 8,
    },
    pendingBadge: {
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        top: -2.5,
        right: -2.5,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1.5,
    },
    reviewBox2: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    createSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
    }
});