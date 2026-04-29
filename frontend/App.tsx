import {useState} from "react";
import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import { getTypography } from './src/theme/typography';
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";
import {AuthProvider, useAuth} from "./src/context/AuthContext";
import {LoadingProvider} from "./src/context/LoadingContext";
import LoadingBar from "./src/context/LoadingBar";
import ErrorBoudnary from "./src/components/ErrorBoundary";

import {TopBar} from "./src/components/TopBar";
import {RegisterOptions} from "./src/screens/auth/RegisterOptions";
import RegisterProfile from "./src/screens/auth/RegisterProfile";
import {LoginOptions} from "./src/screens/auth/LoginOptions";
import {Splash} from "./src/screens/Splash";
import {AccountRecovery} from "./src/screens/auth/AccountRecovery";
import {NavigationContainer} from "@react-navigation/native";
import {BottomBar} from "./src/navigation/BottomBar";
import {DesktopDrawer} from "./src/navigation/Sidebar";

import {Dashboard} from "./src/screens/Dashboard";
import {ReviewSession} from "./src/modals/ReviewSession";
import {Trash} from "./src/screens/Trash";
import {Settings} from "./src/screens/Settings";
import {UnderConstruction} from "./src/screens/UnderConstruction";
import {FloatingReviewPalette} from "./src/components/FloatingReviewPalette";
import {BREAKPOINTS} from "./src/theme/breakpoints";

const MainContent = ()=> {
    const {width} = useWindowDimensions();
    const typography = getTypography(width);
    const isMobile = width <= BREAKPOINTS.MOBILE_MAX;

    const {activePalette} = useTheme();
    const {user, isLoading, profile} = useAuth();

    console.log("Current Profile from django (for testing): ", profile);

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


    if (!user || authScreen === 'profile') {
      return (
          <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
              {authScreen === 'register' && (
                  <RegisterOptions
                      onNavigateLogin={() => setAuthScreen('login')}
                      onNavigateProfile={() => setAuthScreen('profile')}
                  />
              )}
              {authScreen === 'login' && (
                  <LoginOptions
                      onNavigateRegister={() => setAuthScreen('register')}
                      onNavigateRecovery={() => setAuthScreen('recovery')}
                  />
              )}
              {authScreen === 'profile' && (
                  <RegisterProfile
                      onNavigateLogin={() => setAuthScreen('login')}
                      onNavigateDashboard={() => setAuthScreen('register')}
                  />
              )}
              {authScreen === 'recovery' && (
                  <AccountRecovery
                      onNavigateLogin={() => setAuthScreen('login')}
                  />
              )}
          </View>
      );
    }

    const goHome = () => setTestRoute('home');

    if (testRoute === 'dashboard') return <Dashboard onBackTest={goHome}/>;
    if (testRoute === 'reviewSession') return <ReviewSession onBackTest={goHome}/>;
    if (testRoute === 'trash') return <Trash onBackTest={goHome}/>;
    if (testRoute === 'settings') return <Settings onBackTest={goHome}/>;
    if (testRoute === 'underConstruction') return <UnderConstruction title="Import" message="Coming soon." onBackTest={goHome}/>;

    return (
        <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
            {isMobile && <TopBar/>}
            <View style={{flex: 1, width: '100%', zIndex: 101}}>
                <NavigationContainer>
                    {isMobile ? <BottomBar/> : <DesktopDrawer/>}
                </NavigationContainer>
                <FloatingReviewPalette/>
            </View>
        </View>
    );
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
