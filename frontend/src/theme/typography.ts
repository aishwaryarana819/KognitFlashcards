import {BREAKPOINTS} from './breakpoints';

export type FontFamilies = {
    main: string;
    secondary: string;
    handwritten: string;
};

export type FontSizes = {
    heroL: number;
    heroR: number;
    heroS: number;
    heading: number;
    button: number;
    bodyL: number;
    bodyS: number;
    caption: number;
    captionS: number;
};

export type Typography = {
    fontFamilies: FontFamilies;
    fontSizes: FontSizes;
};

export const getTypography = (windowWidth: number): Typography => {
    const isMobile = windowWidth < BREAKPOINTS.MOBILE_MAX;

    return {
        fontFamilies: {
            main: 'Urbanist_400Regular, sans-serif',
            secondary: 'Manrope_400Regular, sans-serif',
            handwritten: 'IndieFlower_400Regular, cursive',
        },

        fontSizes: {
            heroL: isMobile ? 48 : 64,
            heroR: isMobile ? 36 : 48,
            heroS: isMobile ? 28 : 36,
            heading: isMobile ? 18 : 20,
            button: isMobile ? 16 : 18,
            bodyL: isMobile ? 14 : 16,
            bodyS: isMobile ? 12 : 14,
            caption: isMobile ? 11 : 12,
            captionS: isMobile ? 10 : 11,
        }
    };
};