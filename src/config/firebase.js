// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration from user
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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

// Verificar configuração antes de inicializar
if (!checkFirebaseConfig()) {
  throw new Error(
    'Firebase configuration is incomplete. Please check your environment variables.'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

console.log('Firebase inicializado com sucesso!');

// Função de Sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // O usuário logado pode ser acessado em result.user
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
    await signOut(auth);
    console.log('Logout bem-sucedido!');
  } catch (error) {
    console.error('Erro no logout:', error.message);
  }
};

export { auth, db, signInWithGoogle, signOutFromGoogle };
