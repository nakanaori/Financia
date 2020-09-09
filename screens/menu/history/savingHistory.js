import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import firebase, { rootRef } from '../../../database/firebase';
var totalUang = [];
var tahun = [];
var bulan = [];
var HistoryList = [];
var dataYear, dataMonth;
const biruTua = "#64ace6";


var monSort = new Array(12);
monSort['January'] = 1;
monSort['February'] = 2;
monSort['March'] = 3;
monSort['April'] = 4;
monSort['May'] = 5;
monSort['June'] = 6;
monSort['July'] = 7;
monSort['August'] = 8;
monSort['September'] = 9;
monSort['October'] = 10;
monSort['November'] = 11;
monSort['December'] = 12;

export default class SavingHistory extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    fetchDataandInsert() {
        return new Promise((resolve) => {
            rootRef.child('History').child(firebase.auth().currentUser.uid).child('Saving').on('value', (snapshot) => {
                tahun.length = 0;
                bulan.length = 0;
                totalUang.length = 0;
                if (snapshot != null) {
                    snapshot.forEach((data) => {
                        dataYear = data.val().tahun;
                        dataMonth = data.val().bulan;
                        if (!tahun.includes(dataYear)) tahun.push(dataYear);
                        if (bulan[dataYear] === undefined) {
                            bulan[dataYear] = [];
                        }
                        let isExist = false;
                        for (let i in bulan[dataYear]) {
                            if (bulan[dataYear][i] == dataMonth) {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) bulan[dataYear].push(dataMonth);
                        if (totalUang[dataYear] === undefined) {
                            totalUang[dataYear] = [];
                            totalUang[dataYear][dataMonth] = 0;
                        }
                        if (totalUang[dataYear][dataMonth] === undefined) {
                            totalUang[dataYear][dataMonth] = 0;
                        }
                        totalUang[data.val().tahun][data.val().bulan] += data.val().uang;
                    })
                    tahun.sort();
                    for (let i in tahun) {
                        bulan[tahun[i]].sort(this.sortDate);
                    }
                    HistoryList.length = 0;

                    for (let i in tahun) {
                        HistoryList.push(
                            <View style={styles.barTahun} key={tahun[i]}>
                                <Text style={{ fontSize: 18 }}>{tahun[i]}</Text>
                            </View>
                        )
                        for (let j in bulan[tahun[i]]) {
                            HistoryList.push(
                                <View style={styles.barBulan} key={tahun[i] + bulan[tahun[i]][j]}>
                                    <Text>{String(Number(j) + 1)}</Text>
                                    <Text style={{ fontSize: 15 }}>{bulan[tahun[i]][j]}</Text>
                                    <Text style={{ fontSize: 15 }}>{this.currencyFormat((totalUang[tahun[i]][bulan[tahun[i]][j]]))}</Text>
                                </View>
                            )
                        }
                    }

                }
                resolve();
            });
        })
    }

    currencyFormat(num) {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    };


    sortDate(a, b) {
        if (monSort[a] > monSort[b]) return 1;
        if (monSort[a] < monSort[b]) return -1;
        return 0;
    }
    componentWillUnmount() {
        totalUang.length = 0;
        tahun.length = 0;
        bulan.length = 0;
        HistoryList.length = 0;
    }

    componentDidMount() {
        this.fetchDataandInsert().then(() => {
            this.setState({
                isLoading: false
            })
        },
            (error) => console.log(error.message));

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <Text>Hi</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcons name='arrow-back' size={40} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.header}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
                </View>
                <ScrollView style={styles.body}>
                    {HistoryList}
                </ScrollView>
            </View>
        )
    }
}
const { width, height } = Dimensions.get("screen");
const topBarHeight = height * 0.09;
const headerHeight = height * 0.1;
const barTahunHeight = height * 0.05;

var styles = StyleSheet.create({
    container: {
        flex: 1
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
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: headerHeight,
    },
    barTahun: {
        height: barTahunHeight,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: biruTua
    },
    barBulan: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: barTahunHeight / 1.5,
        alignItems: "center",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightColor: 1,
        borderBottomColor: 'black',
        backgroundColor: biruTua
    }

})