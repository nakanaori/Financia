import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {timeRef, rootRef} from '../../../database/firebase';
import firebase from '../../../database/firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {TextInputMask} from 'react-native-masked-text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
} from 'react-native-tesseract-ocr';
import ImagePicker from 'react-native-image-crop-picker';

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
const nums = ['0','1','2','3','4','5','6','7','8','9'];
var icId,
  exId,
  apId,
  arId,
  sId = 0;

export default class addExpense extends React.Component {
  componentDidMount() {
    this.getPermission();
  }

  recognizeTextFromImage = async (path) => {
    this.setState({
      isLoading: true,
    });
    try {
      const tesseractOptions = {allowlist : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"};
      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      let res = this.isNumber(recognizedText);
      this.setState({
        text: recognizedText,
        uang : res
      });
    } catch (err) {
      this.setState({
        text: err.code,
      });
    }
    this.setState({
      isLoading: false,
    });
  };

  recognizeFromCamera = async () => {
    try {
      ImagePicker.openCamera({
        freeStyleCropEnabled : true,
        cropping: true,
        mediaType: 'photo',
      }).then(async (image) => {
        this.setState({
          image: image.path,
        });
        await this.recognizeTextFromImage(image.path);
      });
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        this.setState({
          text: err.message,
        });
      }
    }
  };



  isNumber = (a) => {
    let res = '';
    for(let i in a){
      if(nums.includes(a[i])){
        res += a[i];
      }
    }
    return res;
  }

  pickImageFromCameraRoll = () => {
    try {
      ImagePicker.openPicker({
        freeStyleCropEnabled : true,
        mediaTypes: 'photo',
        cropping: true,
      }).then((res) => {
        this.setState({image: res.path});
      });
    } catch (E) {
      this.setState({text: E.message});
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      judul: '',
      uang: 0,
      tanggal: '',
      catatan: '',
      category: '',
      isDatePickerVisible: false,
      image: null,
      text: '',
      isLoading: false,
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

  handleSubmit = async () => {
    const newTask = {
      judul: this.state.judul.trim(),
      uang: this.state.uang,
      tanggal: this.state.tanggal,
      catatan: this.state.catatan,
      timestamp: timeRef,
      category: this.state.category == '' ? 'Unknown' : this.state.category,
      id: 'EX' + exId.toString(),
    };
    let thisMonth = this.dateToMonth(this.state.tanggal);
    let thisYear = this.state.tanggal.substr(this.state.tanggal.length - 4);
    if (newTask.judul.length && newTask.tanggal.length && newTask.uang != 0) {
      if (
        thisMonth == moment(today).format('MMMM') &&
        thisYear == moment(today).format('YYYY')
      ) {
        let trId = 'EX' + exId.toString();
        rootRef
          .child('Expense')
          .child(firebase.auth().currentUser.uid)
          .child(newTask.category)
          .child(trId)
          .set(newTask);
        if (this.state.image != null) {
          const a = await fetch(this.state.image);
          const blob = await a.blob();
          firebase.storage().ref().child(`${trId}/${trId}.jpg`).put(blob);
        }
        exId++;
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
          .child('Expense')
          .child(month + year)
          .once('value', (snapshot) => {
            if (snapshot != null) {
              temp = snapshot.val().uang;
            }
          });
        historyFirebase
          .child('Expense')
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

  pickImageFromCamera = () => {
    ImagePicker.openCamera({
      freeStyleCropEnabled : true,
      cropping: true,
    })
      .then((image) => {
        this.setState({
          image: image.path,
        });
      })
      .catch((e) => Alert.alert(e.message));
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

  requestPermission = () => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ])
      .then((res) => {
        switch (res) {
          case RESULTS.DENIED:
            Alert.alert('Some Features may be unavailable.');
            break;
        }
      })
      .catch((err) => {
        Alert.alert(err.code);
      });
  };

  getPermission = () => {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ])
      .then((res) => {
        switch (res) {
          case RESULTS.UNAVAILABLE:
            Alert.alert('Unavailable to use this feature');
            break;
          case RESULTS.DENIED:
            this.requestPermission();
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            Alert.alert(
              'Please let Financia use the Camera and Read External Storage permission!',
            );
            break;
        }
      })
      .catch((err) => {
        Alert.alert(err.code);
      });
  };

  render() {
    let {image, text} = this.state;
    if (this.state.isLoading) {
      return (
        <View
          style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
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
            <Text style={styles.title}>Add Expense</Text>
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

            {image && (
              <Image source={{uri: image}} style={{width: 200, height: 200}} />
            )}

            <Text>{text}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleSubmit()}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.pickImageFromCameraRoll()}>
              <Text style={styles.buttonText}>Add Image From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.pickImageFromCamera()}>
              <Text style={styles.buttonText}>Add Image From Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.recognizeFromCamera()}>
              <Text style={styles.buttonText}>Scan your receipt</Text>
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
    marginVertical: 10,
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
