import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTypography } from '../../theme/typography';
import { lightPalette } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BREAKPOINTS } from '../../theme/breakpoints';

export const DeckStates = ({ states }: { states: any }) => {
    const { activePalette, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    if (!states || !states.mastered) return null;

    const renderCard = (title: string, data: any) => {
        const isPositive = data.trend >= 0;
        const trendIcon = isPositive ? 'arrow-up' : 'arrow-down';
        const trendColor = isPositive ? lightPalette.green : lightPalette.red;
        const absTrend = Math.abs(data.trend || 0);
        const shadowColor = isDark ? '#000000' : activePalette.darkest;

        return (
            <View key={title} style={[styles.card, {
                backgroundColor: activePalette.bg2,
                borderColor: activePalette.lighter,
                borderWidth: isDark ? 1 : 0,
                // shadowColor: shadowColor,
                // shadowOffset: { width: 0, height: 4 },
                // shadowOpacity: 0.2,
                // shadowRadius: 10,
                // elevation: 4,
                width: isMobile ? width*.5 : 220,
                flex: 1,
            }]}>
                {/* @ts-ignore */}
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.heading,
                    fontWeight: typography.fontWeights.bold,
                    color: activePalette.darkest,
                    marginBottom: 4
                }}>
                    {title}
                </Text>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyS,
                    color: activePalette.regular,
                    marginBottom: 16
                }}>
                    Last 30 Days
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        {/* @ts-ignore */}
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: 36,
                            fontWeight: typography.fontWeights.bold,
                            color: activePalette.darkest,
                            marginRight: 6
                        }}>
                            {data.count}
                        </Text>
                        <Text style={{
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.bodyS,
                            color: activePalette.regular
                        }}>
                            Cards
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons name={trendIcon} size={16} color={trendColor} style={{ marginRight: 2 }} />
                        {/* @ts-ignore */}
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: typography.fontSizes.bodyL,
                            fontWeight: typography.fontWeights.bold,
                            color: trendColor
                        }}>
                            {absTrend}%
                        </Text>
                    </View>
                </View>

                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: activePalette.darkest, opacity: 0.2, marginBottom: 16 }} />

                <View style={styles.statRow}>
                    <Text style={{ fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyS, color: activePalette.regular }}>
                        Avg. Interval
                    </Text>
                    <Text style={{ fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyS, color: activePalette.darkest, fontWeight: '600' }}>
                        {data.avg_interval}
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={{ fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyS, color: activePalette.regular }}>
                        Avg. Card Age
                    </Text>
                    <Text style={{ fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyS, color: activePalette.darkest, fontWeight: '600' }}>
                        {data.avg_age}
                    </Text>
                </View>
            </View>
        );
    };

    const content = [
        renderCard("Mastered", states.mastered),
        renderCard("Learning", states.learning),
        renderCard("New", states.new)
    ];

    const shadowColor = isDark ? "#A9A9A9" : "#000000";

    // if (isMobile) {
    //     return (
    //         <ScrollView
    //             horizontal
    //             showsHorizontalScrollIndicator={false}
    //             contentContainerStyle={{ paddingHorizontal: 4, gap: 16, paddingVertical: 10 }}
    //             snapToInterval={(width * 0.75) + 16}
    //             decelerationRate="fast"
    //             style={{ width: '100%', marginHorizontal: -4 }}
    //         >
    //             {content}
    //         </ScrollView>
    //     );
    // }

    return (
        <View style={[styles.parentContainer, {
            backgroundColor: activePalette.bg,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
            flex: isMobile ? undefined : 1,
        }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{gap: 15, flexGrow: 1, justifyContent: isMobile ? 'flex-start' : 'space-between'}}
                        decelerationRate="fast" snapToInterval={isMobile ? (width * 0.75) + 15 : 236}
            >
                {content}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    parentContainer: {
        borderRadius: 15,
        padding: 20,
        width: '100%',
    },
    card: {
        borderRadius: 15,
        padding: 15,
        justifyContent: 'space-between',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    }
});
