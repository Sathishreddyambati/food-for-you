import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQd4MFvO1q-6Rtr9GrvyyIoO3VF5ibLK0",
  authDomain: "foodforyou-52955.firebaseapp.com",
  projectId: "foodforyou-52955",
  storageBucket: "foodforyou-52955.appspot.com",
  messagingSenderId: "992651702910",
  appId: "1:992651702910:web:5cdebc9f90e90701371e2f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
window.firebase = { app, database };// Firebase setup script
