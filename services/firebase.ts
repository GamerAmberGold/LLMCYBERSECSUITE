// Import the functions you need from the SDKs you need
// Fix: The build errors indicate that the project is using the Firebase v8 SDK.
// The file has been updated to use the v8 namespaced API syntax for initialization and service access.
// FIX: Use compat imports to support v8 syntax with Firebase v9+
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// TODO: Replace with your project's actual Firebase configuration
// You can find this in the Firebase console:
// Project settings > General > Your apps > Firebase SDK snippet > Config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDRrtNDZYlVuB40UYd3m_IMo3Zzd8dvp94",
  authDomain: "cybersecsuite.firebaseapp.com",
  projectId: "cybersecsuite",
  storageBucket: "cybersecsuite.firebasestorage.app",
  messagingSenderId: "720122591812",
  appId: "1:720122591812:web:0e7ecdd0892de7f9ab5a11",
  measurementId: "G-MMMG0D03Q8"
};

/**
 * Checks if the Firebase configuration has been updated from its placeholder values.
 * @returns {boolean} True if the configuration is valid, false otherwise.
 */
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "AIzaSyDRrtNDZYlVuB40UYd3m_IMo3Zzd8dvp94" && firebaseConfig.projectId !== "cybersecsuite";
};

// Initialize Firebase only if it's configured and hasn't been already.
if (!firebase.apps.length && isFirebaseConfigured()) {
  firebase.initializeApp(firebaseConfig);
}

// Conditionally export services to prevent errors when not configured.
let auth: firebase.auth.Auth;
let firestore: firebase.firestore.Firestore;

if (isFirebaseConfigured()) {
  auth = firebase.auth();
  firestore = firebase.firestore();
} else {
  console.warn("Firebase is not configured. Features that depend on Firebase (like Firestore) will be disabled. Please update services/firebase.ts");
}

export { auth, firestore };