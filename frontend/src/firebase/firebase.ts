import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import * as firebaseStorage from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID 
};

export const App = firebaseApp.initializeApp(firebaseConfig);
export const Auth = firebaseAuth.getAuth(App);
export const db = fireStore.getFirestore(App);
export const Storage = firebaseStorage.getStorage(App);

