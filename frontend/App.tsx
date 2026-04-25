import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import { getTypography } from './src/theme/typography';
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";

import {AuthProvider} from "./src/context/AuthContext";
import {AuthHeader} from "./src/components/AuthHeader";

import {RegisterOptions} from "./src/screens/auth/RegisterOptions";
import RegisterProfile from "./src/screens/auth/RegisterProfile";
import {LoginOptions} from "./src/screens/auth/LoginOptions";

import {Splash} from "./src/screens/Splash";

const MainContent = ()=> {
  const {width} = useWindowDimensions();
  const typography = getTypography(width);

  const {activePalette} = useTheme();

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

  return (
      <View style={{flex: 1}}>
          <View style={[styles.container, {backgroundColor: activePalette.bg}]}>
              <LoginOptions/>
          </View>
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
