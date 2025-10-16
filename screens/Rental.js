import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BikeCard from '../components/BikeCard';
import { useAuth } from '../context/AuthContext';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Rental = ({ navigation }) => {
  const [bikes, setBikes] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  // const { userId } = useAuth(); // Access userId and token

  const getUserId = async () => {
    try {
      // Make the request to your backend endpoint
      const response = await axios.get('http://192.168.1.2:3000/api/userid/get-user-id', { withCredentials: true });
      setUserId(response.data.userId);
  
      // console.log('User ID:', userId);
      // Use the userId as needed in your application
    } catch (error) {
      console.error('Error fetching user ID:', error);
      // Handle error as needed
    }
  };
  
  // Call the function to fetch user ID
  // getUserId();   // this should be in useefect hook at the end of .catch 

  useEffect(() => {
    // Fetch the token from cookies
    CookieManager.get('http://192.168.1.2:3000')
      .then((cookies) => {
        if (cookies.token) {
          setToken(cookies.token.value);
        }
      })
      .catch((error) => {
        console.error('Error fetching token from cookies:', error);
      });

      // here getUserId() call
      getUserId();
  }, []);
  // useEffect(() => {
  //   // Token could be used here if needed for API requests
  // }, [token]);

  const formik = useFormik({
    initialValues: {
      loc_id: '',
    },
    validationSchema: Yup.object({
      loc_id: Yup.string().required('Location is required.'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!token) {
        setErrors({ submit: 'No token available. Please login again.' });
        setSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(
          'http://192.168.1.2:3000/api/bicycles/available',
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBikes(response.data);
      } catch (error) {
        console.error(error);
        setErrors({ submit: 'An error occurred while fetching bikes.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleInputChange = async (text) => {
    formik.setFieldValue('loc_id', text);
  
    if (text.length > 0) {
      try {
        const response = await axios.post(
          'http://192.168.1.2:3000/api/locations/search',
          { query: text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLocationSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      setLocationSuggestions([]);
    }
  };
  

  const handleSelectLocation = (locationId) => {
    formik.setFieldValue('loc_id', locationId);
    setLocationSuggestions([]);
  };

  const handleBook = async (bikeId) => {
    // console.log(formik.values.loc_id);
    // console.log(bikeId);
    // console.log(token);
    try {
      const locationResponse = await axios.post('http://192.168.1.2:3000/api/locations/locid', { loc_id: formik.values.loc_id });
      const location = locationResponse.data;

      if (!location) {
        console.error('Invalid location ID.');
        return;
      }

      // console.log(location._id);

      const response = await axios.post('http://192.168.1.2:3000/api/rides/create', {
        username: userId,
        bikeId: bikeId,
        loc_pick: location._id,
      });

      const { _id: rideId, time_pick: time_pick } = response.data;

      // Save ride data to AsyncStorage
      await AsyncStorage.setItem('currentRide', JSON.stringify({ rideId, username: userId, bikeId, loc_pick: location._id, time_pick }));

      navigation.navigate('Status', { rideId, username: userId, bikeId, loc_pick: location._id, time_pick });
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://192.168.1.2:3000/api/auth/logout', {}, { withCredentials: true });
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rental Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pickup Location"
        placeholderTextColor="#999"
        value={formik.values.loc_id}
        onChangeText={handleInputChange}   // here i have changed onChangeText for testing of suggestion if not implemented please remove this 
        // onChangeText={formik.handleChange('loc_id')}
        onBlur={formik.handleBlur('loc_id')}
      />
      {formik.touched.loc_id && formik.errors.loc_id ? (
        <Text style={styles.error}>{formik.errors.loc_id}</Text>
      ) : null}

      {locationSuggestions.length > 0 && (
        <FlatList
          data={locationSuggestions}
          keyExtractor={(item) => item.loc_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectLocation(item.loc_id)}>
              <Text style={styles.suggestionText}>{item.loc_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={formik.handleSubmit} disabled={formik.isSubmitting}>
        <Text style={styles.buttonText}>Search Bikes</Text>
      </TouchableOpacity>
      {formik.errors.submit && <Text style={styles.error}>{formik.errors.submit}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {bikes.length === 0 ? (
        <Text style={styles.noBikesText}>No Bicycles available right now</Text>
      ) : (
        <FlatList
          data={bikes}
          keyExtractor={item => item.bikeId.toString()}
          renderItem={({ item }) => (
            <BikeCard bike={item} onBook={() => handleBook(item._id)} />
          )}
        />
      )}
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
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    marginTop: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  suggestionList: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  suggestionText: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  noBikesText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Rental;
