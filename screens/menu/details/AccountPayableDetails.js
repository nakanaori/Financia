import React from "react";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
  TextInput
} from "react-native";
import moment from "moment";
import firebase, { rootRef } from "../../../database/firebase";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

var details = [];
const today = new Date();
var a = true;

export default class AccountPayableDetails extends React.Component {
  deleteData = (id, nama) => {
    for (let i in details) {
      if (details[i].id == id) {
        details.splice(i, 1);
      }
    }
    rootRef
      .child("AccountPayable")
      .child(firebase.auth().currentUser.uid)
      .child(nama)
      .child(id.toUpperCase())
      .remove(() => {
        ToastAndroid.show("Delete successfully", ToastAndroid.SHORT);
        if (details.length == 0) {
          this.props.navigation.goBack();
        } else {
          this.setState({
            refresh: !this.state.refresh,
          });
        }
      });
  };

  paid = (id, nama, uang, catatan) => {
    rootRef
      .child("History")
      .child(firebase.auth().currentUser.uid)
      .child("AccountPayable")
      .child(id)
      .set({
        nama: nama,
        uang: uang,
        tanggalBayar: moment(today).format("dddd, D MMMM YYYY"),
        catatan: catatan,
      });
    this.deleteData(id, nama);
  };

  Box = ({ uang, deskripsi, id, nama }) => (
    <View style={styles.boxContainer}>
      <View style={styles.detailList}>
        <View style={styles.kiri}>
          <Text style={styles.textnama}>{nama}</Text>
        </View>
        <View>
          <Text style={styles.uang}>{uang}</Text>
        </View>
      </View>
      <View style={styles.descriptionDetail}>
        <View
          style={{
            justifyContent: "space-between",
          }}
        >
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
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(
                  "AccountPayableUpdateScreen",
                  {
                    nama: nama,
                    id: id,
                  }
                )
              }
            >
              <MaterialIcons name="edit" size={40} style={{ margin: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.deleteData(id, nama)}>
              <MaterialIcons
                name="delete-forever"
                size={40}
                style={{ margin: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          value={deskripsi}
          style={styles.deskripsi}
          editable={false}
          multiline={true}
          textAlignVertical={"top"}
        />
        <View style={styles.pay}>
          <TouchableOpacity
            style={styles.payBox}
            onPress={() => this.paid(id, nama, uang, deskripsi)}
          >
            <Text style={{ textAlign: "center" }}>Paid Off</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  componentDidMount() {
    this.insertData().then(() => {
      this.setState({
        isLoading: false,
      });
    });
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.setState({ count: true });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    clearTimeout(this.t);
  }

  insertData() {
    return new Promise((resolve, reject) => {
      const { navigation } = this.props;
      const nama = navigation.getParam("item");
      rootRef
        .child("AccountPayable")
        .child(firebase.auth().currentUser.uid)
        .child(nama)
        .on("value", (snapshot) => {
          if (snapshot != null) {
            details.length = 0;
            snapshot.forEach((data) => {
              details.push(data.val());
            });
          }
        });
      resolve();
    });
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      refresh: false,
    };
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>Hi</Text>
        </View>
      );
    }
    const { navigation } = this.props;
    const nama = navigation.getParam("item");
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
          <Text style={styles.title}>{nama}</Text>
          <Text style={styles.month}>
            Month : {moment(today).format("MMMM")}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {details.length == 0 ? null : (
            <FlatList
              data={details}
              renderItem={({ item }) => (
                <this.Box
                  uang={item.uang}
                  deskripsi={item.catatan}
                  id={item.id}
                  nama={item.nama}
                />
              )}
              keyExtractor={(data) => data.id}
              style={styles.flatlist}
              extraData={this.state}
            />
          )}
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("screen");
const headerHeight = height * 0.125;
const boxHeight = height * 0.075;
const deskripsiWidth = width * 0.81;
const putih = "#e6eff6";
const biruTua = "#64ace6";
const topBarHeight = height * 0.09;
const payButton = width * 0.2;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: headerHeight,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 10,
  },
  month: {
    fontSize: 18,
  },
  detailList: {
    borderBottomWidth: 1,
    height: boxHeight,
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  descriptionDetail: {
    height: boxHeight * 3,
    flexDirection: "row",
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
    fontSize: 15,
    padding: 7,
    width: deskripsiWidth - 100,
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
  boxContainer: {
    borderRadius: 20,
    backgroundColor: biruTua,
    margin: 10,
  },
  pay: {
    justifyContent: "flex-end",
    width: payButton,
  },
  payBox: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#a0cef2",
    borderWidth: 1,
    padding: 15,
    borderRadius: 100,
    marginBottom: 5,
    elevation: 10,
    height: payButton,
  },
});
