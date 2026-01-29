// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC279V2QkOaVpP-E3dDhNqJJMXlfDZKMN4",
  authDomain: "serverless-spot-it-c6955.firebaseapp.com",
  databaseURL: "https://serverless-spot-it-c6955-default-rtdb.firebaseio.com/",
  projectId: "serverless-spot-it-c6955",
  storageBucket: "serverless-spot-it-c6955.firebasestorage.app",
  messagingSenderId: "174856206047",
  appId: "1:174856206047:web:733556dae10af1ce5bdb6a",
  measurementId: "G-9YNTFJ738V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);