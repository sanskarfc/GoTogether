import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, View, SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ChatScreen from './ChatScreen';
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios'; // Import axios
import { useRoute } from '@react-navigation/native';
import Config from "./../config.json";
import ShadowBox from './shadowbox';


const HomeScreen = () => {  
  const navigation = useNavigation(); 
  const { isLoaded, session, isSignedIn } = useSession();
  const { user } = useUser();

  const handleCarButtonPress = () => {
    navigation.navigate('FilterOptions', {
      poolType: "car",
    }); 
  };

  const handleHitchButtonPress = () => {
    navigation.navigate('FilterOptionsHitch', {
      poolType: "cab",
    }); 
  };

  const handleUserProfilePress = () => {
    navigation.navigate('UserProfilePage');  
  }; 

  const handleChatButtonPress = () => {
    navigation.navigate('ChatScreen');
  };
  function getTimeDiff() {
    const userCreatedAt = moment(user.createdAt.toString(), 'ddd MMM DD YYYY HH:mm:ss GMTZ').utc();
    const now = moment();
    const secondsDifference = now.diff(userCreatedAt, 'seconds'); 

    return secondsDifference;
  }

  useEffect(() => {
    async function registerUser() {
      if(getTimeDiff() < 30) {
        const token = await session.getToken();

        userdata = {
          name: user.fullName,
          profilePic: user.profileImageUrl,
        }
        const ipv4_address = Config.IPV4_ADDRESS;
        fetch(`http://${ipv4_address}:8080/api/user`, {
          method: "post",
          headers: {
            "content-type": "application/json",
            "authorization": `bearer ${token}`,
            mode: "cors",
          },
          body: JSON.stringify(userdata),
        })
          .then((response) => {
            if (!response.ok) {
              throw new error("network response was not ok");
            }
          })
          .then((data) => {
            console.log("user registered successfully:", data);
          })
          .catch((error) => {
            console.error("error registering user:", error);
          }); 
      }
    }

    registerUser();
  }, []);  

  const { isLoade, signOut } = useAuth();



  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        <ShadowBox onPress={handleCarButtonPress} heading="I have a Car" path={require('./img/car.png')} />
        <ShadowBox onPress={handleHitchButtonPress} heading="I want a Ride" path={require('./img/man.png')} />
      </View> 
      <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <View style={{ marginRight: 5 }}>
        <Button
          title="Profile"
          onPress={handleUserProfilePress}
          color="black" // Set text color
        />
      </View>
      <View style={{ marginRight: 5 }}>
        <Button
          title="SignOut"
          onPress={signOut}
          color="grey"
        />
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innercontainer:{
    flexDirection: 'row',
    height: '30%',
    justifyContent:'center',
    alignItems:'center',
    top: -30,
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
