import {View, Text, TouchableOpacity, StyleSheet, useWindowDimensions} from 'react-native';
import Svg, {Path, G, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';

import {useTheme} from "../../context/ThemeContext";
import {getTypography} from "../../theme/typography";
import {lightPalette} from "../../theme/colors";

export const RegisterOptions = () => {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const {isDark, activePalette} = useTheme();
    const isMobile = useWindowDimensions();

    // Custom SVG for Branded Google Logo - AI Generated
    const GoogleIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </Svg>
    );

    // Custom SVG for HackClub Icon - AI Generated
    const HackClubIcon = () => (
        <Svg width="22.5" height="24" viewBox="0 0 22.5 24">
            <Defs>
                <LinearGradient id="hcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FF7A59" />
                    <Stop offset="100%" stopColor="#E23E57" />
                </LinearGradient>
            </Defs>
            <Rect width="22.5" height="24" rx="6" fill="url(#hcGrad)" />
            <Path fill="#FFF" d="M7.5 6v12h2.5v-4.5c0-1.2.8-2 2-2s2 .8 2 2V18H16.5v-5c0-2.5-1.5-4-4-4-1 0-2 .6-2.5 1.5V6H7.5z"
            />
        </Svg>
    );

    // Custom SVG for "Glass Filled & Outlined" Envelope - AI Generated
    const EmailIcon = () => (
        <Svg width="28" height="24" viewBox="0 0 28 24">
            <Path
                fill={activePalette.regular + '40'}
                d="M2 5.5A2.5 2.5 0 0 1 4.5 3h19A2.5 2.5 0 0 1 26 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18.5v-13Z"
            />
            <G stroke={activePalette.lightest} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <Path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h19A2.5 2.5 0 0 1 26 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18.5v-13Z" />
                <Path d="m2 5.5 12 7.5 12-7.5" />
            </G>
        </Svg>
    );

    return (
        <View style={styles.wrapper}>
            <View style={[styles.contentBox,
                {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'auto' : 300}]}>
                <View style={styles.headerSection}>
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.heroS,
                        color: activePalette.darkest,
                        fontWeight: '800',
                        marginBottom: 12,
                    }}>
                        {"Your Memory Mastery\nStarts Here."}
                    </Text>
                    <Text style={{
                        fontFamily: typography.fontFamilies.secondary,
                        fontSize: typography.fontSizes.bodyL,
                        color: activePalette.darker,
                        lineHeight: 24,
                    }}>
                        Let's build memory that lasts.
                    </Text>
                </View>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[styles.authButton, {borderColor: activePalette.darker, borderWidth: 1.5,
                            backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,}]}
                        activeOpacity={0.7}
                    >
                        <GoogleIcon/>
                        <Text style={[styles.authButtonText, {
                            fontFamily: typography.fontFamilies.main,
                            color: activePalette.darker,
                        }]}>
                            Register with Google
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.authButton, {borderColor: activePalette.darker, borderWidth: 1.5,
                            backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,}]}
                        activeOpacity={0.7}
                    >
                        <HackClubIcon/>
                        <Text style={[styles.authButtonText, {
                            fontFamily: typography.fontFamilies.main,
                            color: activePalette.darker,
                        }]}>
                            Register with HackClub
                        </Text>
                    </TouchableOpacity>

                    <View style={[styles.dividerSection]}>
                        <View style={[styles.dividerLine, {
                            backgroundColor: activePalette.lighter }]}/>
                        <Text style={[styles.dividerText, {
                            fontFamily: typography.fontFamilies.secondary,
                            color: activePalette.regular, fontWeight: '800'
                        }]}>
                            OR
                        </Text>
                        <View style={[styles.dividerLine, {
                            backgroundColor: activePalette.lighter
                        }]}/>
                    </View>

                    <TouchableOpacity
                        style={[styles.authButton, {backgroundColor: activePalette.darkest}]}
                        activeOpacity={0.7}
                    >
                        <EmailIcon/>
                        <Text style={[styles.authButtonText, {
                            fontFamily: typography.fontFamilies.main,
                            color: activePalette.lightest,
                        }]}>
                            Register with Email
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    contentBox: {
        padding: 40,
        borderRadius: 25,
        minWidth: 300,
        maxWidth: 450,
        transform: [{ translateY: -20 }],
    },
    headerSection: {
        marginBottom: 40,
    },
    optionsContainer: {
        width: '100%',
        gap: 15,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 16,
        // borderWidth: 10,
        gap: 12,
    },
    authButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    dividerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    dividerLine: {
        flex: 1,
        height: 2,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 16,
    }
});




