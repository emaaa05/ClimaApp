import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WEATHER_API_KEY } from '@env';


const WeatherDetails = () => {
  const [windSpeed, setWindSpeed] = useState(null);
  const [windDirection, setWindDirection] = useState(null);
  const [clouds, setClouds] = useState(null);
  const [seaLevel, setSeaLevel] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        console.log('Iniciando la llamada a la API...');
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        console.log('Respuesta de la API:', data);

        if (data.main && data.wind && data.clouds) {
          setWindSpeed(data.wind.speed);
          setWindDirection(data.wind.deg);
          setClouds(data.clouds.all);
          setSeaLevel(data.main.sea_level); 
          setPressure(data.main.pressure);
        } else {
          setErrorMsg("No se pudo obtener los datos del clima.");
        }
      } catch (error) {
        setErrorMsg("Error al obtener los datos.");
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Viento</Text>
            <Text style={styles.cardValue}>{windSpeed ? `${windSpeed} m/s` : "Cargando..."}</Text>
            <Text style={styles.cardValue}>Dirección: {windDirection ? `${windDirection}°` : "Cargando..."}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nubosidad</Text>
            <Text style={styles.cardValue}>{clouds !== null ? `${clouds}%` : "Cargando..."}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nivel de Presión</Text>
            <Text style={styles.cardValue}>{seaLevel ? `${seaLevel} hPa` : "Cargando..."}</Text>
        </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Presión Atmosférica</Text>
            <Text style={styles.cardValue}>{pressure ? `${pressure} hPa` : "Cargando..."}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  card: {
    width: '90%',
    height: 100,  
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    },
  cardTitle: {
    fontFamily: 'pacifico',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontFamily: 'pacifico',
    fontSize: 16,
    color: '#fff',
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});

export default WeatherDetails;
