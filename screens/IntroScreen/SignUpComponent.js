import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../database/firebase';

export default class SignUpComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  registerUser = () => {
    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.userName === '' ||
      this.state.confirmPassword === ''
    ) {
      Alert.alert('Please enter details to signup!');
    } else if (this.state.password !== this.state.confirmPassword) {
      Alert.alert('Please confirm your password!');
    } else if (this.state.password.length < 6) {
      Alert.alert('Password must be more than 6 letters/numbers!');
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          res.user.sendEmailVerification();
          res.user.updateProfile({
            displayName: this.state.userName,
          });
          ToastAndroid.show(
            'Register Successfully! Please Check your Email',
            ToastAndroid.SHORT,
          );
          this.setState({
            isLoading: false,
            userName: '',
            email: '',
            password: '',
          });
          this.props.navigation.navigate('LoginScreen');
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('That email address is already in use!');
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          } else {
            Alert.alert('Error : ' + error.code);
          }
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      console.log('loading');
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Hi</Text>
        </View>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={{backgroundColor: putih}}
        sytle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../../assets/piggyBank.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.action}>
            {/* Input Username */}
            <View style={styles.section}>
              <MaterialIcons
                name="account-circle"
                size={20}
                style={{marginRight: 5}}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                value={this.state.userName}
                onChangeText={(val) => this.updateInputVal(val, 'userName')}
              />
            </View>

            {/* Input Email */}
            <View style={styles.section}>
              <MaterialIcons name="email" size={20} style={{marginRight: 5}} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
              />
            </View>
            {/* Input Password */}
            <View style={styles.section}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                style={{marginRight: 5}}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                secureTextEntry
              />
            </View>
            {/* Confirm password */}
            <View style={styles.section}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                style={{marginRight: 5}}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                onChangeText={(val) =>
                  this.updateInputVal(val, 'confirmPassword')
                }
                secureTextEntry
              />
            </View>
            <View style={styles.actionButton}>
              {/* Daftar dengan email */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.registerUser()}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signUpOption}>
              <Text>Have an acount? </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('LoginScreen')}>
                <Text style={{color: 'blue', paddingLeft: 2}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const {width, height} = Dimensions.get('screen');
const inputWidth = width * 0.8;
const putih = '#e6eff6';
const biruTua = '#64ace6';
const imageHeight = height * 0.3;
const bodyHeight = height - imageHeight;
const imageWidth = imageHeight * 1.1;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: putih,
  },
  header: {
    flex: 1,
    backgroundColor: biruTua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: putih,
    flex: 1.5,
    height: bodyHeight,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  section: {
    borderColor: biruTua,
    borderWidth: 1,
    width: inputWidth,
    borderRadius: 25,
    backgroundColor: biruTua,
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: biruTua,
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    color: putih,
    width: inputWidth - 15,
  },
  buttonText: {
    fontSize: 18,
  },
  image: {
    height: imageHeight,
    width: imageWidth,
  },
  signUpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom : 10
  },
  action: {
    backgroundColor: putih,
  },
});
