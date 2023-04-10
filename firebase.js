// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE6L0LbQgpzZI2qDC5AjWWKBcy7sFSFAk",
  authDomain: "lockitin-native.firebaseapp.com",
  projectId: "lockitin-native",
  storageBucket: "lockitin-native.appspot.com",
  messagingSenderId: "367382106570",
  appId: "1:367382106570:web:ffb04ae02186ab0cb1ff33",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
