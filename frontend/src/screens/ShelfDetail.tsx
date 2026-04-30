import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LibraryStackParamList } from '../navigation/NavigationTypes';
import { ROUTES } from '../navigation/routes';

type ShelfDetailRouteProp = RouteProp<LibraryStackParamList, typeof ROUTES.SHELF_DETAIL>;

export const ShelfDetail = () => {
    const { activePalette } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<ShelfDetailRouteProp>();
    const { shelfId, shelfName, colorHex } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: activePalette.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={activePalette.darkest} />
                </TouchableOpacity>
                <View style={[styles.iconBox, { backgroundColor: colorHex + '20' }]}>
                    <Ionicons name="folder-open" size={20} color={colorHex} />
                </View>
                <Text style={[styles.title, { color: activePalette.darkest }]}>{shelfName}</Text>
            </View>

            <View style={styles.content}>
                <Text style={{ color: activePalette.regular }}>
                    Decks for Shelf ID: {shelfId} will appear here.
                </Text>
            </View>
        </View>
    );
};

// Written using AI
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
    backBtn: { padding: 4 },
    iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }
});
