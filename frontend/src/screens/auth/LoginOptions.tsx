import {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, TextInput, Pressable, Platform, Alert} from 'react-native';
import Svg, {Path, G, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();

import {AuthHeader} from "../../components/AuthHeader";
import {useTheme} from "../../context/ThemeContext";
import {getTypography} from "../../theme/typography";
import {lightPalette} from "../../theme/colors";
import {Ionicons} from "@expo/vector-icons";
import {BREAKPOINTS} from "../../theme/breakpoints";
import {supabase} from "../../lib/supabase";

type LoginOptionsProps = {
    onNavigateRegister: () => void;
    onNavigateRecovery: () => void;
};

export const LoginOptions = ({onNavigateRegister, onNavigateRecovery}: LoginOptionsProps) => {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const {isDark, activePalette} = useTheme();
    const isMobile = width < BREAKPOINTS.MOBILE_MAX;

    const [step, setStep] = useState<'options' | 'email' | 'otp' | 'password'>("options");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otp, setOtp] = useState("");
    const otpInputRef = useRef<TextInput>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const hcRedirectUri = AuthSession.makeRedirectUri();

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: '48a7f88795a10d6a19e879cf43829984',
            redirectUri: hcRedirectUri,
            scopes: ['openid', 'email'],
        },
        {authorizationEndpoint: 'https://auth.hackclub.com/oauth/authorize'}
    );

    useEffect(() => {
        const handleHackClubBridge = async (code: string) => {
            setIsLoading(true);
            try {
                const res = await fetch ('http://127.0.0.1:8000/api/auth/hackclub/callback', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        code: code,
                        redirect_uri: hcRedirectUri,
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.erro || "HackClub authentication failed.");

                await supabase.auth.setSession({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                });
            }
            catch (err: any) {
                setApiError(err.message);
                setIsLoading(false);
            }
        };

        if (response?.type === 'success' && response.params.code) {
            handleHackClubBridge(response.params.code);
        }
    }, [response]);

    useEffect(() => {
        if (step === 'otp') {
            setTimeout(() => otpInputRef.current?.focus(), 100);
        }
    }, [step]);

    const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    // Custom SVG for Branded Google Logo - AI Generated
    const GoogleIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </Svg>
    );

    // Custom SVG for HackClub Icon - AI Generated
    const HackClubIcon = () => (
        <Svg width="22.5" height="24" viewBox="0 0 22.5 24">
            <Defs>
                <LinearGradient id="hcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FF7A59" />
                    <Stop offset="100%" stopColor="#E23E57" />
                </LinearGradient>
            </Defs>
            <Rect width="22.5" height="24" rx="6" fill="url(#hcGrad)" />
            <Path fill="#FFF" d="M7.5 6v12h2.5v-4.5c0-1.2.8-2 2-2s2 .8 2 2V18H16.5v-5c0-2.5-1.5-4-4-4-1 0-2 .6-2.5 1.5V6H7.5z"
            />
        </Svg>
    );

    // Custom SVG for "Glass Filled & Outlined" Envelope - AI Generated
    const EmailIcon = () => (
        <Svg width="28" height="24" viewBox="0 0 28 24">
            <Path
                fill={activePalette.regular + '40'}
                d="M2 5.5A2.5 2.5 0 0 1 4.5 3h19A2.5 2.5 0 0 1 26 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18.5v-13Z"
            />
            <G stroke={activePalette.lightest} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <Path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h19A2.5 2.5 0 0 1 26 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18.5v-13Z" />
                <Path d="m2 5.5 12 7.5 12-7.5" />
            </G>
        </Svg>
    );

    const verifyOTP = async (code: string) => {
        setApiError("");
        setIsLoading(true);

        const {data, error} = await supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: 'email',
        });

        setIsLoading(false);

        if (error) setApiError(error.message);
    };

    const passwordLogin = async () => {
        if (!isValidEmail(email)) {
            setApiError("Please enter a valid email address");
            return;
        }
        if (!password || password.length < 6) {
            setApiError("Please enter a valid password");
            return;
        }

        setApiError("");
        setIsLoading(true);

        const {error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setIsLoading(false);

        if (error) setApiError(error.message);
    };

    const renderOptions = () => (
        <>
            <View style={styles.headerSection}>
                <Text style={{
                    fontFamily: typography.fontFamilies.main,
                    fontSize: typography.fontSizes.heroS,
                    color: activePalette.darkest,
                    fontWeight: '800',
                    marginBottom: 12,
                }}>
                    {"Welcome Back."}
                </Text>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyL,
                    color: activePalette.darker,
                    lineHeight: 24,
                }}>
                    Pick up where you left off.
                </Text>
            </View>
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.authButton, {borderColor: activePalette.darker, borderWidth: 1.5,
                        backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,}]}
                    activeOpacity={0.7} onPress={() => {
                        if (Platform.OS === 'web')
                            window.alert("Google Login is Coming Soon. Please use HackClub or Email for now.");
                        else Alert.alert("Google Login is Coming Soon. Please use HackClub or Email for now.");
                    }}
                >
                    <GoogleIcon/>
                    <Text style={[styles.authButtonText, {
                        fontFamily: typography.fontFamilies.main,
                        color: activePalette.darker,
                    }]}>
                        Login with Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.authButton, {borderColor: activePalette.darker, borderWidth: 1.5,
                        backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,}]}
                    activeOpacity={0.7} disabled={!request || isLoading} onPress={() => promptAsync()}
                >
                    <HackClubIcon/>
                    <Text style={[styles.authButtonText, {
                        fontFamily: typography.fontFamilies.main,
                        color: activePalette.darker,
                    }]}>
                        Login with HackClub
                    </Text>
                </TouchableOpacity>

                <View style={[styles.dividerSection]}>
                    <View style={[styles.dividerLine, {
                        backgroundColor: activePalette.lighter }]}/>
                    <Text style={[styles.dividerText, {
                        fontFamily: typography.fontFamilies.secondary,
                        color: activePalette.regular, fontWeight: '800'
                    }]}>
                        OR
                    </Text>
                    <View style={[styles.dividerLine, {
                        backgroundColor: activePalette.lighter
                    }]}/>
                </View>

                <TouchableOpacity
                    style={[styles.authButton, {backgroundColor: activePalette.darkest}]}
                    activeOpacity={0.7}
                    onPress={() => setStep('email')}
                >
                    <EmailIcon/>
                    <Text style={[styles.authButtonText, {
                        fontFamily: typography.fontFamilies.main,
                        color: activePalette.lightest,
                    }]}>
                        Login with Email
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={onNavigateRecovery}
                                  style={{alignItems: 'center', marginTop: 8}}>
                    <Text style={{
                        fontFamily: typography.fontFamilies.secondary,
                        fontSize: typography.fontSizes.bodyS,
                        color: activePalette.darker,
                        opacity: 0.7
                    }}>
                        Forgot Password? Recover Account
                    </Text>
                </TouchableOpacity>

            </View>
        </>
    );

    const renderEmailInput = () => (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={() => setStep('options')}
                              hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                              style={{alignSelf: 'flex-start', marginBottom: 20}}>
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>
            <Text style={[styles.subHeaderTitle,
                {fontFamily: typography.fontFamilies.main, color: activePalette.darkest}]}>
                Your Email Address
            </Text>

            <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg : lightPalette.lightest,
                borderColor: emailError ? lightPalette.red : activePalette.regular}]}>
                <Ionicons name="mail-outline" size={20} color={activePalette.darker}
                          style={{marginRight: 12}}/>
                <TextInput style={[styles.textInputCore, {flex: 1, height:'100%', color: activePalette.darkest,
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyL}]}
                           placeholder="higurumaTakaba@jujutsu.com"
                           placeholderTextColor={activePalette.regular}
                           value={email}
                           onChangeText={setEmail}
                           autoCapitalize="none"
                           autoCorrect={false}
                           keyboardType="email-address"
                           autoFocus
                />
            </View>
            {!!emailError && (
                <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                    marginTop: 8, fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                    {emailError}
                </Text>
            )}

            <TouchableOpacity style={[styles.authButton, {backgroundColor: activePalette.darkest,
                marginTop: 32}]} activeOpacity={0.7}
                  onPress={async () => {
                      if (!isValidEmail(email)) {
                          setEmailError("Please enter a valid email address");
                          return;
                      }
                      setEmailError("");
                      setIsLoading(true);

                      const {error} = await supabase.auth.signInWithOtp({
                          email: email,
                          options: {shouldCreateUser: false}
                      });

                      setIsLoading(false);

                      if (error) setEmailError(error.message);
                      else setStep('otp');
            }}>
                <Text style={{fontSize: 18, fontWeight: '700', fontFamily: typography.fontFamilies.main,
                    color: activePalette.lightest}}>
                    {isLoading ? "Sending..." : "Send OTP"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('password')}
                style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyS,
                    color: activePalette.regular,
                }}>
                    Use password instead
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderOtpInput = () => (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={() => setStep('email')}
                              hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                              style={{alignSelf: 'flex-start', marginBottom: 20}}>
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>
            <Text style={[styles.subHeaderTitle, {fontFamily: typography.fontFamilies.main,
                color: activePalette.darkest}]}>
                Please check your inbox and spam.
            </Text>
            <Text style={{fontSize: 16, lineHeight: 24, marginBottom: 32,
                fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}}>
                {"We sent you a 6-digit OTP to "}
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
                onChangeText={(val) => {
                    const cleaned = val.replace(/[^0-9]/g, '').slice(0,6);
                    setOtp(cleaned);
                    if(cleaned.length === 6) verifyOTP(cleaned);
                }}
                keyboardType="number-pad"
                style={{position: 'absolute', opacity: 0, height: 1, width: 1}}
                autoFocus
            />
            <TouchableOpacity style={[styles.authButton, {backgroundColor: activePalette.darkest, marginTop: 32}]}
                              activeOpacity={0.7}
                              onPress={() => {
                                  if (otp.length === 6) verifyOTP(otp);
                                  else setApiError("Please enter a 6-digit code");
                              }}
                              disabled={isLoading}
            >
                <Text style={{fontSize: 18, fontWeight: '700', fontFamily: typography.fontFamilies.main,
                    color: activePalette.lightest}}>
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                </Text>
            </TouchableOpacity>
            {!!apiError && (
                <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                    marginTop: 16, textAlign: 'center', fontFamily: typography.fontFamilies.secondary, fontWeight: '700'
                }}>
                    {apiError}
                </Text>
            )}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('password')}
                              style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyS,
                    color: activePalette.regular,
                }}>
                    Use password instead
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderPasswordInput = () => (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={() => setStep('email')}
                              hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                              style={{alignSelf: 'flex-start', marginBottom: 20}}>
                <Ionicons name="arrow-back" size={24} color={activePalette.darker}/>
            </TouchableOpacity>
            <Text style={[styles.subHeaderTitle, {fontFamily: typography.fontFamilies.main,
                color: activePalette.darkest}]}>
                Enter Your Password
            </Text>
            <Text style={{fontSize: 16, lineHeight: 24, marginBottom: 32,
                fontFamily: typography.fontFamilies.secondary, color: activePalette.regular}}>
                {"Logging in as "}
                <Text style={{color: activePalette.regular, fontWeight: '700'}}>
                    {email || 'your email'}
                </Text>
            </Text>

            <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg : lightPalette.lightest,
                borderColor: activePalette.regular}]}>
                <Ionicons name="lock-closed-outline" size={20} color={activePalette.darker}
                          style={{marginRight: 12}}/>
                <TextInput style={[styles.textInputCore, {color: activePalette.darkest,
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyL}]}
                           value={password}
                           onChangeText={setPassword}
                           secureTextEntry={!showPassword}
                           autoCapitalize="none"
                           autoFocus
                           />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                                  hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20}
                              color={activePalette.regular}/>
                </TouchableOpacity>
            </View>

            {!!apiError && (
                <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                    marginTop: 16, textAlign: 'center', fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                    {apiError}
                </Text>
            )}

            <TouchableOpacity style={[styles.authButton, {backgroundColor: activePalette.darkest,
                marginTop: 32}]} activeOpacity={0.7} onPress={passwordLogin}>
                <Text style={{fontSize: typography.fontSizes.button, fontWeight: '700',
                    fontFamily: typography.fontFamilies.main, color: activePalette.lightest}}>
                    {isLoading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('email')}
                              style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{
                    fontFamily: typography.fontFamilies.secondary,
                    fontSize: typography.fontSizes.bodyS,
                    color: activePalette.regular,
                }}>
                    Use OTP instead
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{flex: 1, width: '100%'}}>
            <AuthHeader rightActionText="Register"
                        onRightActionPress={onNavigateRegister}
            />
            <View style={styles.wrapper}>
                <View style={[styles.contentBox,
                    {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest}]}>
                    {step === 'options' && renderOptions()}
                    {step === 'email' && renderEmailInput()}
                    {step === 'otp' && renderOtpInput()}
                    {step === 'password' && renderPasswordInput()}
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
    headerSection: {
        marginBottom: 40,
    },
    optionsContainer: {
        width: '100%',
        gap: 15,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 16,
        // borderWidth: 10,
        gap: 12,
    },
    authButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    dividerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    dividerLine: {
        flex: 1,
        height: 2,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 16,
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
});
