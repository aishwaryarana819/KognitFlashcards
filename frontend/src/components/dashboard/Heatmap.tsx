import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTypography } from '../../theme/typography';
import { BREAKPOINTS } from '../../theme/breakpoints';

const QUOTES = [
    "A lifetime of knowledge to go.",
    "Keep the streak alive.",
    "Memory is a muscle. Flex it daily.",
    "One card at a time.",
    "The magic is in the repetition.",
    "Knowledge compounds. Keep investing.",
    "Progress, not perfection.",
    "One card closer to mastery.",
    "The secret weapon of top learners.",
    "Show up. Review. Repeat.",
    "A little review goes a long way.",
    "Today's effort is tomorrow's fluency.",
    "Neurons that fire together, wire together.",
    "Make the cards count.",
    "Learning never exhausts the mind.",
    "Review is reinforcement.",
    "Be patient. Mastery takes time.",
    "Compound your memory daily.",
    "The forgetting curve fears you.",
    "Smart people don't just learn — they review.",
    "You've got spaced repetition.",
    "Your future self is watching.",
    "The grind is temporary. Knowledge is permanent.",
    "Feed your brain. It's hungry.",
    "Stay curious. Stay consistent.",
    "Building something beautiful.",
    "The flame burns brightest with daily fuel.",
    "Train your memory. Don't wish for one.",
    "Don't break the chain.",
    "Small steps. Stunning results.",
    "Your brain grows stronger every session.",
    "Stack the days. Build the knowledge.",
    "Rewiring your brain, one card at a time.",
    "Consistency beats intensity.",
    "The only bad session is the skipped one.",
    "Every expert started with a streak of one.",
    "Embrace the grind.",
    "Your streak tells your story.",
    "What you review today, you keep tomorrow.",
    "Discipline over motivation.",
    "The results will follow.",
    "Each review is a brick in your palace.",
    "Forget forgetting.",
    "You're serious about learning.",
    "Strengthen the neural pathway.",
    "The best time to review is now.",
    "Keep going. You're building mastery.",
    "Dedication looks like this.",
    "Your memory is an investment.",
    "Sharp minds review daily.",
];

const sessionQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

const getHeatColor = (count: number, palette: any) => {
    if (count === 0) return { backgroundColor: palette.lightest, opacity: 0.5 };
    if (count <= 3) return { backgroundColor: palette.lighter, opacity: 0.5 };
    if (count <= 7) return { backgroundColor: palette.regular, opacity: 0.5 };
    if (count <= 14) return { backgroundColor: palette.darker, opacity: 0.5 };
    return { backgroundColor: palette.darkest, opacity: 0.5 };
};

