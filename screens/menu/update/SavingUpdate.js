import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  ScrollView,
  TextInput,
} from 'react-native';
import {timeRef, rootRef} from '../../../database/firebase';
import firebase from '../../../database/firebase';
import moment from 'moment';
import {TextInputMask} from 'react-native-masked-text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const today = new Date();
const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class SavingUpdate extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const category = navigation.getParam('category');
    const id = navigation.getParam('id');
    rootRef
      .child('Saving')
      .child(firebase.auth().currentUser.uid)
      .child(category)
      .child(id.toUpperCase())
      .on('value', (data) => {
        this.state = {
          judul: data.val().judul,
          uang: data.val().uang,
          tanggal: data.val().tanggal,
          catatan: data.val().catatan,
          category: data.val().category,
          id: id,
        };
      });
  }

  dateToMonth = (tanggal) => {
    for (let i = 0; i <= 11; i++) {
      if (tanggal.search(monthList[i]) > 0) return monthList[i];
    }
    return -1;
  };

  currencyToNumber = (uang) => {
    return Number(uang.replace(/[^0-9]/g, ''));
  };

  handleSubmit = () => {
    const newTask = {
      judul: this.state.judul.trim(),
      uang: this.state.uang,
      tanggal: this.state.tanggal,
      catatan: this.state.catatan,
      timestamp: timeRef,
      category: this.state.category == '' ? 'Unknown' : this.state.category,
      id: this.state.id,
    };
    let thisMonth = this.dateToMonth(this.state.tanggal);
    let thisYear = this.state.tanggal.substr(this.state.tanggal.length - 4);
    if (newTask.judul.length || newTask.tanggal.length || newTask.uang != 0) {
      let trId = this.state.id.toUpperCase();
      if (
        thisMonth == moment(today).format('MMMM') &&
        thisYear == moment(today).format('YYYY')
      ) {
        rootRef
          .child('Saving')
          .child(firebase.auth().currentUser.uid)
          .child(newTask.category)
          .child(trId)
          .set(newTask);
        this.setState({
          judul: '',
          uang: 0,
          tanggal: '',
          catatan: '',
          category: '',
        });
      } else {
        const historyFirebase = rootRef
          .child('History')
          .child(firebase.auth().currentUser.uid);
        const month = this.dateToMonth(this.state.tanggal);
        const year = this.state.tanggal.substr(this.state.tanggal.length - 4);
        historyFirebase
          .child('Saving')
          .child(month + year)
          .set({
            uang: this.currencyToNumber(this.state.uang),
            bulan: month,
            tahun: year,
          });
        rootRef
          .child('Saving')
          .child(firebase.auth().currentUser.uid)
          .child(newTask.category)
          .child(trId)
          .remove();
      }
      this.props.navigation.goBack();
      ToastAndroid.show('Data updated', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Invalid Data', ToastAndroid.SHORT);
    }
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons
                name="arrow-back"
                size={40}
                style={{marginRight: 5}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>Update Saving</Text>
            <Text style={styles.month}>
              Month : {moment(today).format('MMMM')}
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.section}>
              <TextInput
                style={styles.textInput}
                placeholder="Title"
                value={this.state.judul}
                onChangeText={(val) => this.updateInputVal(val, 'judul')}
              />
            </View>

            <View style={styles.section}>
              <TextInputMask
                style={styles.textInput}
                placeholder={'Uang'}
                type={'money'}
                options={{
                  precision: 0,
                  separator: '.',
                  unit: 'Rp. ',
                }}
                value={
                  this.state.uang == 0 || this.state.uang == 'Rp. 0'
                    ? ''
                    : this.state.uang
                }
                onChangeText={(val) => this.updateInputVal(val, 'uang')}
              />
            </View>

            <View style={styles.section}>
              <TextInput
                style={styles.textInput}
                placeholder="Deskripsi"
                multiline={true}
                numberOfLines={10}
                textAlignVertical={'top'}
                value={this.state.catatan}
                onChangeText={(val) => this.updateInputVal(val, 'catatan')}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleSubmit()}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const biruMuda = '#adcbe3';
const putih = '#e6eff6';
const biruTua = '#64ace6';
const {width, height} = Dimensions.get('screen');
const headerHeight = height * 0.125;
const inputWidth = width * 0.8;
const topBarHeight = height * 0.09;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: headerHeight,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
  },
  month: {
    fontSize: 18,
  },
  body: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
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
  textInput: {
    color: putih,
    width: inputWidth - 25,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: biruTua,
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  topBar: {
    height: topBarHeight,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    bottom: 0,
    left: 10,
  },
});
