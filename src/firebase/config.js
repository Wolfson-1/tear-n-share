// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWkVTCPvE_IS3p0mXDFvVaX5cXeS2Mu4k",
  authDomain: "tear-n-share.firebaseapp.com",
  projectId: "tear-n-share",
  storageBucket: "tear-n-share.appspot.com",
  messagingSenderId: "736702480094",
  appId: "1:736702480094:web:078c32a52291b12f734c4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
