import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from '../theme/typography';
import {BREAKPOINTS} from '../theme/breakpoints';
import {lightPalette} from '../theme/colors';
import {ShelfCard, DeckCard} from '../components/LibraryCards';
import {useAuth} from '../context/AuthContext';
import {AddShelf} from "../modals/AddShelf";
import {ConfirmModal} from "../modals/ConfirmModal";

export const Library = () => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const {session} = useAuth();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [shelves, setShelves] = useState<any[]>([]);
    const [decks, setDecks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddShelfVisible, setIsAddShelfVisible] = useState(false);
    const [editingShelf, setEditingShelf] = useState<any>(null);
    const [deletingShelf, setDeletingShelf] = useState<any>(null);

    const getColWidth = () => {
        if (viewMode === 'list') return '100%';
        if (width > BREAKPOINTS.DESKTOP_LARGE_MIN) return '23%';
        return isMobile ? '48%' : '31%';
    };

    useEffect(() => {
        const fetchLibraryData = async () => {
            if (!session?.access_token) return;
            try {
                const [shelvesRes, decksRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/shelves/', {
                        headers: {'Authorization': `Bearer ${session.access_token}`}
                    }),
                    fetch('http://127.0.0.1:8000/api/decks/', {
                        headers: {'Authorization': `Bearer ${session.access_token}`}
                    })
                ]);

                if (shelvesRes.ok && decksRes.ok) {
                    const sData = await shelvesRes.json();
                    const dData = await decksRes.json();

                    setShelves(Array.isArray(sData) ? sData : (sData.results || []));
                    setDecks(Array.isArray(dData) ? sData : (dData.results || []));
                }
            } catch (error) {
                console.error("Failed to fetch library data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLibraryData();
    }, [session]);

    const handleCreateShelf = async (data: any) => {
        try {
            // NOTE: Make sure this URL has the trailing slash / at the end!
            const res = await fetch('http://127.0.0.1:8000/api/shelves/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const newShelf = await res.json();
                setShelves(prev => [newShelf, ...prev]);
                setIsAddShelfVisible(false); // Close modal ONLY on success
            } else {
                // If Django rejects it, show the exact error!
                const errText = await res.text();
                alert(`Backend Error: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Network Error: Make sure Django server is running.\n${error.message}`);
        }
    };

    const handleDeleteShelf = async (shelfId: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/shelves/${shelfId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                }
            });

            if (res.ok) {
                setShelves(prev => prev.filter(s => s.id !== shelfId));
            } else {
                const errText = await res.text();
                alert(`Delete Failed: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    const handleEditShelf = async (data: any) => {
        if (!editingShelf) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/shelves/${editingShelf.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const updatedShelf = await res.json();
                setShelves(prev => prev.map(s => s.id === updatedShelf.id ? updatedShelf : s));
                setIsAddShelfVisible(false);
                setEditingShelf(null);
            } else {
                const errText = await res.text();
                alert(`Unable to edit: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerRow, {
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center'
            }]}>
                {/* @ts-ignore */}
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.heading,
                    fontWeight: typography.fontWeights.extrablack,
                    color: activePalette.darkest,
                }}>
                    Your Library
                </Text>

                <View style={[styles.controls, {marginTop: isMobile ? 12 : 0}]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.iconButton, {
                                backgroundColor: activePalette.darkest,
                                borderWidth: 1,
                                borderColor: activePalette.darkest,
                            }
                        ]}
                        onPress={() => setIsAddShelfVisible(true)}
                    >
                        <Ionicons name="add" size={20} color={activePalette.bg2}/>
                        <Text style={{
                            fontFamily: typography.fontFamilies.secondary,
                            color: activePalette.bg2,
                            marginLeft: 6,
                            fontWeight: typography.fontWeights.semibold,
                        }}>
                            New Shelf
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.iconButton, {
                                backgroundColor: isDark ? activePalette.bg : lightPalette.lightest,
                                borderWidth: 1,
                                borderColor: activePalette.darkest,
                            }
                        ]}>
                        <Ionicons name="filter" size={20} color={activePalette.darker}/>
                        <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.darker, marginLeft: 6, fontWeight: '700'}}>
                            Sort
                        </Text>
                    </TouchableOpacity>

                    <View style={
                        [styles.toggleGroup, {
                            backgroundColor: isDark ? activePalette.bg : lightPalette.lightest,
                            borderWidth: 1,
                            borderColor: activePalette.darkest,
                            }
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.toggleBtn, viewMode === 'grid' && {backgroundColor: activePalette.darkest}]}
                            onPress={() => setViewMode('grid')}
                        >
                            <Ionicons name="grid" size={18} color={viewMode === 'grid' ? activePalette.bg2 : activePalette.darker}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.toggleBtn, viewMode === 'list' && {backgroundColor: activePalette.darkest}]}
                            onPress={() => setViewMode('list')}
                        >
                            <Ionicons name="list" size={18} color={viewMode === 'list' ? activePalette.bg2 : activePalette.darker}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View style={[styles.contentArea, {justifyContent: 'center', alignItems: 'center'}]}>
                    <ActivityIndicator size="large" color={activePalette.darker} />
                </View>
            ) : (shelves.length === 0 && decks.length === 0) ? (
                <View style={styles.contentArea}>
                    <Text style={{
                        fontFamily: typography.fontFamilies.secondary,
                        color: activePalette.darker,
                        fontSize: typography.fontSizes.bodyL,
                        textAlign: 'center',
                        marginTop: 60,
                        opacity: 0.5,
                    }}>
                        You haven't created any shelves or decks yet.
                    </Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.contentArea}>
                    {shelves.length > 0 && (
                        <View style={{marginBottom: 30}}>
                            {/* @ts-ignore */}
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.button,
                                fontWeight: typography.fontWeights.bold,
                                color: activePalette.darker,
                                marginBottom: 16
                            }}>
                                Shelves
                            </Text>
                            <View style={[styles.gridWrap, {
                                flexDirection: viewMode === 'grid' ? 'row' : 'column',
                                flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap'
                            }]}>
                                {shelves.map(shelf => (
                                    <View key={`shelf-${shelf.id}`} style={{width: getColWidth()}}>
                                        <ShelfCard
                                            name={shelf.name}
                                            deckCount={shelf.deck_count || 0}
                                            colorHex={shelf.color}
                                            viewMode={viewMode}
                                            onPress={() => console.log('Open shelf', shelf.id)}
                                            onDelete={() => setDeletingShelf(shelf)}
                                            onEdit={() => {
                                                setEditingShelf(shelf);
                                                setIsAddShelfVisible(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {decks.length > 0 && (
                        <View style={{marginBottom: 30}}>
                            {/* @ts-ignore */}
                            <Text style={{
                                fontFamily: typography.fontFamilies.main,
                                fontSize: typography.fontSizes.button,
                                fontWeight: typography.fontWeights.bold,
                                color: activePalette.regular,
                                marginBottom: 16
                            }}>
                                Uncategorized Decks
                            </Text>
                            <View style={[styles.gridWrap, {
                                flexDirection: viewMode === 'grid' ? 'row' : 'column',
                                flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap'
                            }]}>
                                {decks.map(deck => {
                                    if (!deck.shelf_ids || deck.shelf_ids.length === 0) {
                                        return (
                                            <View key={`deck-${deck.id}`} style={{width: getColWidth()}}>
                                                <DeckCard
                                                    name={deck.name}
                                                    cardCount={deck.card_count || 0}
                                                    dueCount={0}
                                                    colorHex={deck.color}
                                                    onPress={() => console.log('Open deck', deck.id)}
                                                />
                                            </View>
                                        );
                                    }
                                    return null;
                                })}
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}

            <AddShelf
                visible={isAddShelfVisible}
                onClose={() => {
                    setIsAddShelfVisible(false);
                    setEditingShelf(null);
                }}
                initialData={editingShelf}
                onSubmit={editingShelf ? handleEditShelf : handleCreateShelf}
            />

            <ConfirmModal
                visible={!!deletingShelf}
                title="Delete Shelf"
                message={`Are you sure? All decks inside will become orphaned`}
                confirmText={"Delete"}
                onConfirm={() => {
                    if (deletingShelf) {
                        handleDeleteShelf(deletingShelf.id);
                        setDeletingShelf(null);
                    }
                }}
                onCancel={() => setDeletingShelf(null)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    toggleGroup: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
    },
    toggleBtn: {
        padding: 6,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    contentArea: {
        flex: 1,
    },
    gridWrap: {
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '2%',
    }
});
