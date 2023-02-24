import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const InputScreen = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    axios.get(`https://your-server.com/parking_logs/${licensePlate}`)
      .then(response => {
        const parkingLog = response.data;
        navigation.navigate('Details', { parkingLog });
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Parkify</Text>
        <Text style={styles.subtitle}>Please enter your license plate number below:</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setLicensePlate(text)}
          value={licensePlate}
          placeholder="Enter your license plate"
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
});

export default InputScreen;
