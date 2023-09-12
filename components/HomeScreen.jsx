import React from 'react';
import { Button, View, SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native';

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.signOutContainer}>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
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

  const handleUserProfilePress = () => {
    // Navigate to the user profile screen when the user profile button is pressed
    navigation.navigate('UserProfilePage');
  };

  return (
    <View style={styles.container}>
      {/* User Profile Button */}
      <TouchableOpacity style={styles.userProfileButton} onPress={handleUserProfilePress}>
        <Text style={styles.userProfileIcon} >Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCarButtonPress}>
        <Text style={styles.buttonText}>I have a Car</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHitchButtonPress}>
        <Text style={styles.buttonText}>I want to Hitch a Ride</Text>
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
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 20,
  },
  // User Profile Button Styles
  userProfileButton: {
    position: 'absolute',
    top: 10, // Adjust the top value for positioning
    right: 10, // Adjust the right value for positioning
    backgroundColor: '#FFD700',
    borderRadius: 25,
    padding: 10,
  },
  userProfileIcon: {
    color: 'black',
    fontSize: 13,
  },
});

export default HomeScreen;
