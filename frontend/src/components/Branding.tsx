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
            return isDark ? <IconDark width="40" height="40"/>
                : <IconLight width="40" height="40"/>;
        }
        return isDark ? <LogoDark height="50"/>
            : <LogoLight height="50"/>;
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