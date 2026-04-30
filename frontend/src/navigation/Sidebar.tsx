import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useWindowDimensions} from "react-native";
import {createDrawerNavigator, DrawerContentComponentProps} from "@react-navigation/drawer";
import {useTheme} from '../context/ThemeContext';
import {getTypography} from "../theme/typography";
// import {getSidebarActiveBarShadow, getSidebarActiveIconShadow} from "../theme/shadows";
import {ROUTES} from './routes';
import {Branding} from "../components/Branding";
import {TopBar} from "../components/TopBar";
import {UnderConstruction} from "../screens/UnderConstruction";
import {BREAKPOINTS} from "../theme/breakpoints";
import {MainContentContainer} from "../components/MainContentContainer";

import ActiveBar from '../../assets/icons/Active-bar.svg'
import DashboardFill from '../../assets/icons/dashboard-fill.svg'
import DashboardOutline from '../../assets/icons/dashboard-outline.svg'
import LibraryFill from '../../assets/icons/library-fill.svg'
import LibraryOutline from '../../assets/icons/library-outline.svg'
import AnalyticsFill from '../../assets/icons/analytics-fill.svg'
import AnalyticsOutline from '../../assets/icons/analytics-outline.svg'
import DiscoverFill from '../../assets/icons/discover-fill.svg'
import DiscoverOutline from '../../assets/icons/discover-outline.svg'
import ImportIcon from '../../assets/icons/import.svg'
import ExportIcon from '../../assets/icons/export.svg'
import TrashFill from '../../assets/icons/trash-fill.svg'
import TrashOutline from '../../assets/icons/trash-outline.svg'
import SettingsFill from '../../assets/icons/settings-fill.svg'
import SettingsOutline from '../../assets/icons/settings-outline.svg'
import HelpIcon from '../../assets/icons/help.svg'

const Drawer = createDrawerNavigator();

type MenuItem = {
    route: string;
    label: string;
    outline: React.FC<any>;
    fill: React.FC<any>;
    w: number;
    h: number;
};

const UPPER_ITEMS: MenuItem[] = [
    {route: ROUTES.DASHBOARD, label: 'Dashboard', w: 18, h: 18, outline: DashboardOutline, fill: DashboardFill},
    {route: ROUTES.LIBRARY, label: 'Library', w: 21, h: 21, outline: LibraryOutline, fill: LibraryFill},
    {route: ROUTES.ANALYTICS, label: 'Analytics', outline: AnalyticsOutline, fill: AnalyticsFill, w: 16.5, h: 17.1},
    {route: ROUTES.DISCOVER, label: 'Discover', outline: DiscoverOutline, fill: DiscoverFill, w: 20, h: 20},
];

const LOWER_ITEMS: MenuItem[] = [
    {route: ROUTES.IMPORT, label: 'Import', outline: ImportIcon, fill: ImportIcon, w: 14, h: 14},
    {route: ROUTES.EXPORT, label: 'Export', outline: ExportIcon, fill: ExportIcon, w: 14, h: 14},
    {route: ROUTES.TRASH, label: 'Trash', outline: TrashOutline, fill: TrashFill, w: 14.8, h: 18.27},
    {route: ROUTES.SETTINGS, label: 'Settings', outline: SettingsOutline, fill: SettingsFill, w: 15, h: 15},
    {route: ROUTES.HELP, label: 'Help', outline: HelpIcon, fill: HelpIcon, w: 16, h: 16},
];

const ScreenWrapper = ({title}: {title: string}) => {
    const {activePalette} = useTheme();
    return (
        <View style={{flex: 1, backgroundColor: activePalette.bg}}>
            <TopBar/>
            <MainContentContainer>
                <UnderConstruction title={title} message="Coming soon."/>
            </MainContentContainer>
        </View>
    );
};

const DashboardScreen = () => <ScreenWrapper title="Dashboard"/>;
const LibraryScreen = () => <ScreenWrapper title="Library"/>;
const AnalyticsScreen = () => <ScreenWrapper title="Analytics"/>;
const DiscoverScreen = () => <ScreenWrapper title="Discover"/>;
const ImportScreen = () => <ScreenWrapper title="Import"/>;
const ExportScreen = () => <ScreenWrapper title="Export"/>;
const TrashScreen = () => <ScreenWrapper title="Trash" />;
const SettingsScreen = () => <ScreenWrapper title="Settings"/>;
const HelpScreen = () => <ScreenWrapper title="Help"/>;

