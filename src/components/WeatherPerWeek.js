import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const WeatherPerWeek = () => {
  const [forecast, setForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const WEATHER_API_KEY = '9787d3244c3dc5c13911cf7336a0f634';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let backgroundPermission = await Location.requestBackgroundPermissionsAsync();
      if (backgroundPermission.status !== 'granted') {
        console.log("Permiso de ubicación en segundo plano denegado");
      }

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
        );

        const dailyForecast = response.data.list.reduce((acc, item) => {
          const dt = item.dt * 1000;
          const dateKey = new Date(dt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          });
          if (!acc[dateKey]) {
            acc[dateKey] = {
              temp: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              day: new Date(dt).toLocaleDateString("es-ES", { weekday: "short" }),
            };
          }
          return acc;
        }, {});

        setForecast(Object.entries(dailyForecast).map(([date, data]) => ({ date, ...data })));
      } catch (error) {
        setErrorMsg('Error al obtener el pronóstico');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌦️ Pronóstico semanal</Text>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : forecast.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {forecast.map((dayForecast, index) => (
            <View key={index} style={styles.dayCard}>
              <View style={styles.row}>
                <Text style={styles.date}>{dayForecast.day}</Text>
                <Text style={styles.temp}>{dayForecast.temp}°</Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${dayForecast.icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.loading}>📍 Obteniendo pronóstico...</Text>
      )}
    </View>
  );
};

export default WeatherPerWeek;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dayCard: {
    width: '90%',
    height: 30,  
    marginBottom: 15,
    marginLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',  // Alinea los elementos en una fila
    justifyContent: 'space-between', // Espacio entre los elementos
    alignItems: 'center', // Centra verticalmente
    width: '100%',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
    flex: 1,  // Asegura que ocupe el espacio disponible
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 10, // Espacio entre la temperatura y el icono
  },
  weatherIcon: {
    width: 30,
    height: 30,
  },
  error: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  }
});
