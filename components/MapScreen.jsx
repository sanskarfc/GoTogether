import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const apiKey = process.env.API_KEY;


  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }

    getCurrentLocation();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    if (!startCoordinates) {
      setStartCoordinates(coordinate);
    } else if (!endCoordinates) {
      setEndCoordinates(coordinate);
      calculateTravelTime(coordinate);
    }
  };

  const calculateTravelTime = async (destination) => {
    if (startCoordinates) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoordinates.latitude},${startCoordinates.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const duration = data.routes[0].legs[0].duration.text;
        setTravelTime(duration);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        initialRegion={initialRegion}
      >
        {startCoordinates && <Marker coordinate={startCoordinates} />}
        {endCoordinates && <Marker coordinate={endCoordinates} />}
        {startCoordinates && endCoordinates && (
          <MapViewDirections
            origin={startCoordinates}
            destination={endCoordinates}
            apikey={apikey}
            strokeWidth={3}
            strokeColor="blue"
            mode="DRIVING"
          />
        )}
      </MapView>
      {travelTime && (
        <Text style={styles.travelTimeText}>Travel Time: {travelTime}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  travelTimeText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    elevation: 3,
  },
});

export default MapScreen;
