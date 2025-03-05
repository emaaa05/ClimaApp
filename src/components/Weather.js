import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import weatherTranslations from '../../weatherTranslations.json';
import { MaterialCommunityIcons, FontAwesome, Feather, AntDesign, Fontisto, Ionicons, Entypo } from '@expo/vector-icons';
import { WEATHER_API_KEY, OPENCAGE_API_KEY } from '@env';

function Weather() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);



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
      console.log("Ubicación obtenida: ", JSON.stringify(loc, null, 2));
      setLocation(loc.coords);
      const { latitude, longitude } = loc.coords;

      try {
        const geoResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
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
    if (city && city !== "Ciudad no encontrada") {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=en`)
        .then((response) => setWeather(response.data))
        .catch(() => setErrorMsg('Error al obtener el clima'));
    }
  }, [city]);

  const description = weather?.weather[0]?.description || "";
  const data = weatherTranslations[description] || {};
  const traduccion = data.traduccion || description;
  const iconName = data.imagen || "weather-cloudy";
  const gifUrl = data.gif || "https://default-gif-url.gif";
  const library = data.biblioteca || "MaterialCommunityIcons";
  const IconComponent = { MaterialCommunityIcons, FontAwesome, Feather, AntDesign, Fontisto, Ionicons, Entypo }[library];

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : city && weather ? (
        <View style={styles.weatherCard}>
          <Text style={styles.title}>{weather.main.temp}°</Text>
          <View style={styles.weatherContainer}>
          <Text style={styles.city}>{traduccion}</Text>
            {IconComponent && <IconComponent name={iconName} size={50} color="white" />}
          </View>
          <Text style={styles.temp}>{city}<Entypo name="location-pin" size={24} color="white" /></Text>
        </View>
      ) : (
        <Text style={styles.loading}>📍 Obteniendo ubicación y clima...</Text>
      )}
    </View>
  );
}

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'pacifico',
    fontSize: 32,
    color: '#fff',
    textShadowColor: 'rgba(8, 2, 2, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  weatherCard: {
    padding: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  city: {
    fontSize: 26,
    fontFamily: 'Pacifico',
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  temp: {
    fontSize: 24,
    fontFamily: 'Pacifico',
    color: '#fff',
    marginBottom: 12,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    fontFamily: 'pacifico',
    color: '#fff',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  error: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  loading: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
