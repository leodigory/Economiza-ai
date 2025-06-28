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

// Verificação de configuração para debug
const checkFirebaseConfig = () => {
  const requiredKeys = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    console.error('❌ Firebase Configuration Error:', {
      missingKeys,
      message: 'As seguintes variáveis de ambiente estão faltando:',
      solution:
        'Configure as variáveis no Netlify Dashboard ou arquivo .env.local',
    });
    return false;
  }

  console.log('✅ Firebase Config Status:', {
    isConfigured: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
    hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    config: process.env.REACT_APP_ENV || 'Development',
  });
  return true;
};

// Verificar se as variáveis de ambiente estão configuradas
const isFirebaseConfigured =
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

// Verificar configuração antes de inicializar
if (!checkFirebaseConfig()) {
  console.warn('Firebase configuration is incomplete. Running in demo mode.');
}

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
