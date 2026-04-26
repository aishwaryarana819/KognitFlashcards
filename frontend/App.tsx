import {useState} from "react";
import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import { getTypography } from './src/theme/typography';
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";

import {AuthProvider, useAuth} from "./src/context/AuthContext";

import {RegisterOptions} from "./src/screens/auth/RegisterOptions";
import RegisterProfile from "./src/screens/auth/RegisterProfile";
import {LoginOptions} from "./src/screens/auth/LoginOptions";
import {Splash} from "./src/screens/Splash";
import {AccountRecovery} from "./src/screens/auth/AccountRecovery";

const MainContent = ()=> {
  const {width} = useWindowDimensions();
  const typography = getTypography(width);

  const {activePalette} = useTheme();
  const {user, isLoading} = useAuth();

  const [authScreen, setAuthScreen] = useState<
      'register' | 'login' | 'recovery' | 'profile'>
  ('register');

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


  if (!user) {
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

  return (
      <View style={[styles.container, {backgroundColor: activePalette.bg, justifyContent: 'center'}]}>
          <Text style={{fontFamily: typography.fontFamilies.main,
              fontSize: typography.fontSizes.heading, color: activePalette.darkest, fontWeight: '800'}}>
              Welcome to Kognit!
          </Text>
          <Text style={{fontFamily: typography.fontFamilies.secondary,
              fontSize: typography.fontSizes.bodyL, color: activePalette.regular, marginTop: 8}}>
              Dashboard under development.
          </Text>
      </View>
  );
};

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <MainContent/>
            </ThemeProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
