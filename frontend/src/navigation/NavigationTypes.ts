import {NavigatorScreenParams} from "@react-navigation/native";
import {ROUTES} from "./routes";

export type AppChromeParamList = {
    [ROUTES.DASHBOARD]: undefined;
    [ROUTES.LIBRARY]: undefined;
    [ROUTES.ANALYTICS]: undefined;
    [ROUTES.DISCOVER]: undefined;
    [ROUTES.IMPORT]: undefined;
    [ROUTES.EXPORT]: undefined;
    [ROUTES.TRASH]: undefined;
    [ROUTES.SETTINGS]: undefined;
    [ROUTES.HELP]: undefined;
};

export type MobileTabParamList = {
    [ROUTES.DASHBOARD]: undefined;
    [ROUTES.LIBRARY]: undefined;
    [ROUTES.ANALYTICS]: undefined;
    [ROUTES.DISCOVER]: undefined;
    More: undefined;
};

export type RootStackParamList = {
    AuthSplash: undefined;
    AuthStack: undefined;
    AppChrome: NavigatorScreenParams<AppChromeParamList>;

    [ROUTES.REVIEW_SESSION]: undefined;
    [ROUTES.ADD_CARD]: undefined;
    [ROUTES.ADD_DECK]: undefined;
    [ROUTES.ADD_SHELF]: undefined;
};

