import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
firebase.initializeApp({
  apiKey: "AIzaSyCSs7n0g55MpiKpMVjYMvUgiooRl_ou7Vg",
  authDomain: "chat2020-ef3c0.firebaseapp.com",
  databaseURL: "https://chat2020-ef3c0.firebaseio.com",
  projectId: "chat2020-ef3c0",
  storageBucket: "chat2020-ef3c0.appspot.com",
  messagingSenderId: "182411051990",
  appId: "1:182411051990:web:c7928971d43dc377899a77",
  measurementId: "G-66JGT5CC5E"
})
}

export default firebase