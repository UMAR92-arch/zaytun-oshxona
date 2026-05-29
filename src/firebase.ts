import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDuQeYL8PQ2X2BC2VNfrH7FCN7bV27RRWU",
  authDomain: "oshxona-88675.firebaseapp.com",
  projectId: "oshxona-88675",
  storageBucket: "oshxona-88675.firebasestorage.app",
  messagingSenderId: "977743914887",
  appId: "1:977743914887:web:a9f5f4008c4a2a36109522",
  measurementId: "G-E0W48N7TP3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
