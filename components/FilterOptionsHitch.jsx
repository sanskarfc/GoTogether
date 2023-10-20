import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,ScrollView, Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Slider} from '@miblanchard/react-native-slider'; 

const FilterOptionsHitch = () => { 
  const route = useRoute();
  const { poolType } = route.params;

  const [selectedLadyOption, setSelectedLadyOption] = useState('yes');
  const [selectedCabOption, setSelectedCabOption] = useState('yes');
  const [date, setDate] = useState(new Date());  
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [showDateTimePicker, setShowDateTimePicker] = useState(true);

  const ladyOptions = ['Yes', "Doesn't Matter"];
  const cabOptions = ['Yes', 'No'];

  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate('MapScreen', {
      poolType: poolType,
      date: date.toString(),
      ladyOption: selectedLadyOption,
      cabOption: selectedCabOption,
      seatsNeeded: seatsNeeded,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}> 
          <Text style={styles.filterLabel}>How many seats do you need?</Text>
            <View style={styles_slider.container}>
                <Slider
                    value={seatsNeeded}
                    onValueChange={value => setSeatsNeeded(value)}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    trackClickable={true}
                /> 
                <Text>Value: {seatsNeeded}</Text>
            </View>
        </View>

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

const styles_slider = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});

export default FilterOptionsHitch;
