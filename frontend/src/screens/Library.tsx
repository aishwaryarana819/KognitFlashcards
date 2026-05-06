import React, {useState, useEffect} from 'react';
import {useNavigation} from "@react-navigation/native";
import {View, Text, DeviceEventEmitter, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from '../theme/typography';
import {BREAKPOINTS} from '../theme/breakpoints';
import {lightPalette} from '../theme/colors';
import {ShelfCard, DeckCard} from '../components/LibraryCards';
import {useAuth} from '../context/AuthContext';
import {AddShelf} from "../modals/AddShelf";
import {AddDeck} from "../modals/AddDeck";
import {AddCard} from "../modals/AddCard";
import {ConfirmModal} from "../modals/ConfirmModal";

export const Library = () => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;
    const {session} = useAuth();
    const navigation = useNavigation<any>();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [shelves, setShelves] = useState<any[]>([]);
    const [decks, setDecks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddShelfVisible, setIsAddShelfVisible] = useState(false);
    const [editingShelf, setEditingShelf] = useState<any>(null);
    const [deletingShelf, setDeletingShelf] = useState<any>(null);
    const [isAddDeckVisible, setIsAddDeckVisible] = useState(false);
    const [editingDeck, setEditingDeck] = useState<any>(null);
    const [deletingDeck, setDeletingDeck] = useState<any>(null);
    const [isAddCardVisible, setIsAddCardVisible] = useState(false);
    const [editingCard, setEditingCard] = useState<any>(null);
    const [defaultDeckId, setDefaultDeckId] = useState<number | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [deletingCard, setDeletingCard] = useState<any>(null);

    const [cards, setCards] = useState<any[]>([]);
    const [allCards, setAllCards] = useState<any[]>([]);

    const fetchLibraryData = React.useCallback(async () => {
        if (!session?.access_token) return;
        try {
            const [shelvesRes, decksRes, cardsRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/shelves/', { headers: {'Authorization': `Bearer ${session.access_token}`} }),
                fetch('http://127.0.0.1:8000/api/decks/', { headers: {'Authorization': `Bearer ${session.access_token}`} }),
                fetch('http://127.0.0.1:8000/api/cards/', { headers: {'Authorization': `Bearer ${session.access_token}`} })
            ]);

            if (shelvesRes.ok && decksRes.ok && cardsRes.ok) {
                const sData = await shelvesRes.json();
                const dData = await decksRes.json();
                const cData = await cardsRes.json();

                setShelves(Array.isArray(sData) ? sData : (sData.results || []));
                setDecks(Array.isArray(dData) ? dData : (dData.results || []));

                const allCardsData = Array.isArray(cData) ? cData : (cData.results || []);
                setAllCards(allCardsData);
                setCards(allCardsData.filter((c: any) => !c.deck_ids || c.deck_ids.length === 0));

            }
        } catch (error) {
            console.error("Failed to fetch library data: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [session]);


    useEffect(() => {
        fetchLibraryData();
    }, [fetchLibraryData]);

    useEffect(() => {
        const sub1 = DeviceEventEmitter.addListener('open_add_shelf', () => setIsAddShelfVisible(true));
        const sub2 = DeviceEventEmitter.addListener('open_add_deck', () => setIsAddDeckVisible(true));
        const sub3 = DeviceEventEmitter.addListener('open_add_card', (params) => {
            setEditingCard(params?.initialData || null);
            setDefaultDeckId(params?.deckId || null);
            setIsAddCardVisible(true);
        });
        return () => {
            sub1.remove();
            sub2.remove();
            sub3.remove();
        };
    }, []);

    const handleCreateShelf = async (data: any) => {
        try {
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
                setIsAddShelfVisible(false);
            } else {
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

    const handleCreateDeck = async (data: any) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/decks/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                await fetchLibraryData();
                setIsAddDeckVisible(false);
            } else {
                const errText = await res.text();
                alert(`Something went wrong: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Something went wrong: ${error.message}`);
        }
    };

    const handleEditDeck = async (data: any) => {
        if (!editingDeck) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/decks/${editingDeck.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                await fetchLibraryData();
                setIsAddDeckVisible(false);
                setEditingDeck(null);
            } else {
                const errText = await res.text();
                alert(`Unable to edit: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    const handleDeleteDeck = async (deckId: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/decks/${deckId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                }
            });

            if (res.ok) {
                setDecks(prev => prev.filter(d => d.id !== deckId));
            } else {
                const errText = await res.text();
                alert(`Delete Failed: ${res.status}\n${errText}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    const handleCreateCard = async (data: any) => {
        try {
            const isEditing = !!editingCard;
            const url = isEditing
                ? `http://127.0.0.1:8000/api/cards/${editingCard.id}/`
                : 'http://127.0.0.1:8000/api/cards/';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const newCard = await res.json();

                if (isEditing) {
                    setCards(prev => prev.map(c => c.id === newCard.id ? newCard : c).filter(c => !c.deck_ids || c.deck_ids.length === 0));
                } else {
                    if (!newCard.deck_ids || newCard.deck_ids.length === 0) {
                        setCards(prev => [newCard, ...prev]);
                    }
                }

                DeviceEventEmitter.emit('library_updated');
                setIsAddCardVisible(false);
                setEditingCard(null);
            } else {
                alert(`Something went wrong: ${await res.text()}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/cards/${cardId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) {
                setCards(prev => prev.filter(c => c.id !== cardId));
                DeviceEventEmitter.emit('library_updated');
            } else {
                alert(`Delete Failed: ${await res.text()}`);
            }
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerRow, {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: isMobile ? 16 : 30,
            }]}>
                {/* @ts-ignore */}
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.heading,
                    fontWeight: typography.fontWeights.extrablack,
                    color: activePalette.darkest,
                    paddingTop: 8,
                }}>
                    Your Library
                </Text>

                <View style={[styles.controls, {marginTop: isMobile ? 12 : 0}]}>
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
                <View style={[styles.contentArea, {justifyContent: 'center', alignItems: 'center', paddingBottom: 150}]}>
                    <ActivityIndicator size="large" color={activePalette.darker} />
                </View>
            ) : (shelves.length === 0 && decks.length === 0 && cards.length === 0) ? (
                <View style={styles.contentArea}>
                    <Text style={{ fontFamily: typography.fontFamilies.secondary, color: activePalette.darker, fontSize: typography.fontSizes.bodyL, textAlign: 'center', marginTop: 150, opacity: 0.5}}>
                        Your library is empty. Click + New to get started!
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.contentArea} contentContainerStyle={{paddingBottom: isMobile ? 180 : 150}} showsVerticalScrollIndicator={false}>
                    {shelves.length > 0 && (
                        <View style={[styles.sectionContainer, {backgroundColor: isMobile ? activePalette.bg2 : activePalette.bg}]}>
                            <TouchableOpacity
                                style={[styles.sectionHeader, {paddingRight: 0}]}
                                onPress={() => setExpandedSection(expandedSection === 'shelves' ? null : 'shelves')}
                            >
                                {/* @ts-ignore */}
                                <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darker }}>Shelves</Text>
                                <Ionicons name={expandedSection === 'shelves' ? 'chevron-down' : 'chevron-forward'} size={20} color={activePalette.darker} />
                            </TouchableOpacity>
                            {expandedSection === 'shelves' ? (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16}}>
                                    {shelves.map(shelf => (
                                        <View key={`shelf-${shelf.id}`} style={{width: viewMode === 'grid' ? (isMobile ? '48%' : 220) : '100%'}}>
                                            <ShelfCard name={shelf.name} deckCount={shelf.deck_count || 0} colorHex={shelf.color}
                                                       viewMode={viewMode}
                                                       onPress={() => navigation.navigate('ShelfDetail', { shelfId: shelf.id, shelfName: shelf.name, colorHex: shelf.color })}
                                                       onDelete={() => setDeletingShelf(shelf)}
                                                       onEdit={() => { setEditingShelf(shelf); setIsAddShelfVisible(true); }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16}}>
                                    {shelves.map(shelf => (
                                        <View key={`shelf-${shelf.id}`} style={{width: viewMode === 'grid' ? (isMobile ? 140 : 220) : (isMobile ? 240 : 350)}}>
                                            <ShelfCard name={shelf.name} deckCount={shelf.deck_count || 0} colorHex={shelf.color}
                                                       viewMode={viewMode}
                                                       onPress={() => navigation.navigate('ShelfDetail', { shelfId: shelf.id, shelfName: shelf.name, colorHex: shelf.color })}
                                                       onDelete={() => setDeletingShelf(shelf)}
                                                       onEdit={() => { setEditingShelf(shelf); setIsAddShelfVisible(true); }}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    <View style={[styles.sectionContainer, {backgroundColor: isMobile ? activePalette.bg2 : activePalette.bg}]}>
                        <TouchableOpacity
                            style={[styles.sectionHeader, {paddingRight: 0}]}
                            onPress={() => setExpandedSection(expandedSection === 'decks' ? null : 'decks')}
                        >
                            {/* @ts-ignore */}
                            <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darker }}>Uncategorized Decks</Text>
                            <Ionicons name={expandedSection === 'decks' ? 'chevron-down' : 'chevron-forward'} size={20} color={activePalette.darker} />
                        </TouchableOpacity>
                        {(() => {
                            const uncategorizedDecks = decks.filter(d => !d.shelf_ids || d.shelf_ids.length === 0);
                            if (uncategorizedDecks.length === 0) {
                                return <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary, marginTop: 10, fontStyle: 'italic'}}>No uncategorized decks.</Text>;
                            }
                            return expandedSection === 'decks' ? (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16}}>
                                    {uncategorizedDecks.map(deck => (
                                        <View key={`deck-${deck.id}`} style={{width: viewMode === 'grid' ? (isMobile ? '48%' : 220) : '100%'}}>
                                            <DeckCard name={deck.name} cardCount={deck.card_count || 0} dueCount={0} colorHex={deck.color}
                                                      viewMode={viewMode}
                                                      onPress={() => navigation.navigate('DeckDetail', { deckId: deck.id, deckName: deck.name, colorHex: deck.color })}
                                                      onEdit={() => { setEditingDeck(deck); setIsAddDeckVisible(true); }}
                                                      onDelete={() => setDeletingDeck(deck)}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16}}>
                                    {uncategorizedDecks.map(deck => (
                                        <View key={`deck-${deck.id}`} style={{width: viewMode === 'grid' ? (isMobile ? 140 : 220) : (isMobile ? 240 : 350)}}>
                                            <DeckCard name={deck.name} cardCount={deck.card_count || 0} dueCount={0} colorHex={deck.color}
                                                      viewMode={viewMode}
                                                      onPress={() => navigation.navigate('DeckDetail', { deckId: deck.id, deckName: deck.name, colorHex: deck.color })}
                                                      onEdit={() => { setEditingDeck(deck); setIsAddDeckVisible(true); }}
                                                      onDelete={() => setDeletingDeck(deck)}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            );
                        })()}
                    </View>

                    {decks.length > 0 && (
                        <View style={[styles.sectionContainer, {backgroundColor: isMobile ? activePalette.bg2 : activePalette.bg}]}>
                            <TouchableOpacity
                                style={[styles.sectionHeader, {paddingRight: 0}]}
                                onPress={() => setExpandedSection(expandedSection === 'allDecks' ? null : 'allDecks')}
                            >
                                {/* @ts-ignore */}
                                <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darker }}>All Decks</Text>
                                <Ionicons name={expandedSection === 'allDecks' ? 'chevron-down' : 'chevron-forward'} size={20} color={activePalette.darker} />
                            </TouchableOpacity>
                            {expandedSection === 'allDecks' ? (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16}}>
                                    {decks.map(deck => (
                                        <View key={`alldeck-${deck.id}`} style={{width: viewMode === 'grid' ? (isMobile ? '48%' : 220) : '100%'}}>
                                            <DeckCard name={deck.name} cardCount={deck.card_count || 0} dueCount={0} colorHex={deck.color}
                                                      viewMode={viewMode}
                                                      onPress={() => navigation.navigate('DeckDetail', { deckId: deck.id, deckName: deck.name, colorHex: deck.color })}
                                                      onEdit={() => { setEditingDeck(deck); setIsAddDeckVisible(true); }}
                                                      onDelete={() => setDeletingDeck(deck)}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16}}>
                                    {decks.map(deck => (
                                        <View key={`alldeck-${deck.id}`} style={{width: viewMode === 'grid' ? (isMobile ? 140 : 220) : (isMobile ? 240 : 350)}}>
                                            <DeckCard name={deck.name} cardCount={deck.card_count || 0} dueCount={0} colorHex={deck.color}
                                                      viewMode={viewMode}
                                                      onPress={() => navigation.navigate('DeckDetail', { deckId: deck.id, deckName: deck.name, colorHex: deck.color })}
                                                      onEdit={() => { setEditingDeck(deck); setIsAddDeckVisible(true); }}
                                                      onDelete={() => setDeletingDeck(deck)}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    <View style={[styles.sectionContainer, {backgroundColor: isMobile ? activePalette.bg2 : activePalette.bg}]}>
                        <TouchableOpacity
                            style={[styles.sectionHeader, {paddingRight: 0}]}
                            onPress={() => setExpandedSection(expandedSection === 'cards' ? null : 'cards')}
                        >
                            {/* @ts-ignore */}
                            <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darker }}>Uncategorized Cards</Text>
                            <Ionicons name={expandedSection === 'cards' ? 'chevron-down' : 'chevron-forward'} size={20} color={activePalette.darker} />
                        </TouchableOpacity>
                        {cards.length === 0 ? (
                            <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary, marginTop: 10, fontStyle: 'italic'}}>No uncategorized cards.</Text>
                        ) : expandedSection === 'cards' ? (
                            <View style={{gap: 12}}>
                                {cards.map(card => (
                                    <View key={`card-${card.id}`} style={[styles.cardRow, {
                                        backgroundColor: activePalette.bg2,
                                    }]}>
                                        <View style={{flex: 1, paddingRight: 12}}>
                                            {/* @ts-ignore */}
                                            <Text style={{fontFamily: typography.fontFamilies.main, fontSize: 16, fontWeight: 'bold', color: activePalette.darkest, marginBottom: 4}} numberOfLines={1}>{card.front}</Text>
                                            <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}} numberOfLines={2}>{card.back}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                            <View style={{paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: activePalette.darker + '20'}}>
                                                <Text style={{color: activePalette.darker, fontSize: 10, fontWeight: 'bold'}}>{card.card_type.toUpperCase()}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => { setEditingCard(card); setIsAddCardVisible(true); }} style={{padding: 4}}>
                                                <Ionicons name="create-outline" size={18} color={activePalette.darkest}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setDeletingCard(card)} style={{padding: 4}}>
                                                <Ionicons name="trash-outline" size={18} color={activePalette.red}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12}}>
                                {cards.map(card => (
                                    <View key={`card-${card.id}`} style={{width: isMobile ? 140 : 200, padding: isMobile ? 12 : 16, borderRadius: 16, backgroundColor: isMobile ? activePalette.bg : activePalette.bg2}}>
                                        {/* @ts-ignore */}
                                        <Text style={{fontFamily: typography.fontFamilies.main, fontSize: 16, fontWeight: 'bold', color: activePalette.darkest, marginBottom: 4}} numberOfLines={1}>{card.front}</Text>
                                        <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}} numberOfLines={1}>{card.back}</Text>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
                                            <View style={{paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: activePalette.darker + '20'}}>
                                                <Text style={{color: activePalette.darker, fontSize: 10, fontWeight: 'bold'}}>{card.card_type.toUpperCase()}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', gap: 4}}>
                                                <TouchableOpacity onPress={() => { setEditingCard(card); setIsAddCardVisible(true); }} style={{padding: 4}}>
                                                    <Ionicons name="create-outline" size={16} color={activePalette.darkest}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setDeletingCard(card)} style={{padding: 4}}>
                                                    <Ionicons name="trash-outline" size={16} color={activePalette.red}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {allCards.length > 0 && (
                        <View style={[styles.sectionContainer, {backgroundColor: isMobile ? activePalette.bg2 : activePalette.bg}]}>
                            <TouchableOpacity
                                style={[styles.sectionHeader, {paddingRight: 0}]}
                                onPress={() => setExpandedSection(expandedSection === 'allCards' ? null : 'allCards')}
                            >
                                {/* @ts-ignore */}
                                <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darker }}>All Cards</Text>
                                <Ionicons name={expandedSection === 'allCards' ? 'chevron-down' : 'chevron-forward'} size={20} color={activePalette.darker} />
                            </TouchableOpacity>
                            {expandedSection === 'allCards' ? (
                                <View style={{gap: 12}}>
                                    {allCards.map(card => (
                                        <View key={`allcard-${card.id}`} style={[styles.cardRow, {backgroundColor: activePalette.bg2}]}>
                                            <View style={{flex: 1, paddingRight: 12}}>
                                                {/* @ts-ignore */}
                                                <Text style={{fontFamily: typography.fontFamilies.main, fontSize: 16, fontWeight: 'bold', color: activePalette.darkest, marginBottom: 4}} numberOfLines={1}>{card.front}</Text>
                                                <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}} numberOfLines={1}>{card.back}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                                <View style={{paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: activePalette.darker + '20'}}>
                                                    <Text style={{color: activePalette.darker, fontSize: 10, fontWeight: 'bold'}}>{card.card_type.toUpperCase()}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => { setEditingCard(card); setIsAddCardVisible(true); }} style={{padding: 4}}>
                                                    <Ionicons name="create-outline" size={18} color={activePalette.darkest}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setDeletingCard(card)} style={{padding: 4}}>
                                                    <Ionicons name="trash-outline" size={18} color={activePalette.red}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12}}>
                                    {allCards.map(card => (
                                        <View key={`allcard-${card.id}`} style={{width: isMobile ? 140 : 200, padding: isMobile ? 12 : 16, borderRadius: 16, backgroundColor: isMobile ? activePalette.bg : activePalette.bg2}}>
                                            {/* @ts-ignore */}
                                            <Text style={{fontFamily: typography.fontFamilies.main, fontSize: 16, fontWeight: 'bold', color: activePalette.darkest, marginBottom: 4}} numberOfLines={1}>{card.front}</Text>
                                            <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}} numberOfLines={1}>{card.back}</Text>
                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
                                                <View style={{paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: activePalette.darker + '20'}}>
                                                    <Text style={{color: activePalette.darker, fontSize: 10, fontWeight: 'bold'}}>{card.card_type.toUpperCase()}</Text>
                                                </View>
                                                <View style={{flexDirection: 'row', gap: 4}}>
                                                    <TouchableOpacity onPress={() => { setEditingCard(card); setIsAddCardVisible(true); }} style={{padding: 4}}>
                                                        <Ionicons name="create-outline" size={16} color={activePalette.darkest}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => setDeletingCard(card)} style={{padding: 4}}>
                                                        <Ionicons name="trash-outline" size={16} color={activePalette.red}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
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

            <AddDeck
                visible={isAddDeckVisible}
                onClose={() => {
                    setIsAddDeckVisible(false);
                    setEditingDeck(null);
                }}
                initialData={editingDeck}
                onSubmit={editingDeck ? handleEditDeck : handleCreateDeck}
                availableShelves={shelves}
            />

            <AddCard
                visible={isAddCardVisible}
                onClose={() => { setIsAddCardVisible(false); setEditingCard(null); }}
                onSubmit={handleCreateCard}
                initialData={editingCard}
                availableDecks={decks}
                defaultDeckId={defaultDeckId}
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

            <ConfirmModal
                visible={!!deletingDeck}
                title="Delete Deck"
                message={`Are you sure? This will soft-delete the deck and its cards. They can be restored from the Trash.`}
                confirmText={"Delete"}
                onConfirm={() => {
                    if (deletingDeck) {
                        handleDeleteDeck(deletingDeck.id);
                        setDeletingDeck(null);
                    }
                }}
                onCancel={() => setDeletingDeck(null)}
            />

            <ConfirmModal
                visible={!!deletingCard}
                title="Delete Card"
                message="Are you sure? This card will be soft-deleted and moved to the Trash."
                confirmText="Delete"
                onConfirm={() => {
                    if (deletingCard) {
                        handleDeleteCard(deletingCard.id);
                        setDeletingCard(null);
                    }
                }}
                onCancel={() => setDeletingCard(null)}
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
    cardRow: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingRight: 10
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
    },
    sectionContainer: {
        marginBottom: 24,
        padding: 20,
        borderRadius: 20,
    }
});
