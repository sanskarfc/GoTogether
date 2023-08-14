import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignInWithOAuth from "./components/SignInWithOAuth"; 
import { useUser } from "@clerk/clerk-expo";

const CLERK_PUBLISHABLE_KEY = "pk_test_bGlrZWQtZGlub3NhdXItNjMuY2xlcmsuYWNjb3VudHMuZGV2JA";
export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SafeAreaView styles={styles.container}>
        <SignedIn>
          <Text>You are Signed in</Text>
          <Text>Hello! {user.firstName}</Text>
        </SignedIn>
        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
