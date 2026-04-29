import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Platform} from "react-native";
import {createBottomTabNavigator, BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTheme} from '../context/ThemeContext';
import {getInnerShadow} from "../theme/shadows";
import {MobileTabParamList} from "./NavigationTypes";
import {ROUTES} from './routes';

import {Dashboard} from "../screens/Dashboard";
import {UnderConstruction} from "../screens/UnderConstruction";

import DashboardIcon from '../../assets/icons/dashboard-fill.svg'
import LibraryIcon from '../../assets/icons/library-fill.svg'
import AnalyticsIcon from '../../assets/icons/analytics-fill.svg'
import DiscoverIcon from '../../assets/icons/discover-fill.svg'
import MoreIcon from '../../assets/icons/more.svg'

const Tab = createBottomTabNavigator<MobileTabParamList>();

const TAB_ICONS: Record<string, React.FC<any>> = {
    [ROUTES.DASHBOARD]: DashboardIcon,
    [ROUTES.LIBRARY]: LibraryIcon,
    [ROUTES.ANALYTICS]: AnalyticsIcon,
    [ROUTES.DISCOVER]: DiscoverIcon,
    More: MoreIcon,
};

const DashboardScreem = () => <UnderConstruction title="Dashboard" message="Coming soon."/>
const LibraryScreen = () => <UnderConstruction title="Library" message="Coming soon."/>
const AnalyticsScreen = () => <UnderConstruction title="Analytics" message="Coming soon."/>
const DiscoverScreen = () => <UnderConstruction title="Discover" message="Coming soon."/>
const MoreScreen = () => <UnderConstruction title="More" message="Coming soon."/>

const INACTIVE_ICON_SIZE = 26;
const ACTIVE_ICON_SIZE = 30;
const ACTIVE_CIRCLE_SIZE = 64;
const TAB_BAR_HEIGHT = 76;

const CustomTabBar = ({state, navigation}: BottomTabBarProps) => {
    const {activePalette, isDark} = useTheme();
    const innerShadow = getInnerShadow(activePalette);

    return (
        <View style={[styles.tabBarContainer, {
            backgroundColor: activePalette.bg2 + (isDark ? 'E6' : 'CC'),
            height: TAB_BAR_HEIGHT,
        },
            Platform.OS === 'web' && ({
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            } as any),
        ]}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const IconComponent = TAB_ICONS[route.name];

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented)
                        navigation.navigate(route.name);
                };

                if (isFocused) {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.8}
                            style={styles.tabSlot}
                        >
                            <View style={[styles.activeCircle, {
                                backgroundColor: activePalette.darker,
                            }, innerShadow]}>
                                <IconComponent
                                    width={ACTIVE_ICON_SIZE}
                                    height={ACTIVE_ICON_SIZE}
                                    color={activePalette.bg2}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.7}
                        style={styles.tabSlot}
                    >
                        <IconComponent
                            width={ACTIVE_ICON_SIZE}
                            height={ACTIVE_ICON_SIZE}
                            color={activePalette.darker}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export const BottomBar =  () => {
    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            initialRouteName={ROUTES.DASHBOARD}
            screenOptions={{headerShown: false}}
        >
            <Tab.Screen name={ROUTES.ANALYTICS} component={AnalyticsScreen}/>
            <Tab.Screen name={ROUTES.LIBRARY} component={LibraryScreen}/>
            <Tab.Screen name={ROUTES.DASHBOARD} component={DashboardScreem}/>
            <Tab.Screen name={ROUTES.DISCOVER} component={DiscoverScreen}/>
            <Tab.Screen name="More" component={MoreScreen}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    tabSlot: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    activeCircle: {
        width: ACTIVE_CIRCLE_SIZE,
        height: ACTIVE_CIRCLE_SIZE,
        borderRadius: ACTIVE_CIRCLE_SIZE/2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
});