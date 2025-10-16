import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import MapView, { Marker, Polyline } from 'react-native-maps'; //
// import Geolocation from 'react-native-geolocation-service';  //

const StatusPage = ({ route, navigation }) => {
//   const route = useRoute();
  const { rideId, username, bikeId, loc_pick, time_pick } = route.params;
  // console.log(time_pick);
  const [locDrop, setLocDrop] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [realBikeId, setRealBikeId] = useState('');
  // const [region, setRegion] = useState(null);  //
  // const [markers, setMarkers] = useState([]);  //
  // const [routeCoordinates, setRouteCoordinates] = useState([]);  //


  // useEffect(() => {    //
  //   const getLocationPermission = async () => {
  //     if (Platform.OS === 'android') {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: "Location Access Permission",
  //             message: "We would like to use your location to show your current position on the map.",
  //             buttonNeutral: "Ask Me Later",
  //             buttonNegative: "Cancel",
  //             buttonPositive: "OK"
  //           }
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           console.log("You can use the location");
  //         } else {
  //           console.log("Location permission denied");
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   };

  //   getLocationPermission();
  // }, []);   //


  // useEffect(() => {   //
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       setRegion({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 0.01,
  //         longitudeDelta: 0.01,
  //       });
  //       setMarkers([{ latitude: position.coords.latitude, longitude: position.coords.longitude }]);
  //     },
  //     (error) => {
  //       console.error(error);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // }, []);   //


  const handleRidedata = async () => {
    try {
      const locRes = await axios.post('http://192.168.1.2:3000/api/locations/pickuplocid', { loc_pick });
      const loc = locRes.data;
      const userRes = await axios.post('http://192.168.1.2:3000/api/userid/get-username', { username });
      const user = userRes.data;
      const bikeRes = await axios.post('http://192.168.1.2:3000/api/bicycles/get-bikeid', { bikeId });
      const bike = bikeRes.data;

      // console.log(loc);

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

  const handleInputChange = async (text) => {
    setLocDrop(text);
  
    if (text.length > 0) {
      try {
        const response = await axios.post('http://192.168.1.2:3000/api/locations/search', {
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
  

  const handleEndRide = async () => {
    try {
      const locationResponse = await axios.post('http://192.168.1.2:3000/api/locations/locid', { loc_id: locDrop });
      const location = locationResponse.data;

      if (!location) {
        console.error('Invalid location ID.');
        return;
      }


      // setMarkers([...markers, { latitude: location.latitude, longitude: location.longitude }]);   //
      // // Assume you have a function to get the route coordinates
      // const routeCoords = await getRouteCoordinates(region, location);
      // setRouteCoordinates(routeCoords);   //


      const response = await axios.put('http://192.168.1.2:3000/api/rides/end', {
        rideId,
        loc_drop: location._id,
      });

      const rideData = response.data;

      // Clear saved ride data
      await AsyncStorage.removeItem('currentRide');


      navigation.navigate('Summary', rideData); // Or another relevant page
      
    } catch (error) {
      console.error('Error ending ride:', error);
    }
  };


  // const getRouteCoordinates = async (start, end) => {   //
  //   try {
  //     const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
  //     const startLocation = `${start.latitude},${start.longitude}`;
  //     const endLocation = `${end.latitude},${end.longitude}`;
  
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/directions/json`,
  //       {
  //         params: {
  //           origin: startLocation,
  //           destination: endLocation,
  //           key: apiKey,
  //         },
  //       }
  //     );
  
  //     if (response.data.status === 'OK') {
  //       const points = response.data.routes[0].overview_polyline.points;
  //       const route = decodePolyline(points);
  //       return route.map((point) => ({
  //         latitude: point[0],
  //         longitude: point[1],
  //       }));
  //     } else {
  //       console.error('Error fetching directions:', response.data.status);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error('Error fetching route coordinates:', error);
  //     return [];
  //   }
  // };   //


  // Helper function to decode the polyline
// const decodePolyline = (encoded) => {   //
//   let points = [];
//   let index = 0,
//     len = encoded.length;
//   let lat = 0,
//     lng = 0;

//   while (index < len) {
//     let b, shift = 0,
//       result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
//     lat += dlat;

//     shift = 0;
//     result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
//     lng += dlng;

//     points.push([lat / 1e5, lng / 1e5]);
//   }

//   return points;
// };   //


  handleRidedata();

  return (
    <View style={styles.container}>
      {/* <MapView  
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
        <Polyline coordinates={routeCoordinates} />
      </MapView> */}
      {/* <View style={styles.detailsContainer}> */}
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
          // onChangeText={setLocDrop}
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

        <Button title="End Ride" onPress={handleEndRide} />
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  // map: {
  //   flex: 0.6,
  // },
  detailsContainer: {
    flex: 1, // 0.4
    justifyContent: 'center',
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