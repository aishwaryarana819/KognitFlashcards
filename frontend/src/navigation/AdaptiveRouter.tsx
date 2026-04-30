import React, {useState} from "react";
import {View, useWindowDimensions, StyleSheet} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {useTheme} from "../context/ThemeContext";
import {BREAKPOINTS} from "../theme/breakpoints";
import {TopBar} from "../components/TopBar";
import {BottomBar} from "./BottomBar";
import {DesktopDrawer} from "./Sidebar";
import {FloatingReviewPalette} from "../components/FloatingReviewPalette";
import {ROUTES} from "./routes";

export const AdaptiveRouter = () => {
    const {width} = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const {activePalette} = useTheme();
    const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.DASHBOARD);

    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            {isMobile && <TopBar />}
            <View style={styles.engineWrapper}>
                <NavigationContainer
                    onStateChange={(state) => {
                        const routeName = state?.routes[state.index]?.name;
                        if (routeName && routeName !== 'More')
                            setCurrentRoute(routeName);
                }}>
                    {/* @ts-ignore */}
                    {isMobile ? <BottomBar initialRoute={currentRoute}/> : <DesktopDrawer initialRoute={currentRoute}/>}
                </NavigationContainer>
                <FloatingReviewPalette/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    engineWrapper: {
        flex: 1,
        width: "100%",
        zIndex: 101,
    },
});