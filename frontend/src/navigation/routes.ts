export const ROUTES = {
    SPLASH: 'Splash',
    LOGIN: 'Login',
    SIGNUP: 'SignUp',
    RECOVERY: 'AccountRecovery',

    DASHBOARD: 'Dashboard',
    LIBRARY: 'Library',
    ANALYTICS: 'Analytics',
    DISCOVER: 'Discover',
    IMPORT: 'Import',
    EXPORT: 'Export',
    TRASH: 'Trash',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
    HELP: 'Help',

    REVIEW_SESSION: 'ReviewSession',
    ADD_CARD: 'AddCard',
    ADD_DECK: 'AddDeck',
    ADD_SHELF: 'AddShelf',
    COMMAND_PALETTE: 'CommandPalette',
} as const;

export type RouteName = typeof ROUTES[keyof typeof ROUTES];