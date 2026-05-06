import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, DeviceEventEmitter} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LibraryStackParamList } from '../navigation/NavigationTypes';
import { ROUTES } from '../navigation/routes';
import { useAuth } from '../context/AuthContext';
import { AddCard } from '../modals/AddCard';
import { ConfirmModal } from '../modals/ConfirmModal';
import { getTypography } from '../theme/typography';
import { useWindowDimensions } from 'react-native';

type DeckDetailRouteProp = RouteProp<LibraryStackParamList, typeof ROUTES.DECK_DETAIL>;

export const DeckDetail = () => {
    const { activePalette, isDark } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<DeckDetailRouteProp>();
    const { deckId, deckName, colorHex } = route.params;
    const { session } = useAuth();
    const { width } = useWindowDimensions();
    const typography = getTypography(width);

    const [cards, setCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [editingCard, setEditingCard] = useState<any>(null);
    const [deletingCard, setDeletingCard] = useState<any>(null);

    const fetchCards = React.useCallback(async () => {
        if (!session?.access_token) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/cards/?deck_id=${deckId}`, {
                headers: {'Authorization': `Bearer ${session.access_token}`}
            });
            if (res.ok) {
                const data = await res.json();
                setCards(Array.isArray(data) ? data : (data.results || []));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [deckId, session]);

    useEffect(() => {
        fetchCards();
        const sub = DeviceEventEmitter.addListener('library_updated', fetchCards);
        return () => sub.remove();
    }, [fetchCards]);


    const handleSubmitCard = async (data: any) => {
        try {
            const isEditing = !!editingCard;
            const url = isEditing
                ? `http://127.0.0.1:8000/api/cards/${editingCard.id}/`
                : 'http://127.0.0.1:8000/api/cards/';
            const method = isEditing ? 'PUT' : 'POST';

            const payload = isEditing ? data : { ...data, deck_ids: [deckId] };

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setEditingCard(null);
                fetchCards();
            } else {
                alert(`Error: ${await res.text()}`);
            }
        } catch (e: any) {
            alert(`Network Error: ${e.message}`);
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
            } else {
                alert(`Error: ${await res.text()}`);
            }
        } catch (e: any) {
            alert(`Network Error: ${e.message}`);
        }
    };

    const renderCardItem = ({item}: {item: any}) => (
        <View style={[styles.cardRow, {backgroundColor: isDark ? activePalette.bg2 : activePalette.fg, borderColor: activePalette.bg2}]}>
            <View style={{flex: 1, paddingRight: 12}}>
                <Text style={{color: activePalette.darkest, fontFamily: typography.fontFamilies.main, fontSize: 16, fontWeight: 'bold', marginBottom: 4}} numberOfLines={1}>{item.front}</Text>
                <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary}} numberOfLines={2}>{item.back}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <View style={[styles.typeBadge, {backgroundColor: activePalette.darker + '20'}]}>
                    <Text style={{color: activePalette.darker, fontSize: 10, fontWeight: 'bold'}}>{item.card_type.toUpperCase()}</Text>
                </View>
                <TouchableOpacity onPress={() => { setEditingCard(item); setIsAddModalOpen(true); }} style={styles.actionBtn}>
                    <Ionicons name="create-outline" size={18} color={activePalette.darkest}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeletingCard(item)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={18} color={activePalette.red}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={activePalette.darkest} />
                </TouchableOpacity>
                <View style={[styles.iconBox, { backgroundColor: colorHex + '20' }]}>
                    <Ionicons name="albums" size={20} color={colorHex} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: typography.fontFamilies.main, color: activePalette.darkest }}>{deckName}</Text>
            </View>

            {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100}}>
                    <ActivityIndicator size="large" color={activePalette.darker} />
                </View>
            ) : (
                <FlatList
                    data={cards}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{padding: 20, paddingBottom: 100}}
                    renderItem={renderCardItem}
                    ListEmptyComponent={
                        <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary, textAlign: 'center', marginTop: 40}}>
                            No cards here yet. Tap the + button to create one!
                        </Text>
                    }
                />
            )}

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

// Written using AI
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
    backBtn: { padding: 4 },
    iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardRow: { padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
    actionBtn: { padding: 4 },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }
});
