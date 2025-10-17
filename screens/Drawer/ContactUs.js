import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import emailjs, {EmailJSResponseStatus} from '@emailjs/react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';

const ContactUs = ({route}) => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const onSubmit = async () => {
    if (!username || !query) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await emailjs.send(
        'service_3j3cn0c',
        'template_rkkeihu',
        {from_name: username, to_name: 'Bee-Quick', message: query},
        {
          publicKey: 'WVwwFIVpRJQsdJGeS',
        },
      );
      setUsername('');
      setQuery('');
      console.log('SUCCESS!');
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EMAILJS FAILED...', err);
        return;
      }

      console.log('ERROR', err);
    }
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <View style={styles.inputBox}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.label}>Query</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={query}
          onChangeText={setQuery}
          placeholder="Enter your query"
          placeholderTextColor="#888"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    alignSelf: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFBD0',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    width: 350,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    color: 'black',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    transform: [{scale: 1}],
    transition: 'transform 0.2s',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactUs;