export const Heatmap = ({ data, streak }: { data: any[], streak: any }) => {
    const { activePalette, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const shadowColor = isDark ? '#A9A9A9A9' : '#000000';

    const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
    const hoverTimer = React.useRef<any>(null);
    const gridRef = React.useRef<View>(null);

    const handleHoverIn = (day: { date: string; count: number }, event: any) => {
        hoverTimer.current = setTimeout(() => {
            const { pageX, pageY } = event.nativeEvent;
            setTooltip({ ...day, x: pageX, y: pageY });
        }, 1000);
    };

    const handleHoverOut = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setTooltip(null);
    };


    const heatmapData = data || [];
    const streakCount = streak?.current || 0;
    const isActive = streak?.is_active || false;

    const streakText = streakCount === 1 ? "one day" :
        streakCount < 10 ? ["zero","one","two","three","four","five","six","seven","eight","nine"][streakCount] + " days" :
            `${streakCount} days`;

    const quoteText = streakCount > 0
        ? `"${streakText.charAt(0).toUpperCase() + streakText.slice(1)} down.\n${sessionQuote}"`
        : `"${sessionQuote}"`;

    const blockGap = 8;
    const maxBlockSize = 40;
    const [gridWidth, setGridWidth] = useState(0);
    const COLS = gridWidth > 0 ? Math.floor((gridWidth + blockGap) / (maxBlockSize + blockGap)) : 7;
    const blockSize = gridWidth > 0 ? (gridWidth - (COLS - 1) * blockGap) / COLS : maxBlockSize;

    const rows: any[][] = [];
    for (let i = 0; i < heatmapData.length; i += COLS) {
        rows.push(heatmapData.slice(i, i + COLS));
    }

    return (
        <View style={[styles.card, {
            backgroundColor: activePalette.bg,
            shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
        }]}>
            <View style={styles.streakRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* @ts-ignore */}
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.heroR,
                        fontWeight: typography.fontWeights.extrablack,
                        color: activePalette.darkest,
                        marginRight: 8,
                    }}>
                        {streakCount}
                    </Text>
                    <Image
                        source={isActive
                            ? require('../../../assets/icons/fire-hot.png')
                            : require('../../../assets/icons/fire-cold.png')
                        }
                        style={{
                            width: typography.fontSizes.heroR,
                            height: typography.fontSizes.heroR,
                        }}
                        resizeMode="contain"
                    />
                </View>
                <View style={{
                    width: 0.5,
                    height: '80%',
                    backgroundColor: activePalette.darkest,
                    opacity: 0.2,
                    marginHorizontal: 16,
                }} />

                {/* @ts-ignore */}
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.bodyS,
                    color: activePalette.darkest,
                    opacity: 0.75,
                    flex: 1,
                    fontStyle: 'italic',
                    textAlign: 'right',
                }} numberOfLines={3}>
                    {quoteText}
                </Text>
            </View>

            <View style={{ height: 0.5, backgroundColor: activePalette.darkest, opacity: 0.2, marginVertical: 16 }} />

            <View style={{ position: 'relative' }}>
                <View onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
                      style={styles.gridContainer}>
                    {gridWidth > 0 && rows.map((row, rowIdx) => (
                        <View key={rowIdx} style={{ flexDirection: 'row', gap: blockGap, marginBottom: blockGap }}>
                            {row.map((day, colIdx) => {
                                const colors = getHeatColor(day.count, activePalette);
                                return (
                                    <Pressable
                                        key={day.date}
                                        onHoverIn={() => {
                                            hoverTimer.current = setTimeout(() => {
                                                let x = colIdx * (blockSize + blockGap);
                                                const y = rowIdx * (blockSize + blockGap);
                                                const tooltipWidth = 160;
                                                if (x + tooltipWidth > gridWidth)
                                                    x = gridWidth - tooltipWidth;
                                                setTooltip({ date: day.date, count: day.count, x, y });
                                            }, 1000);
                                        }}
                                        onHoverOut={handleHoverOut}
                                        style={[styles.block, {
                                            width: blockSize,
                                            height: blockSize,
                                            maxWidth: maxBlockSize,
                                            maxHeight: maxBlockSize,
                                            backgroundColor: colors.backgroundColor,
                                            opacity: colors.opacity,
                                            borderWidth: tooltip?.date === day.date ? 2 : 0,
                                            borderColor: activePalette.darkest,
                                        }]}
                                    />
                                );
                            })}
                        </View>
                    ))}
                </View>

                {tooltip && (
                    <View
                        style={{
                            position: 'absolute',
                            left: Math.max(0, tooltip.x),
                            top: tooltip.y - 28,
                            backgroundColor: activePalette.darkest,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 6,
                            zIndex: 999,
                            maxWidth: gridWidth,
                        }}
                        pointerEvents="none"
                    >
                        <Text style={{
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.caption,
                            color: activePalette.bg,
                            // @ts-ignore
                            whiteSpace: 'nowrap',
                        }}>
                            {tooltip.date} · {tooltip.count} review{tooltip.count !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* @ts-ignore */}
            <Text style={{
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.bodyS,
                color: activePalette.darkest,
                opacity: 0.5,
                marginTop: 16,
                textAlign: 'right',
            }}>
                Your 30-Days Memory Heatmap
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 20,
        width: '100%',
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridContainer: {
        width: '100%',
    },
    gridRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    block: {
        borderRadius: 8,
    },
    tooltip: {
        marginTop: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
});
