import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';

const BikeCard = ({ bike, onBook }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.bikeId}>Bike ID: {bike.bikeId}</Text>
      <Button title="Book" onPress={onBook} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 2,
    width: Dimensions.get('window').width - 40, // Full width with margin
  },
  bikeId: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 3, // Take 3/4th of the space
    color: '#333',
  },
  bookButton: {
    flex: 1, // Take 1/4th of the space
  },
});

export default BikeCard;
