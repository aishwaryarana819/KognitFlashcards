import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {getTypography} from '../theme/typography';
import {lightPalette} from '../theme/colors';

export interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({visible, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel}: ConfirmModalProps) => {
    const {activePalette, isDark} = useTheme();
    const {width} = useWindowDimensions();
    const typography = getTypography(width);

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}/>
                <View style={[
                    styles.modalContainer,
                    {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest},
                    Platform.OS === 'web' && ({
                        backdropFilter: 'blur(20px)',
                        WebKitBackdropFilter: 'blur(20px)',
                    } as any)
                ]}>
                    <Text style={{
                        fontFamily: typography.fontFamilies.main,
                        fontSize: typography.fontSizes.heading,
                        fontWeight: 'bold',
                        color: activePalette.darkest,
                        marginBottom: 12
                    }}>
                        {title}
                    </Text>

                    <Text style={{
                        fontFamily: typography.fontFamilies.secondary,
                        fontSize: typography.fontSizes.bodyS,
                        color: activePalette.regular,
                        marginBottom: 24,
                        lineHeight: 22
                    }}>
                        {message}
                    </Text>

                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor: isDark ? activePalette.bg : activePalette.bg2}]} onPress={onCancel}>
                            <Text style={{fontFamily: typography.fontFamilies.main, color: activePalette.regular, fontWeight: 'bold'}}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, {backgroundColor: activePalette.red}]} onPress={onConfirm}>
                            <Text style={{fontFamily: typography.fontFamilies.main, color: activePalette.bg, fontWeight: 'bold'}}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContainer: { width: '85%', maxWidth: 400, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 }
});
