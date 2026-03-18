// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../utils/supabase'; // Import our secure database connection

export default function LoginScreen() {
    // 1. Core State Variables
    const [identifier, setIdentifier] = useState(''); // Holds whatever the user types (Email or Username)
    const [otp, setOtp] = useState(''); // Holds the 6-digit code from their email
    const [isOtpSent, setIsOtpSent] = useState(false); // Flags whether to show the Email input or OTP input
    const [loading, setLoading] = useState(false); // Disables buttons while network requests run

    // 2. The function triggered when "Send Login Code" is pressed
    const handleSendCode = async () => {
        if (!identifier) {
            Alert.alert('Error', 'Please enter your email or username');
            return;
        }

        setLoading(true);

        // 3. Smart Login Logic: If it contains '@', we treat it as an email.
        const isEmail = identifier.includes('@');

        if (isEmail) {
            // Send the magic OTP code to the provided email via Supabase
            const { error } = await supabase.auth.signInWithOtp({
                email: identifier,
            });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Success', 'Check your email for the login code!');
                setIsOtpSent(true); // Switch the UI to show the 6-digit OTP input box
            }
        } else {
            // 4. Temporary Username Fallback (Until our custom V2 Edge Functions are built)
            Alert.alert(
                'Coming Soon',
                'Username login will require our custom backend logic. For Phase 1, please log in using your Email!'
            );
        }

        setLoading(false);
    };

    // 5. The function triggered when "Login" is pressed after typing the OTP
    const handleVerifyOtp = async () => {
        setLoading(true);

        // Send the 6-digit code back to Supabase to verify
        const { error } = await supabase.auth.verifyOtp({
            email: identifier,
            token: otp,
            type: 'email',
        });

        if (error) {
            Alert.alert('Error', error.message);
        }
        // We do NOT need a navigation redirect here!
        // If successful, our global <AuthProvider> (set up in _layout.tsx)
        // will detect the session change and automatically teleport the user to the (tabs) Dashboard!

        setLoading(false);
    };

    return (
        // Outer wrapper handles light mode (bg-white) and dark mode (dark:bg-zinc-900) automatically
        <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-900 p-6">

            {/* App Title */}
            <Text className="text-3xl font-bold mb-8 text-black dark:text-white">
                Kognit Flashcards
            </Text>

            {/* Conditionally Render either the Email Input OR the OTP Input based on state */}
            {!isOtpSent ? (
                <View className="w-full max-w-sm">
                    <Text className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                        Email or Username
                    </Text>
                    <TextInput
                        className="w-full bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl mb-4 text-black dark:text-white"
                        placeholder="you@example.com"
                        placeholderTextColor="#888"
                        value={identifier}
                        onChangeText={setIdentifier}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        className="w-full bg-blue-600 p-4 rounded-xl items-center"
                        onPress={handleSendCode}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Sending...' : 'Send Login Code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="w-full max-w-sm">
                    <Text className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                        Enter 6-Digit Code
                    </Text>
                    <TextInput
                        className="w-full bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl mb-4 text-black dark:text-white"
                        placeholder="123456"
                        placeholderTextColor="#888"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                    />

                    <TouchableOpacity
                        className="w-full bg-green-600 p-4 rounded-xl items-center"
                        onPress={handleVerifyOtp}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Verifying...' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
