import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTypography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import ScratchPen from '../../../assets/icons/scratchpen.svg';

export const Scratchpad = ({ fillHeight }: { fillHeight?: boolean }) => {
    const { activePalette, isDark } = useTheme();
    const { session } = useAuth();
    const { width } = useWindowDimensions();
    const typography = getTypography(width);
    const shadowColor = isDark ? '#A9A9A9' : '#000000';

    const [notes, setNotes] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const API = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const headers = {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
    };

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const fetchNotes = useCallback(async () => {
        if (!session?.access_token) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/scratch-notes/`, { headers });
            if (res.ok) {
                const data = await res.json();
                setNotes(data.results || []);
            }
        } catch (e) {
            console.error('Failed to fetch scratch notes', e);
        } finally {
            setIsFirstLoad(false);
        }
    }, [session]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSave = async () => {
        if (!inputText.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API}/api/scratch-notes/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ content: inputText.trim() }),
            });
            if (res.ok) {
                setInputText('');
                fetchNotes();
            }
        } catch (e) {
            console.error('Failed to save note', e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`${API}/api/scratch-notes/${id}/`, {
                method: 'DELETE',
                headers,
            });
            fetchNotes();
        } catch (e) {
            console.error('Failed to delete note', e);
        }
    };

    const handleConvertToCard = (noteContent: string) => {
        DeviceEventEmitter.emit('open_add_card', {
            initialData: {
                front: noteContent,
                back: '',
                card_type: 'basic',
            }
        });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear().toString().slice(-2);
        const hours = d.getHours();
        const mins = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const h = hours % 12 || 12;
        return `${day}/${month}/${year} ${h}:${mins}${ampm}`;
    };

    return (
        <View style={[styles.card, {
            backgroundColor: activePalette.bg,
            shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
            ...(fillHeight ? {flex: 1} : {height: 340}),
        }]}>
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={styles.toggleRow}
            >
                <View style={{ flex: 1 }} />
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.caption,
                    color: activePalette.regular,
                }}>
                    {expanded ? 'Collapse <' : 'View Saved >'}
                </Text>
            </TouchableOpacity>

            {expanded ? (
                <ScrollView
                    style={{ flex: 1, marginTop: 12 }}
                    showsVerticalScrollIndicator={false}
                >
                    {isFirstLoad ? (
                        <ActivityIndicator color={activePalette.regular} style={{ marginTop: 80 }} />
                    ) : notes.length === 0 ? (
                        <Text style={{
                            fontFamily: typography.fontFamilies.main,
                            fontSize: typography.fontSizes.bodyS,
                            color: activePalette.regular,
                            textAlign: 'center',
                            marginTop: 20,
                            opacity: 0.7,
                        }}>
                            No saved notes yet.
                        </Text>
                    ) : (
                        notes.map((note, idx) => (
                            <View key={note.id} style={[styles.noteItem, {
                                borderBottomColor: activePalette.darkest,
                                borderBottomWidth: idx < notes.length - 1 ? 0.5 : 0,
                            }]}>
                                <Text style={{
                                    fontFamily: typography.fontFamilies.main,
                                    fontSize: typography.fontSizes.bodyS,
                                    color: activePalette.darkest,
                                    marginBottom: 6,
                                }} numberOfLines={3}>
                                    {idx + 1}. {note.content}
                                </Text>
                                <View style={styles.noteActions}>
                                    <Text style={{
                                        fontFamily: typography.fontFamilies.secondary,
                                        fontSize: typography.fontSizes.caption,
                                        color: activePalette.regular,
                                    }}>
                                        {formatDate(note.created_at)}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => handleConvertToCard(note.content)}
                                            style={[styles.convertBtn, { borderColor: activePalette.darker }]}
                                        >
                                            <Text style={{
                                                fontFamily: typography.fontFamilies.secondary,
                                                fontSize: typography.fontSizes.caption,
                                                color: activePalette.darker,
                                                fontWeight: '600',
                                            }}>
                                                Convert to Card
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(note.id)}>
                                            <Ionicons name="trash-outline" size={18} color={activePalette.red} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            ) : (
                <View style={styles.placeholderContainer}>
                    <View style={styles.placeholderContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ScratchPen width={80} height={80} style={{ marginRight: 25, opacity: 0.25 }} />
                            <View>
                                {/* @ts-ignore */}
                                <Text style={{
                                    fontFamily: typography.fontFamilies.handwritten,
                                    fontSize: typography.fontSizes.heroS,
                                    color: activePalette.darkest,
                                    opacity: 0.1,
                                }}>
                                    A Sanctuary For{'\n'}Scattered Memory
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <View style={[styles.inputRow, {
                borderTopColor: activePalette.darkest,
                borderTopWidth: 0.5,
                // @ts-ignore
                borderTopOpacity: 0.2,
            }]}>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: activePalette.bg2,
                        color: activePalette.darkest,
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.bodyS,
                    }]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Jot down a thought..."
                    placeholderTextColor={activePalette.regular + '80'}
                    multiline
                    onSubmitEditing={handleSave}
                />
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!inputText.trim() || isSaving}
                    style={[styles.sendBtn, {
                        backgroundColor: activePalette.darkest,
                        opacity: inputText.trim() && !isSaving ? 1 : 0.4,
                    }]}
                >
                    <Ionicons name="arrow-up" size={18} color={activePalette.bg} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 20,
        width: '100%',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    placeholderContent: {
        alignItems: 'center',
    },
    noteItem: {
        paddingVertical: 12,
        opacity: 0.9,
    },
    noteActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    convertBtn: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    watermarkContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
        paddingTop: 16,
    },
    input: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        maxHeight: 80,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
