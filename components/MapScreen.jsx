import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Config from "./../config.json";

const MapScreen = () => {
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = Config.API_KEY;

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

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchQuery)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.predictions && data.predictions.length > 0) {
        // Assuming the first prediction as the selected suggestion
        const selectedPlaceId = data.predictions[0].place_id;
        const placeDetailResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedPlaceId}&fields=geometry&key=${apiKey}`
        );
        const placeDetailData = await placeDetailResponse.json();
        if (placeDetailData.result && placeDetailData.result.geometry) {
          const { location } = placeDetailData.result.geometry;
          if (!startCoordinates) {
            setStartCoordinates(location);
          } else if (!endCoordinates) {
            setEndCoordinates(location);
            calculateTravelTime(location);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        initialRegion={initialRegion}
      >
        {startCoordinates && <Marker coordinate={startCoordinates} pinColor={'green'} />}
        {endCoordinates && <Marker coordinate={endCoordinates} pinColor={'red'} />}
        {startCoordinates && endCoordinates && (
          <MapViewDirections
            origin={startCoordinates}
            destination={endCoordinates}
            apikey={apiKey}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
