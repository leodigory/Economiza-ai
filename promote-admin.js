// Script para promover usuário a Admin do sistema
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Firebase configuration
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

const userRoles = {
  ADMIN_SYSTEM: 'admin_system',
  STORE_MANAGER: 'store_manager',
  USER: 'user'
};

// Buscar usuário por email
const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return null;
  }
};

// Promover usuário a Admin do sistema
const promoteToAdmin = async (email) => {
  try {
    console.log(`🔍 Buscando usuário: ${email}`);
    const user = await getUserByEmail(email);

    if (!user) {
      console.log(`⚠️ Usuário não encontrado. Criando novo usuário Admin...`);

      // Criar novo usuário como Admin
      const usersRef = collection(db, 'users');
      const newUserRef = doc(usersRef);

      await setDoc(newUserRef, {
        email: email,
        displayName: 'Leonardo Araújo',
        role: userRoles.ADMIN_SYSTEM,
        managedStoreId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`🎉 Novo usuário Admin criado: ${email}`);
      return true;
    }

    console.log(`✅ Usuário encontrado: ${user.displayName || user.email}`);

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      role: userRoles.ADMIN_SYSTEM,
      managedStoreId: null,
      updatedAt: new Date()
    });

    console.log(`🎉 Usuário ${email} promovido a Admin do sistema com sucesso!`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao promover usuário a Admin:', error);
    return false;
  }
};

// Executar a promoção
const main = async () => {
  const email = '01leonardoaraujo@gmail.com';
  console.log(`🚀 Iniciando promoção de ${email} para Admin...`);

  const success = await promoteToAdmin(email);

  if (success) {
    console.log('✅ Promoção concluída com sucesso!');
  } else {
    console.log('❌ Falha na promoção');
  }

  process.exit(0);
};

main();
