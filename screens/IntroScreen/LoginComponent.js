import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firebase from "../../database/firebase";
import CheckBox from '@react-native-community/checkbox';

const { width, height } = Dimensions.get("screen");
const imageHeight = height * 0.3;
const imageWidth = imageHeight * 1.1;
const putih = "#e6eff6";
const biruTua = "#64ace6";
const inputWidth = width * 0.8;
const bodyHeight = height - imageHeight;

export default class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      email: "vnakanaori@gmail.com",
      password: "123456",
      isLoading: false,
    };
  }

  checkBoxPressed() {
    this.setState({
      checked: !this.state.checked,
    });
    console.log(this.state.checked);
  }

  componentWillUnmount() {
    this.setState({
      checked: false,
      email: "",
      password: "",
      isLoading: false,
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  userLogin = () => {
    if (this.state.email === "" || this.state.password === "") {
      Alert.alert("Please fill in your email / password!");
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          if (!res.user.emailVerified) {
            Alert.alert("Please Verified your account!");
            res.user.sendEmailVerification();
          } else {
            if(this.state.checked){
                const credential = firebase.auth.EmailAuthProvider.credential(
                    this.state.email,
                    this.state.password
                  );
                  AsyncStorage.setItem(
                    "user",
                    JSON.stringify(credential)
                  ).catch((err) => Alert.alert(`Error : ${err.code}`));
            }
            ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
              email: "",
              password: "",
            });
            this.props.navigation.navigate("HomeStack");
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
          switch (error.code) {
            case "auth/invalid-email":
              Alert.alert("This email is not registered");
              break;
            case "auth/wrong-password":
              Alert.alert("Wrong password!");
              break;
            case "auth/network-request-failed":
              Alert.alert("No internet!");
              break;
            default:
              Alert.alert("Unknown Error. " + error.code);
              break;
          }
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require("../../assets/piggyBank.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.inputForm}>
            <Text style={styles.title}>Login</Text>

            {/* Input Email */}
            <View style={styles.section}>
              <MaterialIcons
                name="email"
                size={20}
                style={{ marginRight: 5 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, "email")}
                autoCapitalize={"none"}
              />
            </View>

            {/* Input Password */}
            <View style={styles.section}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                style={{ marginRight: 5 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, "password")}
                secureTextEntry
              />
            </View>
          </View>

          {/* Baris remember me dan forget password */}
          <View style={styles.rememberForgot}>
            {/* CheckBox dengan teks */}
            <View style={styles.checkBox}>
              <CheckBox
                value={this.state.checked}
                onChange={() => this.checkBoxPressed()}
              />
              <Text>Remember me?</Text>
            </View>

            {/* Tombol forget pass */}
            <TouchableOpacity style={styles.forgotPass}
            onPress = {() => this.props.navigation.navigate('ForgetPasswordScreen')}>
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          {/* Button login */}
          <View style={styles.actionButton}>
            {/* Masuk dengan email */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.userLogin()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpOption}>
            <Text>Don't have an account yet?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.replace("SignUpScreen")}
            >
              <Text style={{ color: "blue", paddingLeft: 2 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: putih,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: biruTua,
  },
  inputForm: {
    alignItems: "center",
  },
  logo: {
    height: imageHeight,
    width: imageWidth,
  },
  section: {
    borderColor: biruTua,
    borderWidth: 1,
    width: inputWidth,
    borderRadius: 25,
    backgroundColor: biruTua,
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  textInput: {
    color: putih,
    width: inputWidth - 15,
  },
  forgotPass: {
    justifyContent: "flex-end",
  },
  rememberForgot: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: biruTua,
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  signUpOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  body: {
    flex: 1.5,
    backgroundColor: putih,
    height: bodyHeight,
  },
});
