import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { useAuth, useSession } from "@clerk/clerk-expo";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MapView, { Marker, Polygon } from 'react-native-maps';
import Config from "./../config.json";

const MatchScreen = () => {
  const { session } = useSession();
  const [matches, setMatches] = useState({});
  const [showComponent, setShowComponent] = useState(false); // To control component visibility

  useEffect(() => {
    async function GetMatches() {
      const token = await session.getToken();
      const ipv4_address = Config.IPV4_ADDRESS;
      fetch(`http://${ipv4_address}:8080/api/match`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "authorization": `bearer ${token}`,
          mode: "cors",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse the response as JSON
        })
        .then((data) => {
          setMatches(data);
          setTimeout(() => {
            setShowComponent(true);
          }, 2000); // 2-second delay
        })
        .catch((error) => {
          console.error("Error fetching matches", error);
        });
    }

    console.log("Component mounted. Fetching matches...");
    GetMatches();
  }, []);

  useEffect(() => {
    console.log("matches length --> ", Object.keys(matches).length);
  }, [matches]); 

  const randomNumber = Math.random() * (0.001) + 0.001;

  return (
    <View style={styles.container}>
      {showComponent && ( // Conditionally render the component
        <ScrollView>
          {Object.keys(matches).length > 0 ? (
            Object.keys(matches).map((tripId) => {
              const tripData = matches[tripId];
              return (
                <Card key={tripId} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardText}>Ride Start Time: {tripData['Ride Start Time']}</Text>
                    <Text style={styles.cardText}>Rider: {tripData['Rider']}</Text> 
                    <Text style={styles.cardText}>Detour Minutes: {tripData['Your Detour']} Minutes</Text> 
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: parseFloat(tripData['Start Latitude']),
                        longitude: parseFloat(tripData['Start Longitude']),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    >          
                      <Polygon
                          coordinates={[
                              { latitude: parseFloat(tripData['Start Latitude']) - 0.01 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) - 0.01 + randomNumber},
                              { latitude: parseFloat(tripData['Start Latitude']) - 0.01 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) - 0.001 + randomNumber },
                              { latitude: parseFloat(tripData['Start Latitude']) - 0.00002 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) + 0.01 + randomNumber },
                              { latitude: parseFloat(tripData['Start Latitude']) + 0.005 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) + 0.011 + randomNumber },
                              { latitude: parseFloat(tripData['Start Latitude']) + 0.001 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) - 0.009 + randomNumber },
                              { latitude: parseFloat(tripData['Start Latitude']) - 0.004 + randomNumber, longitude: parseFloat(tripData['Start Longitude']) - 0.02 + randomNumber },
                          ]}
                          fillColor="rgba(0, 255, 0, 0.5)"
                          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                          strokeColors={[
                              '#7F0000',
                              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                              '#B24112',
                              '#E5845C',
                              '#238C23',
                              '#7F0000'
                          ]}
                          strokeWidth={6}
                      />
                      <Polygon
                          coordinates={[
                              { latitude: parseFloat(tripData['End Latitude']) - 0.01, longitude: parseFloat(tripData['End Longitude']) - 0.01},
                              { latitude: parseFloat(tripData['End Latitude']) - 0.01, longitude: parseFloat(tripData['End Longitude']) - 0.001 },
                              { latitude: parseFloat(tripData['End Latitude']) - 0.00002, longitude: parseFloat(tripData['End Longitude']) + 0.01 },
                              { latitude: parseFloat(tripData['End Latitude']) + 0.005, longitude: parseFloat(tripData['End Longitude']) + 0.011 },
                              { latitude: parseFloat(tripData['End Latitude']) + 0.001, longitude: parseFloat(tripData['End Longitude']) - 0.009 },
                              { latitude: parseFloat(tripData['End Latitude']) - 0.004, longitude: parseFloat(tripData['End Longitude']) - 0.02 },
                          ]}
                          fillColor="rgba(255, 0, 0, 0.5)"
                          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                          strokeColors={[
                              '#7F0000',
                              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                              '#B24112',
                              '#E5845C',
                              '#238C23',
                              '#7F0000'
                          ]}
                          strokeWidth={6}
                      />
                    </MapView>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      onPress={() => {

                      }}
                      color="#1976D2"
                    >
                     Chat 
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })
          ) : (
            <Text style={styles.noMatchesText}>No matches available.</Text>
          )}
        </ScrollView>
      )}
      {!showComponent && <ActivityIndicator animating={true} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0', // Light gray background
  },
  card: {
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  map: {
    height: 200,
  },
  noMatchesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MatchScreen;
