import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';


const GradientBackground = ({ isDarkMode, bgColor, children }) => {

  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#A8C0FF', '#121212'], 
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
