// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Initial from '../screens/Initial';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Rental from '../screens/Rental';
import Status from '../screens/Status';
import Summary from '../screens/Summary';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen 
        name="Initial" 
        component={Initial} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Rental" 
        component={Rental} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Status" 
        component={Status} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Summary" 
        component={Summary} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
