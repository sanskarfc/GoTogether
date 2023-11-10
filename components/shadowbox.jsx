import React from 'react';
import { View, StyleSheet,Text,TouchableOpacity, Image } from 'react-native';

const ShadowBox = (prop) => {
  return (
    <TouchableOpacity style={styles.container} onPress={prop.onPress}>
      <Image
        source={prop.path}
        style={styles.image}
      />
      <Text style={styles.text}>
        {prop.heading}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey', // Background color for the grey box
    padding: 10, // Adjust the padding as needed
    alignItems: 'center', 
    borderRadius: 20,
    width: 150,
    marginLeft: 10,
  },
  image: {
    resizeMode: 'contain',
    aspectRatio: 1,
    width: 100, 
    height:100,// Adjust the image width as needed
    
  },
  text: {
    marginTop: 10, // Adjust the margin as needed to separate image and text
    fontSize: 16, // Adjust the text size as needed
  },
});
  
  export default ShadowBox;