import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useState} from 'react';
import axios from 'axios';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Iconicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UserContext} from '../../context/UserProvider';
import ContactUs from './ContactUs'; // Import the ContactUs component

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const CustomDrawer = props => {
  const {user} = useContext(UserContext);
  const userData = user.user;
  const {navigation} = props;

  const logout = async () => {
    try {
      await axios.post('http://192.168.29.20:3000/api/auth/logout');
      console.log('Logged out successfully');
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.log('Logout failed: ', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#FFC107'}}>
        <ImageBackground
          source={require('./bgimage.jpg')}
          style={{padding: 20}}>
          <Image
            source={require('./profile-modified.png')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
            }}>
            {capitalizeFirstLetter(userData.username)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto-Regular',
              }}>
              {userData.balance} Coins
            </Text>
            <FontAwesome5
              style={{marginLeft: 5, marginTop: 4}}
              name="coins"
              size={14}
              color="#fff"
            />
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
          <View
            style={{
              borderTopWidth: 3,
              borderTopColor: '#FFC107',
              marginTop: 357,
              paddingBottom: 20,
              height: 110,
            }}>
            <ImageBackground
              source={require('./bgimage.jpg')}
              style={{paddingTop: 20, paddingBottom: 20}}>
              <DrawerItem
                style={{marginTop: -10}}
                label="Contact us"
                onPress={() => props.navigation.navigate('ContactUs', userData)}
                icon={({}) => (
                  <MaterialIcons
                    name="contact-support"
                    size={22}
                    color="#fff"
                  />
                )}
                labelStyle={{
                  marginLeft: -15,
                  fontSize: 15,
                  fontFamily: 'Roboto-Medium',
                  color: '#fff',
                }}
              />
              <DrawerItem
                label="Sign Out"
                style={{marginTop: -20}}
                icon={() => (
                  <MaterialIcons name="exit-to-app" size={22} color="#fff" />
                )}
                onPress={logout}
                labelStyle={{
                  marginLeft: -15,
                  fontSize: 15,
                  fontFamily: 'Roboto-Medium',
                  color: '#fff',
                }}
              />
            </ImageBackground>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
