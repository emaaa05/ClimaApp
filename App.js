import React from 'react';
import { View, StyleSheet } from 'react-native';
import Home from './src/pages/home';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
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
