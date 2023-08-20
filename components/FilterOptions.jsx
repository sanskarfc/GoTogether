import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FilterOptions = () => {
  return (
    <View style={styles.container}>
      {/* Add filter options here */}
      <Text>Filter Options</Text>
      {/* Add filter options here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterOptions;
