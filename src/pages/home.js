import React, { useState } from 'react';
import { ScrollView, StyleSheet, Animated } from 'react-native'; 
import Weather from '../components/Weather';
import WeatherPerWeek from '../components/WeatherPerWeek';
import GradientBackground from '../components/GradientBackground';
import Humidity from '../components/Humidity';
import SunTime from '../components/SunTime';
import WeatherDetails from '../components/WeatherDetails';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bgColor] = useState(new Animated.Value(0)); 

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    if (offset > 50 && !isDarkMode) {
      setIsDarkMode(true);
      Animated.timing(bgColor, {
        toValue: 1, 
        duration: 500, 
        useNativeDriver: false,
      }).start();
    } else if (offset <= 50 && isDarkMode) {
      setIsDarkMode(false);
      Animated.timing(bgColor, {
        toValue: 0, 
        duration: 500, 
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <GradientBackground isDarkMode={isDarkMode} bgColor={bgColor}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Weather isDarkMode={isDarkMode} />
        <Humidity isDarkMode={isDarkMode} />
        <SunTime isDarkMode={isDarkMode} />
        <WeatherPerWeek isDarkMode={isDarkMode} />
        <WeatherDetails isDarkMode={isDarkMode} />
      </ScrollView>
    </GradientBackground>
  );
};

export default Home;
