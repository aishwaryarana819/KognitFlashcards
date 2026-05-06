import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTypography } from '../../theme/typography';
import Svg, { Circle, Defs, LinearGradient, Stop, Filter, FeDropShadow } from 'react-native-svg';
import {BREAKPOINTS} from "../../theme/breakpoints";

export const TodayAtGlance = ({ data, deckStates }: { data: any, deckStates?: any }) => {
    const { activePalette, isDark } = useTheme();
    const shadowColor = isDark ? '#A9A9A9A9' : '#000000';
    const { width } = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    const goal = data?.daily_goal ?? 0;
    const reviewed = data?.reviewed || 0;
    const progress = goal > 0 ? Math.min(reviewed / goal, 1) : 0;

    const size = 160;
    const bottomStrokeWidth = 20;
    const topStrokeWidth = 24;
    const radius = (size - topStrokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress * circumference);

    const renderStatRow = (label: string, value: string | number) => (
        <View style={styles.statRow}>
            {/* @ts-ignore */}
            <Text style={{
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.bodyS,
                color: activePalette.darkest,
                fontWeight: typography.fontWeights.thin,
                flexShrink: 0,
            }}>
                {label}
            </Text>
            {/* @ts-ignore */}
            <Text style={{
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.bodyL,
                fontWeight: typography.fontWeights.bold,
                color: activePalette.darkest,
                textAlign: 'right',
            }}>
                {value}
            </Text>
        </View>
    );


    return (
        <View style={[styles.card, {
            backgroundColor: activePalette.bg,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
            width: '100%',
            flex: isMobile ? undefined : 1,
        }]}>
            {/* @ts-ignore */}
            <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.heading, fontWeight: typography.fontWeights.bold, color: activePalette.darkest, marginBottom: 12 }}>
                Today at a Glance
            </Text>

            <View style={{ height: 0.5, backgroundColor: activePalette.darkest, opacity: 0.3, marginBottom: 20 }} />

            <View style={styles.content}>
                <View style={styles.ringContainer}>
                    <Svg width={size} height={size} style={{overflow: 'visible'}}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor={activePalette.regular} />
                                <Stop offset="100%" stopColor={activePalette.darker} />
                            </LinearGradient>
                            <Filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <FeDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
                            </Filter>
                        </Defs>

                        <Circle
                            stroke="url(#grad)"
                            strokeOpacity={0.3}
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={bottomStrokeWidth}
                        />

                        <Circle
                            stroke="url(#grad)"
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={topStrokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${size/2} ${size/2})`}
                            filter="url(#dropShadow)"
                        />
                    </Svg>
                    <View style={styles.ringTextContainer}>
                        {/* @ts-ignore */}
                        <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: 28, fontWeight: typography.fontWeights.extrablack, color: activePalette.darkest }}>
                            {reviewed}/{goal}
                        </Text>
                    </View>
                </View>

                <View style={{ width: 0.5, height: 140, backgroundColor: activePalette.darkest, opacity: 0.3, marginHorizontal: 24 }} />

                <View style={styles.statsTable}>
                    {renderStatRow("New", deckStates?.new?.count || 0)}
                    {renderStatRow("Inaccuracy", data?.inaccuracy || 0)}
                    {renderStatRow("Mastered", deckStates?.mastered?.count || 0)}
                    {renderStatRow("Learning", deckStates?.learning?.count || 0)}
                    {renderStatRow("Time Spent", data?.time_spent || "0m")}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 20,
        // maxWidth: 400,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ringContainer: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsTable: {
        flex: 1,
        gap: 12,
        justifyContent: 'center',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 32,
    }
});
