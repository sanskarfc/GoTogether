import React, { useState, useEffect } from 'react';
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import { ClerkProvider, useSignIn } from "@clerk/clerk-expo";
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

const UserProfilePage = () => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("https://example.com/profile.jpg");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState("");
  const [canedit, setCanedit] = useState(false); 

  const { sessionId, getToken } = useAuth();
  const { session } = useSession(); 


  useEffect(() => {
    async function GetUserData() {
      const token = await session.getToken();

      fetch("http://10.7.47.190:8080/api/profile", {
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
          setGender(data.gender);
          setAge(data.age.toString());
          setRating(data.rating.toString());
        })
        .catch((error) => {
          console.error("User Profile Fetch Error: ", error);
        }); 
    }

    GetUserData();
  }, []); 

  async function handleEdit() { 
    const token = await session.getToken();

    fetch("http://10.7.47.190:8080/api/profile", {
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

    fetch("http://10.7.47.190:8080/api/profile", {
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
      {!canedit && <Button title="Edit" onPress={handleEdit} />}
      {canedit && <Button title="Save Details" onPress={handleSave} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700', 
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333', 
  },
  input: {
    fontSize: 16,
    backgroundColor: '#FFF', 
    borderRadius: 5,
    padding: 5,
    width: 200,
    marginBottom: 10,
    borderColor: '#333', 
    borderWidth: 1, 
  },
});

export default UserProfilePage;
