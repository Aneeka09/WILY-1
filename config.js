// Import the functions you need from the SDKs you need
import * as firebase from "firebase"
require("@firebase/firestore")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC85E6OfDCZCo4dd3Tu75Knk1aorbsSb8",
  authDomain: "wily2-c1944.firebaseapp.com",
  projectId: "wily2-c1944",
  storageBucket: "wily2-c1944.appspot.com",
  messagingSenderId: "913183491356",
  appId: "1:913183491356:web:17a8f40d1ac9c677ade6d9"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase.firestore()