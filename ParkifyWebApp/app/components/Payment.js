import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useStripe } from "@stripe/stripe-react-native";
import moment from "moment/moment";
const logo = require("../assets/logo.png");

const Payment = (props) => {
  const stripe = useStripe();
  const car = props.car[0];

  const payAPI = async () => {
    try {
      const res = await fetch(`https://f96e-77-75-244-148.eu.ngrok.io/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          parkingFee: car.parkingFee * 100, //10euro in unit of cents
          //paymentStatus : boolean? status?//ADDING STATUS TO CHECK IT PAY OR NOT
        }),
      });

      const data = await res.json();
      console.log(data);
      console.log("Button Pressed");

      if (!res.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        // applePay: {
        //   merchantCountryCode: 'EU',
        // }
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment complete, thank you!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {car ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parking Details</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Plate Number:</Text>
            <Text style={styles.cardValue}>{car.license_plate}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Entry Time:</Text>
            <Text style={styles.cardValue}>{moment(car.timeEntry).format('YYYY/MM/DD HH:mm')}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Exit Time:</Text>
            <Text style={styles.cardValue}>{moment(car.timeExit).format('YYYY/MM/DD HH:mm')}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Parking Fee:</Text>
            <Text style={styles.cardValue}>€{car.parkingFee}</Text>
          </View>
        </View>
      ) : null}

      <TouchableOpacity style={styles.payButton} onPress={async () => payAPI()}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginVertical: 15,
  },
  logo: {
    width: 350,
    height: 200,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    width: 300,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    alignSelf:"center"

  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardValue: {
    flex: 1,
    marginTop: 10,
    fontSize: 15,
    textAlign: "right",
  },
  payButton: {
    backgroundColor: "palevioletred",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Payment;
