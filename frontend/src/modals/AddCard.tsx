import React, {useState} from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    StyleSheet,
    useWindowDimensions,
    Alert
} from "react-native";
import {useTheme} from "../context/ThemeContext";
import {getTypography} from "../theme/typography";
import {Ionicons} from '@expo/vector-icons';
import {lightPalette} from "../theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddCardProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {front: string, back: string, card_type: string, notes?: string, deck_ids: number[]}) => void;
    initialData?: any | null;
    availableDecks: any[];
    defaultDeckId?: number | null;
}

const CARD_TYPES = [
    { id: 'basic', label: 'Basic', icon: 'browsers-outline' },
    { id: 'reversed', label: 'Reversed', icon: 'swap-horizontal-outline' }
];

export const AddCard = ({visible, onClose, onSubmit, initialData, availableDecks, defaultDeckId}: AddCardProps) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    const [cardType, setCardType] = useState('basic');
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (visible && initialData) {
            setCardType(initialData.card_type || 'basic');
            setFront(initialData.front);
            setBack(initialData.back);
            setNotes(initialData.notes || '');
            setImageUrl(initialData.image_url || '');
            setSelectedDeckId(initialData.deck_ids?.[0] || null);
        } else if (visible && !initialData) {
            setCardType('basic');
            setFront('');
            setBack('');
            setNotes('');
            setImageUrl('');
            if (defaultDeckId) {
                setSelectedDeckId(defaultDeckId);
            } else {
                setSelectedDeckId(null); // Leave it unselected by default!
            }
        }
    }, [visible]);

    const handleCreate = async () => {
        if (!front.trim() || !back.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                front: front.trim(),
                back: back.trim(),
                card_type: cardType,
                notes: notes.trim(),
                deck_ids: selectedDeckId ? [selectedDeckId] : [],
            });
            if (!initialData) {
                const hasCreatedFirst = await AsyncStorage.getItem('hasCreatedFirstCard');
                if (!hasCreatedFirst) {
                    if (Platform.OS === 'web') {
                        window.alert("Yay! You created your first flashcard. It will appear in the Library.");
                    } else {
                        Alert.alert(
                            "First Flashcard!!!",
                            "Yay! You created your first flashcard. It will appear in the Library.",
                        );
                    }
                    await AsyncStorage.setItem('hasCreatedFirstCard', 'true');
                }
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}/>
                <View style={[
                    styles.modalContainer,
                    {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest},
                    Platform.OS === 'web' && ({ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } as any)
                ]}>
                    <View style={styles.header}>
                        <Text style={{ fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.button, fontWeight: 'bold', color: activePalette.darkest }}>
                            {initialData ? "Edit Card" : "Add New Card"}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={activePalette.regular}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{flexShrink: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {color: activePalette.darker, fontFamily: typography.fontFamilies.secondary}]}>Select Deck</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
                                {availableDecks && availableDecks.map(deck => {
                                    const isSelected = selectedDeckId === deck.id;
                                    return (
                                        <TouchableOpacity key={deck.id} activeOpacity={0.7} onPress={() => setSelectedDeckId(deck.id)}
                                                          style={[styles.typeChip, {backgroundColor: isSelected ? activePalette.darkest : (isDark ? activePalette.bg : activePalette.bg2)}, {borderColor: isSelected ? activePalette.darkest : activePalette.darker + '40'} ]}
                                        >
                                            <Ionicons name="albums" size={14} color={isSelected ? activePalette.bg2 : deck.color} style={{marginRight: 6}} />
                                            <Text style={{ fontFamily: typography.fontFamilies.secondary, color: isSelected ? activePalette.bg2 : activePalette.darker, fontWeight: isSelected ? 'bold' : 'normal' }}>
                                                {deck.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {color: activePalette.darker, fontFamily: typography.fontFamilies.secondary}]}>Card Type</Text>
                            <View style={styles.typeSelectorRow}>
                                {CARD_TYPES.map(type => {
                                    const isSelected = cardType === type.id;
                                    return (
                                        <TouchableOpacity key={type.id} activeOpacity={0.7} onPress={() => setCardType(type.id)}
                                                          style={[ styles.typeChip, {backgroundColor: isSelected ? activePalette.darkest : (isDark ? activePalette.bg : activePalette.bg2)}, {borderColor: isSelected ? activePalette.darkest : activePalette.darker + '40'} ]}
                                        >
                                            {/* @ts-ignore */}
                                            <Ionicons name={type.icon} size={16} color={isSelected ? activePalette.bg2 : activePalette.darker} style={{marginRight: 6}} />
                                            <Text style={{ fontFamily: typography.fontFamilies.secondary, color: isSelected ? activePalette.bg2 : activePalette.darker, fontWeight: isSelected ? 'bold' : 'normal' }}>{type.label}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {color: activePalette.darker, fontFamily: typography.fontFamilies.secondary}]}>Front</Text>
                            <TextInput style={[styles.input, styles.textArea, {backgroundColor: isDark ? activePalette.bg : activePalette.bg2, color: activePalette.darkest, borderColor: activePalette.darker + '40'}]} value={front} onChangeText={setFront} placeholder="What is the capital of France?" placeholderTextColor={activePalette.regular + '80'} multiline numberOfLines={3} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {color: activePalette.darker, fontFamily: typography.fontFamilies.secondary}]}>Back</Text>
                            <TextInput style={[styles.input, styles.textArea, {backgroundColor: isDark ? activePalette.bg : activePalette.bg2, color: activePalette.darkest, borderColor: activePalette.darker + '40'}]} value={back} onChangeText={setBack} placeholder="Paris" placeholderTextColor={activePalette.regular + '80'} multiline numberOfLines={3} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {color: activePalette.darker, fontFamily: typography.fontFamilies.secondary}]}>Extra Notes (Optional)</Text>
                            <TextInput style={[styles.input, styles.textArea, {height: 60, backgroundColor: isDark ? activePalette.bg : activePalette.bg2, color: activePalette.darkest, borderColor: activePalette.darker + '40'}]} value={notes} onChangeText={setNotes} placeholder="Mnemonic devices, tags, or extra context..." placeholderTextColor={activePalette.regular + '80'} multiline numberOfLines={2} />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest}]} onPress={onClose}>
                            <Text style={{color: activePalette.regular, fontFamily: typography.fontFamilies.secondary, fontWeight: 'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.primaryBtn, {backgroundColor: activePalette.darkest, opacity: front.trim() && back.trim() && !isSubmitting ? 1 : 0.5}]} onPress={handleCreate} disabled={!front.trim() || !back.trim() || isSubmitting}>
                            <Text style={{color: activePalette.bg, fontFamily: typography.fontFamilies.secondary, fontWeight: 'bold'}}>{isSubmitting ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Card")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContainer: { width: '90%', maxWidth: 480, borderRadius: 24, overflow: 'hidden', maxHeight: '85%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    closeBtn: { padding: 4 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 10 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
    typeSelectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
    input: { borderRadius: 12, padding: 16, borderWidth: 1, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: 24, borderTopWidth: 1, borderColor: 'rgba(150,150,150,0.1)' },
    btn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
    primaryBtn: { shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 }
});
