import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import BikeCard from '../../components/BikeCard';
import {useAuth} from '../../context/AuthContext';
import CookieManager from '@react-native-cookies/cookies';
import {RAZORPAY_API_KEY, RAZORPAY_APT_SECRET} from '@env';
import RazorpayCheckout from 'react-native-razorpay';
import Navbar from '../Navbar';
import {UserContext} from '../../context/UserProvider';

const Rental = ({navigation, route}) => {
  const [bikes, setBikes] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isThereAnyBalance, setIsThereAnyBalance] = useState(1);
  const {setUser} = useContext(UserContext);
  // const { userId } = useAuth(); // Access userId and token
  const getUserId = async () => {
    try {
      const response = await axios.get(
        'http://192.168.29.20:3000/api/userid/get-user-id',
        {withCredentials: true},
      );
      setUserId(response.data.userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };
  const fetchBalance = async () => {
    try {
      const response = await axios.post(
        'http://192.168.29.20:3000/api/auth/getBalance',
        {user_id: userId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  const getNewUser = async () => {
    // console.log(userId);
    try {
      const response = await axios.post(
        'http://192.168.29.20:3000/api/userid/get-username',
        {username: userId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser({user: response.data});
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  useEffect(() => {
    getUserId();
    CookieManager.get('http://192.168.29.20:3000')
      .then(cookies => {
        if (cookies.token) {
          setToken(cookies.token.value);
        }
      })
      .catch(error => {
        console.error('Error fetching token from cookies:', error);
      });
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchBalance();
      getNewUser();
    }
  }, [userId, token]);

  useEffect(() => {
    if (route.params?.username && route.params?.token) {
      setUserId(route.params.username);
      setToken(route.params.token);
      setBalance(balance - route.params?.amount);
      getNewUser();
    }
  }, [route.params]);

  const formik = useFormik({
    initialValues: {
      loc_id: '',
    },
    validationSchema: Yup.object({
      loc_id: Yup.string().required('Location is required.'),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      if (!token) {
        setErrors({submit: 'No token available. Please login again.'});
        setSubmitting(false);
        return;
      }
      try {
        const response = await axios.post(
          'http://192.168.29.20:3000/api/bicycles/available',
          {loc_id: values.loc_id, user_id: userId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // if(response.message === "balance is zero"){
        // }
        if (response.data === 'balance is zero') {
          setIsThereAnyBalance(0);
        } else {
          setBikes(response.data);
        }
      } catch (error) {
        console.error(error);
        setErrors({submit: 'An error occurred while fetching bikes.'});
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBook = async bikeId => {
    // console.log(formik.values.loc_id);
    // console.log(bikeId);
    // console.log(token);
    try {
      const locationResponse = await axios.post(
        'http://192.168.29.20:3000/api/locations/locid',
        {loc_id: formik.values.loc_id},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const location = locationResponse.data;

      if (!location) {
        console.error('Invalid location ID.');
        return;
      }

      // console.log(location._id);

      const response = await axios.post(
        'http://192.168.29.20:3000/api/rides/create',
        {
          username: userId,
          bikeId: bikeId,
          loc_pick: location._id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log(userId, bikeId, location._id);
      const {_id: rideId, time_pick: time_pick} = response.data;

      navigation.navigate('Status', {
        rideId,
        username: userId,
        bikeId,
        loc_pick: location._id,
        time_pick,
        token,
      });
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };
  const handlePayment = async () => {
    const amount = 100;
    const currency = 'INR';
    const response = await axios.post(
      'http://192.168.29.20:3000/api/payment/createOrder',
      {
        amount: amount * 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const order = response.data;

    var options = {
      description: 'BeeQuick Add Money',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: currency,
      key: RAZORPAY_API_KEY,
      amount: amount * 100,
      name: 'My Customer',
      order_id: order.id, // Use the order_id from the server
      theme: {color: '#f8e90b'},
    };
    RazorpayCheckout.open(options)
      .then(async data => {
        await axios.post(
          'http://192.168.29.20:3000/api/payment/savePayment',
          {
            user_id: userId,
            payment_id: data.razorpay_payment_id,
            payment_amount: amount,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        alert(`Success: ${data.razorpay_payment_id}`);
        setIsThereAnyBalance(1);
        setBalance(balance + amount);
      })
      .catch(error => {
        console.error('Payment failed:', error);
        alert(`Error: ${error.code} | ${error.message}`);
      });
  };
  const handleBalance = async charge => {
    setBalance(balance - charge);
  };
  return (
    <View style={styles.container}>
      <Navbar balance={balance} />
      <Text style={styles.title}>Rental Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pickup Location"
        placeholderTextColor="#999"
        value={formik.values.loc_id}
        onChangeText={formik.handleChange('loc_id')}
        onBlur={formik.handleBlur('loc_id')}
      />
      {formik.touched.loc_id && formik.errors.loc_id ? (
        <Text style={styles.error}>{formik.errors.loc_id}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}>
        <Text style={styles.buttonText}>Search Bikes</Text>
      </TouchableOpacity>
      {isThereAnyBalance === 1 ? (
        ''
      ) : (
        <>
          <Text style={styles.error}>You have no balance in your wallet</Text>
          <TouchableOpacity style={styles.button} onPress={handlePayment}>
            <Text style={styles.buttonText}>Add money</Text>
          </TouchableOpacity>
        </>
      )}
      {formik.errors.submit && (
        <Text style={styles.error}>{formik.errors.submit}</Text>
      )}

      {bikes.length === 0 ? (
        <Text style={styles.noBikesText}>No Bicycles available right now</Text>
      ) : (
        <FlatList
          data={bikes}
          keyExtractor={item => item.bikeId.toString()}
          renderItem={({item}) => (
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
    backgroundColor: '#FFFBD0',
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
    borderColor: '#FF9900',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f8e90b',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  noBikesText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     color: '#333',
//   },
//   input: {
//     width: '100%',
//     padding: 15,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     color: '#333',
//   },
//   button: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#4CAF50',
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   switchText: {
//     marginTop: 20,
//     color: '#333',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 12,
//   },
//   noBikesText: {
//     fontSize: 18,
//     color: '#888',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
// });

export default Rental;
