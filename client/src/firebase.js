// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-64b4a.firebaseapp.com",
  projectId: "mern-estate-64b4a",
  storageBucket: "mern-estate-64b4a.appspot.com",
  messagingSenderId: "1039102936108",
  appId: "1:1039102936108:web:42ea2eb170340b836dfd89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);