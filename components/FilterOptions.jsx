import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';

const FilterOptions = () => {
  const [selectedLadies, setSelectedLadies] = useState('1');
  const [selectedMen, setSelectedMen] = useState('1');
  const [detourMinutes, setDetourMinutes] = useState('');
  const [showDetourInfo, setShowDetourInfo] = useState(false);

  const ladiesOptions = ['1', '2', '3', '4'];
  const menOptions = ['1', '2', '3', '4'];

  const toggleDetourInfo = () => {
    setShowDetourInfo(!showDetourInfo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Filter Options</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Number of Ladies in the Car:</Text>
        {ladiesOptions.map(option => (
          <View key={option} style={styles.radioButtonContainer}>
            <RadioButton.Android
              value={option}
              color="pink"
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
          <TouchableOpacity onPress={toggleDetourInfo}>
            <Text style={styles.infoButton}>ℹ️</Text>
          </TouchableOpacity>
        </View>
        {showDetourInfo && (
          <View style={styles.infoBubble}>
            <Text style={styles.infoText}>
              Enter the number of minutes of detour that is acceptable to you
              so that you can drop off your fellow rider to their destination.
            </Text>
          </View>
        )}
      </View>
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
  infoBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoText: {
    fontSize: 14,
  },
});

export default FilterOptions;
