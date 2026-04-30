import {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Branding} from "../components/Branding";
import {useTheme} from "../context/ThemeContext";

export const Splash = () => {
    const {activePalette} = useTheme();
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.2,
                    duration: 750,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Branding />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
