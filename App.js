import React from 'react';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; 
import { fonts } from './src/globals/fonts'; 
import Home from './src/pages/home';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <Home />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
