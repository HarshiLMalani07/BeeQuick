// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = ({ navigation }) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      gender: '',
      residence: '',
      age: '',
      phone_number: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
      gender: Yup.string().required('Gender is required'),
      residence: Yup.string().required('Residence is required'),
      age: Yup.number()
        .required('Age is required')
        .positive('Age must be positive')
        .integer('Age must be an integer'),
      phone_number: Yup.string().required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://192.168.1.2:3000/api/auth/register', values);
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
        />
        {formik.touched.username && formik.errors.username ? (
          <Text style={styles.error}>{formik.errors.username}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
        />
        {formik.touched.email && formik.errors.email ? (
          <Text style={styles.error}>{formik.errors.email}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
        />
        {formik.touched.password && formik.errors.password ? (
          <Text style={styles.error}>{formik.errors.password}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Gender"
          placeholderTextColor="#999"
          value={formik.values.gender}
          onChangeText={formik.handleChange('gender')}
          onBlur={formik.handleBlur('gender')}
        />
        {formik.touched.gender && formik.errors.gender ? (
          <Text style={styles.error}>{formik.errors.gender}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Residence"
          placeholderTextColor="#999"
          value={formik.values.residence}
          onChangeText={formik.handleChange('residence')}
          onBlur={formik.handleBlur('residence')}
        />
        {formik.touched.residence && formik.errors.residence ? (
          <Text style={styles.error}>{formik.errors.residence}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formik.values.age}
          onChangeText={formik.handleChange('age')}
          onBlur={formik.handleBlur('age')}
        />
        {formik.touched.age && formik.errors.age ? (
          <Text style={styles.error}>{formik.errors.age}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          value={formik.values.phone_number}
          onChangeText={formik.handleChange('phone_number')}
          onBlur={formik.handleBlur('phone_number')}
        />
        {formik.touched.phone_number && formik.errors.phone_number ? (
          <Text style={styles.error}>{formik.errors.phone_number}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
});

export default Register;
