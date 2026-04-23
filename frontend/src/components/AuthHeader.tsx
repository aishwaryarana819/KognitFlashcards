import {View, Text, TouchableOpacity, StyleSheet, useWindowDimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Branding} from './Branding';
import {getTypography} from '../theme/typography';
import {getLayoutType} from "../theme/breakpoints";
import {useTheme} from "../context/ThemeContext";

// const isDark = false;
// const activePalette = isDark ? darkPalette : lightPalette;

type AuthHeaderProps = {
    rightActionText: 'Login' | 'Register';
    onRightActionPress: () => void;
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({
    rightActionText,
    onRightActionPress,
}) => {
    const {width} = useWindowDimensions();
    const layout = getLayoutType(width);
    const isMobile = layout === 'mobile';
    const typography = getTypography(width);
    const {isDark, activePalette, toggleTheme} = useTheme();

    return (
        <View style={[styles.headerContainer, {
            paddingHorizontal: isMobile ? 20 : 20
        }]}>
            <View style={styles.leftSection}>
               <Branding/>
            </View>
            <View style={styles.rightSection}>
                <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.iconButton}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isDark ? "moon-outline" : "sunny-outline"}
                        size={isMobile ? 20 : 26}
                        color={activePalette.darkest}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={onRightActionPress}
                style={[styles.actionButton,
                    {
                        backgroundColor: activePalette.darkest,
                        paddingVertical:  isMobile ? 8 : 10,
                        paddingHorizontal: isMobile ? 14 : 20,
                        borderRadius: isMobile ? 12 : 20,
                    }
                ]}
                activeOpacity={0.8}
                >
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.button,
                        color: activePalette.lightest,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                    }}>
                        {rightActionText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconButton: {
        // marginRight: 10,
        padding: 20,
        // borderRadius: 50,
    },
    actionButton: {
    }
});