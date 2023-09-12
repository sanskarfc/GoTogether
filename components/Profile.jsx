import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

const UserProfilePage = () => {
  const [name, setName] = useState("John Doe");
  const [profilePicture, setProfilePicture] = useState("https://example.com/profile.jpg");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("30");
  const [canedit, setCanedit] = useState(false);

  // Function to handle editing name, gender, and age
  const handleEdit = () => { 
    setCanedit(!canedit);
  }; 

  const handleSave = () => {
    // Create a JSON object with the data to send
    const userData = {
      name,
      gender,
      age,
    };

    fetch("http://localhost:8000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data as needed (e.g., show a success message)
        console.log("Profile updated successfully:", data);
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
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
        editable={canedit} // Make it editable when editing is enabled
      />
      <Text style={styles.label}>Gender:</Text>
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={setGender}
        editable={canedit} // Make it editable when editing is enabled
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        editable={canedit} // Make it editable when editing is enabled
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
    backgroundColor: '#FFD700', // Gold color background
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333', // Dark gray text color
  },
  input: {
    fontSize: 16,
    backgroundColor: '#FFF', // White input background
    borderRadius: 5,
    padding: 5,
    width: 200,
    marginBottom: 10,
    borderColor: '#333', // Dark gray border color
    borderWidth: 1, // Add a border
  },
});

export default UserProfilePage;
