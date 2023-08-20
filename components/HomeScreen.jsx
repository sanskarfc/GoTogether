import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import FilterOptions from "./FilterOptions";
import FilterOptionsHitch from "./FilterOptionsHitch";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleCarButtonPress = () => {
    navigation.navigate('FilterOptions'); // Navigate to FilterOptions screen
  };

  const handleHitchButtonPress = () => {
    navigation.navigate('FilterOptionsHitch'); // Navigate to FilterOptions screen
  }; 

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCarButtonPress}>
        <Text style={styles.buttonText}>I have a Car</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHitchButtonPress}>
        <Text style={styles.buttonText}>I want to Hitch a Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
