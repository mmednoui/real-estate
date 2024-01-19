// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "real-estate-184d8.firebaseapp.com",
  projectId: "real-estate-184d8",
  storageBucket: "real-estate-184d8.appspot.com",
  messagingSenderId: "255533997935",
  appId: "1:255533997935:web:4f66706cd96b542a23d29a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
