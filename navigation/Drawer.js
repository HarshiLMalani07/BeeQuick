import '../gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Iconicons from 'react-native-vector-icons/Ionicons'; // Make sure to install @expo/vector-icons
import PaymentHistory from '../screens/Drawer/PaymentHistory';
import Profile from '../screens/Drawer/Profile';
import Rental from '../screens/Drawer/Rental';
import Logout from '../screens/Drawer/Logout';
import CustomDrawer from '../screens/Drawer/CustomDrawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useEffect} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import ContactUs from '../screens/Drawer/ContactUs';
const Drawer = createDrawerNavigator();

function MyDrawer({route, navigation}) {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#FFC107',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={Rental}
        options={{
          headerShown: false,
          drawerIcon: ({color}) => (
            <Iconicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          drawerIcon: ({color}) => (
            <MaterialIcons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment history"
        component={PaymentHistory}
        options={{
          headerShown: false,
          drawerIcon: ({color}) => (
            <MaterialIcons name="payment" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
