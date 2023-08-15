import { useUser } from "@clerk/clerk-expo";
import { Text } from "react-native";

export default function UseAuthExample() {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log(user);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return(
    <Text>Hello, {user.firstName} welcome to Clerk.</Text>
  );
}
