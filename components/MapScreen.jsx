// TODO:
// make a time field asking them the time they want a ride 

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Config from "./../config.json";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-expo";

const MapScreen = () => {
  const route = useRoute();
  const { ladiesValue, menValue, detourValue, date } = route.params; 

  const [travelTime, setTravelTime] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = Config.API_KEY;   

  const handleSearch = async () => { 
    const token = await session.getToken();

    const userData = {
      ladiesValue: ladiesValue,
      menValue: menValue,
      date: date,
      travelTime: travelTime,
      detourValue: detourValue
    };

    fetch("http://10.7.47.190:8080/api/trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("Trip data sent to backend successfully:", data);
      })
      .catch((error) => {
        console.error("Error in sending trip data sent to backend:", error);
      }); 
  }; 

  const handleButtonPress = () => {

  };

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

  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent; 
    if(!startCoordinates) {
      setStartCoordinates((prevCoordinates) => coordinate);
    } else if(!endCoordinates) {
      setEndCoordinates((prevCoordinates) => coordinate);
    } 
  }; 

  const [responseText, setResponseText] = useState(''); // State to store the response
  const [durations, setDurations] = useState(null); 

  async function handleLetsGo() {
    const token = await session.getToken();

    const userData = {
      startLatitude: startCoordinates.latitude,
      startLongitude: startCoordinates.longtude,
      endLatitude: endCoordinates.latitude,
      endLongitude: endCoordinates.longitude,
    };

    fetch("http://10.7.48.43:8080/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      }); 

    setCanedit(!canedit);
  };

  const handlePostRequest = async () => {
    try {
      const response = await axios.post('https://api.openrouteservice.org/v2/matrix/driving-car', {
        locations: [[startCoordinates.longitude, startCoordinates.latitude], [endCoordinates.longitude, endCoordinates.latitude]],
        destinations: [1]
      }, {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': Config.OPEN_SOURCE_KEY,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

      // Store the response in the state
      setResponseText(JSON.stringify(response.data));
      const responseData = JSON.parse(JSON.stringify(response.data));
      const durations = (responseData.durations)[0]/60;
      console.log("Durations: ", durations);
      setDurations(durations); 

      const data = {
        start_latitude: startCoordinates.latitude,
        start_longitude: startCoordinates.longitude,
        end_latitude: endCoordinates.latitude,
        end_longitude: endCoordinates.longitude,
      };

      // Make the POST request
      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error("error: ", error.response.data);
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
      </MapView>
      {durations && (
        <Text style={styles.travelTimeText}>Travel Time: {durations} Minutes</Text>
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handlePostRequest}>
        <Text style={styles.submitButtonText}>Show me Approx Time!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleLetsGo}>
        <Text style={styles.submitButtonText}>Let's Go!</Text>
      </TouchableOpacity>
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
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MapScreen;
