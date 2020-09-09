import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firebase, { rootRef } from '../../database/firebase';
import moment from 'moment';
import ExpenseComponentTitle from './components/expenseComponentTitle'

const { width, height } = Dimensions.get("screen");
const headerHeight = height * 0.125;
const totalExpenseHeight = height * 0.05;
const totalExpenseWidth = width * 0.5;
const bottomHeight = height * 0.18;
const today = new Date();
const topBarHeight = height * 0.09;

var details = [];
var totalExpense = 0;

const monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export default class Expense extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            judul: "",
            uang: 0,
            tanggal: "",
            catatan: "",
            count: 0
        }
        this.t = setInterval(() => {
            this.setState({ count: this.state.count + 1 });
        }, 1000);
        totalExpense = 0;
    }

    currencyToNumber = (uang) => {
        return Number(uang.replace(/[^0-9]/g, ''));
    }

    dateToMonth = (tanggal) => {
        for (let i = 0; i <= 11; i++) {
            if (tanggal.search(monthList[i]) > 0) {
                return monthList[i];
            }
        }
        return -1;
    }
    currencyFormat(num) {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    };

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ count: true });
        });
        rootRef.child('Expense').child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            if (snapshot != null) {
                details.length = 0;
                totalExpense = 0;
                snapshot.forEach((data) => {
                    data.forEach((detail) => {
                        if (this.dateToMonth(detail.val().tanggal) != moment(today).format('MMMM')) {
                            let temp = 0;
                            const historyFirebase = rootRef.child('History').child(firebase.auth().currentUser.uid);
                            const month = this.dateToMonth(detail.val().tanggal);
                            const year = detail.val().tanggal.substr(detail.val().tanggal.length - 4);
                            historyFirebase.child('Expense').child(month + year).once('value', (snapshot) => {
                                if (snapshot != null) {
                                    temp = snapshot.val().uang;
                                }
                            })
                            historyFirebase.child('Expense').child(month + year).set({
                                uang: this.currencyToNumber(detail.val().uang) + temp,
                                bulan: month,
                                tahun: year
                            })
                            let trId = detail.val().id;
                            rootRef.child('Expense').child(firebase.auth().currentUser.uid).child(detail.val().category).child(trId.toUpperCase()).remove()
                        } else {
                            if (!details.includes(detail.val().category)) details.push(detail.val().category);
                            let money = this.currencyToNumber(detail.val().uang);
                            totalExpense += money;
                        }
                    })
                })
            }
        });
    }

    componentWillUnmount() {
        details.length = 0;
        this.focusListener.remove();
        clearTimeout(this.t);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcons name='arrow-back' size={40} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.historyButton} onPress={() => this.props.navigation.navigate('ExpenseHistoryScreen')}>
                        <MaterialIcons name='history' size={40} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Expense</Text>
                    <Text style={styles.month}>Month : {moment(today).format('MMMM')}</Text>
                </View>
                <View style={styles.body}>
                    <FlatList
                        numColumns={2}
                        data={details}
                        renderItem={({ item }) => <ExpenseComponentTitle item={item} navigation={this.props.navigation} />}
                        keyExtractor={(item, index) => 'key' + index}
                        extraData={this.state.count}
                        contentContainerStyle={styles.flatlist}
                    />
                </View>
                <View style={styles.bottom}>
                    <View style={styles.ExpenseTab}>
                        <Text style={{ paddingHorizontal: 12 }} >Total Expense</Text>
                        <View style={styles.totalExpense}>
                            <Text>{this.currencyFormat(totalExpense)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => this.props.navigation.navigate('addExpenseScreen')}>
                        <MaterialIcons name='add' size={40} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    addButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        alignSelf: 'center',
        height: 65,
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: headerHeight,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        padding: 10
    },
    month: {
        fontSize: 18
    },
    body: {
        flex: 1.5,
        height: headerHeight * 10
    },
    totalExpense: {
        borderWidth: 1,
        borderColor: 'black',
        height: totalExpenseHeight,
        width: totalExpenseWidth,
        justifyContent: 'center',
        paddingLeft: 10
    },
    bottom: {
        height: bottomHeight,
        justifyContent: 'space-evenly'
    },
    ExpenseTab: {
        height: totalExpenseHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    flatlist: {
        alignItems: 'center'
    },
    topBar: {
        height: topBarHeight,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    backButton: {
        position: 'absolute',
        bottom: 0,
        left: 10
    },
    historyButton: {
        position: 'absolute',
        bottom: 0,
        right: 10
    }
})