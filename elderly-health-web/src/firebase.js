// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1VvlF0_4weafcSrnCh6HlgUcr_E_VYSo",
  authDomain: "fit5032-2025--3--wenhan-li.firebaseapp.com",
  projectId: "fit5032-2025--3--wenhan-li",
  storageBucket: "fit5032-2025--3--wenhan-li.firebasestorage.app",
  messagingSenderId: "238249361343",
  appId: "1:238249361343:web:ae1f368ebc07673c9d2b0a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };