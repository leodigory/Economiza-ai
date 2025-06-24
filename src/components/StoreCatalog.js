import React, { useState, useEffect } from 'react';
import './StoreCatalog.css';
import { checkUserPermissions, userRoles, db } from '../config/firestore';
import { updateDoc, doc } from 'firebase/firestore';
import { generateColor } from '../utils/userAvatar';

const StoreCatalog = ({ store, currentUser, onBack }) => {
  const [permissions, setPermissions] = useState({ canEdit: false });
  const [isEditing, setIsEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState(store?.logoUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPermissions = async () => {
      if (currentUser?.uid) {
        const userPermissions = await checkUserPermissions(
          currentUser.uid,
          store?.id
        );
        setPermissions(userPermissions);
      }
    };
    checkPermissions();
  }, [currentUser, store]);

  const handleSaveLogo = async () => {
    if (!logoUrl.trim()) {
      setMessage('Por favor, insira uma URL válida');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Validar se a URL é uma imagem
      const img = new Image();
      img.onload = async () => {
        try {
          await updateDoc(doc(db, 'stores', store.id), {
            logoUrl: logoUrl.trim(),
            updatedAt: new Date(),
            updatedBy: currentUser.uid,
          });

          setMessage('Logo atualizada com sucesso!');
          setIsEditing(false);
          // Atualizar o store local
          store.logoUrl = logoUrl.trim();
        } catch (error) {
          console.error('Erro ao salvar logo:', error);
          setMessage('Erro ao salvar logo');
        } finally {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        setMessage('URL inválida. Certifique-se de que é uma imagem válida.');
        setIsLoading(false);
      };

      img.src = logoUrl.trim();
    } catch (error) {
      console.error('Erro ao validar URL:', error);
      setMessage('Erro ao validar URL');
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setLogoUrl(store?.logoUrl || '');
    setIsEditing(false);
    setMessage('');
  };

  const isManager =
    permissions.role === userRoles.STORE_MANAGER && permissions.canEdit;
  const isAdmin = permissions.role === userRoles.ADMIN_SYSTEM;

  return (
    <div className='store-catalog'>
      <div className='store-catalog-header'>
        <button className='back-btn' onClick={onBack}>
          ← Voltar ao Catálogo
        </button>
        <h2>🏪 {store?.name}</h2>
        {(isManager || isAdmin) && (
          <button
            className='edit-mode-btn'
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '❌ Cancelar' : '✏️ Editar Loja'}
          </button>
        )}
      </div>

      <div className='store-info-section'>
        <div className='store-logo-section'>
          <h3>🖼️ Logo da Loja</h3>
          <div className='store-logo-display'>
            {store?.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className='store-logo-large'
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className='store-logo-placeholder'
              style={{ display: store?.logoUrl ? 'none' : 'flex' }}
            >
              <span style={{ backgroundColor: generateColor(store?.name) }}>
                {getInitials(store?.name)}
              </span>
            </div>
          </div>

          {(isManager || isAdmin) && (
            <div className='logo-edit-section'>
              {isEditing ? (
                <div className='logo-edit-form'>
                  <input
                    type='url'
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder='https://exemplo.com/logo.png'
                    className='logo-url-input'
                  />
                  <div className='logo-edit-buttons'>
                    <button
                      className='save-logo-btn'
                      onClick={handleSaveLogo}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Salvando...' : '💾 Salvar Logo'}
                    </button>
                    <button
                      className='cancel-logo-btn'
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className='edit-logo-btn'
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Editar Logo
                </button>
              )}
            </div>
          )}
        </div>

        <div className='store-details-section'>
          <h3>📋 Informações da Loja</h3>
          <div className='store-details'>
            <div className='detail-item'>
              <strong>Nome:</strong> {store?.name}
            </div>
            <div className='detail-item'>
              <strong>Endereço:</strong> {store?.address || 'Não informado'}
            </div>
            <div className='detail-item'>
              <strong>Distância:</strong>{' '}
              {store?.distance
                ? `${store.distance.toFixed(1)} km`
                : 'Não calculada'}
            </div>
            <div className='detail-item'>
              <strong>Tipo:</strong>{' '}
              {store?.isCustom ? 'Adicionada manualmente' : 'Da API'}
            </div>
          </div>
        </div>

        {/* Seção futura para produtos */}
        <div className='products-section'>
          <h3>🛒 Produtos (Em breve)</h3>
          <p>Funcionalidade de produtos será implementada em breve.</p>
        </div>
      </div>

      {/* Mensagens de feedback */}
      {message && (
        <div
          className={`message ${
            message.includes('sucesso') ? 'success' : 'error'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

// Funções auxiliares
const getInitials = text => {
  if (!text) return '?';
  const words = text.split(' ').filter(word => word.length > 0);
  let initials = '';

  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = words
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  return initials.substring(0, 3);
};

export default StoreCatalog;
