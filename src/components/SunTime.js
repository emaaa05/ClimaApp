import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const SunTime = () => {
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const WEATHER_API_KEY = '9787d3244c3dc5c13911cf7336a0f634';

  useEffect(() => {
    const fetchSunTimes = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.sys) {
          setSunrise(data.sys.sunrise);
          setSunset(data.sys.sunset);
        } else {
          setErrorMsg("No se pudo obtener los horarios del sol.");
        }
      } catch (error) {
        setErrorMsg("Error al obtener datos.");
      }
    };

    fetchSunTimes();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={styles.card}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          <Text style={styles.title}>☀️ Horarios del Sol</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Amanecer</Text>
            <Text style={styles.value}>{sunrise ? formatTime(sunrise) : "Cargando..."}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Atardecer</Text>
            <Text style={styles.value}>{sunset ? formatTime(sunset) : "Cargando..."}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default SunTime;

const styles = StyleSheet.create({
    card: {
    width: '90%',
    height: 100,  
    marginBottom: 10,
    marginLeft: 20,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1,
    gap: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});
