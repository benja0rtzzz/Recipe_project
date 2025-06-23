// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2mbYdSdbTV_YDnImYBO8JjBSmACPLfEU",
  authDomain: "recipe-project-d00d1.firebaseapp.com",
  projectId: "recipe-project-d00d1",
  storageBucket: "recipe-project-d00d1.firebasestorage.app",
  messagingSenderId: "153631167027",
  appId: "1:153631167027:web:1a75a773dbc2fedce10946",
  measurementId: "G-NV5QP9XM89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
