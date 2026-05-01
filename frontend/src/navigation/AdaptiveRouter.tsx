import React, {useState} from "react";
import {View, useWindowDimensions, StyleSheet} from "react-native";
import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useTheme} from "../context/ThemeContext";
import {BREAKPOINTS} from "../theme/breakpoints";
import {TopBar} from "../components/TopBar";
import {BottomBar} from "./BottomBar";
import {DesktopDrawer} from "./Sidebar";
import {FloatingReviewPalette} from "../components/FloatingReviewPalette";
import {ROUTES} from "./routes";
import {ReviewSession} from "../screens/ReviewSession";

export const AdaptiveRouter = () => {
    const {width} = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const {activePalette} = useTheme();
    const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.DASHBOARD);

    const TransparentTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
        },
    };

    const Stack = createNativeStackNavigator();

    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            {isMobile && <TopBar />}
            <View style={styles.engineWrapper}>
                <NavigationContainer
                    theme={TransparentTheme}
                    onStateChange={(state) => {
                        try {
                            const rootRoute = state?.routes[state.index];
                            if (rootRoute && rootRoute.name === 'AppChrome' && rootRoute.state) {
                                const activeChild = rootRoute.state.routes[rootRoute.state.index];
                                if (activeChild && activeChild.name !== 'More') {
                                    setCurrentRoute(activeChild.name);
                                }
                            }
                        } catch (e) {
                        }
                    }}>
                    {/* @ts-ignore */}
                    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}>
                        <Stack.Screen name="AppChrome">
                            {() => (
                                <>
                                    {isMobile ? <BottomBar initialRoute={currentRoute}/> : <DesktopDrawer initialRoute={currentRoute}/>}
                                    <FloatingReviewPalette/>
                                </>
                            )}
                        </Stack.Screen>

                        <Stack.Screen
                            name={ROUTES.REVIEW_SESSION}
                            component={ReviewSession}
                        />

                    </Stack.Navigator>

                </NavigationContainer>
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