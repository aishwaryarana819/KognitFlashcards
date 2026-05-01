import React from "react";
import {View, StyleSheet, ViewStyle, useWindowDimensions} from "react-native";
import {useTheme} from '../context/ThemeContext';
import {BREAKPOINTS} from "../theme/breakpoints";

interface MainContentContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const MainContentContainer = ({children, style}: MainContentContainerProps) => {
    const {activePalette} = useTheme();
    const {width} = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    return (
        <View
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
        >
            <View style={[styles.content, {paddingHorizontal: isMobile ? 20 : 30, paddingTop: isMobile ? 10 : 30}]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 30,
        paddingBottom: 0,
    }
});
