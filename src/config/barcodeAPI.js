// Configuração para APIs de código de barras
// Esta funcionalidade será implementada em versões futuras

export const BARCODE_API_CONFIG = {
  // APIs disponíveis para consulta de produtos
  APIS: {
    // API da Cosmos (Brasil)
    COSMOS: {
      BASE_URL: 'https://api.cosmos.bluesoft.com.br',
      API_KEY: process.env.REACT_APP_COSMOS_API_KEY || '',
      ENDPOINTS: {
        PRODUCT: '/gtins/{barcode}',
        SEARCH: '/products/search'
      }
    },

    // API Open Food Facts (Internacional)
    OPEN_FOOD_FACTS: {
      BASE_URL: 'https://world.openfoodfacts.org/api/v0',
      ENDPOINTS: {
        PRODUCT: '/product/{barcode}.json',
        SEARCH: '/search'
      }
    },

    // API UPC Database (EUA)
    UPC_DATABASE: {
      BASE_URL: 'https://api.upcdatabase.org/product',
      API_KEY: process.env.REACT_APP_UPC_API_KEY || '',
      ENDPOINTS: {
        PRODUCT: '/{barcode}'
      }
    }
  },

  // Configurações de fallback
  FALLBACK_CONFIG: {
    ENABLED: true,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 10000
  },

  // Cache de produtos
  CACHE_CONFIG: {
    ENABLED: true,
    DURATION: 24 * 60 * 60 * 1000, // 24 horas
    MAX_ITEMS: 1000
  }
};

// Serviço de código de barras
export const BarcodeService = {
  // Escanear código de barras
  scanBarcode: async (barcode) => {
    console.log('Escaneamento será implementado aqui');
    return null;
  },

  // Buscar produto por código
  getProductByBarcode: async (barcode) => {
    console.log('Busca de produto será implementada aqui');
    return null;
  },

  // Buscar produtos por nome
  searchProducts: async (query) => {
    console.log('Busca por nome será implementada aqui');
    return [];
  },

  // Validar código de barras
  validateBarcode: (barcode) => {
    if (!barcode || typeof barcode !== 'string') return false;

    // Remove caracteres não numéricos
    const cleanBarcode = barcode.replace(/\D/g, '');

    // Verifica se tem 8, 12, 13 ou 14 dígitos
    if (![8, 12, 13, 14].includes(cleanBarcode.length)) return false;

    // Implementar algoritmo de validação (checksum)
    return true;
  },

  // Calcular checksum EAN-13
  calculateEAN13Checksum: (digits) => {
    if (digits.length !== 12) return null;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }

    const checksum = (10 - (sum % 10)) % 10;
    return checksum;
  }
};

// Cache de produtos
export const ProductCache = {
  cache: new Map(),

  // Adicionar produto ao cache
  set: (barcode, product) => {
    if (!BARCODE_API_CONFIG.CACHE_CONFIG.ENABLED) return;

    const expiry = Date.now() + BARCODE_API_CONFIG.CACHE_CONFIG.DURATION;
    ProductCache.cache.set(barcode, {
      product,
      expiry
    });

    // Limpar cache se exceder limite
    if (ProductCache.cache.size > BARCODE_API_CONFIG.CACHE_CONFIG.MAX_ITEMS) {
      const firstKey = ProductCache.cache.keys().next().value;
      ProductCache.cache.delete(firstKey);
    }
  },

  // Obter produto do cache
  get: (barcode) => {
    if (!BARCODE_API_CONFIG.CACHE_CONFIG.ENABLED) return null;

    const cached = ProductCache.cache.get(barcode);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      ProductCache.cache.delete(barcode);
      return null;
    }

    return cached.product;
  },

  // Limpar cache expirado
  cleanup: () => {
    const now = Date.now();
    for (const [key, value] of ProductCache.cache.entries()) {
      if (now > value.expiry) {
        ProductCache.cache.delete(key);
      }
    }
  },

  // Limpar todo o cache
  clear: () => {
    ProductCache.cache.clear();
  }
};

// Utilitários para formatação de dados
export const BarcodeUtils = {
  // Formatar dados do produto
  formatProductData: (rawData, source) => {
    const baseProduct = {
      barcode: rawData.barcode || rawData.code || '',
      name: rawData.name || rawData.title || rawData.product_name || '',
      brand: rawData.brand || rawData.brands || '',
      category: rawData.category || rawData.categories || '',
      image: rawData.image || rawData.image_url || '',
      source: source,
      lastUpdated: new Date().toISOString()
    };

    // Adicionar dados específicos da API
    switch (source) {
      case 'COSMOS':
        return {
          ...baseProduct,
          price: rawData.price || null,
          weight: rawData.weight || null,
          description: rawData.description || ''
        };

      case 'OPEN_FOOD_FACTS':
        return {
          ...baseProduct,
          ingredients: rawData.ingredients_text || '',
          nutrition: rawData.nutriments || {},
          allergens: rawData.allergens_tags || []
        };

      default:
        return baseProduct;
    }
  },

  // Normalizar nome do produto
  normalizeProductName: (name) => {
    if (!name) return '';

    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Calcular similaridade entre produtos
  calculateSimilarity: (name1, name2) => {
    const normalized1 = BarcodeUtils.normalizeProductName(name1);
    const normalized2 = BarcodeUtils.normalizeProductName(name2);

    // Implementar algoritmo de similaridade (Levenshtein, Jaro-Winkler, etc.)
    // Por enquanto, retorna uma comparação simples
    return normalized1 === normalized2 ? 1 : 0;
  }
};

// Hook para React
export const useBarcodeScanner = () => {
  return {
    isScanning: false,
    isSupported: false,
    error: null,
    scan: () => console.log('Hook de escaneamento será implementado'),
    stopScan: () => console.log('Hook de parada será implementado')
  };
};

export default {
  BARCODE_API_CONFIG,
  BarcodeService,
  ProductCache,
  BarcodeUtils,
  useBarcodeScanner
};
