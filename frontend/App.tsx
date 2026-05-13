import {useState} from "react";
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import {ThemeProvider, useTheme} from "./src/context/ThemeContext";
import {AuthProvider, useAuth} from "./src/context/AuthContext";
import {LoadingProvider} from "./src/context/LoadingContext";
import LoadingBar from "./src/context/LoadingBar";
import ErrorBoudnary from "./src/components/ErrorBoundary";

import {RegisterOptions} from "./src/screens/auth/RegisterOptions";
import RegisterProfile from "./src/screens/auth/RegisterProfile";
import {LoginOptions} from "./src/screens/auth/LoginOptions";
import {Splash} from "./src/screens/Splash";
import {AccountRecovery} from "./src/screens/auth/AccountRecovery";
import {AdaptiveRouter} from "./src/navigation/AdaptiveRouter";

import {Dashboard} from "./src/screens/Dashboard";
import {ReviewSession} from "./src/modals/ReviewSession";
import {Trash} from "./src/screens/Trash";
import {Settings} from "./src/screens/Settings";
import {UnderConstruction} from "./src/screens/UnderConstruction";
import {supabase} from "./src/lib/supabase";

const MainContent = ()=> {
    const {activePalette} = useTheme();
    const {user, isLoading, profile} = useAuth();

    const [authScreen, setAuthScreen] = useState<
      'register' | 'login' | 'recovery' | 'profile'>('register');

    const [testRoute, setTestRoute] = useState<
      'home' | 'dashboard' | 'reviewSession' | 'trash' | 'settings' | 'underConstruction'>('home');

    const [urbanistLoaded] = useUrbanist({Urbanist_400Regular});
    const [manropeLoaded] = useManrope({Manrope_400Regular});
    const [indieFlowerLoaded] = useIndieFlower({IndieFlower_400Regular});

    if (!urbanistLoaded || !manropeLoaded || !indieFlowerLoaded) {
    return (
        <View style={[styles.container, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color={activePalette.darker}/>
        </View>
    );
    }

    if (isLoading) return <Splash/>

    const needsProfileSetup = user && !profile;
// Updated via AI to save time
        if (!user || needsProfileSetup || authScreen === 'profile') {
                return (
                        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
                                {(!user && authScreen === 'register') && (
                                    <RegisterOptions
                                        onNavigateLogin={() => setAuthScreen('login')}
                                        onNavigateProfile={() => setAuthScreen('profile')}
                                    />
                                )}
                                {(!user && authScreen === 'login') && (
                                    <LoginOptions
                                        onNavigateRegister={() => setAuthScreen('register')}
                                        onNavigateRecovery={() => setAuthScreen('recovery')}
                                    />
                                )}
                                {(!user && authScreen === 'recovery') && (
                                    <AccountRecovery
                                        onNavigateLogin={() => setAuthScreen('login')}
                                    />
                                )}
                                {(needsProfileSetup || authScreen === 'profile') && (
                                    <RegisterProfile
                                        onNavigateLogin={async () => {
                                            await supabase.auth.signOut();
                                            setAuthScreen('login');
                                        }}
                                        onNavigateDashboard={() => setAuthScreen('register')}
                                    />
                                )}
                            </View>
                    );
            }

    const goHome = () => setTestRoute('home');

    // @ts-ignore
    if (testRoute === 'dashboard') return <Dashboard onBackTest={goHome}/>;
    if (testRoute === 'reviewSession') return <ReviewSession onBackTest={goHome}/>;
    if (testRoute === 'trash') return <Trash onBackTest={goHome}/>;
    if (testRoute === 'settings') return <Settings onBackTest={goHome}/>;
    if (testRoute === 'underConstruction') return <UnderConstruction title="Import" message="Coming soon." onBackTest={goHome}/>;

    return <AdaptiveRouter/>;
};

export default function App() {
    return (
        <ErrorBoudnary>
            <SafeAreaProvider>
                <LoadingProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            <LoadingBar />
                            <MainContent />
                        </AuthProvider>
                    </ThemeProvider>
                </LoadingProvider>
            </SafeAreaProvider>
        </ErrorBoudnary>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
