
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These variables should be set in your environment
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Fix: Replaced legacy v8 initialization with modern Firebase v9+ modular syntax to fix "property does not exist" errors on the default export.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
