import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { db } from './firebase';

/**
 * Salva a lista de IDs de lojas favoritas de um usuário no Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @param {string[]} favoriteStoreIds - Um array com os IDs das lojas favoritas.
 */
export const saveFavoriteStores = async (userId, favoriteStoreIds) => {
  if (!userId) return;
  try {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', 'stores');
    await setDoc(userFavoritesRef, { ids: favoriteStoreIds });
    console.log('Lojas favoritas salvas no Firestore com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar lojas favoritas no Firestore:', error);
  }
};

/**
 * Carrega a lista de IDs de lojas favoritas de um usuário do Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @returns {Promise<string[]>} - Um array com os IDs das lojas favoritas ou um array vazio.
 */
export const loadFavoriteStores = async userId => {
  if (!userId) return [];
  try {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', 'stores');
    const docSnap = await getDoc(userFavoritesRef);

    if (docSnap.exists() && docSnap.data().ids) {
      console.log(
        'Lojas favoritas carregadas do Firestore:',
        docSnap.data().ids
      );
      return docSnap.data().ids;
    } else {
      console.log(
        'Nenhum documento de lojas favoritas encontrado para o usuário.'
      );
      return [];
    }
  } catch (error) {
    console.error('Erro ao carregar lojas favoritas do Firestore:', error);
    return [];
  }
};

/**
 * Salva a lista de compras de um usuário para um mercado específico no Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @param {string} storeId - O ID do mercado.
 * @param {object[]} shoppingItems - O array de itens da lista de compras.
 */
export const saveShoppingList = async (userId, storeId, shoppingItems) => {
  if (!userId || !storeId) return;
  try {
    // Limpa undefined dos itens
    const sanitizedItems = (shoppingItems || []).map(item => {
      const sanitized = {};
      Object.entries(item).forEach(([key, value]) => {
        sanitized[key] = value === undefined ? null : value;
      });
      return sanitized;
    });
    const listRef = doc(db, 'users', userId, 'shoppingLists', storeId);
    await setDoc(listRef, { items: sanitizedItems });
    console.log(
      `Lista de compras para o mercado ${storeId} salva no Firestore.`
    );
  } catch (error) {
    console.error('Erro ao salvar a lista de compras:', error);
  }
};

/**
 * Carrega a lista de compras de um usuário para um mercado específico do Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @param {string} storeId - O ID do mercado.
 * @returns {Promise<object[]>} - Um array com os itens da lista ou um array vazio.
 */
export const loadShoppingList = async (userId, storeId) => {
  if (!userId || !storeId) return [];
  try {
    const listRef = doc(db, 'users', userId, 'shoppingLists', storeId);
    const docSnap = await getDoc(listRef);

    if (docSnap.exists() && docSnap.data().items) {
      console.log(
        `Lista de compras para o mercado ${storeId} carregada do Firestore.`
      );
      return docSnap.data().items;
    } else {
      console.log(
        `Nenhuma lista de compras ativa encontrada para o mercado ${storeId}.`
      );
      return [];
    }
  } catch (error) {
    console.error('Erro ao carregar a lista de compras:', error);
    return [];
  }
};

/**
 * Adiciona um novo registro de preço para um item em uma loja específica e atualiza o preço mais recente.
 * @param {string} itemName - O nome do item (usado como ID).
 * @param {string} storeName - O nome da loja (usado como ID).
 * @param {number} price - O preço do item.
 * @param {string} userId - O ID do usuário que está registrando o preço.
 */
export const addPriceRecord = async (itemName, storeName, price, userId) => {
  if (!itemName || !storeName || !price || !userId) {
    console.error('Dados insuficientes para registrar o preço.');
    return;
  }

  try {
    const normalizedItemName = itemName.toLowerCase().trim();
    const normalizedStoreName = storeName.toLowerCase().trim();

    // 1. Adiciona o registro ao histórico
    const historyRef = collection(
      db,
      'prices',
      normalizedItemName,
      'stores',
      normalizedStoreName,
      'history'
    );
    await addDoc(historyRef, {
      price: price,
      userId: userId,
      timestamp: new Date(),
    });

    // 2. Atualiza o preço mais recente (latest)
    const latestPriceRef = doc(
      db,
      'prices',
      normalizedItemName,
      'stores',
      normalizedStoreName
    );
    await setDoc(
      latestPriceRef,
      {
        latestPrice: price,
        updatedAt: new Date(),
        updatedBy: userId,
      },
      { merge: true }
    ); // Merge para não sobrescrever outros campos

    console.log(`Preço de '${itemName}' em '${storeName}' salvo com sucesso.`);
  } catch (error) {
    console.error('Erro ao salvar o registro de preço:', error);
  }
};

/**
 * Busca o preço mais recente de um item em uma loja específica.
 * @param {string} itemName - O nome do item.
 * @param {string} storeName - O nome da loja.
 * @returns {Promise<object|null>} - Um objeto com { latestPrice, updatedAt, updatedBy } ou null.
 */
export const getLatestPrice = async (itemName, storeName) => {
  if (!itemName || !storeName) return null;

  try {
    const normalizedItemName = itemName.toLowerCase().trim();
    const normalizedStoreName = storeName.toLowerCase().trim();

    const latestPriceRef = doc(
      db,
      'prices',
      normalizedItemName,
      'stores',
      normalizedStoreName
    );
    const docSnap = await getDoc(latestPriceRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar o preço mais recente:', error);
    return null;
  }
};

/**
 * Salva a localização (estado e cidade) de um usuário no Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @param {{state: string, city: string}} location - Objeto com estado e cidade.
 */
export const saveUserLocation = async (userId, location) => {
  if (!userId || !location || !location.state || !location.city) {
    console.error('Dados de localização insuficientes para salvar.');
    return;
  }
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { location }, { merge: true });
    console.log('Localização do usuário salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar localização do usuário:', error);
  }
};

