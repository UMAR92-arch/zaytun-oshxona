import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Admin paneldan IP (config) o'zgartirish uchun biz uni avval local storagedan o'qiymiz
// Yoki foydalanuvchi o'zining haqiqiy Firebase configini shu yerga kiritishi kerak:
export const getFirebaseConfig = () => {
  const storedConfig = localStorage.getItem('firebaseConfig');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Default config
  return {
    apiKey: "AIzaSyDuQeYL8PQ2X2BC2VNfrH7FCN7bV27RRWU",
    authDomain: "oshxona-88675.firebaseapp.com",
    projectId: "oshxona-88675",
    storageBucket: "oshxona-88675.firebasestorage.app",
    messagingSenderId: "977743914887",
    appId: "1:977743914887:web:a9f5f4008c4a2a36109522",
    measurementId: "G-E0W48N7TP3"
  };
};

import { getAnalytics } from "firebase/analytics";

export const initFirebase = (config: any) => {
  if (!config.apiKey || config.apiKey === "YOUR_API_KEY") return null;
  try {
    const app = initializeApp(config);
    if (typeof window !== 'undefined') {
      getAnalytics(app);
    }
    return getFirestore(app);
  } catch (e) {
    console.error("Firebase initialization error:", e);
    return null;
  }
};

let dbInstance = initFirebase(getFirebaseConfig());

export const getDb = () => dbInstance;
export const setDbConfig = (config: any) => {
  localStorage.setItem('firebaseConfig', JSON.stringify(config));
  dbInstance = initFirebase(config);
};
