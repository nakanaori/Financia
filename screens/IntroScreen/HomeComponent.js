import {View,
        Text,
        StyleSheet,
        Dimensions,
        TouchableOpacity
    } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../database/firebase'
const {width,height} = Dimensions.get("screen");
const buttonHeight = height * 0.08;
const buttonWidth = width * 0.45;
const putih = "#e6eff6";
const biruTua = "#64ace6";

export default class HomeComponent extends React.Component{

    constructor(){
        super();
        this.state = {
            uid : ''
        }
    }
    
    signOut = () => {
        AsyncStorage.removeItem('user');
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('LoginScreen');
        }).catch(error => {
            Alert.alert("Error : " + error.code);
        })
    }
    render(){
        this.state = { 
            displayName: firebase.auth().currentUser.displayName,
            uid: firebase.auth().currentUser.uid
          }
        return(
            <View style = {styles.container}>
                <View style = {styles.header}>
                    <Text style = {styles.greeting}>Hi, {this.state.displayName} </Text>
                    {/* <Text style = {styles.greeting}>Hi, {this.state.displayName} </Text> */}
                </View>
                <View style = {styles.body}>

                    {/* Income and expenses*/}
                    <View style = {styles.section}>
                        <TouchableOpacity style = {styles.button}
                        onPress = {() => this.props.navigation.navigate('IncomeScreen')}>
                            <Text style = {styles.buttonText}>Income</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {styles.button}
                        onPress = {() => this.props.navigation.navigate('ExpenseScreen')}>
                            <Text style = {styles.buttonText}>Expenses</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Account receivable and Account Payable*/}
                    <View style = {styles.section}>
                        <TouchableOpacity style = {styles.button}
                        onPress = {() => this.props.navigation.navigate('AccountReceivableScreen')}>
                            <Text style = {styles.buttonText}>Account Receivable</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {styles.button}
                        onPress = {() => this.props.navigation.navigate('AccountPayableScreen')}>
                            <Text style = {styles.buttonText}>Account Payable</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Saving and ... */}
                    <View style = {styles.section}>
                        <TouchableOpacity style = {styles.button}
                        onPress = {() => this.props.navigation.navigate('SavingScreen')}>
                            <Text style = {styles.buttonText}>Saving</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {styles.button}
                            onPress = {() => this.signOut()}>
                            <Text style = {styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    
                    
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container : {
        flex : 1
    },
    button : {
         backgroundColor : biruTua,
         borderRadius : 30,
         alignItems : 'center',
         justifyContent : 'center',
         width : buttonWidth,
         height : buttonHeight,
         margin : 10,
    },
    buttonText : {
        fontSize : height * 0.027,
        textAlign : 'center'
    },
    header : {
        flex : 1,
        backgroundColor : biruTua,
        justifyContent : 'center',
    },
    body : {
        flex : 2,
        backgroundColor : putih,
        justifyContent : 'space-evenly',
        alignItems : 'stretch'
    },
    greeting : {
        fontSize : 24,
        fontWeight : 'bold',
        paddingLeft : 20,
        paddingHorizontal : 20,
    },
    section : {
        justifyContent : 'space-evenly',
        flexDirection : 'row',
        alignItems : 'center'
    }
})

