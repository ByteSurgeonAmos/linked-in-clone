import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "linked-in-clone-d4df5.firebaseapp.com",
  projectId: "linked-in-clone-d4df5",
  databaseURL: "https://linked-in-clone-d4df5-default-rtdb.firebaseio.com/",
  storageBucket: "linked-in-clone-d4df5.appspot.com",
  messagingSenderId: "41488148189",
  appId: "1:41488148189:web:77e561e70b52058d17dd34",
  measurementId: "G-CJ6QBNJ4EB",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
