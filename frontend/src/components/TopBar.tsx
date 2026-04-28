// Made fixes using AI

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, TextInput, Platform} from "react-native";
import {useTheme} from "../context/ThemeContext";
import {useAuth} from "../context/AuthContext";
import {getTypography} from "../theme/typography";
import {getInnerShadow, getIconShadow} from "../theme/shadows";
import {Ionicons} from "@expo/vector-icons";
import {BREAKPOINTS} from "../theme/breakpoints";
import {Branding} from "./Branding";
import {lightPalette} from "../theme/colors";

import SearchIcon from '../../assets/icons/search.svg';

export const TopBar = () => {
    const {width} = useWindowDimensions();
    const {activePalette, isDark, toggleTheme} = useTheme();
    const {profile} = useAuth();

    const [showNotifSoon, setShowNotifSoon] = useState(false);
    const [isMac, setIsMac] = useState(true);

    useEffect(() => {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent));
        } else {
            setIsMac(Platform.OS === 'ios' || Platform.OS === 'macos');
        }
    }, []);

    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const innerShadow = getInnerShadow(activePalette);
    const iconShadow = getIconShadow(activePalette);

    const circleSize = isMobile? 32 : 40;
    const circleRadius = circleSize / 2;
    const iconSize = isMobile ? 16 : 20
    const searchCircleSize = isMobile ? 40 : 48;
    const SearchCircleRadius = searchCircleSize / 2;

    return (
        <View style={[styles.rootWrapper, {
            paddingTop: isMobile ? 0 : 20,
            paddingHorizontal: isMobile ? 0 : 20,
        }]}>

            {isMobile && (
                <View style={{marginLeft: 15, marginRight: 15, marginTop: 5, alignSelf: 'center'}}>
                    <Branding />
                </View>
            )}

            <View style={[styles.topBarIsland, {
                backgroundColor: activePalette.bg2,

                paddingHorizontal: 20,
                paddingVertical: isMobile ? 15 : 20,
                borderBottomLeftRadius: isMobile ? 20 : 15,
                borderTopLeftRadius: isMobile ? 0 : 15,
                borderTopRightRadius: isMobile ? 0 : 15,
                borderBottomRightRadius: isMobile ? 0 : 15,
            }]}>

                <View style={[styles.searchPalette, {
                    backgroundColor: activePalette.bg,
                    paddingHorizontal: isMobile ? 15 : 20,
                    // paddingVertical: isMobile ? 12 : 20,
                    height: isMobile ? 36 : 48,
                }]}>
                    <View style={{flexShrink: 0}}>
                        <SearchIcon width={20} height={20} color={activePalette.darkest}/>
                    </View>

                    <TextInput
                        style={[styles.searchInput, {
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.caption,
                            color: activePalette.bg2,
                            width: isMobile ? 120 : 300,
                            flexShrink: 1,
                            minWidth: 0,
                        }, Platform.OS === 'web' && ({outlineStyle: 'none'} as any)]}
                        placeholder={isMobile ? "Search" : "Your Powerful Search & Command Palette."}
                        placeholderTextColor={activePalette.fg2}
                    />

                    {!isMobile && (
                        <View style={[styles.cmdBadge, {backgroundColor: activePalette.darkest}, innerShadow]}>
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.caption,
                                color: activePalette.bg,
                                fontWeight: typography.fontWeights.thin,
                                marginRight: 4,
                            }}>
                                {isMac ? '⌘' : 'Ctrl'}
                            </Text>
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.bodyS,
                                color: activePalette.bg,
                                fontWeight: typography.fontWeights.bold
                            }}>
                                P
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{flex: 1, minWidth: 10}}/>

                <View style={styles.actionSection}>

                    <TouchableOpacity activeOpacity={0.7} onPress={toggleTheme} style=
                        {[{
                            backgroundColor: activePalette.bg,
                            width: circleSize,
                            height: circleSize,
                            borderRadius: circleRadius,
                            alignItems: 'center', justifyContent: 'center',
                    }]}>
                        <Ionicons name={isDark ? "sunny-outline" : "moon-outline"}
                                  size={iconSize} color={activePalette.darkest} style={iconShadow}/>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} style={[{
                        backgroundColor: activePalette.bg,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleRadius,
                        alignItems: 'center', justifyContent: 'center',
                    }]}>
                        <Ionicons name="sync" size={iconSize} color={activePalette.darkest} style={iconShadow}/>
                        <View style={[styles.statusDot, {
                            backgroundColor: activePalette.green,
                            borderColor: activePalette.bg,
                            width: isMobile ? 12 : 14,
                            height: isMobile ? 12 : 14,
                            borderRadius: 10
                        }]}/>
                    </TouchableOpacity>

                    <View style={{zIndex: 50}}>
                        <TouchableOpacity activeOpacity={0.7} style={[{
                            backgroundColor: activePalette.bg,
                            width: circleSize,
                            height: circleSize,
                            borderRadius: circleRadius,
                            alignItems: 'center', justifyContent: 'center',
                        }]}
                                          onPress={() => {
                                              setShowNotifSoon(true);
                                              setTimeout(() => setShowNotifSoon(false), 2000);
                                          }}>
                            <Ionicons name="notifications-outline" size={iconSize}
                                      color={activePalette.darkest} style={iconShadow}/>

                            <View style={[styles.notificationBadge, {backgroundColor: activePalette.red, borderColor: activePalette.bg}]}>
                                <Text style={{fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.micro, color: lightPalette.lightest, fontWeight: typography.fontWeights.thin}}>
                                    23
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {showNotifSoon && (
                            <View style={[styles.tooltipCard, {backgroundColor: activePalette.darkest}]}>
                                <Text style={{fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.captionS, color: activePalette.bg, fontWeight: typography.fontWeights.bold}}>
                                    Coming Soon
                                </Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={styles.profileBox}>
                        <View style={[{
                            backgroundColor: activePalette.bg,
                            width: circleSize, height: circleSize, borderRadius: circleRadius,
                            alignItems: 'center', justifyContent: 'center',
                        }]}>
                            <Ionicons name="person-outline" size={iconSize}
                                      color={activePalette.darkest} style={iconShadow}/>
                        </View>

                        {!isMobile && (
                            <View style={styles.profileTextWrapper}>
                                <Text style={{fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.bodyS, fontWeight: typography.fontWeights.extrablack, color: activePalette.darkest}}>
                                    {profile?.full_name || "Sukuna"}
                                </Text>
                                <Text style={{fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.caption, color: activePalette.fg2}}>
                                    {profile?.username ? `@${profile.username}` : "ryomensukuna"}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    topBarIsland: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchPalette: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexShrink: 1,
        height: 48,
        borderRadius: 24,
    },
    searchInput: {
        marginLeft: 12,
        marginRight: 12,
    },
    cmdBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    actionSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 12,
        flexShrink: 0
    },
    actionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusDot: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    tooltipCard: {
        position: 'absolute',
        top: 48,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    profileTextWrapper: {
        marginLeft: 10,
        justifyContent: 'center',
    }
});
