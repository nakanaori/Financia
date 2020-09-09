import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  TextInput,
  ScrollView,
} from 'react-native';
import firebase, {timeRef, rootRef} from '../../../database/firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
var icId,
  exId,
  apId,
  arId,
  sId = 0;

export default class addIncome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judul: '',
      uang: 0,
      tanggal: '',
      catatan: '',
      category: '',
      isDatePickerVisible: false,
    };
    rootRef.child('Counter').on('value', (snapshot) => {
      if (snapshot != null) {
        icId = snapshot.val().IncomeCounter;
        exId = snapshot.val().ExpenseCounter;
        apId = snapshot.val().AccountPayableCounter;
        arId = snapshot.val().AccountReceivableCounter;
        sId = snapshot.val().SavingCounter;
      }
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
      id: 'IC' + icId.toString(),
    };
    let thisMonth = this.dateToMonth(this.state.tanggal);
    let thisYear = this.state.tanggal.substr(this.state.tanggal.length - 4);
    if (newTask.judul.length && newTask.tanggal.length && newTask.uang != 0) {
      if (
        thisMonth == moment(today).format('MMMM') &&
        thisYear == moment(today).format('YYYY')
      ) {
        let trId = 'IC' + icId.toString();
        rootRef
          .child('Income')
          .child(firebase.auth().currentUser.uid)
          .child(newTask.category)
          .child(trId)
          .set(newTask);
        icId++;
        rootRef.child('Counter').set({
          IncomeCounter: icId,
          ExpenseCounter: exId,
          AccountPayableCounter: apId,
          AccountReceivableCounter: arId,
          SavingCounter: sId,
        });
        this.setState({
          judul: '',
          uang: 0,
          tanggal: '',
          catatan: '',
          category: '',
        });
      } else {
        let temp = 0;
        const historyFirebase = rootRef
          .child('History')
          .child(firebase.auth().currentUser.uid);
        const month = this.dateToMonth(this.state.tanggal);
        const year = this.state.tanggal.substr(this.state.tanggal.length - 4);
        historyFirebase
          .child('Income')
          .child(month + year)
          .once('value', (snapshot) => {
            if (snapshot != null) {
              temp = snapshot.val().uang;
            }
          });
        historyFirebase
          .child('Income')
          .child(month + year)
          .set({
            uang: this.currencyToNumber(this.state.uang) + temp,
            bulan: month,
            tahun: year,
          });
      }
      this.props.navigation.goBack();
      ToastAndroid.show('Data added', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Invalid Data', ToastAndroid.SHORT);
    }
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  handleConfirm = (date) => {
    this.setState({
      tanggal: moment(date).format('dddd, D MMMM YYYY'),
    });
    this.hideDatePicker();
  };

  isDateNull = () => {
    return this.state.tanggal == ''
      ? 'Pick a date'
      : this.state.tanggal.toString();
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
            <Text style={styles.title}>Add Income</Text>
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
              <TextInput
                style={styles.textInput}
                placeholder="Category"
                value={this.state.category}
                onChangeText={(val) => this.updateInputVal(val, 'category')}
              />
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                onPress={() => this.showDatePicker()}
                style={styles.textInput}>
                <TextInput
                  style={{color: putih}}
                  value={this.isDateNull()}
                  editable={false}
                />
                <DateTimePickerModal
                  isVisible={this.state.isDatePickerVisible}
                  mode="date"
                  onConfirm={(date) => this.handleConfirm(date)}
                  onCancel={() => this.hideDatePicker()}
                />
              </TouchableOpacity>
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
              <Text style={styles.buttonText}>Add</Text>
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
  historyButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
});
