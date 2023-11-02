import firebase from 'firebase';
require("firebase/database");
require("firebase/auth");

const config = {
  apiKey: "AIzaSyBuVBYM2WYmUiOtNXwh4kXQLYcWcc2i51Q",
  authDomain: "bissi-app-257f8.firebaseapp.com",
  databaseURL: "https://bissi-app-257f8-default-rtdb.firebaseio.com",
  projectId: "bissi-app-257f8",
  storageBucket: "bissi-app-257f8.appspot.com",
  messagingSenderId: "62728924266",
  appId: "1:62728924266:web:111d089211a7255134ee13",
  measurementId: "G-FF8SR83SCV"

};

const fire = firebase.initializeApp(config);

export const auth = firebase.auth();

export const storage = firebase.storage();

export const database = firebase.database();


export default fire;