import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { KeyboardAvoidingView} from "react-native";
import { useState, useEffect } from "react";
import {StripeProvider} from "@stripe/stripe-react-native"
import Payment from "./components/Payment";
import {configurePushNotifications } from './notifications'
import moment from "moment/moment";

const LINK = "https://af5a-77-75-244-156.ngrok-free.app"
const Stack = createNativeStackNavigator();

export default App = () => {
  useEffect(() => {

    configurePushNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Parkify Application", headerStyle: { backgroundColor: "lightcoral", }, headerTintColor: "#fff",  headerTitleStyle: { fontWeight: "bold", fontFamily: "Cochin", },  }} /> 
        <Stack.Screen name="Calculate" component={CalculateScreen} options={{ title: "Calculate Parking Fee", headerStyle: {  backgroundColor: "indianred", }, headerTintColor: "#fff", headerTitleStyle: {  fontWeight: "bold",  fontFamily: "Cochin", }, }}/>
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment Screen", headerStyle: {  backgroundColor: "indianred", }, headerTintColor: "#fff", headerTitleStyle: {    fontWeight: "bold",    fontFamily: "Cochin",  },  }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const logo = require("./assets/logo.png");

const HomeScreen = ({ navigation }) => {
  const [carLP, setCarLP] = useState("");
  const searchAPI = async () => {
    try {
      const res = await fetch(
        `https://af5a-77-75-244-156.ngrok-free.app/getSpecificCar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            license_plate: carLP,
          }),
        }
      );
      const data = await res.json(); // Parse the response as JSON
      console.log(data);
      if (data && data.length > 0) {
        navigation.navigate("Calculate", { car: data }); //Passing car data to the Calculate page
      } else {
        Alert.alert("Car not found in database!");
      }
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
      <Text style={styles.homeTitle}>
        Enter license plate to search!
      </Text>
      <Text style={styles.homeBody}>License Plate: </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the License Plate here"
        onChangeText={(newCarLP) => setCarLP(newCarLP)}
        value={carLP}
      />
      <TouchableOpacity
        style={styles.inputButton}
        onPress={async () => searchAPI()}
      >
        <Text style={styles.inputText}>Search license plate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const CalculateScreen = ({ navigation, route }) => {
  var car = route.params.car;
  const updateAPI = async () => {
    try {
      const res = await fetch(
        `https://af5a-77-75-244-156.ngrok-free.app/updateSpecificCar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            license_plate: car?.[0]?.license_plate,
            timeExit: new Date().toISOString(),
          }),
        }
      );
      
      const data = await res.text();
      console.log(data);
      navigation.navigate("Payment", { car: car }); //Passing car data to the Payment page
   
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
          <View>
            <Text style={styles.cardText}>
              Plate Number: {car?.[0]?.license_plate}
            </Text>
            <Text style={styles.cardText}>
              Entry Time: {moment(car?.[0]?.timeEntry).format('YYYY/MM/DD HH:mm')}
            </Text>
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={async () => updateAPI()}
      >
        <Text style={styles.inputText}>Pay and exit now!</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const PaymentScreen = ({ navigation, route}) => {
  var car = route.params.car;
  console.log('car object:', car);

  return (
    <StripeProvider publishableKey="pk_test_51Mot9bIWIjnneG7hW9yDmDgLA9L4gT9JRZL3c3nRmGKOwVpfRXdGFFPobbD88auKHzYj2VQha2vVwR2sPDueICk000FuTNp46f">
      <Payment car={car}/>
    </StripeProvider>
  );
};




const styles = StyleSheet.create({
  homeTitle: {
    marginBottom: 30,
    fontSize: 20,
    fontFamily: "Cochin",
    fontWeight: "bold",
  },
  homeBody: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: "Cochin",
    fontWeight: "bold",
  },
  inputButton: {
    height: 40,
    width: 165,
    margin: 12,
    marginTop: 35,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    borderColor: "maroon",
  },

  exitButton: {
    height: 40,
    width: 165,
    margin: 12,
    marginTop: 35,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "lightsalmon",
    backgroundColor: "lightpink",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 3,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  inputText: {
    color: "maroon",
    fontSize: 15,
    alignSelf: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "indianred",
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 350,
    height: 200,
  },

  card: {
    backgroundColor: "palevioletred",
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  cardText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Cochin",
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowRadius: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    elevation: 8,
    backgroundColor: "#5cb85c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },

  // //FUNCTION PAGE
  // containerFunc: {
  //   flex: 1,
  //   backgroundColor: "#E8EAED",
  // },
  // tasksWrapper: {
  //   paddingTop: 80,
  //   paddingHorizontal: 20,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  // },
  // itemsListing: {
  //   marginTop: 30,
  // },
  // writeTaskWrapper: {
  //   position: "absolute",
  //   bottom: 60,
  //   width: "100%",
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   alignItems: "center",
  // },
  // inputfunction: {
  //   paddingVertical: 15,
  //   paddingHorizontal: 15,
  //   backgroundColor: "#FFF",
  //   borderRadius: 60,
  //   borderColor: "#C0C0C0",
  //   borderWidth: 1,
  //   width: 250,
  // },
  // inputfunction1: {
  //   paddingVertical: 15,
  //   paddingHorizontal: 15,
  //   backgroundColor: "#FFF",
  //   borderRadius: 60,
  //   borderColor: "#C0C0C0",
  //   borderWidth: 1,
  // },
  // addWrapper: {
  //   width: 60,
  //   height: 60,
  //   backgroundColor: "#FFF",
  //   borderRadius: 60,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderColor: "lightsalmon",
  //   borderWidth: 1,
  // },
  // addText: {},
});
