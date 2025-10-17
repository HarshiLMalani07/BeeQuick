/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext'; // Import your AuthProvider
import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';

import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(
  appName,
  (App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    );
  }),
);

export default App;
