import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const SummaryPage = ({ route, navigation }) => {
  // Destructure ride data from route params
  const { _id , username, bikeId, loc_pick, loc_drop, time_pick, time_drop, amount } = route.params;

  const [locDrop, setLocDrop] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [realBikeId, setRealBikeId] = useState('');

  const handleRidedata = async () => {
    try {
      const dropLocRes = await axios.post('http://192.168.1.2:3000/api/locations/droplocid', { loc_drop });
      const dropLoc = dropLocRes.data;
      const locRes = await axios.post('http://192.168.1.2:3000/api/locations/pickuplocid', { loc_pick });
      const loc = locRes.data;
      const userRes = await axios.post('http://192.168.1.2:3000/api/userid/get-username', { username });
      const user = userRes.data;
      const bikeRes = await axios.post('http://192.168.1.2:3000/api/bicycles/get-bikeid', { bikeId });
      const bike = bikeRes.data;

      // console.log(loc);

      if (!dropLoc) {
        console.error('Invalid drop location ID.');
        return;
      }

      if (!loc) {
        console.error('Invalid location ID.');
        return;
      }

      if (!user) {
        console.error('Invalid user ID.');
        return;
      }

      if (!bike) {
        console.error('Invalid bike ID.');
        return;
      }

      setLocDrop(dropLoc.loc_name);
      setPickUpLocation(loc.loc_name);
      setNameOfUser(user.username);
      setRealBikeId(bike.bikeId);
      
    } catch (error) {
      console.error('Error getting rideData:', error);
    }
  };

  handleRidedata();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Summary</Text>
      <Text style={styles.detail}>Ride ID: {_id}</Text>
      <Text style={styles.detail}>Username: {nameOfUser}</Text>
      <Text style={styles.detail}>Bike ID: {realBikeId}</Text>
      <Text style={styles.detail}>Pickup Location: {pickUpLocation}</Text>
      <Text style={styles.detail}>Drop-off Location: {locDrop}</Text>
      <Text style={styles.detail}>Pickup Time: {new Date(time_pick).toLocaleString()}</Text>
      <Text style={styles.detail}>Drop-off Time: {new Date(time_drop).toLocaleString()}</Text>
      <Text style={styles.detail}>Amount: {amount.toFixed(2)} Tokens</Text>
      <Button
        title="Back to Rental"
        onPress={() => navigation.navigate('Rental')}
        color="#4CAF50" // Match the button color from Rental page
        width="100%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
});

export default SummaryPage;
