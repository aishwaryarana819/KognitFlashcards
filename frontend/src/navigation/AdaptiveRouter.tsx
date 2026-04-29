import React from "react";
import {View, useWindowDimensions, StyleSheet} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {useTheme} from "../context/ThemeContext";
import {BREAKPOINTS} from "../theme/breakpoints";
import {TopBar} from "../components/TopBar";
import {BottomBar} from "./BottomBar";
import {DesktopDrawer} from "./Sidebar";
import {FloatingReviewPalette} from "../components/FloatingReviewPalette";

export const AdaptiveRouter = () => {
    const {width} = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const {activePalette} = useTheme();

    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            {isMobile && <TopBar />}
            <View style={styles.engineWrapper}>
                <NavigationContainer>
                    {isMobile ? <BottomBar/> : <DesktopDrawer/>}
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