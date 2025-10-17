// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Initial from '../screens/Initial';
import Login from '../screens/Login';
import Register from '../screens/Register';
import MyDrawer from './Drawer';
import Status from '../screens/Status';
import Summary from '../screens/Summary';
import {NavigationContainer} from '@react-navigation/native';
import {UserProvider} from '../context/UserProvider';
import ContactUs from '../screens/Drawer/ContactUs';
const Stack = createStackNavigator();
        // <Stack.Navigator initialRouteName="Initial">
    //   <Stack.Screen 
    //     name="Initial" 
    //     component={Initial} 
    //     options={{ headerShown: false }} 
    //   />
    //   <Stack.Screen 
    //     name="Login" 
    //     component={Login} 
    //     options={{ headerShown: false }} 
    //   />
    //   <Stack.Screen 
    //     name="Register" 
    //     component={Register} 
    //     options={{ headerShown: false }} 
    //   />
    //   <Stack.Screen 
    //     name="Rental" 
    //     component={Rental} 
    //     options={{ headerShown: false }} 
    //   />
    //   <Stack.Screen 
    //     name="Status" 
    //     component={Status} 
    //     options={{ headerShown: false }} 
    //   />
    //   <Stack.Screen 
    //     name="Summary" 
    //     component={Summary} 
    //     options={{ headerShown: false }} 
    //   />
    // </Stack.Navigator>
function AppNavigator() {
  return (

    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen 
        name="Initial" 
        component={Initial} 
        options={{ headerShown: false }} 
      />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyDrawer"
            component={MyDrawer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ContactUs"
            component={ContactUs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Status"
            component={Status}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Summary"
            component={Summary}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
// navigation.navigate('MyDrawer', {screen: 'Rental'});
export default AppNavigator;
