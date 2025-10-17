import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {UserContext} from '../../context/UserProvider'; // Adjust the import path as needed

const PaymentHistoryScreen = () => {
  const {user} = useContext(UserContext);
  const [payments, setPayments] = useState([]);
  const userData = user.user;

  const getPayments = async () => {
    const userId = userData._id;
    try {
      const response = await axios.post(
        'http://192.168.29.20:3000/api/payment/getPayment',
        {userId: userId},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments data:', error);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {payments.map(payment => (
        <View key={payment._id} style={styles.paymentContainer}>
          <Text style={styles.paymentText}>Payment ID: {payment._id}</Text>
          <Text style={styles.paymentText}>
            Amount: {payment.payment_amount}
          </Text>
          <Text style={styles.paymentText}>Date: {payment.createdAt}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFBD0', // Light yellow background
  },
  paymentContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // White background for payment cards
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentText: {
    fontSize: 16,
    color: '#333', // Dark gray text
  },
});

export default PaymentHistoryScreen;
