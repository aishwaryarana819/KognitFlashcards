import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from "../theme/typography";
import {Ionicons} from "@expo/vector-icons";
import {BREAKPOINTS} from "../theme/breakpoints";
import {getReviewBox1Shadow, getReviewBox2Shadow, getCreateBoxShadow} from "../theme/shadows";

export const FloatingReviewPalette = () => {
    const {width} = useWindowDimensions();
    const {activePalette} = useTheme();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    const [isChevronUp, setIsChevronUp] = useState(false);

    const reviewBox1Shadow = getReviewBox1Shadow();
    const reviewBox2Shadow = getReviewBox2Shadow(activePalette);
    const createBoxShadow = getCreateBoxShadow(activePalette);

    return (
        <View style={[styles.floatingContainer, {bottom: isMobile ? 90 : 40, marginVertical: 10}]}>
            <View style={[styles.paletteWraper, {gap: isMobile ? 6 : 20}]}>
                <View style={styles.reviewSectionWrapper}>
                    <View style={[styles.reviewBox1, {
                        backgroundColor: activePalette.fg,
                        borderColor: activePalette.darkest,
                        borderLeftWidth: 0.3,
                        borderTopWidth: 0.2,
                        borderBottomWidth: 0.2,
                        borderRightWidth: 0,
                        paddingHorizontal: isMobile ? 10 : 20,
                        paddingVertical: isMobile ? 7.75 : 12,
                    },
                    reviewBox1Shadow
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
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.bodyL,
                                fontWeight: typography.fontWeights.bold,
                                color: activePalette.bg,
                            }}>
                                32
                            </Text>

                            <View style={[styles.statusDot,
                                {
                                    backgroundColor: activePalette.red,
                                    borderColor: activePalette.darkest,
                                    borderWidth: 1,
                                    width: 12, height: 12, borderRadius: 8,
                                }
                            ]}/>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.8} style={[styles.reviewBox2,
                        {
                            backgroundColor: activePalette.darker,
                            paddingHorizontal: isMobile ? 10 : 20,
                            paddingVertical: isMobile ? 12 : 16,
                        },
                        reviewBox2Shadow
                    ]}>
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
                            backgroundColor: activePalette.fg,
                            borderColor: activePalette.darkest,
                            borderLeftWidth: 0.3,
                            borderTopWidth: 0.2,
                            borderBottomWidth: 0.2,
                            borderRightWidth: 0,
                            paddingHorizontal: isMobile ? 10 : 20,
                            paddingVertical: isMobile ? 9 : 12,
                        },
                        createBoxShadow
                    ]}>
                    <Ionicons
                        name="add"
                        size={isMobile ? 24 : 28}
                        color={activePalette.darkest}
                    />

                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.button,
                        fontWeight: typography.fontWeights.bold,
                        color: activePalette.darkest,
                        marginLeft: 4,
                        marginRight: 12,
                    }}>
                        Card
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
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
        paddingHorizontal: 20
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