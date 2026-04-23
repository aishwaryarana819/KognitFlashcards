import {View, StyleSheet} from 'react-native';
import {Branding} from "../components/Branding";
import {useTheme} from "../context/ThemeContext";

// const activePalette = isDark ? darkPalette : lightPalette;

export const Splash = () => {
    const {activePalette} = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            <Branding />
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