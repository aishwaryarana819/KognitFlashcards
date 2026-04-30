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
                {backgroundColor: activePalette.bg2},
                {
                    marginLeft: isMobile ? 15 : 0,
                    marginRight: isMobile ? 15 : 20,
                    marginBottom: isMobile ? 90 : 20,
                },
                style
            ]}
            contentContainerStyle={styles.content}
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