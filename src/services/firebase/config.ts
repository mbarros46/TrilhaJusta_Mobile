import 'react-native-get-random-values';        // polyfill p/ crypto
import 'react-native-url-polyfill/auto';        // polyfill p/ URL
import { Platform } from 'react-native';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBN6rlhnaA8hykM8tgl826a8_fNBwE0LjE',
  authDomain: 'fleetzone-70ec3.firebaseapp.com',
  projectId: 'fleetzone-70ec3',
  storageBucket: 'fleetzone-70ec3.appspot.com', 
  messagingSenderId: '322754107857',
  appId: '1:322754107857:web:4540c93f5aa33996b9a8f0',
  measurementId: 'G-VWC6K4SD5W',
};

// Evita re-inicialização em hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth com persistência automática no React Native
let auth;
if (Platform.OS !== 'web') {
  try {
    // No React Native, a persistência já é o comportamento padrão
    auth = initializeAuth(app);
  } catch {
    // já inicializado em hot reload, usar a instância existente
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

// Firestore e Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics só no Web
let analytics: any = null;
if (Platform.OS === 'web') {
  import('firebase/analytics')
    .then(({ getAnalytics }) => {
      analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export { app, auth, db, storage, analytics };
export default app;
