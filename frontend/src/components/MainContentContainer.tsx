import React from "react";
import {ScrollView, StyleSheet, ViewStyle} from "react-native";
import {useTheme} from '../context/ThemeContext';

interface MainContentContainerProps {
    children: React.ReactNode;
    style?: viewStyle;
}

export const MainContentContainer = ({children, style}:
    MainContentContainerProps) => {
    const {activePalette} = useTheme();

    return (
        <ScrollView
            style={[
                styles.container,
                {backgroundColor: activePalette.bg2},
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
        marginLeft: 15,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        padding: 30,
    }
});