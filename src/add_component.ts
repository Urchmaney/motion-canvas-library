import { initializeApp } from "firebase/app";
import FirebaseLibrary from "./services/firebase_library";
import 'dotenv/config';
import { getFirestore } from "firebase/firestore";

const id = "6glpZjP6JHa6M36xoIbz"


const code = `
`

const usage = `
`

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db =  getFirestore(app);
const firebaseLibrary = new FirebaseLibrary(db);
try {
    await firebaseLibrary.addCustomNodeCode({ node_id: id, code, usage });
    console.log("Successfully added")
} catch(e) {
    console.log(e)
}
