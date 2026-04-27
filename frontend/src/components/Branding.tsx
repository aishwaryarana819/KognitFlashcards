import React from 'react';
import {View, StyleSheet, useWindowDimensions, Platform} from 'react-native';
import {BlurView} from "expo-blur";
import {getLayoutType} from "../theme/breakpoints";
import {lightPalette, darkPalette} from "../theme/colors";
import {useTheme} from "../context/ThemeContext";

import IconLight from '../../assets/icon_light.svg';
import IconDark from '../../assets/icon_dark.svg';
import LogoLight from '../../assets/logo_light.svg';
import LogoDark from '../../assets/logo_dark.svg';

// const isDark = false;
// const activePalette = isDark ? darkPalette : lightPalette;

export const Branding = () => {
    const {width} = useWindowDimensions();
    const layout = getLayoutType(width);
    const isMobile = layout === 'mobile';
    const {isDark, activePalette} = useTheme();

    const renderLogo = () => {
        if (isMobile) {
            return (
                <View style={{width: 36, height: 40}}>
                    {
                        isDark ? <IconDark style={{width: '100%', height: '100%'}}/>
                            : <IconLight style={{width: '100%', height: '100%'}}/>
                    }
                </View>
            );
        }
        return (
            <View style={{width: 132, height: 50}}>
                {
                    isDark ? <LogoDark style={{width: '100%', height: '100%'}}/>
                        : <LogoLight style={{width: '100%', height: '100%'}}/>
                }
            </View>
        );
    };

    const dynamicGlassStyle = [
        styles.glassContainer,
        {
            backgroundColor: activePalette.lightest + 'CC',
            paddingTop: isMobile ? 8 : 18,
            paddingBottom: isMobile ? 7 : 16,
            paddingHorizontal: isMobile ? 8 : 20,
            borderRadius: isMobile ? 12 : 20,
        }
    ];

    if (Platform.OS === 'web') {
        return (
            <View style={[
                ...dynamicGlassStyle,
                // {backdropFilter: 'blur(10px)'}
            ]}>
                {renderLogo()}
            </View>
        );
    }

    return (
        <BlurView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            style={dynamicGlassStyle}
        >
            {renderLogo()}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    glassContainer: {
        overflow: "hidden",
    }
});