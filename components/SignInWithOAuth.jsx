import React from "react";
import * as WebBrowser from "expo-web-browser";
import { View, Image, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();


const SignInWithOAuth = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
      <View style={styles.container}>
        <Image source={require('./img/logo.png')} style={styles.logo}  resizeMode="contain" />

        <TouchableOpacity style={styles.signInButton} onPress={onPress} >
          <View style={styles.buttonContent}>
            <Image source={require('./img/glogo.png')} style={styles.googleLogo} />
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logo: {
    width: '85%',
    height: 'auto',
    aspectRatio: 1, 
  },
  signInButton: {
    backgroundColor: 'white',
    width: '75%',
    height: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    bottom: 60,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
});


export default SignInWithOAuth;