/**
 * Carrega a localização de um usuário do Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @returns {Promise<{state: string, city: string}|null>}
 */
export const loadUserLocation = async userId => {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists() && docSnap.data().location) {
      return docSnap.data().location;
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar localização do usuário:', error);
    return null;
  }
};

// Funções para gerenciar usuários e permissões
export const userRoles = {
  ADMIN_SYSTEM: 'admin_system',
  STORE_MANAGER: 'store_manager',
  USER: 'user',
};

// Criar ou atualizar usuário
export const createOrUpdateUser = async userData => {
  try {
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(
      userRef,
      {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    return false;
  }
};

// Buscar usuário por UID
export const getUserByUid = async uid => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

// Buscar usuário por email
export const getUserByEmail = async email => {
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

// Promover usuário a gerente de loja
export const promoteToStoreManager = async (email, storeId) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      role: userRoles.STORE_MANAGER,
      managedStoreId: storeId,
      updatedAt: new Date(),
    });

    // Adicionar à lista de gerentes da loja
    const storeManagerRef = doc(db, 'store_managers', `${storeId}_${user.id}`);
    await setDoc(storeManagerRef, {
      storeId,
      userId: user.id,
      userEmail: email,
      userName: user.displayName || user.email,
      assignedAt: new Date(),
      assignedBy: 'admin_system', // Será atualizado com o UID do admin
    });

    return true;
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    return false;
  }
};

// Promover usuário a Admin do sistema
export const promoteToAdmin = async email => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      role: userRoles.ADMIN_SYSTEM,
      managedStoreId: null, // Admin não gerencia loja específica
      updatedAt: new Date(),
    });

    console.log(`Usuário ${email} promovido a Admin do sistema com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao promover usuário a Admin:', error);
    return false;
  }
};

// Remover gerente de loja
export const removeStoreManager = async (storeId, userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: userRoles.USER,
      managedStoreId: null,
      updatedAt: new Date(),
    });

    // Remover da lista de gerentes da loja
    const storeManagerRef = doc(db, 'store_managers', `${storeId}_${userId}`);
    await deleteDoc(storeManagerRef);

    return true;
  } catch (error) {
    console.error('Erro ao remover gerente:', error);
    return false;
  }
};

// Buscar gerentes de uma loja
export const getStoreManagers = async storeId => {
  try {
    const storeManagersRef = collection(db, 'store_managers');
    const q = query(storeManagersRef, where('storeId', '==', storeId));
    const querySnapshot = await getDocs(q);

    const managers = [];
    querySnapshot.forEach(doc => {
      managers.push({ id: doc.id, ...doc.data() });
    });

    return managers;
  } catch (error) {
    console.error('Erro ao buscar gerentes da loja:', error);
    return [];
  }
};

// Verificar permissões do usuário
export const checkUserPermissions = async (uid, storeId = null) => {
  try {
    const user = await getUserByUid(uid);
    if (!user) return { role: userRoles.USER, canEdit: false };

    const permissions = {
      role: user.role || userRoles.USER,
      canEdit: false,
      canManageUsers: false,
      canManageSystem: false,
    };

    switch (user.role) {
      case userRoles.ADMIN_SYSTEM:
        permissions.canEdit = true;
        permissions.canManageUsers = true;
        permissions.canManageSystem = true;
        break;

      case userRoles.STORE_MANAGER:
        if (storeId && user.managedStoreId === storeId) {
          permissions.canEdit = true;
        }
        break;

      case userRoles.USER:
      default:
        permissions.canEdit = false;
        break;
    }

    return permissions;
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return { role: userRoles.USER, canEdit: false };
  }
};

/**
 * Salva uma lista finalizada no histórico do usuário no Firestore.
 * @param {string} userId - O ID do usuário do Firebase.
 * @param {object} historyList - Objeto da lista finalizada (deve conter id, store, items, date, etc).
 */
export const saveHistoryList = async (userId, historyList) => {
  if (!userId || !historyList || !historyList.id) return;
  try {
    // Sanitiza o objeto historyList e seus itens
    const sanitize = obj => {
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      } else if (obj && typeof obj === 'object') {
        const sanitized = {};
        Object.entries(obj).forEach(([key, value]) => {
          sanitized[key] = value === undefined ? null : sanitize(value);
        });
        return sanitized;
      }
      return obj;
    };
    const sanitizedHistoryList = sanitize(historyList);
    const historyRef = doc(
      db,
      'users',
      userId,
      'shoppingHistory',
      sanitizedHistoryList.id
    );
    await setDoc(historyRef, sanitizedHistoryList);
    console.log(
      `Histórico de lista ${sanitizedHistoryList.id} salvo no Firestore.`
    );
  } catch (error) {
    console.error('Erro ao salvar histórico de lista:', error);
  }
};

// Verificar se é o primeiro usuário e promover a admin
export const checkAndPromoteFirstUser = async (uid, email, displayName, photoURL) => {
  try {
    // Verificar se já existe algum usuário no sistema
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    if (querySnapshot.empty) {
      // É o primeiro usuário - promover a admin
      console.log('🎉 Primeiro usuário detectado! Promovendo a Admin do Sistema...');

      const userData = {
        uid,
        email,
        displayName,
        photoURL,
        role: userRoles.ADMIN_SYSTEM,
        managedStoreId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFirstUser: true
      };

      await createOrUpdateUser(userData);
      console.log(`✅ Usuário ${email} promovido automaticamente a Admin do Sistema!`);
      return userData;
    }

    return null; // Não é o primeiro usuário
  } catch (error) {
    console.error('Erro ao verificar primeiro usuário:', error);
    return null;
  }
};

export { db };
