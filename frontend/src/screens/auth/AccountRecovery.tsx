import {useState, useRef, useEffect} from "react";
import {View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, TextInput, Pressable, Platform} from "react-native";
import {Ionicons} from '@expo/vector-icons';

import {useTheme} from "../../context/ThemeContext";
import {getTypography} from "../../theme/typography";
import {lightPalette} from "../../theme/colors";
import {AuthHeader} from "../../components/AuthHeader";

export const AccountRecovery = () => {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const {isDark, activePalette} = useTheme();

    const [step, setStep] = useState<'email' | 'otp' | 'newpassword' | 'success'>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const otpInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (step === 'otp') setTimeout(() => otpInputRef.current?.focus(), 100);
    }, [step]);

    useEffect(() => {
        if (password.length > 0 && password.length < 6) setPasswordError("Password must be at least 6 characters long.");
        else setPasswordError("");
    }, [password]);

    const calculateStrength = (pass: string) => {
        if (!pass) return 0;
        let entropy = 0;
        entropy += pass.length * 4;
        if (/[A-Z]/.test(pass)) entropy += 5;
        if (/[a-z]/.test(pass)) entropy += 5;
        if (/[0-9]/.test(pass)) entropy += 10;
        if (/[^A-Za-z0-9]/.test(pass)) entropy += 15;
        const repeats = pass.match(/(.)\1{2,}/g);
        if (repeats) repeats.forEach(r => {entropy -= r.length * 3;});
        if (/(012|123|234|345|456|567|678|789|890)/.test(pass)) entropy -= 15;
        if (/(qwe|wer|ert|asd|sdf|dfg|zxc|xcv)/i.test(pass)) entropy -= 15;
        if (entropy < 25) return 1;
        if (entropy < 45) return 2;
        if (entropy < 65) return 3;
        return 4;
    };

    const passStrength = calculateStrength(password);
    const passwordsMatch = password === confirmPassword;

    const renderEmailInput = () => (
        <View style={{width: '100%'}}>
            <Text style={[styles.subHeaderTitle, {
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.heading,
                color: activePalette.darkest
            }]}>
                Recover Your Account
            </Text>

            <Text style={{
                fontSize: typography.fontSizes.button, lineHeight: 24, marginBottom: 32,
                fontFamily: typography.fontFamilies.secondary, color: activePalette.regular
            }}>
                Enter your email address to get the reset code
            </Text>

            <View style={[styles.inputBlock, {
                backgroundColor: isDark ?
                    activePalette.bg : lightPalette.lightest,
                borderColor: activePalette.regular
            }]}>
                <Ionicons name="mail-outline" size={20} color={activePalette.darker}
                          style={{marginRight: 12}}/>
                <TextInput style={[styles.textInputCore, {
                    color: activePalette.darkest,
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyL
                }]}
                           placeholder="takaba@email.com"
                           placeholderTextColor={activePalette.regular}
                           value={email}
                           onChangeText={setEmail}
                           autoCapitalize="none"
                           autoCorrect={false}
                           keyboardType="email-address"
                           autoFocus
                />

                {!!emailError && (
                    <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                        marginTop: 8, fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                        {emailError}
                    </Text>
                )}
            </View>

            <TouchableOpacity style={[styles.submitButton, {
                backgroundColor: activePalette.darkest,
                marginTop: 32
            }]} activeOpacity={0.7} onPress={() => {setEmailError(""); setStep('otp');}}>
                <Text style={{
                    fontSize: typography.fontSizes.button, fontWeight: '700', fontFamily: typography.fontFamilies.main,
                    color: activePalette.lightest
                }}>
                    Send Reset Code
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderOtpInput = () => (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={() => setStep('email')}
                              hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                              style={{alignSelf: 'flex-start', marginBottom: 20}}
            >
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>

            <Text style={[styles.subHeaderTitle, {
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.heading,
                color: activePalette.darkest}]}>
                Please check your inbox and spam.
            </Text>
            <Text style={{fontSize: typography.fontSizes.bodyL, lineHeight: 24, marginBottom: 32,
                fontFamily: typography.fontFamilies.secondary,
                color: activePalette.regular}}>
                We have sent a 6-digit reset code to
                <Text style={{color: activePalette.regular, fontWeight: '700'}}>
                    {email || 'your email'}
                </Text>
            </Text>

            <Pressable style={styles.otpBoxesContainer} onPress={() => otpInputRef.current?.focus()}>
                {new Array(6).fill(0).map((_, index) => {
                    const digit = otp[index] || '';
                    const isCurrent = otp.length === index;

                    return(
                        <View key={index} style={[styles.otpBox, {
                            borderColor: isCurrent ? activePalette.darkest : activePalette.lighter,
                            backgroundColor: isDark ? activePalette.bg : activePalette.lightest,
                            borderWidth: isCurrent ? 2 : 1
                        }]}>
                            <Text style={{fontSize: 24, fontWeight: '700',
                                fontFamily: typography.fontFamilies.main, color: activePalette.darkest}}>
                                {digit}
                            </Text>
                        </View>
                    );
                })}
            </Pressable>
            <TextInput
                ref={otpInputRef}
                value={otp}
                onChangeText={(val) => setOtp(val.replace
                (/[^0-9]/g, '').slice(0,6))}
                keyboardType="number-pad"
                style={{position: 'absolute', opacity: 0, height: 1, width: 1}}
                autoFocus
            />
            <TouchableOpacity style={[styles.submitButton, {backgroundColor: activePalette.darkest, marginTop: 32}]}
                              activeOpacity={0.7} onPress={() => setStep('newpassword')}>
                <Text style={{fontSize: 18, fontWeight: '700', fontFamily: typography.fontFamilies.main,
                    color: activePalette.lightest}}>
                    Verify & Continue
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderNewPassword = () => (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={() => setStep('otp')}
                              hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                              style={{alignSelf: 'flex-start', marginBottom: 20}}
            >
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>
            <Text style={[styles.subHeaderTitle, {
                fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.heading,
                color: activePalette.darkest,
            }]}>
                Set New Password
            </Text>
            <Text style={{fontSize: typography.fontSizes.bodyL, lineHeight: 24, marginBottom: 32,
                fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}}
            >
                Choose a strong password between 6-20 characters.
            </Text>

            <View style={{gap: 24}}>
                <View>
                    <View style={[styles.inputBlock, {backgroundColor:
                        isDark ? activePalette.bg : lightPalette.lightest,
                        borderColor: passwordError ? lightPalette.red : activePalette.regular}]}>
                        <Ionicons name="lock-closed-outline" size={20} color={activePalette.darker}
                                  style={{marginRight: 12}}/>
                        <TextInput style={[styles.textInputCore, {color: activePalette.darkest,
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.bodyL}]}
                                   placeholder="New Password"
                                   placeholderTextColor={activePalette.regular}
                                   value={password}
                                   onChangeText={setPassword}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                                   maxLength={20}
                                   autoFocus
                       />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                                          hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"}
                                      size={20} color={activePalette.regular}/>
                        </TouchableOpacity>
                    </View>

                    {!!passwordError && (
                        <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                            marginTop: 4, fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                            {passwordError}
                        </Text>
                    )}

                        <View style={{flexDirection: 'row', gap: 6, marginTop: 8}}>
                            <View style={[styles.strengthBar, {backgroundColor: passStrength >= 1 ? lightPalette.red : activePalette.lighter}]}/>
                            <View style={[styles.strengthBar, {backgroundColor: passStrength >= 2 ? lightPalette.yellow : activePalette.lighter}]}/>
                            <View style={[styles.strengthBar, {backgroundColor: passStrength >= 3 ? lightPalette.green : activePalette.lighter}]}/>
                        </View>
                </View>

                <View>

                    <View style={[styles.inputBlock, {backgroundColor:
                            isDark ? activePalette.bg : lightPalette.lightest,
                            borderColor: (!passwordsMatch && confirmPassword)
                            ? lightPalette.red : activePalette.regular
                    }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={activePalette.darker}
                                  style={{marginRight: 12}}/>
                        <TextInput style={[styles.textInputCore, {color: activePalette.darkest,
                            fontFamily: typography.fontFamilies.secondary,
                            fontSize: typography.fontSizes.bodyL}]}
                                   placeholder="Confirm Password"
                                   placeholderTextColor={activePalette.regular}
                                   value={confirmPassword}
                                   onChangeText={setConfirmPassword}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                                   maxLength={20}
                       />
                    </View>

                    {(confirmPassword.length > 0 && password !== confirmPassword) && (
                        <Text style={{color: lightPalette.red, fontSize:
                            typography.fontSizes.caption, marginTop: 8,
                            fontFamily: typography.fontFamilies.secondary,
                            fontWeight: '700'
                        }}>
                            Passwords do not match
                        </Text>
                    )}
                </View>
            </View>

            <TouchableOpacity style={[styles.submitButton, {backgroundColor: activePalette.darkest,
                marginTop: 32}]} activeOpacity={0.7} onPress={() => setStep('success')}>
                <Text style={{fontSize: 18, fontWeight: '700', fontFamily: typography.fontFamilies.main,
                color: activePalette.lightest}}>
                    Reset Password
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderSuccess = () => (
        <View style={{width: '100%', alignItems: 'center'}}>
            <Ionicons name="checkmark-circle-outline" size={64} color={activePalette.darker}
                      style={{marginBottom: 24}}/>
            <Text style={[styles.subHeaderTitle, {fontFamily: typography.fontFamilies.main,
                fontSize: typography.fontSizes.heading, color: activePalette.darkest, textAlign: 'center'}]}>
                Password Reset!
            </Text>

            <Text style={{
                fontSize: 16, lineHeight: 24, marginBottom: 32, textAlign: 'center',
                fontFamily: typography.fontFamilies.secondary, color: activePalette.regular,
            }}>
                Your password has been updated. You may now login with your new credentials.
            </Text>

            <TouchableOpacity style={[styles.submitButton, {backgroundColor: activePalette.darkest}]}
                              activeOpacity={0.7} onPress={() => console.log("Navigate to Login")}>
                <Text style={{fontSize: typography.fontSizes.button, color: activePalette.lightest,
                    fontFamily: typography.fontFamilies.main, fontWeight: '700'
                }}>
                    Back to Login
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{flex: 1, width: '100%'}}>
            <AuthHeader rightActionText="Login"
                        onRightActionPress={() => console.log("Navigate to Login")}
            />

            <View style={styles.wrapper}>
                <View style={[styles.contentBox, {
                    backgroundColor:
                        isDark ? activePalette.bg2 : lightPalette.lightest
                }]}>
                    {step === 'email' && renderEmailInput()}
                    {step === 'otp' && renderOtpInput()}
                    {step === 'newpassword' && renderNewPassword()}
                    {step === 'success' && renderSuccess()}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    contentBox: {
        padding: 40,
        borderRadius: 25,
        width: '100%',
        maxWidth: 450,
        transform: [{ translateY: -20 }],
    },
    subHeaderTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
    },
    inputBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 56,
    },
    textInputCore: {
        flex: 1,
        height: '100%',
        ...Platform.select({
            web: { outlineStyle: 'none' as any },
            default: {},
        }),
    },
    submitButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    otpBox: {
        width: 48,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    strengthBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
    },
});
