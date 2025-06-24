import React, { useState } from 'react';
import './StoreSelector.css';
import ToggleSwitch from './common/ToggleSwitch';
import { mapPin } from './icons';
import { generateInitials, generateColor } from '../utils/userAvatar';

const StoreSelector = ({
  stores,
  onSelectStore,
  onAddStore,
  favoriteStores,
  onToggleFavorite,
  isEditMode,
  onDeleteStore,
  showOnlyFavorites,
  hideAddStoreCard,
  noOuterCard,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [imageErrors, setImageErrors] = useState(new Set());

  // Garantir que favoriteStores seja um Set válido
  const safeFavoriteStores = favoriteStores || new Set();

  const handleImageError = storeId => {
    setImageErrors(prev => new Set(prev).add(storeId));
  };

  const handleAddSubmit = e => {
    e.preventDefault();
    if (newStoreName.trim()) {
      onAddStore({
        name: newStoreName.trim(),
        address: newStoreAddress.trim(),
      });
      setNewStoreName('');
      setNewStoreAddress('');
      setIsModalOpen(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleModalKeyDown = e => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getGroupedStores = () => {
    let storesToDisplay = showOnlyFavorites
      ? stores.filter(store => safeFavoriteStores.has(store.id))
      : stores;

    const groups = {
      Favoritos: [],
      'Muito Perto (até 1 km)': [],
      'Bem Perto (1 a 2 km)': [],
      'Perto (2 a 5 km)': [],
      'Um pouco longe (mais de 5 km)': [],
    };

    storesToDisplay.forEach(store => {
      const isFavoriteOrCustom =
        safeFavoriteStores.has(store.id) || store.isCustom;

      if (isFavoriteOrCustom) {
        // Se o toggle 'só favoritos' estiver ativo, só mostramos os favoritados com estrela
        if (showOnlyFavorites && !safeFavoriteStores.has(store.id)) {
          return;
        }
        groups['Favoritos'].push(store);
      } else if (typeof store.distance === 'number') {
        if (store.distance <= 1) {
          groups['Muito Perto (até 1 km)'].push(store);
        } else if (store.distance <= 2) {
          groups['Bem Perto (1 a 2 km)'].push(store);
        } else if (store.distance <= 5) {
          groups['Perto (2 a 5 km)'].push(store);
        } else {
          groups['Um pouco longe (mais de 5 km)'].push(store);
        }
      }
    });

    // Ordena os grupos internos
    for (const group in groups) {
      groups[group].sort((a, b) => {
        if (typeof a.distance === 'number' && typeof b.distance === 'number') {
          return a.distance - b.distance;
        }
        return a.name.localeCompare(b.name); // Fallback para nome
      });
    }

    return groups;
  };

  const groupedStores = getGroupedStores();

  // Adiciona o botão "Adicionar" como o primeiro item do primeiro grupo de distância
  if (!showOnlyFavorites && !hideAddStoreCard) {
    const addStorePlaceholder = { id: 'add-store', isAddButton: true };
    const firstGroupName = 'Muito Perto (até 1 km)';
    if (groupedStores[firstGroupName]) {
      groupedStores[firstGroupName].unshift(addStorePlaceholder);
    } else {
      groupedStores[firstGroupName] = [addStorePlaceholder];
    }
  }

  const getLogoUrl = store => {
    // 1. Se já tem logoUrl salva, usa ela
    if (store.logoUrl) {
      return store.logoUrl;
    }
    // 2. Para grandes redes, tenta Clearbit
    if (store.website) {
      const domain = new URL(store.website).hostname.replace('www.', '');
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      return clearbitUrl;
    }
    // 3. Fallback: ícone padrão
    return null;
  };

  return (
    <div className='store-selector-container'>
      <div className='store-grid'>
        {Object.entries(groupedStores).map(
          ([groupName, storesInGroup]) =>
            storesInGroup.length > 0 && (
              <React.Fragment key={groupName}>
                <h3 className='store-group-title'>{groupName}</h3>
                {storesInGroup.map(store => {
                  if (store.isAddButton) {
                    return (
                      <button
                        key='add-store-button'
                        className='add-store-card-glass'
                        onClick={() => setIsModalOpen(true)}
                      >
                        <span className='add-icon'>+</span>
                        <span className='add-text'>Adicionar Loja</span>
                      </button>
                    );
                  }
                  const logoUrl = getLogoUrl(store);
                  return (
                    <div
                      key={store.id}
                      className='store-card-glass'
                      onClick={() => !isEditMode && onSelectStore(store.name)}
                      onKeyDown={e =>
                        handleKeyDown(e, () => onSelectStore(store.name))
                      }
                      role='button'
                      tabIndex={0}
                      aria-label={`Selecionar ${store.name}`}
                    >
                      <span className='store-logo-container'>
                        {logoUrl && !imageErrors.has(store.id) ? (
                          <img
                            src={logoUrl}
                            alt={store.name}
                            className='store-logo-img'
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.parentNode.querySelector(
                                '.store-initials'
                              ).style.display = 'flex';
                              handleImageError(store.id);
                            }}
                          />
                        ) : null}
                        <div
                          className='store-initials'
                          style={{
                            backgroundColor: generateColor(store.name),
                            display:
                              !logoUrl || imageErrors.has(store.id)
                                ? 'flex'
                                : 'none',
                          }}
                        >
                          {generateInitials(store.name)}
                        </div>
                      </span>
                      <span className='store-name'>{store.name}</span>
                      {store.address &&
                        store.address !== 'Endereço não disponível' && (
                          <span className='store-address'>{store.address}</span>
                        )}
                      {typeof store.distance === 'number' && (
                        <span className='store-distance'>
                          {store.distance.toFixed(1)} km
                        </span>
                      )}

                      {store.coords && (
                        <a
                          href={`https://maps.google.com/?q=${store.coords.lat},${store.coords.lon}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='map-link-btn'
                          aria-label={`Navegar para ${store.name}`}
                          onClick={e => e.stopPropagation()}
                        >
                          {mapPin}
                        </a>
                      )}

                      {isEditMode && store.isCustom ? (
                        <button
                          className='delete-store-btn'
                          onClick={() => onDeleteStore(store.id)}
                          aria-label={`Excluir ${store.name}`}
                        >
                          &times;
                        </button>
                      ) : (
                        <button
                          className={`favorite-star-btn ${
                            safeFavoriteStores.has(store.id) ? 'favorited' : ''
                          }`}
                          onClick={e => {
                            e.stopPropagation();
                            onToggleFavorite(store.id);
                          }}
                          aria-label={
                            safeFavoriteStores.has(store.id)
                              ? `Remover ${store.name} dos favoritos`
                              : `Adicionar ${store.name} aos favoritos`
                          }
                        >
                          ★
                        </button>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            )
        )}
      </div>

      {isModalOpen && (
        <div
          className='modal-overlay'
          onClick={handleOverlayClick}
          onKeyDown={handleModalKeyDown}
          role='button'
          tabIndex={0}
        >
          <div className='modal-content'>
            <form onSubmit={handleAddSubmit}>
              <h3>Adicionar Novo Mercado</h3>
              <input
                type='text'
                value={newStoreName}
                onChange={e => setNewStoreName(e.target.value)}
                placeholder='Nome do estabelecimento'
                required
              />
              <input
                type='text'
                value={newStoreAddress}
                onChange={e => setNewStoreAddress(e.target.value)}
                placeholder='Endereço (opcional)'
              />
              <div className='modal-buttons'>
                <button type='submit'>Adicionar</button>
                <button type='button' onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSelector;
