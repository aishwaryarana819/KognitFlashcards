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
            textShadow: `1px 0px 2px ${palette.regular}80, 0px 0px 1px rgba(0,0,0,0.25)`,
        }
    }

    return {
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    };
};