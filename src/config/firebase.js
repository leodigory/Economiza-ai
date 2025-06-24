// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração padrão para desenvolvimento (fallback)
const defaultConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'demo-app-id',
  measurementId: 'demo-measurement-id',
};

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    defaultConfig.storageBucket,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    defaultConfig.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
    defaultConfig.measurementId,
};

// Verificar se as variáveis de ambiente estão configuradas
const isFirebaseConfigured =
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

console.log('Firebase Config Status:', {
  isConfigured: isFirebaseConfigured,
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  config: isFirebaseConfigured ? 'Production' : 'Demo Mode',
});

// Initialize Firebase
let app, auth, db, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  console.log('Firebase inicializado com sucesso!');
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);

  // Fallback para modo demo
  app = initializeApp(defaultConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  console.log('Firebase inicializado em modo demo');
}

// Função de Sign-in
const signInWithGoogle = async () => {
  try {
    if (!isFirebaseConfigured) {
      console.warn('Firebase não configurado - modo demo ativo');
      return {
        user: {
          uid: 'demo-user',
          displayName: 'Demo User',
          email: 'demo@example.com',
        },
      };
    }

    const result = await signInWithPopup(auth, googleProvider);
    console.log('Login com Google bem-sucedido!', result.user);
    return result.user;
  } catch (error) {
    console.error('Erro no login com Google:', error.message);
    return null;
  }
};

// Função de Sign-out
const signOutFromGoogle = async () => {
  try {
    if (!isFirebaseConfigured) {
      console.warn('Firebase não configurado - logout simulado');
      return;
    }

    await signOut(auth);
    console.log('Logout bem-sucedido!');
  } catch (error) {
    console.error('Erro no logout:', error.message);
  }
};

// Função para verificar se o Firebase está configurado
const isFirebaseReady = () => {
  return isFirebaseConfigured;
};

export {
  auth,
  db,
  signInWithGoogle,
  signOutFromGoogle,
  isFirebaseReady,
  isFirebaseConfigured,
};
