import React from 'react';
import { Button, View, SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ChatScreen from './ChatScreen';
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native'; 

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  
  if (!isLoaded) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Button
          title="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    </SafeAreaView>
  );
}; 

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleCarButtonPress = () => {
    navigation.navigate('FilterOptions'); // Navigate to FilterOptions screen
  };

  const handleHitchButtonPress = () => {
    navigation.navigate('FilterOptionsHitch'); // Navigate to FilterOptions screen
  }; 

  const handleChatButtonPress = () => {
    navigation.navigate('ChatScreen'); // Navigate to ChatScreen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCarButtonPress}>
        <Text style={styles.buttonText}>I have a Car</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHitchButtonPress}>
        <Text style={styles.buttonText}>I want to Hitch a Ride</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleChatButtonPress}>
        <Text style={styles.buttonText}>Open Chat</Text>
      </TouchableOpacity>
      <SignOut />
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
