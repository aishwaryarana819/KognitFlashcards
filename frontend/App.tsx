import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import { getTypography } from './src/theme/typography';
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";

import {AuthProvider} from "./src/context/AuthContext";
import {AuthHeader} from "./src/components/AuthHeader";

import {Splash} from "./src/screens/Splash";
// import {useTheme} from "@react-navigation/native";

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
              <AuthHeader
                  rightActionText="Register"
                  onRightActionPress={()=> console.log("Did something wow")}
              />

              <Text style={{
                  fontFamily: 'Urbanist_400Regular',
                  fontSize: typography.fontSizes.heroS,
                  color: activePalette.darkest,
                  marginBottom: 10
              }}>
                  Welcome to Kognit! Currently testing variables.
              </Text>

              <Text style={{
                  fontFamily: 'Manrope_400Regular',
                  fontSize: typography.fontSizes.bodyL,
                  color: activePalette.regular
              }}>
                  Sign Up
              </Text>

              <Text style={{
                  fontFamily: 'IndieFlower_400Regular',
                  fontSize: typography.fontSizes.heading,
                  color: activePalette.darker,
              }}>
                  This is handwritten font.
              </Text>
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
    // paddingTop: 20,
  },
});
