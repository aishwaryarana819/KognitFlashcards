import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LibraryStackParamList } from '../navigation/NavigationTypes';
import { ROUTES } from '../navigation/routes';
import { useAuth } from '../context/AuthContext';
import { DeckCard } from '../components/LibraryCards';
import { getTypography } from '../theme/typography';
import { useWindowDimensions } from 'react-native';

type ShelfDetailRouteProp = RouteProp<LibraryStackParamList, typeof ROUTES.SHELF_DETAIL>;

export const ShelfDetail = () => {
    const { activePalette, isDark } = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<ShelfDetailRouteProp>();
    const { shelfId, shelfName, colorHex } = route.params;
    const { session } = useAuth();
    const { width } = useWindowDimensions();
    const typography = getTypography(width);

    const [decks, setDecks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDecks = async () => {
            if (!session?.access_token) return;
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/decks/?shelf_id=${shelfId}`, {
                    headers: {'Authorization': `Bearer ${session.access_token}`}
                });
                if (res.ok) {
                    const data = await res.json();
                    setDecks(Array.isArray(data) ? data : (data.results || []));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDecks();
    }, [shelfId, session]);

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={activePalette.darkest} />
                </TouchableOpacity>
                <View style={[styles.iconBox, { backgroundColor: colorHex + '20' }]}>
                    <Ionicons name="folder-open" size={20} color={colorHex} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: typography.fontFamilies.main, color: activePalette.darkest }}>{shelfName}</Text>
            </View>

            {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100}}>
                    <ActivityIndicator size="large" color={activePalette.darker} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20, paddingBottom: 100}}>
                    {decks.length === 0 ? (
                        <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary, textAlign: 'center', marginTop: 40}}>
                            No decks in this shelf yet.
                        </Text>
                    ) : (
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: '2%'}}>
                            {decks.map(deck => (
                                <View key={deck.id} style={{width: '48%', marginBottom: 16}}>
                                    <DeckCard
                                        name={deck.name}
                                        cardCount={deck.card_count || 0}
                                        dueCount={0}
                                        colorHex={deck.color}
                                        viewMode={'grid'}
                                        onPress={() => navigation.navigate('DeckDetail', {
                                            deckId: deck.id, deckName: deck.name, colorHex: deck.color,
                                        })}
                                        onEdit={() => {}}
                                        onDelete={() => {}}
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
    backBtn: { padding: 4 },
    iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
