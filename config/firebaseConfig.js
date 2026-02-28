// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyCAwYkNlL25LxX-k_Di0i6o2CC1wYxbA",
  authDomain: "restrox-343a8.firebaseapp.com",
  projectId: "restrox-343a8",
  storageBucket: "restrox-343a8.firebasestorage.app",
  messagingSenderId: "800880224360",
  appId: "1:800880224360:web:bf296a314fd71c340433dd",
  measurementId: "G-ZZZVLDJ2YY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);