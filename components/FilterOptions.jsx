import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import MapScreen from "./MapScreen"; 
import {Slider} from '@miblanchard/react-native-slider'; 
import { useRoute } from '@react-navigation/native';


const FilterOptions = () => {
  const route = useRoute();
  const { poolType } = route.params;

  const [ladiesValue, setLadiesValue] = useState(0);
  const [menValue, setMenValue] = useState(0);
  const [detourValue, setDetourValue] = useState(0); 
  const [date, setDate] = useState(new Date());  
  const [freeSeats, setFreeSeats] = useState(0);
  const [showDateTimePicker, setShowDateTimePicker] = useState(true);

  const navigation = useNavigation();

  const handleSubmit = () => { 
    navigation.navigate('MapScreen', {
      poolType: poolType,
      date: date.toString(),
      ladiesValue: ladiesValue,
      menValue: menValue,
      detourValue: detourValue,
      poolType: poolType,
      freeSeats: freeSeats, 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.filterContainer}> 
          <Text style={styles.filterLabel}>Number of free seats in your car?</Text>
            <View style={styles_slider.container}>
                <Slider
                    value={freeSeats}
                    onValueChange={value => setFreeSeats(value)}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    trackClickable={true}
                /> 
                <Text>Value: {freeSeats}</Text>
            </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Number of Ladies in the Car</Text>
            <View style={styles_slider.container}>
                <Slider
                    value={ladiesValue}
                    onValueChange={value => setLadiesValue(value)}
                    minimumValue={0}
                    maximumValue={30}
                    step={1}
                    trackClickable={true}
                /> 
                <Text>Value: {ladiesValue}</Text>
            </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Number of Men in the Car</Text>
            <View style={styles_slider.container}>
                <Slider
                    value={menValue}
                    onValueChange={value => setMenValue(value)}
                    minimumValue={0}
                    maximumValue={30}
                    step={1}
                    trackClickable={true}
                /> 
                <Text>Value: {menValue}</Text>
            </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>
            Number of Minutes of Detour Acceptable to You?
          </Text>
            <View style={styles_slider.container}>
                <Slider
                    value={detourValue}
                    onValueChange={value => setDetourValue(value)}
                    minimumValue={0}
                    maximumValue={30}
                    step={1}
                    trackClickable={true}
                /> 
                <Text>Value: {detourValue}</Text>
            </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Select a Date and Time</Text>
          <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
            <Text>{date.toISOString()}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={showDateTimePicker}
          animationType="slide"
        >
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setShowDateTimePicker(false);
                  setDate(selectedDate);
                }
              }}
            />
          </View>
        </Modal>

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

const styles_slider = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});

export default FilterOptions;
