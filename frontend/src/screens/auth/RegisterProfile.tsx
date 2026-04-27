import {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, TextInput, ScrollView, Pressable, Platform} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

import {useTheme} from "../../context/ThemeContext";
import {getTypography} from "../../theme/typography";
import {lightPalette} from "../../theme/colors";
import {BREAKPOINTS} from "../../theme/breakpoints";
import {AuthHeader} from "../../components/AuthHeader";
import {supabase} from "../../lib/supabase";

const REGIONS = ["USA/Canada", "South America", "Western Europe", "Central/Eastern Europe", "Russia", "India", "Other Asia", "Africa", "Oceania", "Others"];
const DOMAINS = ["Medical & Health", "Law & Humanities", "STEM & Engineering", "Languages", "Arts & Design", "General Productivity", "Others"];

type RegisterProfileProps = {
    onNavigateLogin: () => void;
    onNavigateDashboard: () => void;
};

const RegisterProfile = ({onNavigateLogin, onNavigateDashboard}: RegisterProfileProps) => {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const {isDark, activePalette} = useTheme();
    const isMobile = width < BREAKPOINTS.MOBILE_MAX;

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [region, setRegion] = useState("");
    const [domain, setDomain] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<'region' | 'domain' | null>(null);

    useEffect(() => {
        if (username.length > 0) {
            const isValid = /^[A-Za-z0-9_-]{4,12}$/.test(username);

            if (username.length > 12) setUsernameError("Uh oh! Please keep it below 12 characters.");
            else if (!isValid) setUsernameError("You may only use letters, numbers, underscore & hyphen and it should be at least 4 characters.");
            else {
                setUsernameError("");
                setIsCheckingUsername(true);

                const delayDebounceFn = setTimeout(async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/auth/check-username?q=${username}`);
                        const data = await response.json();

                        if (!response.ok) setUsernameError(data.error || "Failed to check availability");
                        else if (!data.available) setUsernameError("This username is already taken.");
                        else setUsernameError("");
                    }
                    catch(err) {
                        setUsernameError("Failed to connect to server.");
                    }
                    finally {
                        setIsCheckingUsername(false);
                    }
                }, 500);

                return () => clearTimeout(delayDebounceFn);
            }
        } else {
            setUsernameError("");
            setIsCheckingUsername(false);
        }
    }, [username]);

    useEffect(() => {
        if (password.length > 0 && password.length < 6) setPasswordError("Password must be at least 6 characters.");
        else setPasswordError("");
    })

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

    return (
        <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
            <AuthHeader rightActionText="Login"
                        onRightActionPress={onNavigateLogin}
            />
            
            <View style={[styles.contentBox1, {paddingBottom: isMobile ? 10 : 20}]}>

                <View style={{alignItems: 'flex-end', transform: [{translateX: -20}]}}>
                    <Pressable onPress={onNavigateDashboard}>
                        {(state: any) => (
                        <Text style={{fontFamily: typography.fontFamilies.main, fontWeight: '700',
                            fontSize: typography.fontSizes.bodyL, opacity: state.pressed ? 0.5 : 1,
                            color: state.hovered ? activePalette.darker : activePalette.regular
                        }}>
                            {"Do this later >"}
                        </Text>
                        )}
                    </Pressable>
                </View>
            </View>

            <View style={[styles.contentBox, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                padding: isMobile ? 24 : 40, paddingBottom: isMobile ? 12 : 20}]}>

                <View style={{gap: 24, paddingBottom: 20}}>
                    <View>
                        <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main,
                            color: activePalette.regular}]}>
                            Username
                        </Text>

                        <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                            borderColor: usernameError ? lightPalette.red : activePalette.regular}]}>
                            <Ionicons name="at-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                            <TextInput style={[styles.textInputCore, {color: activePalette.darkest,
                                fontFamily: typography.fontFamilies.main, fontSize: typography.fontSizes.bodyL}]}
                                value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false}/>
                        </View>
                        {!!usernameError && <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption,
                            marginTop: 4, fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                                {usernameError}
                            </Text>
                        }
                    </View>

                    <View style={{flexDirection: isMobile ? 'column' : 'row', gap: 16}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular,}]}>
                                First Name
                            </Text>
                            <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2
                                    : lightPalette.lightest, borderColor: activePalette.regular}]}>
                                <Ionicons name="person-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                                <TextInput style={[styles.textInputCore, {color: activePalette.darkest, fontFamily: typography.fontFamilies.secondary,
                                    fontSize: typography.fontSizes.bodyL}]} value={firstName} onChangeText={setFirstName} autoCapitalize="none" autoCorrect={false}/>
                            </View>
                        </View>

                        <View style={{flex: 1}}>
                            <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular}]}>
                                Last Name
                            </Text>
                            <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                                borderColor: activePalette.regular}]}>
                                <TextInput style={[styles.textInputCore, {color: activePalette.darkest, fontFamily: typography.fontFamilies.secondary,
                                    fontSize: typography.fontSizes.bodyL}]} value={lastName} onChangeText={setLastName} autoCapitalize="none" autoCorrect={false}/>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular}]}>
                            Password
                        </Text>
                        <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                            borderColor: passwordError ? lightPalette.red : activePalette.regular}]}>
                            <Ionicons name="lock-closed-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                            <TextInput style={[styles.textInputCore, {color: activePalette.darkest, fontFamily: typography.fontFamilies.secondary,
                                fontSize: typography.fontSizes.bodyL}]} value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                                       autoCapitalize="none" maxLength={20}/>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={activePalette.regular}/>
                            </TouchableOpacity>
                        </View>

                        {!!passwordError && (
                            <Text style={{color: lightPalette.red, fontSize: typography.fontSizes.caption, marginTop: 4,
                                fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
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
                        <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular}]}>
                            Confirm Password
                        </Text>
                        <View style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                            borderColor: (!passwordsMatch && confirmPassword) ? lightPalette.red : activePalette.regular}]}>
                            <Ionicons name="lock-closed-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                            <TextInput style={[styles.textInputCore, {color: activePalette.darkest, fontFamily: typography.fontFamilies.secondary,
                                fontSize: typography.fontSizes.bodyL}]} value={confirmPassword} onChangeText={setConfirmPassword}
                                       secureTextEntry={!showPassword} autoCapitalize="none"/>
                        </View>

                        {(!passwordsMatch && confirmPassword.length > 0) && <Text style={{color: lightPalette.red, fontSize: 12,
                        marginTop: 4, fontFamily: typography.fontFamilies.secondary, fontWeight: '700'}}>
                                Passwords do not match
                            </Text>
                        }
                    </View>

                    <View style={{flexDirection: isMobile ? 'column' : 'row', gap: 16, zIndex: 10, position: 'relative'}}>

                        <View style={{flex: 1, zIndex: 50, position: 'relative'}}>
                            <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular}]}>
                                Region
                            </Text>

                            <TouchableOpacity activeOpacity={0.7} style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                                borderColor: activePalette.regular}]} onPress={() => setActiveDropdown(activeDropdown === 'region' ? null : 'region')}>
                                <Ionicons name="globe-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                                <Text style={[{flex: 1, color: region ? activePalette.darkest : activePalette.regular,
                                    fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyL}]}>
                                    {region || "Select Region"}
                                </Text>
                                <Ionicons name={activeDropdown === 'region' ? 'chevron-up' : 'chevron-down'} size={16} color={activePalette.regular}/>
                            </TouchableOpacity>

                            {activeDropdown === 'region' && (
                                <View style={{
                                    position: 'absolute', top: 85, left: 0, right: 0, zIndex: 50,
                                    backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                                    borderWidth: 1.5, borderColor: activePalette.lighter,
                                    borderRadius: 16, marginTop: 8, maxHeight: 200, paddingBottom: 12}}
                                >
                                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                                        {REGIONS.map((opt, i) => (
                                            <TouchableOpacity key={i} style={{padding: 16, borderBottomWidth: i === REGIONS.length - 1 ? 0 : 1,
                                                borderBottomColor: activePalette.lighter}} onPress={() => {
                                                    setRegion(opt);
                                                    setActiveDropdown(null)}}
                                            >
                                                <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.darkest}}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                            <View style={{height: 8}}/>
                        </View>

                        <View style={{flex: 1, zIndex: 10, position: 'relative'}}>
                            <Text style={[styles.inputLabel, {fontFamily: typography.fontFamilies.main, color: activePalette.regular}]}>
                                Domain
                            </Text>

                            <TouchableOpacity activeOpacity={0.7} style={[styles.inputBlock, {backgroundColor: isDark ? activePalette.bg2
                                    : lightPalette.lightest, borderColor: activePalette.regular}]} onPress={() => setActiveDropdown(
                                        activeDropdown === 'domain' ? null : 'domain')}>
                                <Ionicons name="book-outline" size={20} color={activePalette.darker} style={styles.leadingIcon}/>
                                <Text style={[{flex: 1, color: domain ? activePalette.darkest : activePalette.regular,
                                    fontFamily: typography.fontFamilies.secondary, fontSize: typography.fontSizes.bodyL}]}>
                                    {domain || 'Select Domain'}
                                </Text>
                                <Ionicons name={activeDropdown === 'domain' ? "chevron-up" : "chevron-down"} size={16} color={activePalette.regular}/>
                            </TouchableOpacity>

                            {activeDropdown === 'domain' && (
                                <View style={{
                                    position: 'absolute', top: 85, left: 0, right: 0, zIndex: 50,
                                    backgroundColor: isDark ? activePalette.bg2 : lightPalette.lightest,
                                    borderWidth: 1.5, borderColor: activePalette.lighter,
                                    borderRadius: 16, marginTop: 8, maxHeight: 200, paddingBottom: 12}}
                                >
                                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                                        {DOMAINS.map((opt, i) => (
                                            <TouchableOpacity key={i} style={{padding: 16, borderBottomWidth: i === DOMAINS.length - 1 ? 0 : 1,
                                                borderBottomColor: activePalette.lighter}} onPress={() => {
                                                    setDomain(opt);
                                                    setActiveDropdown(null)
                                            }}>
                                                <Text style={{fontFamily: typography.fontFamilies.secondary, color: activePalette.darkest}}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                    </ScrollView>
                                </View>
                            )}
                            <View style={{height: 8}}/>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.submitButton, {backgroundColor: activePalette.darkest}]} activeOpacity={0.8} disabled={isLoading}
                        onPress={async () => {
                            if (password.length < 6 || password !== confirmPassword || usernameError || !username || isCheckingUsername) {
                                alert("Please enter valid details.");
                                return;
                            }

                            setIsLoading(true);

                            try {
                                const {error: authError} = await supabase.auth.updateUser({
                                    password: password
                                });

                                if (authError) throw new Error(authError.message);

                                const {data: sessionData} = await supabase.auth.getSession();
                                const token = sessionData.session?.access_token;

                                const response = await fetch('http://127.0.0.1:8000/api/auth/finalize-profile', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        username: username,
                                        firstName: firstName,
                                        lastName: lastName,
                                        region: region,
                                        domain: domain
                                    })
                                });

                                if (!response.ok) {
                                    const errData = await response.json();
                                    throw new Error(errData.error || "Failed to sync profile");
                                }

                                onNavigateDashboard();
                            }
                            catch (e: any) {
                                alert(e.message);
                            }
                            finally {
                                setIsLoading(false);
                            }
                        }}
                    >
                        <Text style={{fontSize: 18, fontWeight: '700', fontFamily: typography.fontFamilies.main, color: activePalette.lightest}}>
                            {isLoading? "Saving..." : "Save Profile"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {activeDropdown && (
                <Pressable
                    style={{
                        position: 'fixed' as any,
                        top: 0, left: 0, right: 0, bottom: 0, zIndex: 1
                    }}
                    onPress={() => setActiveDropdown(null)}
                />
            )}
        </ScrollView>
    );
}

export default RegisterProfile;

const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    contentBox: {
        paddingBottom: 20,
        borderRadius: 25,
        width: '100%',
        maxWidth: 600,
    },
    contentBox1: {
        borderRadius: 25,
        width: '100%',
        maxWidth: 600,
    },
    formTitle: {
        fontWeight: '800',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 56,
    },
    leadingIcon: {
        marginRight: 12,
    },
    textInputCore: {
        flex: 1,
        height: '100%',
        ...Platform.select({
                web: { outlineStyle: 'none' as any },
                default: {},
        }),
    },
    strengthBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 20,
    },
});

