import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config/firebase';
import ToggleSwitch from './components/common/ToggleSwitch';
import { mapPin } from './components/icons';

// Firebase
import { auth, signInWithGoogle, signOutFromGoogle } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Firestore
import {
  saveFavoriteStores,
  loadFavoriteStores,
  saveShoppingList,
  loadShoppingList,
  saveUserLocation,
  loadUserLocation,
  createOrUpdateUser,
  getUserByUid,
  checkUserPermissions,
  userRoles,
  saveHistoryList,
} from './config/firestore';

// Hooks
import useTheme from './hooks/useTheme';
import { useApiSuggestions } from './hooks/useApiSuggestions';
import { useDebounce } from './hooks/useDebounce';
import useCapsLockDetection from './hooks/useCapsLockDetection';
import useMobileDetection from './hooks/useMobileDetection';
import { useNearbyStores, fetchLogoFromGoogle } from './hooks/useNearbyStores';

// New Layout Components
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Components
import ShoppingList from './components/ShoppingList';
import StoreSelector from './components/StoreSelector';
import StoreCatalog from './components/StoreCatalog';
import UserManagementModal from './components/UserManagementModal';

// Modals and Views
import AddItemModal from './components/AddItemModal';
import AccountView from './components/AccountView';
import HistoryView from './components/HistoryView';
import UserManagement from './components/UserManagement';

// CSS
import './App.css';

// New imports
import { getAllProductsForStore } from './config/catalog';

// Main titles for the header
const viewTitles = {
  home: 'Economiza Ai',
  list: 'Lista de Compras',
  history: 'Histórico',
  settings: 'Conta',
  catalog: 'Catálogo',
};

// Componente de erro para quando o Firebase não está configurado
const FirebaseErrorComponent = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
      }}
    >
      <h1 style={{ color: '#e74c3c', marginBottom: '20px' }}>
        ⚠️ Configuração Necessária
      </h1>
      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        O <strong>Economiza AI</strong> precisa das configurações do Firebase
        para funcionar corretamente.
      </p>
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'left',
        }}
      >
        <h3 style={{ marginTop: '0', color: '#495057' }}>Para configurar:</h3>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li>
            Crie um projeto no{' '}
            <a
              href='https://console.firebase.google.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Firebase Console
            </a>
          </li>
          <li>Configure as variáveis de ambiente no Netlify</li>
          <li>Adicione as credenciais do Firebase</li>
        </ol>
      </div>
      <p style={{ fontSize: '14px', color: '#6c757d' }}>
        <strong>Variáveis necessárias:</strong>
        <br />
        REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_PROJECT_ID, etc.
      </p>
    </div>
  </div>
);

