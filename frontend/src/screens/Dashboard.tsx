import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DailyGoalWidget } from '../components/DailyGoalWidget'; // Import the widget

export const Dashboard = () => {
    const { activePalette } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
            {/* Render the widget right at the top of the dashboard */}
            <DailyGoalWidget />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center', // Centers the widget horizontally
    }
});
