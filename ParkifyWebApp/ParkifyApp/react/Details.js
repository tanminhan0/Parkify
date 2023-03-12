import React, { useState } from 'react';
import {View, Text, Button, StyleSheet } from 'react-native';

const Details = ({ route, navigation }) => {
  const [parkingFee, setParkingFee] = useState(null);

  const { parkingLog } = route.params;

  const handleExit = () => {
    // Code to calculate parking fee and update parking log in database
    setParkingFee(parkingFeeCalculatedFromDatabase);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Details</Text>
      <Text style={styles.licensePlate}>License Plate: {parkingLog.licensePlate}</Text>
      <Text style={styles.entryTime}>Entry Time: {parkingLog.entryTime}</Text>
      {parkingFee ? (
        <Text style={styles.parkingFee}>Parking Fee: {parkingFee}</Text>
      ) : (
        <View>
          <Text style={styles.warning}>
            Please exit the parking spot within 15 minutes.
          </Text>
          <Button title="Exit" onPress={handleExit} />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    licensePlate: {
      fontSize: 18,
      marginBottom: 10,
    },
    entryTime: {
      fontSize: 18,
      marginBottom: 10,
    },
    parkingFee: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    warning: {
      fontSize: 18,
      marginBottom: 10,
      color: 'red',
    },
  });
  
export default Details;
