import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from "react-native-swiper";
import * as Animatable from "react-native-animatable";
import firebase from "../../database/firebase";

export default class SwiperComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpAnimation: null,
      loginAnimation: null,
      show: false,
      isLoading : true
    };
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        let auth = JSON.parse(value);
        firebase
          .auth()
          .signInWithEmailAndPassword(auth.email, auth.password)
          .then((res) => {
            this.setState({
              isLoading : false
            })
            this.props.navigation.navigate('HomeStack');
          });
      }
      this.setState({
        isLoading : false
      })
    } catch (error) {
        Alert.alert(error.code)
    }
  };

  componentDidMount() {
    this.retrieveData();
  }

  onIndexChanged(index) {
    if (index == 2) {
      this.setState({
        signUpAnimation: "bounceInLeft",
        loginAnimation: "bounceInRight",
        show: true,
      });
    } else {
      this.setState({
        signUpAnimation: null,
        loginAnimation: null,
        show: false,
      });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style = {{flex : 1,justifyContent : 'center', alignContent : 'center'}}>
          <ActivityIndicator size = {'large'}/>
        </View>
      )
    }
    return (
      <Swiper
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => this.onIndexChanged(index)}
      >
        {/* slide pertama */}
        <View style={styles.slider}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/moneyInHand.png")}
              style={styles.image}
              resizeMode={"stretch"}
            />
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>Control Money in Your Hands</Text>
            <Text style={styles.desc}>
              With a few click, your money will be organized
            </Text>
          </View>
        </View>
        {/* slide kedua */}
        <View style={styles.slider}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/receipt.png")}
              style={styles.image}
              resizeMode={"stretch"}
            />
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>Manage Your Receipt</Text>
            <Text style={styles.desc}>
              With just one photo, your receipt will be included in the
              calculation
            </Text>
          </View>
        </View>
        {/* slide ketiga */}
        <View style={styles.slider}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/piggyBank.png")}
              style={styles.image}
              resizeMode={"stretch"}
            />
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>
              Let's make your finances organized and safe!
            </Text>
            {this.state.show ? (
              <View style={{ flexDirection: "row" }}>
                {/* button Sign up */}
                <Animatable.View
                  animation={this.state.signUpAnimation}
                  delay={0}
                  duration={1500}
                  useNativeDriver
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("SignUpScreen")
                    }
                    style={[
                      styles.button,
                      {
                        borderColor: "black",
                        borderRadius: 50,
                        borderWidth: 1,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text style={{ color: "black" }}>Sign Up</Text>
                  </TouchableOpacity>
                </Animatable.View>

                {/* button Login */}
                <Animatable.View
                  animation={this.state.loginAnimation}
                  delay={0}
                  duration={1500}
                  useNativeDriver
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("LoginScreen")
                    }
                    style={[
                      styles.button,
                      {
                        backgroundColor: "black",
                        borderRadius: 50,
                        marginTop: 15,
                        marginLeft: 20,
                      },
                    ]}
                  >
                    <Text style={{ color: "white" }}>Login</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            ) : null}
          </View>
        </View>
      </Swiper>
    );
  }
}
const { width, height } = Dimensions.get("screen");
const heightImage = height * 0.5 * 0.8;
const widthImage = heightImage * 1.1;
const buttonWidth = width * 0.3;
const biruMuda = "#adcbe3";
const putih = "#e6eff6";
const biruTua = "#64ace6";
var styles = StyleSheet.create({
  slider: {
    flex: 1,
    backgroundColor: biruTua,
  },
  header: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    height: heightImage,
    width: widthImage,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: putih,
    textAlign: "center",
  },
  desc: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  dot: {
    backgroundColor: putih,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  activeDot: {
    backgroundColor: biruMuda,
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  button: {
    width: buttonWidth,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
