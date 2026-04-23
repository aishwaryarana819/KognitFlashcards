export const BREAKPOINTS = {
    MOBILE_MAX: 500,
    DESKTOP_SMALL_MAX: 1023,
    DESKTOP_LARGE_MIN: 1024,
} as const;

export type LayoutType = 'mobile' | 'desktopSmall' | 'desktopLarge';

export const getLayoutType = (windowWidth: number): LayoutType => {
    if (windowWidth <= BREAKPOINTS.MOBILE_MAX) return 'mobile';
    if (windowWidth <= BREAKPOINTS.DESKTOP_SMALL_MAX) return 'desktopSmall';
    return 'desktopLarge';
};