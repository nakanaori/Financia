import React from "react";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

export default class accountPayableComponentTitle extends React.Component {
  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() =>
          this.props.navigation.navigate("AccountPayableDetails", {
            item: item,
          })
        }
      >
        <Text style={styles.text}>{item}</Text>
        <Text>{item.tanggal}</Text>
      </TouchableOpacity>
    );
  }
}
const { width, height } = Dimensions.get("screen");
const boxWidth = width * 0.45;
const boxHeight = width * 0.4;
const biruMuda = "#adcbe3";
const putih = "#e6eff6";
const biruTua = "#64ace6";
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    height: boxHeight,
    width: boxWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: biruTua,
    margin: 5,
    borderRadius: 25,
  },
  text: {
    color: putih,
    fontSize: 20,
  },
});
