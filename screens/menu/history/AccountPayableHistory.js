import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firebase, { rootRef } from "../../../database/firebase";
var HistoryList = [];
const biruTua = "#64ace6";

var monSort = new Array(12);
monSort["January"] = 1;
monSort["February"] = 2;
monSort["March"] = 3;
monSort["April"] = 4;
monSort["May"] = 5;
monSort["June"] = 6;
monSort["July"] = 7;
monSort["August"] = 8;
monSort["September"] = 9;
monSort["October"] = 10;
monSort["November"] = 11;
monSort["December"] = 12;

export default class AccountPayableHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
    HistoryList.length = 0;
  }

  fetchDataandInsert() {
    return new Promise((resolve) => {
      rootRef
        .child("History")
        .child(firebase.auth().currentUser.uid)
        .child("AccountPayable")
        .on("value", (snapshot) => {
          if (snapshot != null) {
            snapshot.forEach((details) => {
              HistoryList.push(details.val());
            });
          }
          resolve();
        });
    });
  }

  currencyFormat(num) {
    return "Rp " + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  sortDate(a, b) {
    if (monSort[a] > monSort[b]) return 1;
    if (monSort[a] < monSort[b]) return -1;
    return 0;
  }
  componentWillUnmount() {}

  componentDidMount() {
    this.fetchDataandInsert().then(
      () => {
        this.setState({
          isLoading: false,
        });
      },
      (error) => console.log(error.message)
    );
  }

  Box = ({ nama, uang, catatan, tanggalBayar }) => (
    <View style={styles.boxContainer}>
      <View style={styles.detailList}>
        <View style={styles.kiri}>
          <Text style={styles.textnama}>{nama}</Text>
        </View>
        <View>
          <Text style={styles.uang}>{uang}</Text>
        </View>
      </View>
      <View>
        <View style={styles.descriptionDetail}>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 8,
              paddingBottom: -10,
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Notes :
          </Text>
          <TextInput
            value={catatan}
            style={styles.deskripsi}
            editable={false}
            multiline={true}
            textAlignVertical={"top"}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            borderTopWidth: 1,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Paid Off on : {tanggalBayar}
          </Text>
        </View>
      </View>
    </View>
  );

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>Hi</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={40}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>History</Text>
        </View>
        {HistoryList.length == 0 ? null : (
          <FlatList
            data={HistoryList}
            renderItem={({ item }) => (
              <this.Box
                nama={item.nama}
                uang={item.uang}
                catatan={item.catatan}
                tanggalBayar={item.tanggalBayar}
              />
            )}
            keyExtractor={(index) => "key" + index}
          />
        )}
      </View>
    );
  }
}
const { width, height } = Dimensions.get("screen");
const topBarHeight = height * 0.09;
const headerHeight = height * 0.1;
const barTahunHeight = height * 0.05;
const boxHeight = height * 0.075;
const deskripsiWidth = width * 0.81;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: topBarHeight,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    bottom: 0,
    left: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: headerHeight,
  },
  barTahun: {
    height: barTahunHeight,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: biruTua,
  },
  barBulan: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: barTahunHeight / 1.5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightColor: 1,
    borderBottomColor: "black",
    backgroundColor: biruTua,
  },
  boxContainer: {
    borderRadius: 20,
    backgroundColor: biruTua,
    margin: 10,
  },
  detailList: {
    borderBottomWidth: 1,
    height: boxHeight,
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  kiri: {
    paddingLeft: 15,
  },
  textnama: {
    fontSize: 20,
    fontWeight: "bold",
  },
  uang: {
    fontSize: 20,
    fontWeight: "500",
    paddingRight: 10,
  },
  deskripsi: {
    fontSize: 18,
    padding: 7,
    width: deskripsiWidth - 100,
  },
  descriptionDetail: {
    height: boxHeight * 3,
    flexDirection: "row",
  },
});
