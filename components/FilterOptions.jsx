import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import MapScreen from "./MapScreen";

const FilterOptions = () => {
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedLadies, setSelectedLadies] = useState('none');
  const [selectedMen, setSelectedMen] = useState('none');
  const [detourMinutes, setDetourMinutes] = useState('');
  const [showDetourInfo, setShowDetourInfo] = useState(false);
  const [infoButtonRef, setInfoButtonRef] = useState(null);

  const genderOptions = ['Male', 'Female', 'Other']; 
  const ladiesOptions = ['None', '1', '2', '3', '4'];
  const menOptions = ['None', '1', '2', '3', '4'];

  const navigation = useNavigation();

  const toggleDetourInfo = () => {
    setShowDetourInfo(!showDetourInfo);
  };

  const onInfoButtonPress = event => {
    setInfoButtonRef(event.target);
    toggleDetourInfo();
  };

  const handleSubmit = () => {
    // Logic to handle the submit action
    // For example, you can navigate to the MapScreen component
    navigation.navigate('MapScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Age:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={age}
              style={styles.input}
              onChangeText={text => setAge(text)}
              keyboardType="numeric"
              placeholder="Enter your age"
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Gender:</Text>
          {genderOptions.map(option => (
          <View key={option} style={styles.radioButtonContainer}>
            <RadioButton.Android
              value={option}
              color="blue"
              onPress={() => setSelectedGender(option)}
              status={selectedGender === option ? 'checked' : 'unchecked'}
            />
              <Text>{option}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Number of Ladies in the Car:</Text>
          {ladiesOptions.map(option => (
            <View key={option} style={styles.radioButtonContainer}>
              <RadioButton.Android
                value={option}
                color="blue"
                onPress={() => setSelectedLadies(option)}
                status={selectedLadies === option ? 'checked' : 'unchecked'}
              />
              <Text>{option}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Number of Men in the Car:</Text>
          {menOptions.map(option => (
            <View key={option} style={styles.radioButtonContainer}>
              <RadioButton.Android
                value={option}
                color="blue"
                onPress={() => setSelectedMen(option)}
                status={selectedMen === option ? 'checked' : 'unchecked'}
              />
              <Text>{option}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Number of Minutes of Detour:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={detourMinutes}
              onChangeText={text => setDetourMinutes(text)}
              keyboardType="numeric"
              placeholder="Enter minutes"
            />
            <TouchableOpacity onPress={onInfoButtonPress}>
              <Text style={styles.infoButton}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <Popover
            isVisible={showDetourInfo}
            fromView={infoButtonRef}
            onRequestClose={toggleDetourInfo}
            popoverStyle={styles.popover}
          >
            <Text style={styles.popoverText}>
              Enter the number of minutes of detour that is acceptable to you
              so that you can drop off your fellow rider to their destination.
            </Text>
          </Popover>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 120,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  infoButton: {
    fontSize: 20,
    marginLeft: 10,
  },
  popover: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  popoverText: {
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FilterOptions;
