import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firebase from "../../database/firebase";

const { width, height } = Dimensions.get("screen");
const imageHeight = height * 0.3;
const putih = "#e6eff6";
const biruTua = "#64ace6";
const inputWidth = width * 0.8;
const bodyHeight = height - imageHeight;

export default class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isLoading: false,
    };
  }

  sendEmail = () => {
      firebase.auth().sendPasswordResetEmail(this.state.email).then(()=> {
          ToastAndroid.show("Email sent successfully!",ToastAndroid.SHORT);
          this.props.navigation.goBack();
      }).catch((error)=> {
        Alert.alert(error.code);
      })
  }

  componentWillUnmount() {
    this.setState({
      email: "",
      isLoading: false,
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
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
        <View style={styles.body}>
          <View style={styles.inputForm}>
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
          </View>

          {/* Button login */}
          <View style={styles.actionButton}>
            {/* Masuk dengan email */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.sendEmail()}
            >
              <Text style={styles.buttonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  inputForm: {
    alignItems: "center",
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
  body: {
    flex: 1,
    backgroundColor: putih,
    height: bodyHeight,
    justifyContent: "center",
    alignContent: "center",
  },
});
