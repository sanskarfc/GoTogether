import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import { ClerkProvider, useSignIn } from "@clerk/clerk-expo";
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import Config from "./../config.json";

const UserProfilePage = () => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("https://en.wikipedia.org/wiki/File:IIT_Gandhinagar_Logo.svg");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState("");
  const [canedit, setCanedit] = useState(false); 

  const { sessionId, getToken } = useAuth();
  const { session } = useSession(); 

  const [dataFetched, setDataFetched] = useState(false);


  useEffect(() => {
    async function GetUserData() {
      const token = await session.getToken();
      const ipv4_address = Config.IPV4_ADDRESS;
      fetch(`http://${ipv4_address}:8080/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
          console.log("Received data from server: ", data);
          setName(data.name);
          if(data.gender !== null) {
            setGender(data.gender);
          }
          if(data.age !== null) {
            setAge(data.age.toString());
          }
          setRating(data.rating.toString());
          setProfilePicture(data.profilePic);
          setTimeout(() => {
            setDataFetched(true);
          }, 1000);
        })
        .catch((error) => {
          console.error("User Profile Fetch Error: ", error);
        }); 
    }

    GetUserData();
  }, []); 

  async function handleEdit() { 
    const token = await session.getToken();
    const ipv4_address = Config.IPV4_ADDRESS;
    fetch(`http://${ipv4_address}:8080/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        mode: "cors",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response.json());
      })
      .then((data) => {
        console.log("Got data from server: ", data);
      })
      .catch((error) => {
        console.error("Error getting data from server: ", error);
      });  

    setCanedit(!canedit);
  }; 

  async function handleSave() {
    const token = await session.getToken();

    const userData = {
      name: name,
      age: age,
      gender: gender
    };
    const ipv4_address = Config.IPV4_ADDRESS;
    fetch(`http://${ipv4_address}:8080/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      }); 

    setCanedit(!canedit);
  };

  return (
    <View style={styles.container}>
      {dataFetched && 
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={canedit}
          />
          <Text style={styles.label}>Gender:</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            editable={canedit}
          />
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            editable={canedit}
          />
          <Text style={styles.label}>Rating:</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={setRating}
            editable={false}
          />
          {!canedit ? (
            <Button title="Edit" onPress={handleEdit} />
          ) : (
            <Button title="Save Details" onPress={handleSave} />
          )}
        </View>
      }
      {!dataFetched && <ActivityIndicator animating={true} style={styles.activityIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(to bottom, #3454D1, #6511AC)', // Apply a gradient background
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    borderRadius: 10,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a shadow to the container
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333', // Slightly darker text color
  },
  input: {
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
    borderRadius: 5,
    padding: 10,
    width: 200,
    marginBottom: 10,
    borderColor: '#333', // Slightly darker border
    borderWidth: 1,
    color: '#333', // Slightly darker text color
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default UserProfilePage;
