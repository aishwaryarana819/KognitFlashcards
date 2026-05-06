import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Platform, useWindowDimensions, Modal} from "react-native";
import {useTheme} from '../context/ThemeContext';
import {getInnerShadow} from "../theme/shadows";
import {ROUTES} from './routes';

import {UnderConstruction} from "../screens/UnderConstruction";
import {getTypography} from "../theme/typography";
import {MainContentContainer} from "../components/MainContentContainer";

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

import {LibraryStack} from "./LibraryStack";
import {Dashboard} from "../screens/Dashboard";

const TAB_ICONS: Record<string, React.FC<any>> = {
    [ROUTES.DASHBOARD]: DashboardIcon,
    [ROUTES.LIBRARY]: LibraryIcon,
    [ROUTES.ANALYTICS]: AnalyticsIcon,
    [ROUTES.DISCOVER]: DiscoverIcon,
    More: MoreIcon,
};

const DashboardScreen = () =>
    <MainContentContainer>
        <Dashboard/>
    </MainContentContainer>

const LibraryScreen = () => (
    <MainContentContainer>
        <LibraryStack/>
    </MainContentContainer>
);

const AnalyticsScreen = () =>
    <MainContentContainer>
        <UnderConstruction title="Analytics" message="Coming soon."/>
    </MainContentContainer>
const DiscoverScreen = () =>
    <MainContentContainer>
        <UnderConstruction title="Discover" message="Coming soon."/>
    </MainContentContainer>
const MoreScreen = ({route}: any) => (
    <MainContentContainer>
        <UnderConstruction title={route?.params?.title || 'More'} message="Coming soon."/>
    </MainContentContainer>
);

const DRAWER_ITEMS = [
    {icon: ImportIcon, label: 'Import'},
    {icon: ExportIcon, label: 'Export'},
    {icon: TrashIcon, label: 'Trash'},
    {icon: SettingsIcon, label: 'Settings'},
    {icon: HelpIcon, label: 'Help'},
];

const MoreDrawer = ({visible, onClose, onNavigate}: {visible: boolean; onClose: () => void; onNavigate: (label: string) => void}) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    if (!visible) return null;

    const row1 = DRAWER_ITEMS.slice(0, 3);
    const row2 = DRAWER_ITEMS.slice(3);

    return (
        <Modal transparent visible={visible} animationType="fade">
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
                                    onPress={() => onNavigate(item.label)}
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
                                    onPress={() => onNavigate(item.label)}
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
        </Modal>
    );
};

const ACTIVE_ICON_SIZE = 30;
const ACTIVE_CIRCLE_SIZE = 64;
const TAB_BAR_HEIGHT = 76;

const CustomTabBar = ({activeTab, onTabPress}: {
    activeTab: string;
    onTabPress: (tab: string) => void;
}) => {
    const {activePalette, isDark} = useTheme();
    const innerShadow = getInnerShadow(activePalette);

    const TAB_ORDER = [ROUTES.ANALYTICS, ROUTES.LIBRARY, ROUTES.DASHBOARD, ROUTES.DISCOVER, 'More'];

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
            {TAB_ORDER.map((tab) => {
                const isFocused = activeTab === tab;
                const IconComponent = TAB_ICONS[tab];

                if (isFocused) {
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabPress(tab)}
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
                        key={tab}
                        onPress={() => onTabPress(tab)}
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

export const BottomBar = ({initialRoute = ROUTES.DASHBOARD}: {initialRoute?: string}) => {
    const [showMore, setShowMore] = useState(false);
    const [activeTab, setActiveTab] = useState(initialRoute);
    const [moreTitle, setMoreTitle] = useState('More');

    const renderScreen = () => {
        switch (activeTab) {
            case ROUTES.DASHBOARD: return <DashboardScreen />;
            case ROUTES.LIBRARY: return <LibraryScreen />;
            case ROUTES.ANALYTICS: return <AnalyticsScreen />;
            case ROUTES.DISCOVER: return <DiscoverScreen />;
            case 'More': return (
                <MainContentContainer>
                    <UnderConstruction title={moreTitle} message="Coming soon." />
                </MainContentContainer>
            );
            default: return <DashboardScreen />;
        }
    };

    return (
        <View style={{flex: 1}}>
            {renderScreen()}
            <CustomTabBar
                activeTab={activeTab}
                onTabPress={(tab) => {
                    if (tab === 'More') {
                        setShowMore(prev => !prev);
                    } else {
                        setActiveTab(tab);
                        setShowMore(false);
                    }
                }}
            />
            <MoreDrawer
                visible={showMore}
                onClose={() => setShowMore(false)}
                onNavigate={(label: string) => {
                    setMoreTitle(label);
                    setActiveTab('More');
                    setShowMore(false);
                }}
            />
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



