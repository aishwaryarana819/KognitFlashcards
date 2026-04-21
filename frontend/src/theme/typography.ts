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
    const isMobile = windowWidth < 768;

    return {
        fontFamilies: {
            main: 'Urbanist',
            secondary: 'Manrope',
            handwritten: 'IndieFlower',
        },

        fontSizes: {
            heroL: isMobile ? 48 : 72,
            heroR: isMobile ? 36 : 52,
            heroS: isMobile ? 30 : 40,
            heading: isMobile ? 20 : 24,
            button: isMobile ? 18 : 20,
            bodyL: isMobile ? 14 : 16,
            bodyS: isMobile ? 12 : 14,
            caption: isMobile ? 11 : 12,
            captionS: isMobile ? 10 : 11,
        }
    };
};