import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import imagePath from '../src/constants/imagePath';
import { locationPermission, getCurrentLoc } from '../helper/helperFunction';
import Geolocation from 'react-native-geolocation-service';
// import React, {useState} from 'react';
// import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

const StatusPage = ({route, navigation}) => {
  //   const route = useRoute();
  const {rideId, username, bikeId, loc_pick, time_pick, token} = route.params;
  // const StatusPage = ({ route, navigation }) => {
    //   const { rideId, username, bikeId, loc_pick, time_pick } = route.params;
  // console.log(time_pick);
  const [locDrop, setLocDrop] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [realBikeId, setRealBikeId] = useState('');
  const mapRef = useRef();

  // Separate state variables for curLoc and dropoffCoords
  const [curLoc, setCurLoc] = useState({
    latitude: 23.17533585988,
    longitude: 80.02260292768577,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [dropoffCoords, setDropoffCoords] = useState({
    latitude: 23.17624126932023,
    longitude: 80.01965358099041,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLiveLocation = async () => {
    const locPermissionGranted = await locationPermission();
    if (locPermissionGranted) {
      const { latitude, longitude } = await getCurrentLoc();
      setCurLoc({
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
    }
  };

  useEffect(() => {
    handleRidedata();
  }, []);

  const handleRidedata = async () => {
    try {
      const locRes = await axios.post(
        'http://192.168.29.20:3000/api/locations/pickuplocid',
        {loc_pick},
      );
      const loc = locRes.data;
      const userRes = await axios.post(
        'http://192.168.29.20:3000/api/userid/get-username',
        {username},
      );
      const user = userRes.data;
      const bikeRes = await axios.post(
        'http://192.168.29.20:3000/api/bicycles/get-bikeid',
        {bikeId},
      );
       // const locRes = await axios.post('http://192.168.1.7:3000/api/locations/pickuplocid', { loc_pick });
      // const loc = locRes.data;
      // const userRes = await axios.post('http://192.168.1.7:3000/api/userid/get-username', { username });
      // const user = userRes.data;
      // const bikeRes = await axios.post('http://192.168.1.7:3000/api/bicycles/get-bikeid', { bikeId });
      const bike = bikeRes.data;

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

      setPickUpLocation(loc.loc_name);
      setNameOfUser(user.username);
      setRealBikeId(bike.bikeId);
    } catch (error) {
      console.error('Error getting rideData:', error);
    }
  };
  // const handleEndRide = async () => {
  //   try {
  //     const locationResponse = await axios.post(
  //       'http://192.168.29.20:3000/api/locations/locid',
  //       {loc_id: locDrop},
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  const handleInputChange = async (text) => {
    setLocDrop(text);

    if (text.length > 0) {
      try {
        const response = await axios.post('http://192.168.1.7:3000/api/locations/search', {
          query: text
        });
        setLocationSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSelectLocation = async () => {
    try {
      const locationResponse = await axios.post('http://192.168.1.7:3000/api/locations/locid', { loc_id: locDrop });
      const location = locationResponse.data;

      if (!location) {
        console.error('Location not found.');
        return;
      }

      setDropoffCoords({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        });
      }

    } catch (error) {
      if (error.response) {
        console.error(`Server Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  const handleEndRide = async () => {
    try {
      const locationResponse = await axios.post('http://192.168.1.7:3000/api/locations/locid', { loc_id: locDrop });
      const location = locationResponse.data;

      if (!location) {
        console.error('Invalid location ID.');
        return;
      }
      // const response = await axios.put(
      //   'http://192.168.29.20:3000/api/rides/end',
      //   {
      //     rideId,
      //     loc_drop: location._id,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

      // const rideData = response.data;

      // navigation.navigate('Summary', {rideData, token});
      const response = await axios.put('http://192.168.1.7:3000/api/rides/end', 
        {rideId,
        loc_drop: location._id},
                {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const rideData = response.data;

      await AsyncStorage.removeItem('currentRide');

      navigation.navigate('Summary', {rideData,token});

    } catch (error) {
      console.error('Error ending ride:', error);
    }
  };

  return (
          // <Text style={styles.label}>Ride Details</Text>
      // <Text style={styles.text}>Username: {nameOfUser}</Text>
      // <Text style={styles.text}>Bike ID: {realBikeId}</Text>
      // <Text style={styles.text}>Pickup Location: {pickUpLocation}</Text>
      // <Text style={styles.text}>
      //   Pickup Time: {new Date(time_pick).toLocaleString()}
      // </Text>
      // <TextInput
      //   style={styles.input}
      //   placeholder="Enter Drop-off Location"
      //   placeholderTextColor="#999"
      //   value={locDrop}
      //   onChangeText={setLocDrop}
      // />
      // <Button title="End Ride" onPress={handleEndRide} />
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={curLoc}
        region={curLoc} // Update the map with current location changes
      >
        <Marker
          coordinate={curLoc}
          image={imagePath.icCurLoc}
        />
        <Marker
          coordinate={dropoffCoords}
          image={imagePath.icGreenMarker}
        />
      </MapView>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Ride Details</Text>
        <Text style={styles.text}>Username: {nameOfUser}</Text>
        <Text style={styles.text}>Bike ID: {realBikeId}</Text>
        <Text style={styles.text}>Pickup Location: {pickUpLocation}</Text>
        <Text style={styles.text}>Pickup Time: {new Date(time_pick).toLocaleString()}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Drop-off Location"
          placeholderTextColor='#999'
          value={locDrop}
          onChangeText={handleInputChange}
        />

        {locationSuggestions.length > 0 && (
          <FlatList
            data={locationSuggestions}
            keyExtractor={(item) => item.loc_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setLocDrop(item.loc_id);
                setLocationSuggestions([]);
              }}>
                <Text style={styles.suggestionText}>{item.loc_name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}

        <Button title="Select" onPress={handleSelectLocation} />
        <Button title="End Ride" onPress={handleEndRide} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 300,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
  },
  text: {
    color: '#333',
    marginBottom: 10,
  },
  suggestionList: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
  },
  suggestionText: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default StatusPage;
