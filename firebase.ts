import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2jTHdt6Hnt3-SjEXrbylAJdMD5MCgd1Y",
  authDomain: "cric-auction-7bd24.firebaseapp.com",
  projectId: "cric-auction-7bd24",
  storageBucket: "cric-auction-7bd24.firebasestorage.app",
  messagingSenderId: "582324412853",
  appId: "1:582324412853:web:d2fdda63b48b3852e5b9fc",
  measurementId: "G-SNH52Y8DVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
