import * as firebase from "firebase";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBii7IJPuRlAs1TVd9-wvrrV8isPYjfHv0",
  authDomain: "f19-dfsjudgingapplication.firebaseapp.com",
  databaseURL: "https://f19-dfsjudgingapplication.firebaseio.com",
  projectId: "f19-dfsjudgingapplication",
  storageBucket: "f19-dfsjudgingapplication.appspot.com",
  messagingSenderId: "816921615752",
  appId: "1:816921615752:web:54590aa1b7d0fb42fdae3d",
  measurementId: "G-C6PTTJ9ZP1"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export default firebase;
