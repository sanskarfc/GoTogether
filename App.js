import React from "react";
import { View, SafeAreaView, Text, StyleSheet, Button } from "react-native";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import SignInWithOAuth from "./components/SignInWithOAuth"; 
import * as SecureStore from "expo-secure-store";
import UseAuthExample from "./components/UseAuthExample";
import HomeScreen from "./components/HomeScreen"; 
import FilterOptions from "./components/FilterOptions";
import MapScreen from "./components/MapScreen";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const CLERK_PUBLISHABLE_KEY = "pk_test_bGlrZWQtZGlub3NhdXItNjMuY2xlcmsuYWNjb3VudHMuZGV2JA";  
const Stack = createNativeStackNavigator();

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
                    options={{ title: 'Filter Options' }} // Add options if needed
                  />
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
