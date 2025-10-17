import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const Navbar = ({balance}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          navigation.openDrawer();
        }}>
        <MaterialIcons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.balance}>
        <Text style={styles.balanceText}>Balance: </Text>
        <Text style={styles.balanceValue}>₹{balance}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8e90b',
    color: 'black',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: 'full',
    zIndex: 1,
    borderBottomWidth: 5,
    borderBottomColor: '#FF9900',
  },
  menuButton: {
    padding: 10,
  },
  detailsButton: {
    position: 'absolute',
    left: 50,
    top: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  detailsText: {
    color: '#6200EE',
  },
  balanceText: {
    color: '#fff',
    fontSize: 20,
  },
  balance: {
    flexDirection: 'row',
  },
  balanceValue: {
    backgroundColor: 'black', // Black background color
    paddingVertical: 5, // Add padding
    paddingHorizontal: 15,
    borderRadius: 5, // Add border radius
    color: 'white', // Text color
    fontSize: 15,
  },
});

export default Navbar;
