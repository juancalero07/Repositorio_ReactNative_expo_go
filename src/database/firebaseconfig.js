import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database"; // Importación para Realtime DB

const { extra } = Constants.expoConfig;

// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
  databaseURL: extra.FIREBASE_DATABASE_URL // URL necesaria para Realtime DB
};

// 2. 🎯 INICIALIZAR Firebase APP PRIMERO
const app = initializeApp(firebaseConfig);

// 3. Servicios - AHORA USAMOS 'app'

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

// 4. Crear la instancia de Realtime Database usando 'app'
// Esto debe ir DESPUÉS de donde se define 'app'
const realtimeDB = getDatabase(app); 


export { app, auth, db, realtimeDB };