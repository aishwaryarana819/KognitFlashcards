import React from "react";
import {ScrollView, StyleSheet, ViewStyle, useWindowDimensions} from "react-native";
import {useTheme} from '../context/ThemeContext';
import {BREAKPOINTS} from "../theme/breakpoints";

interface MainContentContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const MainContentContainer = ({children, style}:
    MainContentContainerProps) => {
    const {activePalette} = useTheme();
    const {width} = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    return (
        <ScrollView
            style={[
                styles.container,
                {backgroundColor: isMobile ? 'transparent' : activePalette.bg2},
                {
                    marginLeft: 0,
                    marginRight: isMobile ? 0 : 20,
                    marginBottom: isMobile ? 0 : 20,
                },
                style
            ]}
            contentContainerStyle={[styles.content, {paddingBottom: isMobile ? 120 : 40}]}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        // marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        padding: 30,
    }
});