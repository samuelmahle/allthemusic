import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaiK1W1AgWtzlpiGtG3BOLU8mwmLYY4wc",
  authDomain: "musicita-b0f83.firebaseapp.com",
  projectId: "musicita-b0f83",
  storageBucket: "musicita-b0f83.firebasestorage.app",
  messagingSenderId: "304102525848",
  appId: "1:304102525848:web:7c0cc434a34dbbd2ff79ed",
  measurementId: "G-GQYL2Y9MTQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);