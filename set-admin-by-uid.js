import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkEYlreLoQFqrdN8eKASS20a6DaLpJtYE",
  authDomain: "lista-de-compras-f67aa.firebaseapp.com",
  projectId: "lista-de-compras-f67aa",
  storageBucket: "lista-de-compras-f67aa.appspot.com",
  messagingSenderId: "276613236544",
  appId: "1:276613236544:web:b5419812728802e013dca5",
  measurementId: "G-2HFQ3BGVVF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const setAdminByUid = async (uid, email, displayName) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  const data = {
    role: 'admin_system',
    managedStoreId: null,
    email,
    displayName,
    updatedAt: new Date()
  };

  if (userSnap.exists()) {
    await updateDoc(userRef, data);
    console.log(`Usuário ${uid} atualizado para admin_system com email salvo.`);
  } else {
    await setDoc(userRef, {
      ...data,
      createdAt: new Date()
    });
    console.log(`Usuário ${uid} criado como admin_system com email salvo.`);
  }
};

setAdminByUid(
  'NO8ROgw5AYZ9sAwLpItS4hNgEpe2',
  '01leonardoaraujo@gmail.com',
  'Leonardo Araújo'
);
