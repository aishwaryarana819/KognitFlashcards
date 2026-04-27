import {View, Text, TouchableOpacity, Platform, StyleSheet, useWindowDimensions} from "react-native";
import {useTheme} from "../context/ThemeContext";
import {getTypography} from "../theme/typography";
import {Ionicons} from '@expo/vector-icons';

export const AddCard = ({onBackTest}) => {
    const {activePalette, isDark, toggleTheme} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    return (
        <View style={[styles.wrapper, {backgroundColor: activePalette.bg}]}>
            <TouchableOpacity activeOpacity={0.7} onPress={onBackTest} style={[styles.absoluteBtn, {
                backgroundColor: activePalette.bg2, top: Platform.OS === 'web' ? 40 : 60, left: 20,
            }]}>
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={toggleTheme} style={[styles.absoluteBtn, {
                backgroundColor: activePalette.bg2,
                top: Platform.OS === 'web' ? 40 : 60, right: 20,
            }]}>
                <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color={activePalette.darker}/>
            </TouchableOpacity>

            <View style={[styles.contentBox, {backgroundColor: activePalette.bg2, padding: 40, borderRadius: 24}]}>
                <Text style={{fontSize: typography.fontSizes.heroS,
                    fontFamily: typography.fontFamilies.main, fontWeight: '800',
                    color: activePalette.darkest}}>
                    AddCard
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    absoluteBtn: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    contentBox: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});