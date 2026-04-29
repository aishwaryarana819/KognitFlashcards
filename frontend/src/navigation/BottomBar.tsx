import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Platform, useWindowDimensions} from "react-native";
import {createBottomTabNavigator, BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from "@react-navigation/native";
import {useTheme} from '../context/ThemeContext';
import {getInnerShadow} from "../theme/shadows";
import {MobileTabParamList} from "./NavigationTypes";
import {ROUTES} from './routes';

import {Dashboard} from "../screens/Dashboard";
import {UnderConstruction} from "../screens/UnderConstruction";
import {getTypography} from "../theme/typography";

import DashboardIcon from '../../assets/icons/dashboard-fill.svg'
import LibraryIcon from '../../assets/icons/library-fill.svg'
import AnalyticsIcon from '../../assets/icons/analytics-fill.svg'
import DiscoverIcon from '../../assets/icons/discover-fill.svg'
import MoreIcon from '../../assets/icons/more.svg'
import ImportIcon from '../../assets/icons/import.svg'
import ExportIcon from '../../assets/icons/export.svg'
import TrashIcon from '../../assets/icons/trash-fill.svg'
import SettingsIcon from '../../assets/icons/settings-fill.svg'
import HelpIcon from '../../assets/icons/help.svg'

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
const MoreScreen = ({route}: any) => (
    <UnderConstruction title={route?.params?.title || 'More'} message="Coming soon."/>
);

const DRAWER_ITEMS = [
    {icon: ImportIcon, label: 'Import'},
    {icon: ExportIcon, label: 'Export'},
    {icon: TrashIcon, label: 'Trash'},
    {icon: SettingsIcon, label: 'Settings'},
    {icon: HelpIcon, label: 'Help'},
];

const MoreDrawer = ({visible, onClose}: {visible: boolean; onClose: () => void}) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    if (!visible) return null;
    const navigation = useNavigation<any>();

    const row1 = DRAWER_ITEMS.slice(0, 3);
    const row2 = DRAWER_ITEMS.slice(3);

    return (
        <View style={drawerStyles.overlay}>
            <TouchableOpacity
                style={drawerStyles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={[drawerStyles.panel,
                {backgroundColor: activePalette.bg2 + (isDark ? 'E6' : 'CC')},
                Platform.OS === 'web' && ({
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                } as any),
            ]}>
                <View style={drawerStyles.titleGrid}>
                    <View style={drawerStyles.titleRow}>
                        {row1.map((item) => (
                            <TouchableOpacity
                                key={item.label}
                                activeOpacity={0.7}
                                onPress={() => {
                                    navigation.navigate('More', {title: item.label});
                                }}
                                style={[drawerStyles.title,
                                    {backgroundColor: activePalette.bg}]}
                            >
                                <item.icon width={24} height={24} color={activePalette.darker}/>
                                <Text style={{
                                    fontFamily: typography.fontFamilies.main,
                                    fontSize: typography.fontSizes.caption,
                                    fontWeight: typography.fontWeights.semibold,
                                    color: activePalette.darkest,
                                    marginTop: 6,
                                }}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={drawerStyles.titleRow}>
                        {row2.map((item) => (
                            <TouchableOpacity
                                key={item.label}
                                activeOpacity={0.7}
                                onPress={() => {
                                    navigation.navigate('More', {title: item.label});
                                }}
                                style={[drawerStyles.title,
                                    {backgroundColor: activePalette.bg}]}
                            >
                                <item.icon width={24} height={24} color={activePalette.darker}/>
                                <Text style={{
                                    fontFamily: typography.fontFamilies.main,
                                    fontSize: typography.fontSizes.caption,
                                    fontWeight: typography.fontWeights.semibold,
                                    color: activePalette.darkest,
                                    marginTop: 6,
                                }}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

const INACTIVE_ICON_SIZE = 26;
const ACTIVE_ICON_SIZE = 30;
const ACTIVE_CIRCLE_SIZE = 64;
const TAB_BAR_HEIGHT = 76;

const CustomTabBar =
    ({state, navigation, showMore, onToggleMore}: BottomTabBarProps & {
        showMore: boolean, onToggleMore: () => void
    }) => {
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
                    if (route.name === 'More') {
                        onToggleMore();
                        return;
                    }
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
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={{flex: 1}}>
            {/* @ts-ignore */}
            <Tab.Navigator
                tabBar={props => (
                    <CustomTabBar {...props}
                        showMore={showMore}
                        onToggleMore={() => setShowMore(prev => !prev)}
                    />
                    )}
                    initialRouteName={ROUTES.DASHBOARD}
                    screenOptions={{headerShown: false}}
                >
                <Tab.Screen name={ROUTES.ANALYTICS} component={AnalyticsScreen}/>
                <Tab.Screen name={ROUTES.LIBRARY} component={LibraryScreen}/>
                <Tab.Screen name={ROUTES.DASHBOARD} component={DashboardScreem}/>
                <Tab.Screen name={ROUTES.DISCOVER} component={DiscoverScreen}/>
                <Tab.Screen name="More" component={MoreScreen}/>
            </Tab.Navigator>
            <MoreDrawer visible={showMore} onClose={() => setShowMore(false)}
                /* @ts-ignore */
                onNavigate={(label: string) => {
                setShowMore(false);
            }}/>
        </View>
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

const drawerStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 110,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.80)',
    },
    panel: {
        position: 'absolute',
        bottom: 76,
        right: 12,
        borderRadius: 16,
        padding: 12,
    },
    titleGrid: {
        flexDirection: 'column',
        gap: 10,
    },
    titleRow: {
        flexDirection: 'row',
        gap: 10,
    },
    title: {
        width: 80,
        height: 80,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});



