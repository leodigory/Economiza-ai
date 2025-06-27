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

// Promover usuário a Admin
const promoteToAdmin = async (email) => {
  try {
    console.log(`Promovendo usuário ${email} a Admin do Sistema...`);

    const user = await getUserByEmail(email);

    if (!user) {
      console.log('Usuário não encontrado. Criando novo usuário admin...');

      // Criar novo usuário admin
      const newUser = {
        uid: `admin_${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
        role: userRoles.ADMIN_SYSTEM,
        managedStoreId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const userRef = doc(db, 'users', newUser.uid);
      await setDoc(userRef, newUser);

      console.log(`✅ Usuário ${email} criado e promovido a Admin do Sistema com sucesso!`);
      return true;
    } else {
      console.log('Usuário encontrado. Atualizando permissões...');

      // Atualizar usuário existente
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        role: userRoles.ADMIN_SYSTEM,
        managedStoreId: null,
        updatedAt: new Date()
      });

      console.log(`✅ Usuário ${email} promovido a Admin do Sistema com sucesso!`);
      return true;
    }
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
    return false;
  }
};

// Executar a promoção
const targetEmail = '01leonardoaraujo@gmail.com';

promoteToAdmin(targetEmail)
  .then(success => {
    if (success) {
      console.log('🎉 Operação concluída com sucesso!');
    } else {
      console.log('❌ Falha na operação.');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  });
