import React, { useEffect, useState, useRef } from 'react';
import './AccountView.css';
import ToggleSwitch from './common/ToggleSwitch';
import { useLocation } from '../hooks/useLocation';
import { useDebounce } from '../hooks/useDebounce';
import useClickOutside from '../hooks/useClickOutside';
import { getUserByEmail } from '../config/firestore';
import { generateInitials, generateColor } from '../utils/userAvatar';

const AccountView = ({
  user,
  onLogin,
  onLogout,
  isDarkMode,
  onToggleTheme,
  savedLocation,
  onSaveLocation,
  userPermissions,
  userRoles,
  userData,
  onUserDataUpdate,
  onOpenUserManagement,
}) => {
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coords, setCoords] = useState(null);
  const debouncedStreet = useDebounce(street, 500);
  const suggestionsRef = useRef(null);
  const {
    states,
    cities,
    loadingStates,
    loadingCities,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    getUserLocation,
  } = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareUser, setShareUser] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');
  const [sharedEmails, setSharedEmails] = useState([]);

  // Efeito para preencher com a localização salva quando ela carregar
  useEffect(() => {
    if (savedLocation) {
      setSelectedState(savedLocation.state);
      // O useEffect do hook vai buscar as cidades, então damos um tempo
      // para ele carregar e então setamos a cidade.
      setTimeout(() => {
        setSelectedCity(savedLocation.city);
      }, 500);
      if (savedLocation.street) {
        setStreet(savedLocation.street);
      }
      if (savedLocation.latitude && savedLocation.longitude) {
        setCoords({
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
        });
      }
    }
  }, [savedLocation, setSelectedState, setSelectedCity]);

  useClickOutside(suggestionsRef, () => setShowSuggestions(false));

  const handleUseCurrentLocation = () => {
    getUserLocation(newCoords => {
      setCoords(newCoords);
      alert(
        'Coordenadas capturadas! Clique em "Salvar Localização" para confirmar.'
      );
    });
  };

  const handleSave = async () => {
    if (!selectedState || !selectedCity) {
      alert('Por favor, selecione um estado e uma cidade.');
      return;
    }

    // Se temos coordenadas (do botão "Usar Localização"), salvamos diretamente.
    if (coords) {
      onSaveLocation({
        state: selectedState,
        city: selectedCity,
        street: street,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      alert('Localização salva com sucesso!');
      return;
    }

    // Plano B: Se não temos coordenadas, tentamos geocodificar o endereço.
    try {
      const query = `street=${encodeURIComponent(
        street || ''
      )}&city=${encodeURIComponent(selectedCity)}&state=${encodeURIComponent(
        selectedState
      )}&country=Brazil&format=json&limit=1`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${query}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        // Passo 2: Chamar a função de salvar com o objeto de localização completo
        onSaveLocation({
          state: selectedState,
          city: selectedCity,
          street: street,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } else {
        // Se não encontrar coordenadas, salva mesmo assim, mas avisa o usuário.
        // A busca automática ainda pode funcionar com geolocalização do navegador.
        alert(
          'Não foi possível encontrar as coordenadas exatas para este endereço, mas a localização foi salva.'
        );
        onSaveLocation({
          state: selectedState,
          city: selectedCity,
          street: street,
        });
      }
    } catch (error) {
      console.error('Erro ao geocodificar endereço para salvar:', error);
      alert('Ocorreu um erro ao obter as coordenadas. Tente novamente.');
    }
  };

  const handleCepSearch = async () => {
    if (cep.replace(/\D/g, '').length !== 8) return; // Verifica se tem 8 dígitos

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      setSelectedState(data.uf);
      setStreet(data.logradouro);

      // A API do IBGE é mais rápida, mas esperamos o estado ser setado
      // para então selecionar a cidade correta.
      setTimeout(() => {
        setSelectedCity(data.localidade);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Não foi possível buscar o CEP.');
    }
  };

  // Efeito para buscar sugestões de rua
  useEffect(() => {
    const fetchStreetSuggestions = async () => {
      if (debouncedStreet.length < 3 || !selectedCity) {
        setStreetSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const query = `street=${encodeURIComponent(
          debouncedStreet
        )}&city=${encodeURIComponent(selectedCity)}&state=${encodeURIComponent(
          selectedState
        )}&country=Brazil&format=json`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${query}`
        );
        const data = await response.json();

        // Filtra e formata os resultados para evitar duplicatas
        const uniqueSuggestions = data.reduce((acc, current) => {
          const streetName = current.address?.road;
          if (
            streetName &&
            !acc.find(item => item.address?.road === streetName)
          ) {
            acc.push(current);
          }
          return acc;
        }, []);

        setStreetSuggestions(uniqueSuggestions);
        setShowSuggestions(uniqueSuggestions.length > 0);
      } catch (error) {
        console.error('Erro ao buscar sugestões de rua:', error);
      }
    };

    fetchStreetSuggestions();
  }, [debouncedStreet, selectedCity, selectedState]);

  // Função para obter o nome da função do usuário
  const getUserRoleName = () => {
    if (!userPermissions || !userRoles) return 'Usuário';

    switch (userPermissions.role) {
      case userRoles.ADMIN_SYSTEM:
        return 'Admin Sistema';
      case userRoles.STORE_MANAGER:
        return 'Gerente de Loja';
      default:
        return 'Usuário';
    }
  };

  // Função para obter a cor da função
  const getRoleColor = () => {
    if (!userPermissions || !userRoles) return '#607D8B';

    switch (userPermissions.role) {
      case userRoles.ADMIN_SYSTEM:
        return '#E91E63'; // Rosa/vermelho para admin
      case userRoles.STORE_MANAGER:
        return '#4CAF50'; // Verde para gerente
      default:
        return '#607D8B'; // Cinza para usuário
    }
  };

  const handleShareEmailChange = async e => {
    const email = e.target.value;
    setShareEmail(email);
    setShareUser(null);
    setShareError('');
    if (email && email.includes('@')) {
      setShareLoading(true);
      try {
        const foundUser = await getUserByEmail(email);
        if (foundUser) {
          setShareUser(foundUser);
        } else {
          setShareUser(null);
        }
      } catch (err) {
        setShareError('Erro ao buscar usuário.');
      } finally {
        setShareLoading(false);
      }
    }
  };

  const handleShare = () => {
    if (shareUser && !sharedEmails.some(e => e.email === shareUser.email)) {
      setSharedEmails([
        ...sharedEmails,
        {
          email: shareUser.email,
          name: shareUser.displayName,
          photoURL: shareUser.photoURL,
        },
      ]);
    }
    setIsShareModalOpen(false);
    setShareEmail('');
    setShareUser(null);
  };

  const handleRemoveShared = email => {
    setSharedEmails(sharedEmails.filter(e => e.email !== email));
  };

  return (
    <div className='account-view-container'>
      {/* Seção de Perfil/Login */}
      <div className='account-section profile-section'>
        {user ? (
          <>
            <div className='profile-picture-wrapper'>
              <img
                src={user.photoURL}
                alt={user.displayName}
                className='profile-picture'
              />
              {userPermissions?.role && (
                <div
                  className='user-role-badge'
                  style={{ backgroundColor: getRoleColor() }}
                >
                  {getUserRoleName()}
                </div>
              )}
            </div>
            <h3 className='profile-name'>{user.displayName}</h3>
            <p className='profile-email'>{user.email}</p>

            {/* Botão Compartilhar Listas */}
            <button
              className='auth-btn share-btn'
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                marginBottom: 10,
              }}
              onClick={() => setIsShareModalOpen(true)}
            >
              Compartilhar Listas
            </button>

            {/* Botão de gerenciamento de usuários - só para admins */}
            {userPermissions?.role === userRoles?.ADMIN_SYSTEM && (
              <button
                className='admin-management-btn'
                onClick={onOpenUserManagement}
              >
                👥 Gerenciar Usuários
              </button>
            )}

            <button onClick={onLogout} className='auth-btn logout-btn'>
              Sair
            </button>
          </>
        ) : (
          <div className='login-prompt'>
            <h4>Faça login para salvar suas listas na nuvem!</h4>
            <button onClick={onLogin} className='auth-btn login-btn'>
              Login com Google
            </button>
          </div>
        )}
      </div>

      {/* Seção de Tema */}
      <div className='account-section theme-section'>
        <div className='setting-item'>
          <h4>Modo Escuro</h4>
          <ToggleSwitch isToggled={isDarkMode} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Seção de Localização */}
      <div className='account-section location-section'>
        <h3 className='section-title'>Minha Localização</h3>
        <div className='location-inputs' ref={suggestionsRef}>
          <input
            type='text'
            value={cep}
            onChange={e => setCep(e.target.value)}
            onBlur={handleCepSearch}
            placeholder='Digite seu CEP'
            maxLength='9'
          />
          <div className='street-input-container'>
            <input
              type='text'
              value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder='Rua / Logradouro'
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && streetSuggestions.length > 0 && (
              <ul className='suggestions-list'>
                {streetSuggestions.map(suggestion => {
                  const handleSelect = () => {
                    setStreet(suggestion.address?.road || '');
                    setShowSuggestions(false);
                  };

                  return (
                    <li key={suggestion.place_id}>
                      <button
                        onClick={handleSelect}
                        className='suggestion-item-btn'
                      >
                        {suggestion.address?.road || 'Endereço não disponível'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            disabled={loadingStates}
          >
            <option value='' disabled>
              {loadingStates ? 'Carregando...' : 'Selecione o Estado'}
            </option>
            {states.map(state => (
              <option key={state.id} value={state.sigla}>
                {state.nome}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={!selectedState || loadingCities}
          >
            <option value='' disabled>
              {loadingCities ? 'Carregando...' : 'Selecione a Cidade'}
            </option>
            {cities.map(city => (
              <option key={city.id} value={city.nome}>
                {city.nome}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleUseCurrentLocation} className='location-btn'>
          Usar Localização Atual
        </button>
        {user && (
          <button onClick={handleSave} className='save-location-btn'>
            Salvar Localização
          </button>
        )}
      </div>

      {/* Modal de Compartilhamento */}
      {isShareModalOpen && (
        <div
          className='modal-overlay'
          style={{
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className='modal-content'
            style={{
              maxWidth: 350,
              width: '100%',
              padding: 24,
              margin: 0,
              borderRadius: 20,
              background: 'var(--background-color, #2c3440)',
            }}
          >
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>
              Compartilhar Listas
            </h3>
            <input
              type='email'
              placeholder='Digite o email do usuário'
              value={shareEmail}
              onChange={handleShareEmailChange}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #ccc',
                marginBottom: 12,
                textAlign: 'center',
                fontSize: 16,
              }}
            />
            {shareLoading && (
              <p style={{ color: '#888', fontSize: 13, textAlign: 'center' }}>
                Buscando usuário...
              </p>
            )}
            {shareUser && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: generateColor(
                      shareUser.displayName || shareUser.email
                    ),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {generateInitials(shareUser.displayName || shareUser.email)}
                </div>
                <span style={{ fontWeight: 600 }}>
                  {shareUser.displayName || shareUser.email}
                </span>
              </div>
            )}
            {shareError && (
              <p style={{ color: 'red', fontSize: 13, textAlign: 'center' }}>
                {shareError}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#eee',
                  color: '#333',
                  fontWeight: 600,
                }}
              >
                Fechar
              </button>
              <button
                onClick={handleShare}
                disabled={!shareUser}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: shareUser
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#bbb',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: shareUser ? 'pointer' : 'not-allowed',
                  opacity: shareUser ? 1 : 0.7,
                }}
              >
                Compartilhar
              </button>
            </div>
            {/* Lista de emails compartilhados */}
            {sharedEmails.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: 15,
                    color: '#764ba2',
                    textAlign: 'center',
                  }}
                >
                  Compartilhado com:
                </h4>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {sharedEmails.map(e => (
                    <div
                      key={e.email}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: 8,
                        padding: '6px 10px',
                        gap: 10,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: generateColor(e.name || e.email),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {generateInitials(e.name || e.email)}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>
                          {e.name || e.email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveShared(e.email)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: 'pointer',
                          marginLeft: 8,
                        }}
                        aria-label={`Remover ${e.email}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountView;
