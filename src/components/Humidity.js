import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';


const Humidity = () => {
  const [humidity, setHumidity] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);  
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);

  const WEATHER_API_KEY = '9787d3244c3dc5c13911cf7336a0f634'; 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      try {
        const geoResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fd3e62ab47aa4c4faac2572516ec2c38`
        );

        if (geoResponse.data.results.length > 0) {
          const components = geoResponse.data.results[0].components;
          const cityName = components.city || components.town || components.village || null;
          setCity(cityName || 'Ciudad no encontrada');
        } else {
          setCity('Ciudad no encontrada');
        }
      } catch (error) {
        setErrorMsg('Error al obtener la ciudad');
      }
    })();
  }, []);

  useEffect(() => {
    if (city) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=en`)
        .then((response) => {
          setHumidity(response.data.main.humidity);
          setMaxTemp(response.data.main.temp_max);  
        })
        .catch(() => setErrorMsg('Error al obtener humedad'));
    }
  }, [city]);

  return (
    <View style={styles.card}>  
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          {maxTemp && (
            <Text style={styles.maxTemp}>
              Temperaturas máximas de {Math.round(maxTemp)}°
            </Text>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Humedad</Text>
            <Text style={styles.value}>{humidity ? `${humidity}%` : 'Cargando...'}</Text>
          </View>
        </>
      )}
    </View>
  );  
};  


const styles = StyleSheet.create({
  card: {
    width: '90%',
    height: 100,  
    marginBottom: 10,  
    marginLeft: 20,  
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  maxTemp:{
    color: "white",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    width: "100%",
    paddingBottom: 5,
    textAlign: 'center',
  },    
  row: {
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  error: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default Humidity;
