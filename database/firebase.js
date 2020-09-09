import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBNPfqCpw5IyQ5LVZklyzsW2YkmSjSRakk",
    authDomain: "financia-7a16b.firebaseapp.com",
    databaseURL: "https://financia-7a16b.firebaseio.com",
    projectId: "financia-7a16b",
    storageBucket: "financia-7a16b.appspot.com",
    messagingSenderId: "476714460944",
    appId: "1:476714460944:web:507caa085ddba51d50a795",
    measurementId: "G-Q1FLK7Y0J2"
};

if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const rootRef = firebase.database().ref();
export const timeRef = firebase.database.ServerValue.TIMESTAMP;
export default firebase;