// === /src/firebase.js ===
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTXv38B8i0xHoTsIv5mzXNQ9jxaIIDXN8",
  authDomain: "barrister-web-f4b8f.firebaseapp.com",
  projectId: "barrister-web-f4b8f",
  storageBucket: "barrister-web-f4b8f.appspot.com", // ✔️ `firebasestorage.app` биш `appspot.com` байх ёстой
  messagingSenderId: "867205757650",
  appId: "1:867205757650:web:85d216c7ec4557fc3d0b0b",
};

// 🚀 Firebase initialization
const app = initializeApp(firebaseConfig);

// 🔐 Auth
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

// 🔥 Firestore ба Storage
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Экспорт
export { auth, db, storage };
