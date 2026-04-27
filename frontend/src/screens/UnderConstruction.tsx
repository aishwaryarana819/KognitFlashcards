import {View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Platform} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from "../theme/typography";
import {Ionicons} from "@expo/vector-icons";
import {BREAKPOINTS} from "../theme/breakpoints";

type UnderConstructionProps = {
    title: string;
    message?: string;
    onBackTest?: () => void;
};

export const UnderConstruction = ({title, message, onBackTest}: UnderConstructionProps) => {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const {activePalette, isDark, toggleTheme} = useTheme();
    const isMobile = width < BREAKPOINTS.MOBILE_MAX;

    return (
        <View style={[styles.wrapper, {backgroundColor: activePalette.bg}]}>
            <TouchableOpacity activeOpacity={0.7} onPress={onBackTest} style={[styles.absoluteBtn, {
                backgroundColor: activePalette.bg2, top: Platform.OS === 'web' ? 40 : 60, left: 20}]}>
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={toggleTheme} style={[styles.absoluteBtn, {
                backgroundColor: activePalette.bg2, top: Platform.OS === 'web' ? 40 : 60, right: 20,
            }]}>
                <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color={activePalette.darker}/>
            </TouchableOpacity>

            <View style={[styles.contentBox, {
                backgroundColor: activePalette.lighter,
                width: isMobile ? 80 : 120,
                height: isMobile ? 80 : 120,
                borderRadius: isMobile ? 40 : 60,
                marginBottom: 24,
            }]}>
                <Ionicons name="construct-outline" size={isMobile ? 36 :  54} color={activePalette.darker}/>
            </View>
            <Text style={{fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.heroS,
                color: activePalette.darkest,
                fontWeight: '800',
                marginBottom: 12,
                textAlign: 'center'
            }}>
                {title}
            </Text>
            <Text style={{
                fontFamily: typography.fontFamilies.secondary,
                fontSize: typography.fontSizes.bodyL,
                color: activePalette.darker,
                textAlign: 'center',
                maxWidth: 400,
                lineHeight: 24,
                opacity: 0.8
            }}>
                {message || "The foundry is running at full capacity to forge this for YOU."}
            </Text>
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













