import React, {useState, useEffect} from "react";
import {View, Alert, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, useWindowDimensions} from "react-native";
import {useTheme} from "../context/ThemeContext";
import {getTypography} from "../theme/typography";
import {Ionicons} from '@expo/vector-icons';
import {lightPalette} from "../theme/colors";

//  edited with AI
const SHELF_COLORS = [
    '#5D5FEF', // Indigo (Tech/General)
    '#10B981', // Emerald (Science/Nature)
    '#F43F5E', // Rose (Medical/Urgent)
    '#F59E0B', // Amber (History/Arts)
    '#8B5CF6', // Violet (Literature/Theory)
    '#0EA5E9', // Sky Blue (Mathematics)
    '#F97316', // Orange (Creativity/Design)
    '#14B8A6', // Teal (Languages)
    '#64748B', // Slate (Reference/Admin)
    '#DC2626', // Crimson (Law/Ethics)
    '#84CC16', // Lime (Health/Sports)
    '#D946EF', // Fuchsia (Music/Performing Arts)
    '#06B6D4', // Cyan (Economics/Business)
];

// edited with AI
const SHELF_ICONS = [
    'library', 'folder-open', 'book', 'layers',
    'grid', 'albums', 'cube', 'prism',
    'book',          // General Studies / Humanities
    'flask',         // Chemistry / Hard Sciences
    'calculator',    // Math / Physics / Finance
    'color-palette', // Arts / Design
    'code-slash',    // Computer Science / IT
    'globe',         // Geography / International Studies
    'musical-notes', // Music / Media
    'fitness',       // Health / Kinesiology
    'business',      // Economics / Management (New 1)
    'construct',     // Engineering / Lab work (New 2)
    'school',        // General Education / Campus (New 3)
    'calendar',      // Planning / Deadlines (New 4)
    'language',      // Linguistics / Translation (New 5)
    // --- Law ---
    'scales',        // Justice / Legal Systems
    'hammer',        // The Gavel / Litigation
    'briefcase',     // Professional Practice / Bar
    'document-lock', // Privacy / Intellectual Property
    // --- Biology ---
    'leaf',          // Botany / Ecology
    'medkit',        // Medicine / Healthcare
    'pulse',         // Physiology / Human Biology
    'bug',           // Entomology / Microbiology
];

interface AddShelfProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {name: string, description: string, color: string, icon: string}) => Promise<void>;
    initialData?: {id: number, name: string, description: string, color: string, icon: string} | null;
}

export const AddShelf = ({visible, onClose, onSubmit, initialData}: AddShelfProps) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedColor, setSelectedColor] = useState(SHELF_COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState(SHELF_ICONS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible && initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setSelectedColor(initialData.color || SHELF_COLORS[0]);
            setSelectedIcon(initialData.icon || SHELF_ICONS[0]);
        } else if (visible && !initialData) {
            setName('');
            setDescription('');
            setSelectedColor(SHELF_COLORS[0]);
            setSelectedIcon(SHELF_ICONS[0]);
        }
    }, [visible]);

    const handleCreate = async () => {
        if (!name.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                color: selectedColor,
                icon: selectedIcon
            });

            if (!initialData) {
                if (Platform.OS === 'web') {
                    window.alert("Yay! You created your first shelf. It will appear in the Library.");
                } else {
                    Alert.alert(
                        "First Shelf!!!",
                        "Yay! You created your first shelf. It will appear in the Library.",
                    );
                }
            }

            setName('');
            setDescription('');
            setSelectedColor(SHELF_COLORS[0]);
            setSelectedIcon(SHELF_ICONS[0]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType={"fade"} onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}/>
                <View style={[
                    styles.modalContainer,
                    {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest},
                    Platform.OS === 'web' && ({
                        backdropFilter: 'blur(20px)',
                        WebKitBackdropFilter: 'blur(20px)',
                    } as any)
                ]}>
                    <View style={styles.header}>
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: typography.fontSizes.button,
                            fontWeight: 'bold',
                            color: activePalette.darkest
                        }}>
                            { initialData ? "Edit Shelf" : "Create Shelf"}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={activePalette.regular}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{flexShrink: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: activePalette.darker,
                                    fontFamily: typography.fontFamilies.secondary
                                }]}>
                                Name
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? activePalette.bg : activePalette.bg2,
                                    color: activePalette.darkest,
                                    borderColor: activePalette.darker + '40',
                                }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Biology"
                                placeholderTextColor={activePalette.regular + '80'}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {color: activePalette.darker,
                                    fontFamily: typography.fontFamilies.secondary
                            }]}>
                                Description
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea, {
                                    backgroundColor: isDark ? activePalette.bg : activePalette.bg2,
                                    color: activePalette.darkest,
                                    borderColor: activePalette.darker + '40',
                                }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="What goes in this shelf?"
                                placeholderTextColor={activePalette.regular + '80'}
                                multiline
                                numberOfLines={5}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, {
                                color: activePalette.darker,
                                fontFamily: typography.fontFamilies.secondary
                            }]}>
                                Theme Color
                            </Text>
                            <View style={styles.selectorRow}>
                                {SHELF_COLORS.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedColor(color)}
                                        style={[styles.colorCircle,
                                            {backgroundColor: color},
                                            selectedColor === color &&
                                                {borderWidth: 3,
                                                borderColor: activePalette.darkest}
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {color: activePalette.darker,
                                fontFamily: typography.fontFamilies.secondary}
                            ]}>
                                Icon
                            </Text>
                            <View style={styles.selectorRow}>
                                {SHELF_ICONS.map(icons => (
                                    <TouchableOpacity
                                        key={icons}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedIcon(icons)}
                                        style={[
                                            styles.iconBox,
                                            {backgroundColor: isDark ? activePalette.bg : activePalette.bg2},
                                            selectedIcon === icons && {backgroundColor: activePalette.darker}
                                        ]}
                                    >
                                        {/* @ts-ignore */}
                                        <Ionicons name={selectedIcon === icons ? icons: `${icons}-outline`}
                                                  size={24}
                                                  color={selectedIcon === icons ? activePalette.bg2 : activePalette.regular}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.btn,
                                {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest}]}
                                onPress={onClose}
                        >
                            <Text style={{
                                color: activePalette.regular,
                                fontFamily: typography.fontFamilies.secondary,
                                fontWeight: 'bold'}}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.btn,
                                styles.primaryBtn,
                                {
                                    backgroundColor: activePalette.darkest,
                                    opacity: name.trim() && !isSubmitting ? 1 : 0.5
                                }]}
                            onPress={handleCreate}
                            disabled={!name.trim() || isSubmitting}
                        >
                            <Text style={{
                                color: activePalette.bg,
                                fontFamily: typography.fontFamilies.secondary,
                                fontWeight: 'bold'}}>
                                { isSubmitting ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Shelf")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 480,
        borderRadius: 24,
        overflow: 'hidden',
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    selectorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 24,
        borderTopWidth: 1,
        borderColor: 'rgba(150,150,150,0.1)',
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    primaryBtn: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    }
});