import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const FilterOptionsHitch = () => {
  const [selectedLadyOption, setSelectedLadyOption] = useState('yes');
  const [selectedCabOption, setSelectedCabOption] = useState('yes');

  const ladyOptions = ['Yes', "Doesn't Matter"];
  const cabOptions = ['Yes', 'No'];

  const navigation = useNavigation();

  const handleSubmit = () => {
    // Navigate to the MapScreen
    navigation.navigate('MapScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Should there be at least one lady in the car?</Text>
        {ladyOptions.map(option => (
          <View key={option} style={styles.radioButtonContainer}>
            <RadioButton.Android
              value={option}
              color="#FF69B4" // Pink color
              onPress={() => setSelectedLadyOption(option)}
              status={selectedLadyOption === option ? 'checked' : 'unchecked'}
            />
            <Text style={styles.radioButtonLabel}>{option}</Text>
          </View>
        ))}
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Are you okay to take a cab with someone?</Text>
        {cabOptions.map(option => (
          <View key={option} style={styles.radioButtonContainer}>
            <RadioButton.Android
              value={option}
              color="#87CEFA" // Light blue color
              onPress={() => setSelectedCabOption(option)}
              status={selectedCabOption === option ? 'checked' : 'unchecked'}
            />
            <Text style={styles.radioButtonLabel}>{option}</Text>
          </View>
        ))}
      </View>
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
    marginBottom: 10,
  },
  radioButtonLabel: {
    marginLeft: 10,
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

export default FilterOptionsHitch;