const SidebarContent = (props: DrawerContentComponentProps) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const isCollapsed = width <= BREAKPOINTS.DESKTOP_SMALL_MAX;
    const typography = getTypography(1024);
    // const activeIconShadow = getSidebarActiveIconShadow(activePalette);
    // const activeBarShadow = getSidebarActiveBarShadow(activePalette);

    const currentRoute = props.state.routes[props.state.index].name;

    const renderItem = (item: MenuItem) => {
        const isActive = currentRoute === item.route;
        const IconComponent = isActive ? item.fill : item.outline;

        return (
            <TouchableOpacity
                key={item.route}
                activeOpacity={0.7}
                onPress={() => {
                    console.log('Sidebar tap:',item.route); //test
                    props.navigation.navigate(item.route);
                }}
                style={styles.menuItem}
            >
                {isActive && (
                    <View style={styles.activeBarWrapper}>
                        <ActiveBar height={38} color={activePalette.darkest}/>
                    </View>
                )}

                <View style={styles.iconWrapper}>
                    <IconComponent width={isActive ? item.w + 5 : item.w}
                                   height={isActive ? item.h + 5 : item.h}
                                   color={activePalette.darker}
                    />
                </View>

                {!isCollapsed && (
                    /* @ts-ignore */
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.bodyS,
                        fontWeight: isActive
                            ? typography.fontWeights.extrablack
                            : typography.fontWeights.regular,
                        color: activePalette.darkest,
                        marginLeft: 15,
                    }}>
                        {item.label}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.outerPadding}>
            <View style={styles.logoArea}>
                <Branding/>
            </View>
            <View style={[
                styles.sidebarBox,
                isCollapsed && {width: 62},
                {backgroundColor: activePalette.bg2 + (isDark ? 'E6' : 'CC')},
                Platform.OS === 'web' && ({
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }as any),
            ]}>
                <View style={styles.menuArea}>
                    <View style={styles.upperGroup}>
                        {UPPER_ITEMS.map(renderItem)}
                    </View>
                    <View style={styles.lowerGroup}>
                        {LOWER_ITEMS.map(renderItem)}
                    </View>
                </View>
            </View>
        </View>
    );
};

export const DesktopDrawer = () => {
    const {activePalette} = useTheme();
    const {width} = useWindowDimensions();
    const isCollapsed = width <= BREAKPOINTS.DESKTOP_SMALL_MAX;
    const sidebarWidth = isCollapsed ? 102 : 211.5;

    return (
        // @ts-ignore
        <Drawer.Navigator
            drawerContent={(props) => <SidebarContent {...props}/>}
            screenOptions={{
                drawerType: 'permanent',
                drawerStyle: {width: sidebarWidth, backgroundColor: 'transparent', borderRightWidth: 0, overflow: 'visible'},
                headerShown: false,
                sceneStyle: {backgroundColor: activePalette.bg},
                overlayColor: 'transparent',
            }}
            initialRouteName={ROUTES.DASHBOARD}
        >
            <Drawer.Screen name={ROUTES.DASHBOARD} component={DashboardScreen}/>
            <Drawer.Screen name={ROUTES.LIBRARY} component={LibraryScreen}/>
            <Drawer.Screen name={ROUTES.ANALYTICS} component={AnalyticsScreen}/>
            <Drawer.Screen name={ROUTES.DISCOVER} component={DiscoverScreen}/>
            <Drawer.Screen name={ROUTES.IMPORT} component={ImportScreen}/>
            <Drawer.Screen name={ROUTES.EXPORT} component={ExportScreen}/>
            <Drawer.Screen name={ROUTES.TRASH} component={TrashScreen}/>
            <Drawer.Screen name={ROUTES.SETTINGS} component={SettingsScreen}/>
            <Drawer.Screen name={ROUTES.HELP} component={HelpScreen}/>
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    outerPadding: {
        flex: 1,
        padding: 20,
        width: 211.5,
    },
    sidebarBox: {
        flex: 1,
        borderRadius: 15,

    },
    logoArea: {
        paddingHorizontal: 0,
        paddingBottom: 15,
        // paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menuArea: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        justifyContent: 'space-between',
    },
    upperGroup: {
        gap: 20,
    },
    lowerGroup: {
        gap: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeBarWrapper: {
        position: 'absolute',
        left: -26,
    },
    iconWrapper: {
        width: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});