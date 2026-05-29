import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzf5KJS52SA9sqTrDUibvW8OPbP6dq0Gg",
  authDomain: "ytun-oshxona.firebaseapp.com",
  projectId: "ytun-oshxona",
  storageBucket: "ytun-oshxona.firebasestorage.app",
  messagingSenderId: "887445619372",
  appId: "1:887445619372:web:5f37ee176c54f4bdfa5509",
  measurementId: "G-X0Z1BFH3KM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
