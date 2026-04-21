import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';

import { useFonts as useUrbanist, Urbanist_400Regular } from "@expo-google-fonts/urbanist";
import { useFonts as useManrope, Manrope_400Regular } from "@expo-google-fonts/manrope";
import { useFonts as useIndieFlower, IndieFlower_400Regular } from "@expo-google-fonts/indie-flower";

import { getTypography } from './src/theme/typography';
import { lightPalette } from './src/theme/colors';

export default function App() {
  const {width} = useWindowDimensions();
  const typography = getTypography(width);

  const [urbanistLoaded] = useUrbanist({Urbanist_400Regular});
  const [mandropeLoaded] = useManrope({Manrope_400Regular});
  const [indieFlowerLoaded] = useIndieFlower({IndieFlower_400Regular});

  if (!urbanistLoaded || !mandropeLoaded || !indieFlowerLoaded) {
    return (
        <View style={[styles.container, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color="lightPalette.darker"/>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={{
          fontFamily: 'Urbanist_400Regular',
          fontSize: typography.fontSizes.heroS,
          color: lightPalette.darkest,
          marginBottom: 10
        }}>
          Welcome to Kognit! Currently testing variables.
        </Text>

        <Text style={{
          fontFamily: 'Manrope_400Regular',
          fontSize: typography.fontSizes.bodyL,
          color: lightPalette.regular
        }}>
          A Sactuary for Scattered Memory.
        </Text>

        <Text style={{
          fontFamily: 'IndieFlower_400Regular',
          fontSize: typography.fontSizes.heading,
          color: lightPalette.darker,
        }}>
          This is handwritten font.
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightPalette.bg,
    alignItems: 'center',
    paddingTop: 40,
  },
});
