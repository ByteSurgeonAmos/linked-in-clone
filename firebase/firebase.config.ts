import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOauPLOEKfKZBQlgVg8lx3ad5MBJl62YU",
  authDomain: "erick-4th-proj.firebaseapp.com",
  projectId: "erick-4th-proj",
  storageBucket: "erick-4th-proj.appspot.com",
  messagingSenderId: "616853411447",
  appId: "1:616853411447:web:ecf00ddc7942f19bed5872",
  measurementId: "G-D77W58MVKY",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
