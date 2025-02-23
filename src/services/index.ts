import { db } from "../firebase";
import FirebaseLibrary from "./firebase_library";

export const firebaseLibrary = new FirebaseLibrary(db);
