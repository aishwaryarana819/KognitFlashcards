import {Platform, ViewStyle, TextStyle} from 'react-native'
import {ColorPalette} from "./colors";

export const getInnerShadow = (palette: ColorPalette): ViewStyle => {
    if (Platform.OS === 'web') {
        return {
            boxShadow: `inset 0px 0px 7px 0px ${palette.regular}`,
        };
    }

    return {
        borderWidth: 1,
        borderColor: palette.regular + '40',
    };
};

export const getIconShadow = (palette: ColorPalette): TextStyle => {
    if (Platform.OS === 'web') {
        return {
            // @ts-ignore
            textShadow: `1px 0px 2px ${palette.regular}80, 0px 0px 1px rgba(0,0,0,0.25)`,
        }
    }

    return {
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    };
};

export const getReviewBox1Shadow = (): ViewStyle => {
    return {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 10,
        elevation: 5,
    };
};

export const getReviewBox2Shadow = (palette: ColorPalette): ViewStyle => {
    const dropShadow: ViewStyle = {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
    };

    if (Platform.OS === 'web') {
        return {
            ...dropShadow,
            boxShadow: `inset 0px 0px 20px 0px ${palette.darkest}, 0px 2px 4px 0px rgba(0,0,0,0.25)`,
            shadowColor: 'transaprent',
            shadowOpacity: 0,
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 0,
        };
    }
    return dropShadow;
};

export const getCreateBoxShadow = (palette: ColorPalette): ViewStyle => {
    const dropShadow: ViewStyle = {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 10,
        elevation: 5,
    };

    if (Platform.OS === 'web') {
        return {
            ...dropShadow,
            boxShadow: `inset 0px 0px 60px -10px ${palette.darker}60, 0px 4px 10px 0px rgba(0,0,0,0.25)`,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 0,
        };
    }
    return dropShadow;
};