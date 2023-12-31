import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignInWithOAuth from "./components/SignInWithOAuth"; 
import * as SecureStore from "expo-secure-store";
import HomeScreen from "./components/HomeScreen"; 
import FilterOptions from "./components/FilterOptions";
import FilterOptionsHitch from "./components/FilterOptionsHitch";
import ChatScreen from "./components/ChatScreen";
import MapScreen from "./components/MapScreen";
import MatchScreen from "./components/MatchScreen";
import UserProfilePage from "./components/Profile";
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Config from "./config.json";
import { io } from 'socket.io-client';

const CLERK_PUBLISHABLE_KEY = "pk_test_bGlrZWQtZGlub3NhdXItNjMuY2xlcmsuYWNjb3VudHMuZGV2JA";  
const Stack = createNativeStackNavigator();
const ipv4_address = Config.IPV4_ADDRESS;
const clientSocket = io(`http://${ipv4_address}:8080`);

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
}; 

export default function App() {
  return (
    <NavigationContainer>
      <ClerkProvider 
        tokenCache={tokenCache}
        publishableKey={CLERK_PUBLISHABLE_KEY}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <SignedIn>
              <View style={styles.signedInContainer}>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{title: 'Home Screen'}}
                  />
                  <Stack.Screen
                    name="FilterOptions"
                    component={FilterOptions}
                    options={{ title: 'Filter Options' }}
                  />
                  <Stack.Screen
                    name="FilterOptionsHitch"
                    component={FilterOptionsHitch}
                    options={{ title: 'Filter Options For Hitching' }} 
                  />
                  <Stack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{ title: 'Select Locations' }} 
                  />
                  <Stack.Screen
                    name="UserProfilePage"
                    component={UserProfilePage}
                    options={{ title: 'Your Profile' }} 
                  />
                  <Stack.Screen
                    name="MatchScreen"
                    component={MatchScreen}
                    options={{ title: 'Your Matches' }} 
                  />
                  <Stack.Screen
                    name="ChatScreen"
                    component={ChatScreen}
                    options={{ title: 'Chat' }}>
                    </Stack.Screen>
                </Stack.Navigator>
              </View>
            </SignedIn>
            <SignedOut>
              <SignInWithOAuth />
            </SignedOut>
          </View>
        </SafeAreaView>
      </ClerkProvider>
    </NavigationContainer>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
  },
  signedInContainer: {
    flex: 1,
  },
});
