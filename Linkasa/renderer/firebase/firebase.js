// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import admin from 'firebase-admin'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr7DOs8o-NSVIu9OBE5y5rqe1IrnocIuw",
  authDomain: "linkasa-6d8e6.firebaseapp.com",
  projectId: "linkasa-6d8e6",
  storageBucket: "linkasa-6d8e6.appspot.com",
  messagingSenderId: "860039317869",
  appId: "1:860039317869:web:009dd50db7abb6c395f264"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { app, db, auth};