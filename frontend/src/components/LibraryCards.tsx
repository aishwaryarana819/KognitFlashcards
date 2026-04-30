import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTypography } from '../theme/typography';
import { lightPalette } from '../theme/colors';
import {BREAKPOINTS} from "../theme/breakpoints";

export interface ShelfCardProps {
    name: string;
    deckCount: number;
    colorHex: string;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewMode?: 'grid' | 'list',
}

interface DeckCardProps {
    name: string;
    cardCount: number;
    dueCount: number;
    colorHex: string;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewMode?: 'grid' | 'list';  // Add this line
}

export const ShelfCard = (
    { name, deckCount, colorHex, onPress, onEdit, onDelete, viewMode='list' }: ShelfCardProps) => {
    const { activePalette, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const typography = getTypography(width);

    const cardBg = isMobile
        ? (isDark ? activePalette.bg2 : activePalette.bg)
        : activePalette.fg;

    const isGrid = viewMode === 'grid';
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardBase, { backgroundColor: cardBg }]}
        >
            <View style={[
                styles.colorBar,
                { backgroundColor: colorHex },
                isGrid && { width: '100%', height: 6, right: 0, bottom: 'auto' }
            ]} />

            <View style={[styles.cardContent, isGrid && { flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 0, paddingTop: 10 }]}>

                <View style={[styles.iconBox, { backgroundColor: colorHex + '20' }, isGrid && { marginBottom: 16 }]}>
                    <Ionicons name="folder-open" size={isGrid ? 20 : 24} color={colorHex} />
                </View>

                <View style={[styles.textStack, isGrid && { marginLeft: 0, marginRight: 0, marginBottom: 12 }]}>
                    {/* @ts-ignore */}
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: isGrid ? typography.fontSizes.bodyS : typography.fontSizes.bodyL,
                        fontWeight: 'bold',
                        color: activePalette.darkest
                    }} numberOfLines={isGrid ? 2 : 1}>
                        {name}
                    </Text>
                    <Text style={{
                        fontFamily: typography.fontFamilies.secondary,
                        fontSize: typography.fontSizes.caption,
                        color: activePalette.regular,
                        marginTop: 4
                    }}>
                        {deckCount} {deckCount === 1 ? 'Deck' : 'Decks'}
                    </Text>
                </View>

                {!isGrid && <Ionicons name="chevron-forward" size={20} color={activePalette.regular} />}

                <View style={{
                    flexDirection: isGrid ? 'column' : 'row',
                    gap: isGrid ? 6 : 8,
                    position: isGrid ? 'absolute' : 'relative',
                    right: isGrid ? 0 : 0,
                    top: isGrid ? 12 : 0,
                }}>
                    {onEdit && (
                        <TouchableOpacity activeOpacity={0.6} style={{padding: 8}} onPress={onEdit}>
                            <Ionicons name="create-outline" size={18} color={activePalette.darkest}/>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity activeOpacity={0.6} style={{padding: 8}} onPress={onDelete}>
                            <Ionicons name="trash-outline" size={18} color={activePalette.red}/>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

interface DeckCardProps {
    name: string;
    cardCount: number;
    dueCount: number;
    colorHex: string;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const DeckCard = ({ name, cardCount, dueCount, colorHex, onPress, onEdit, onDelete, viewMode='list' }: DeckCardProps) => {
    const { activePalette, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const typography = getTypography(width);

    const isGrid = viewMode === 'grid';

    const cardBg = isMobile
        ? (isDark ? activePalette.bg2 : activePalette.bg)
        : activePalette.fg;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardBase, { backgroundColor: cardBg, flexDirection: 'column' }]}
        >
            <View style={styles.deckHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <View style={[styles.iconBox, { backgroundColor: colorHex + '20', width: 36, height: 36, borderRadius: 12 }]}>
                        <Ionicons name="albums" size={18} color={colorHex} />
                    </View>
                    {dueCount > 0 && (
                        <View style={[styles.dueBadge, { backgroundColor: activePalette.red + '20' }]}>
                            {/* @ts-ignore */}
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.micro,
                                fontWeight: typography.fontWeights.bold,
                                color: activePalette.red
                            }}>
                                {dueCount} Due
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{flexDirection: isGrid ? 'column' : 'row', gap: 4}}>
                    {onEdit && (
                        <TouchableOpacity activeOpacity={0.6} style={{padding: 4}} onPress={onEdit}>
                            <Ionicons name="create-outline" size={18} color={activePalette.darkest}/>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity activeOpacity={0.6} style={{padding: 4}} onPress={onDelete}>
                            <Ionicons name="trash-outline" size={18} color={activePalette.red}/>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            <View style={{ marginTop: 16 }}>
                {/* @ts-ignore */}
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.bodyL,
                    fontWeight: typography.fontWeights.bold,
                    color: activePalette.darkest
                }} numberOfLines={2}>
                    {name}
                </Text>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.caption,
                    color: activePalette.regular,
                    marginTop: 6
                }}>
                    {cardCount} Total Cards
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardBase: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        padding: 20,
    },
    colorBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 6,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 6,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStack: {
        flex: 1,
        marginLeft: 16,
        marginRight: 12,
    },
    deckHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    dueBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    }
});
