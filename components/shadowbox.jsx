import React from 'react';
import { View, StyleSheet,Text,TouchableOpacity } from 'react-native';

const ShadowBox = (prop) => {
    
  return (
    <TouchableOpacity  style={styles.container} onPress={prop.onPress}>
      <Text style={styles.bigText}>{prop.heading}</Text>
      <Text style={styles.smallText}>{prop.subtitle}</Text>
    </TouchableOpacity >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(200, 200, 200, 200)', // Gray color with transparency
    borderRadius: 10, // Rounded corners
    borderColor: 'rgba(200, 200, 200, 200)',
    padding: 20,
    borderWidth: 0, 
    elevation: 50, 
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width:'85%',
    marginBottom: 20,
  },
    bigText: {
      fontSize: 30, 
      backgroundColor: 'transparent',// Adjust the font size as needed
      fontWeight: 'bold',
      textAlign: 'left',
    },
    smallText: {
      fontSize: 14, // Adjust the font size as needed
      textAlign: 'left',
    },
  });
  
  export default ShadowBox;