function App() {
  // Hooks devem ser chamados sempre, no topo
  const [shoppingItems, setShoppingItems] = useState(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [stores, setStores] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [currentStore, setCurrentStore] = useState('');
  const [lastPurchaseData, setLastPurchaseData] = useState(null);
  const [favoriteStores, setFavoriteStores] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteStores');
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isStoreEditMode, setIsStoreEditMode] = useState(false);
  const [selectedCatalogStore, setSelectedCatalogStore] = useState(null);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingCatalogProducts, setLoadingCatalogProducts] = useState(false);
  const { isDarkMode, toggleTheme, appRef } = useTheme();
  const debouncedInputValue = useDebounce(inputValue, 300);
  const { suggestions, clearSuggestions } =
    useApiSuggestions(debouncedInputValue);
  const { isCapsLockOn } = useCapsLockDetection();
  const isMobile = useMobileDetection();
  const { fetchNearbyStores, loading: loadingNearby } = useNearbyStores();
  const [currentView, setCurrentView] = useState('home');
  const [userPermissions, setUserPermissions] = useState({
    role: userRoles.USER,
    canEdit: false,
  });
  const [userData, setUserData] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] =
    useState(false);
  const [shoppingHistory, setShoppingHistory] = useState(() => {
    const saved = localStorage.getItem('shoppingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // TODOS OS HOOKS DEVEM SER CHAMADOS AQUI, ANTES DE QUALQUER RETURN CONDICIONAL
  const syncAndSetStores = useCallback(
    async (latitude, longitude) => {
      if (!isFirebaseConfigured) return; // Early return dentro do hook

      const processedStores = new Map();

      // 1. Buscar todas as lojas do nosso banco de dados
      const firestoreStoresSnapshot = await getDocs(collection(db, 'stores'));
      firestoreStoresSnapshot.forEach(doc => {
        const storeData = { ...doc.data(), id: doc.id };
        // Usar osm_id como chave primária para desduplicação se existir, senão o ID do Firestore
        const key = storeData.osm_id ? `osm_${storeData.osm_id}` : storeData.id;
        processedStores.set(key, storeData);
      });

      // 2. Buscar lojas próximas da API se tivermos coordenadas
      let nearbyApiStores = [];
      if (latitude && longitude) {
        nearbyApiStores = await fetchNearbyStores(latitude, longitude);
        for (const apiStore of nearbyApiStores) {
          if (!apiStore.osm_id) continue;
          const key = `osm_${apiStore.osm_id}`;
          const existingStore = processedStores.get(key);
          if (existingStore) {
            processedStores.set(key, {
              ...existingStore,
              ...apiStore,
              id: existingStore.id,
            });
          } else {
            processedStores.set(key, { ...apiStore, isCustom: false });
          }
        }
      }

      // 3. Processar lojas da API, atualizando as existentes e adicionando novas
      for (const apiStore of nearbyApiStores) {
        const key = `osm_${apiStore.osm_id}`;
        const existingStore = processedStores.get(key);

        if (existingStore) {
          // Loja já existe, apenas atualizar se necessário
        } else {
          // Nova loja da API
          processedStores.set(key, {
            ...apiStore,
            isCustom: false,
            createdAt: new Date(),
          });
        }
      }

      // Exibe imediatamente os mercados
      setStores(Array.from(processedStores.values()));

      // Busca logos em background para mercados sem logo
      const storesWithoutLogo = nearbyApiStores.filter(apiStore => {
        if (!apiStore.osm_id) return false;
        const key = `osm_${apiStore.osm_id}`;
        const store = processedStores.get(key);
        return !store.logoUrl && !store.isCustom;
      });

      // Busca logos sequencialmente para evitar rate limiting
      for (let i = 0; i < storesWithoutLogo.length; i++) {
        const apiStore = storesWithoutLogo[i];
        const key = `osm_${apiStore.osm_id}`;
        const store = processedStores.get(key);
        // Delay entre cada busca
        setTimeout(async () => {
          try {
            const logoUrl = await fetchLogoFromGoogle(
              apiStore.name,
              apiStore.address || ''
            );
            if (logoUrl) {
              // Salvar no Firestore
              await updateDoc(doc(db, 'stores', store.id), { logoUrl });
              // Atualizar estado local
              processedStores.set(key, { ...store, logoUrl });
              setStores(Array.from(processedStores.values()));
            }
          } catch (error) {
            // Mantém o erro para depuração
            console.error(
              `❌ Erro ao buscar logo para ${apiStore.name}:`,
              error
            );
          }
        }, i * 3000); // 3 segundos entre cada busca
      }
    },
    [fetchNearbyStores, isFirebaseConfigured]
  );

  // Efeito para observar o estado de autenticação do Firebase e definir o usuário
  useEffect(() => {
    if (!isFirebaseConfigured) return; // Early return dentro do hook

    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);

      if (user) {
        // Carregar dados completos do usuário
        const userData = await getUserByUid(user.uid);
        setUserData(userData);

        // Verificar permissões
        const permissions = await checkUserPermissions(user.uid);
        setUserPermissions(permissions);

        // Criar/atualizar usuário no Firestore se não existir
        if (!userData) {
          await createOrUpdateUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role:
              user.email === 'leonardo@email.com'
                ? userRoles.ADMIN_SYSTEM
                : userRoles.USER, // Leonardo como admin
          });
        }

        // Carregar dados não relacionados à localização
        loadFavoriteStores(user.uid).then(favoriteIds => {
          setFavoriteStores(new Set(favoriteIds));
        });
        loadShoppingList(user.uid).then(items => {
          if (items.length > 0) setShoppingItems(items);
        });

        // Lógica de localização
        const savedLocation = await loadUserLocation(user.uid);
        setUserLocation(savedLocation);

        if (
          savedLocation &&
          savedLocation.latitude &&
          savedLocation.longitude
        ) {
          // --- NOVA PRIORIDADE 1: Usar coordenadas salvas diretamente ---
          console.log('Usando coordenadas salvas do Firestore.');
          const { street, city, state, latitude, longitude } = savedLocation;
          const displayAddress = [street, city, state]
            .filter(Boolean)
            .join(', ');
          setUserAddress(displayAddress);
          syncAndSetStores(latitude, longitude);
        } else if (savedLocation && savedLocation.city) {
          // --- PRIORIDADE 2: Tentar geocodificar endereço salvo (fallback) ---
          console.log('Tentando geocodificar endereço salvo...');
          const { street, city, state } = savedLocation;
          const displayAddress = [street, city, state]
            .filter(Boolean)
            .join(', ');
          setUserAddress(displayAddress);
          // Geocodificação: Endereço -> Coordenadas
          try {
            const query = `street=${encodeURIComponent(
              street || ''
            )}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(
              state
            )}&country=Brazil&format=json&limit=1`;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?${query}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              syncAndSetStores(lat, lon);
            } else {
              console.log(
                'Não foi possível encontrar coordenadas para o endereço salvo. Carregando apenas lojas do DB.'
              );
              syncAndSetStores(null, null);
            }
          } catch (error) {
            console.error('Erro na geocodificação do endereço salvo:', error);
            syncAndSetStores(null, null);
          }
        } else {
          // --- PRIORIDADE 3: Usar geolocalização automática ---
          console.log('Usando geolocalização do navegador.');
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async position => {
                const { latitude, longitude } = position.coords;
                syncAndSetStores(latitude, longitude);
                // Geocodificação Reversa: Coordenadas -> Endereço
                try {
                  const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                  );
                  const geoData = await geoRes.json();
                  if (geoData && geoData.address) {
                    const { road, suburb, city, town } = geoData.address;
                    const displayAddress = [road, suburb, city || town]
                      .filter(Boolean)
                      .join(', ');
                    setUserAddress(displayAddress);
                  }
                } catch (error) {
                  console.error('Erro na geocodificação reversa:', error);
                }
              },
              error => {
                console.error('Erro ao obter localização para busca:', error);
                syncAndSetStores(null, null);
              }
            );
          } else {
            // Se não tiver geolocalização, carrega apenas do banco de dados
            syncAndSetStores(null, null);
          }
        }
      } else {
        // Limpa a sessão se não houver usuário
        setCurrentUser(null);
        setUserData(null);
        setUserPermissions({ role: userRoles.USER, canEdit: false });
        setStores([]);
        setUserLocation(null);
        setUserAddress('');
        // Poderia carregar do localStorage aqui se quisesse
      }
    });
    return () => unsubscribe(); // Limpa o observador ao desmontar
  }, [syncAndSetStores, isFirebaseConfigured]);

  const handleAddItem = useCallback(
    itemData => {
      if (!itemData || !itemData.text || !itemData.text.trim()) return;

      if (isEditing) {
        setShoppingItems(
          shoppingItems.map(item =>
            item.id === isEditing.id
              ? { ...item, ...itemData, completed: item.completed }
              : item
          )
        );
        setIsEditing(null);
      } else {
        const newItem = {
          id: uuidv4(),
          ...itemData,
          completed: false,
        };
        setShoppingItems([...shoppingItems, newItem]);
      }
      setInputValue('');
      setQuantity(1);
      setPrice(0);
      setIsAddItemModalOpen(false); // Close modal after adding/editing
    },
    [isEditing, shoppingItems]
  );

  const onKeyPress = useCallback(
    key => {
      // Keyboard logic will now primarily affect the AddItemModal input
      if (isAddItemModalOpen) {
        if (key === 'Enter') {
          handleAddItem();
        } else if (key === 'Backspace') {
          setInputValue(prev => prev.slice(0, -1));
        } else {
          setInputValue(prev => prev + key);
        }
      }
    },
    [isAddItemModalOpen, handleAddItem]
  );

  // Load data on mount
  useEffect(() => {
    const savedStore = localStorage.getItem('currentStore');
    if (savedStore) {
      setCurrentStore(savedStore);
      if (currentUser) {
        loadShoppingList(currentUser.uid, savedStore).then(items =>
          setShoppingItems(items)
        );
      } else {
        const savedItems = JSON.parse(
          localStorage.getItem(`shoppingItems_${savedStore}`) || '[]'
        );
        setShoppingItems(savedItems);
      }
    }
    const lastPurchase = JSON.parse(
      localStorage.getItem('lastPurchaseData') || 'null'
    );
    setLastPurchaseData(lastPurchase);
  }, [currentUser]);

  // Save items when they change
  useEffect(() => {
    if (currentStore) {
      localStorage.setItem(
        `shoppingItems_${currentStore}`,
        JSON.stringify(shoppingItems)
      );
      if (currentUser) {
        saveShoppingList(currentUser.uid, currentStore, shoppingItems);
      }
    }
  }, [shoppingItems, currentStore, currentUser]);

  useEffect(() => {
    if (lastPurchaseData) {
      localStorage.setItem(
        'lastPurchaseData',
        JSON.stringify(lastPurchaseData)
      );
    }
  }, [lastPurchaseData]);

  useEffect(() => {
    localStorage.setItem('stores', JSON.stringify(stores));
  }, [stores]);

  // Efeito para salvar favoritos no Firestore quando eles mudam
  useEffect(() => {
    // Salva no localStorage para usuários não logados ou como backup
    localStorage.setItem(
      'favoriteStores',
      JSON.stringify(Array.from(favoriteStores))
    );

    // Salva no Firestore se o usuário estiver logado
    if (currentUser) {
      saveFavoriteStores(currentUser.uid, Array.from(favoriteStores));
    }
  }, [favoriteStores, currentUser]);

  // Verificar se o Firebase está configurado - DEPOIS de todos os hooks
  if (!isFirebaseConfigured) {
    console.warn('Firebase não configurado - mostrando tela de erro');
    return <FirebaseErrorComponent />;
  }

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutFromGoogle();
    // O onAuthStateChanged vai limpar o estado
  };

  const handleToggleFavorite = storeId => {
    setFavoriteStores(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(storeId)) {
        newFavorites.delete(storeId);
      } else {
        newFavorites.add(storeId);
      }
      return newFavorites;
    });
  };

  const handleEditItem = item => {
    setIsEditing(item);
    setInputValue(item.text);
    setQuantity(item.quantity);
    setPrice(item.value);
    setIsAddItemModalOpen(true);
  };

  const handleDeleteItem = id => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  const handleToggleItem = id => {
    setShoppingItems(
      shoppingItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleStoreSelect = async store => {
    setCurrentStore(store);
    localStorage.setItem('currentStore', store);

    if (currentUser) {
      const items = await loadShoppingList(currentUser.uid, store);
      setShoppingItems(items);
    } else {
      const savedItems = JSON.parse(
        localStorage.getItem(`shoppingItems_${store}`) || '[]'
      );
      setShoppingItems(savedItems);
    }
    setActiveView('list');
  };

  const navigateToHome = () => {
    setCurrentStore('');
    setActiveView('home');
  };

  const openAddItemModal = () => {
    setIsAddItemModalOpen(true);
  };

  const openAddStoreItemModal = () => {
    // Função específica para adicionar itens no catálogo da loja
    // Aqui você pode implementar a lógica para adicionar produtos/preços
    alert(
      'Funcionalidade de adicionar produtos ao catálogo da loja será implementada em breve!'
    );
  };

  const openUserManagementModal = () => {
    setIsUserManagementModalOpen(true);
  };

  const handleAddStore = async storeData => {
    if (!currentUser) {
      alert('Você precisa estar logado para adicionar uma nova loja.');
      return;
    }

    try {
      const newStoreRef = await addDoc(collection(db, 'stores'), {
        name: storeData.name,
        address: storeData.address || 'Endereço não informado',
        isCustom: true,
        addedBy: currentUser.uid,
        // O Firestore irá gerar um ID único automaticamente
      });

      console.log('Loja adicionada com o ID: ', newStoreRef.id);

      // Atualiza o estado local para refletir a mudança imediatamente
      const newStore = {
        id: newStoreRef.id,
        name: storeData.name,
        address: storeData.address || 'Endereço não informado',
        isCustom: true,
      };
      setStores(prevStores => [...prevStores, newStore]);

      // Adiciona automaticamente aos favoritos
      handleToggleFavorite(newStoreRef.id);
    } catch (error) {
      console.error('Erro ao adicionar loja no Firestore: ', error);
      alert('Ocorreu um erro ao adicionar a loja. Tente novamente.');
    }
  };

  const handleDeleteStore = async storeId => {
    if (!currentUser) {
      alert('Você precisa estar logado para excluir uma loja.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'stores', storeId));

      console.log('Loja excluída: ', storeId);

      // Atualiza o estado local
      setStores(stores.filter(store => store.id !== storeId));

      // Remove dos favoritos se estiver lá
      setFavoriteStores(prevFavorites => {
        const newFavorites = new Set(prevFavorites);
        newFavorites.delete(storeId);
        return newFavorites;
      });
    } catch (error) {
      console.error('Erro ao excluir loja do Firestore: ', error);
      alert('Ocorreu um erro ao excluir a loja. Tente novamente.');
    }
  };

  const handleSaveLocation = location => {
    if (currentUser && location) {
      saveUserLocation(currentUser.uid, location);
      setUserLocation(location);
      alert('Localização salva com sucesso!');
    }
  };

  const handleBackFromStoreCatalog = () => {
    setSelectedStore(null);
    setCurrentView('catalog');
  };

  const handleCatalogStoreSelect = async storeName => {
    // Encontrar a loja selecionada
    const store = stores.find(s => s.name === storeName);
    if (store) {
      setSelectedStore(store);
      setCurrentView('store-catalog');
    }
  };

  const handleFinishList = async () => {
    if (!currentStore || shoppingItems.length === 0) return;
    // Só permite finalizar se ao menos um item estiver marcado
    const hasCompleted = shoppingItems.some(item => item.completed);
    if (!hasCompleted) {
      alert('Marque pelo menos um item como concluído para finalizar a lista!');
      return;
    }
    const finishedList = {
      id: `${currentStore}_${Date.now()}`,
      store: currentStore,
      items: shoppingItems,
      date: new Date().toISOString(),
    };
    // Salvar no histórico local
    const newHistory = [finishedList, ...shoppingHistory];
    setShoppingHistory(newHistory);
    localStorage.setItem('shoppingHistory', JSON.stringify(newHistory));
    // Salvar no Firestore se logado
    if (currentUser) {
      await saveHistoryList(currentUser.uid, finishedList);
    }
    // Limpar lista ativa
    setShoppingItems([]);
    // Navegar para histórico
    setActiveView('history');
  };

  return (
    <div
      ref={appRef}
      className={`app-container ${isDarkMode ? 'dark' : ''} mobile-layout`}
    >
      <header className='sticky-header'>
        <Header
          title={activeView === 'list' ? currentStore : viewTitles[activeView]}
          showBackButton={activeView === 'list'}
          onBackClick={navigateToHome}
        />
        {(activeView === 'home' || activeView === 'catalog') && (
          <div className='home-header-controls'>
            {userAddress && (
              <p className='user-location-display'>
                <span className='location-icon'>{mapPin}</span>
                Sua localização: <strong>{userAddress}</strong>
              </p>
            )}
            <div className='store-list-controls'>
              <ToggleSwitch
                label='Mostrar apenas favoritos'
                isToggled={showOnlyFavorites}
                onToggle={() => setShowOnlyFavorites(!showOnlyFavorites)}
              />
              {activeView === 'home' && (
                <button
                  onClick={() => setIsStoreEditMode(!isStoreEditMode)}
                  className='edit-mode-btn'
                >
                  {isStoreEditMode ? 'Concluir' : 'Editar'}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className='content-area'>
        {/* Home View */}
        {activeView === 'home' && (
          <div className='home-view'>
            <StoreSelector
              stores={stores}
              onSelectStore={handleStoreSelect}
              onAddStore={handleAddStore}
              favoriteStores={favoriteStores}
              onToggleFavorite={handleToggleFavorite}
              isEditMode={isStoreEditMode}
              onToggleEditMode={() => setIsStoreEditMode(!isStoreEditMode)}
              onDeleteStore={handleDeleteStore}
              showOnlyFavorites={showOnlyFavorites}
            />
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className='list-view'>
            <ShoppingList
              items={shoppingItems}
              onRemoveItem={handleDeleteItem}
              onToggleItem={handleToggleItem}
              onClearList={() => setShoppingItems([])}
              onFinishList={handleFinishList}
              currentStore={currentStore}
              currentUser={currentUser}
            />
            {/* Botão '+' flutuante para adicionar item */}
            <button
              className='add-item-fab'
              onClick={openAddItemModal}
              aria-label='Adicionar item'
              style={{
                position: 'fixed',
                bottom: 140,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
              }}
            >
              +
            </button>
          </div>
        )}

        {/* Catalog View */}
        {activeView === 'catalog' && (
          <div className='catalog-view'>
            <StoreSelector
              stores={stores}
              onSelectStore={handleCatalogStoreSelect}
              onToggleFavorite={handleToggleFavorite}
              favoriteStores={favoriteStores}
              showOnlyFavorites={showOnlyFavorites}
              hideAddStoreCard={true}
              userPermissions={userPermissions}
            />
          </div>
        )}

        {/* Store Catalog View */}
        {activeView === 'store-catalog' && selectedStore && (
          <StoreCatalog
            store={selectedStore}
            currentUser={currentUser}
            onBack={handleBackFromStoreCatalog}
          />
        )}

        {/* Account View */}
        {activeView === 'account' && (
          <div className='account-view'>
            <AccountView
              user={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              savedLocation={userLocation}
              onSaveLocation={handleSaveLocation}
              userPermissions={userPermissions}
              userRoles={userRoles}
              userData={userData}
              onUserDataUpdate={setUserData}
              onOpenUserManagement={openUserManagementModal}
            />
          </div>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <div className='history-view'>
            <HistoryView history={shoppingHistory} />
          </div>
        )}

        {/* User Management View */}
        {activeView === 'user-management' && (
          <div className='user-management-view'>
            <div className='view-header'>
              <button
                className='back-btn'
                onClick={() => setActiveView('account')}
              >
                ← Voltar para Conta
              </button>
              <h2>👥 Gerenciamento de Usuários</h2>
            </div>

            <UserManagement currentUser={userData} currentStore={null} />
          </div>
        )}
      </div>

      {/* Bottom Navigation - Fixada em todas as abas */}
      <BottomNav currentView={activeView} onViewChange={setActiveView} />

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <>
          <AddItemModal
            onClose={() => setIsAddItemModalOpen(false)}
            inputValue={inputValue}
            setInputValue={setInputValue}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            onAddItem={handleAddItem}
            isEditing={!!isEditing}
          />
          <button
            className='add-item-fixed-btn'
            type='button'
            onClick={() => {
              if (!inputValue.trim()) return;
              handleAddItem(window.__getAddItemData());
            }}
            disabled={!inputValue.trim()}
            style={{
              position: 'fixed',
              left: 0,
              bottom: 0,
              width: '100vw',
              padding: '1.1rem 0',
              fontSize: '1.15rem',
              fontWeight: 700,
              borderRadius: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              opacity: inputValue.trim() ? 1 : 0.6,
              transition: 'background 0.2s, opacity 0.2s',
              boxShadow: '0 -2px 16px rgba(102, 126, 234, 0.13)',
              zIndex: 3000,
              textAlign: 'center',
            }}
          >
            Adicionar Item
          </button>
        </>
      )}

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;
