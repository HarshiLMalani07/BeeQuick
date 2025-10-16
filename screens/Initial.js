import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Initial = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // Token exists, navigate to home screen
          // navigation.navigate('Rental');
          const checkCurrentRide = async () => {
            const rideData = await AsyncStorage.getItem('currentRide');
            if (rideData) {
              const { rideId, username, bikeId, loc_pick, time_pick } = JSON.parse(rideData);
              navigation.navigate('Status', { rideId, username, bikeId, loc_pick, time_pick });
            }
            else
            {
              navigation.navigate('Rental');
            }
          };
        
          checkCurrentRide();
        } else {
            // console.log(token);
          // No token, navigate to login screen
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token', error);
        navigation.navigate('Login');
      }
    };

    checkToken();
  }, [navigation]);

  // useEffect(() => {
  //   const checkCurrentRide = async () => {
  //     const rideData = await AsyncStorage.getItem('currentRide');
  //     if (rideData) {
  //       const { rideId, username, bikeId, loc_pick, time_pick } = JSON.parse(rideData);
  //       navigation.navigate('Status', { rideId, username, bikeId, loc_pick, time_pick });
  //     }
  //   };
  
  //   checkCurrentRide();
  // }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Initial;
