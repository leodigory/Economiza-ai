import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Busca todos os produtos e preços mais recentes de uma loja específica
export const getAllProductsForStore = async (storeName) => {
  if (!storeName) return [];
  const products = [];
  try {
    // Busca todos os produtos (subcoleções de 'prices')
    const pricesSnapshot = await getDocs(collection(db, 'prices'));
    for (const productDoc of pricesSnapshot.docs) {
      const productName = productDoc.id;
      // Busca o preço mais recente para esta loja
      const storeRef = collection(db, 'prices', productName, 'stores');
      const storeSnapshot = await getDocs(storeRef);
      for (const storeDoc of storeSnapshot.docs) {
        if (storeDoc.id === storeName.toLowerCase().trim()) {
          const data = storeDoc.data();
          products.push({
            name: productName,
            latestPrice: data.latestPrice,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy
          });
        }
      }
    }
    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos do catálogo:', error);
    return [];
  }
};

// Configurações do catálogo
export const catalogConfig = {
  // Configurações futuras podem ser adicionadas aqui
};
