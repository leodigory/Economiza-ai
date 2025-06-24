import React, { useState, useEffect } from 'react';
import './UserManagementModal.css';
import {
  getUserByEmail,
  createOrUpdateUser,
  userRoles,
  db
} from '../config/firestore';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const UserManagementModal = ({ isOpen, onClose, currentUser }) => {
  const [admins, setAdmins] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(userRoles.STORE_MANAGER);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Carregar usuários existentes
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Buscar todos os usuários
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);

      const adminUsers = [];
      const managerUsers = [];

      querySnapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() };
        if (user.role === userRoles.ADMIN_SYSTEM) {
          adminUsers.push(user);
        } else if (user.role === userRoles.STORE_MANAGER) {
          managerUsers.push(user);
        }
      });

      setAdmins(adminUsers);
      setManagers(managerUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setMessage('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newEmail.trim()) {
      setMessage('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Verificar se o usuário já existe
      let user = await getUserByEmail(newEmail);

      if (!user) {
        // Criar novo usuário
        const newUser = {
          uid: `temp_${Date.now()}`, // Será atualizado quando o usuário fizer login
          email: newEmail,
          displayName: newEmail.split('@')[0],
          role: selectedRole,
          managedStoreId: selectedRole === userRoles.STORE_MANAGER ? null : null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await createOrUpdateUser(newUser);
        user = newUser;
      } else {
        // Atualizar usuário existente
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          role: selectedRole,
          managedStoreId: selectedRole === userRoles.STORE_MANAGER ? null : null,
          updatedAt: new Date()
        });
      }

      // Atualizar listas
      await loadUsers();
      setNewEmail('');
      setMessage(`Usuário ${newEmail} ${selectedRole === userRoles.ADMIN_SYSTEM ? 'promovido a Admin' : 'promovido a Gerente'} com sucesso!`);

    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      setMessage('Erro ao adicionar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId, userEmail, currentRole) => {
    if (userEmail === currentUser?.email) {
      setMessage('Você não pode remover suas próprias permissões');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: userRoles.USER,
        managedStoreId: null,
        updatedAt: new Date()
      });

      // Remover da lista de gerentes se for gerente
      if (currentRole === userRoles.STORE_MANAGER) {
        const storeManagersRef = collection(db, 'store_managers');
        const q = query(storeManagersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }

      // Atualizar listas
      await loadUsers();
      setMessage(`Usuário ${userEmail} rebaixado para Usuário com sucesso!`);

    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      setMessage('Erro ao remover usuário');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtragem dos usuários
  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredManagers = managers.filter(manager =>
    manager.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="user-management-modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      aria-label="Fechar modal"
      tabIndex={0}
      style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, padding: '1rem' }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="user-management-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">👥 Gerenciamento de Usuários</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Seção de adicionar usuário */}
          <div className="section-card add-user-section">
            <div className="section-title">➕ Adicionar Usuário</div>
            <div className="add-user-form">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Digite o email do usuário"
                className="email-input"
              />
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    value={userRoles.STORE_MANAGER}
                    checked={selectedRole === userRoles.STORE_MANAGER}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <span>Gerente de Loja</span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    value={userRoles.ADMIN_SYSTEM}
                    checked={selectedRole === userRoles.ADMIN_SYSTEM}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <span>Admin Sistema</span>
                </label>
              </div>
              <button
                className="add-btn"
                onClick={handleAddUser}
                disabled={isLoading || !newEmail.trim()}
              >
                {isLoading ? 'Adicionando...' : '➕ Incluir'}
              </button>
            </div>
          </div>

          {/* Input de pesquisa */}
          <div className="section-card" style={{marginBottom: '0.5rem', padding: '1rem 1rem 0.7rem 1rem'}}>
            <input
              type="text"
              className="email-input"
              placeholder="Pesquisar email de admin ou gerente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{width: '100%'}}
            />
          </div>

          {/* Listas de usuários */}
          <div className="users-lists">
            {/* Coluna de Admins */}
            <div className="users-column">
              <div className="section-title">👑 Admins do Sistema</div>
              <div className="users-list">
                {filteredAdmins.map((admin) => (
                  <div key={admin.id} className="user-item">
                    <span className="user-email">{admin.email}</span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveUser(admin.id, admin.email, userRoles.ADMIN_SYSTEM)}
                      disabled={isLoading}
                      title="Remover acesso"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {filteredAdmins.length === 0 && (
                  <p className="empty-list">
                    {search.trim()
                      ? 'Nenhum admin registrado com esse email'
                      : 'Nenhum admin cadastrado'}
                  </p>
                )}
              </div>
            </div>

            {/* Coluna de Gerentes */}
            <div className="users-column">
              <div className="section-title">🏪 Gerentes de Loja</div>
              <div className="users-list">
                {filteredManagers.map((manager) => (
                  <div key={manager.id} className="user-item">
                    <span className="user-email">{manager.email}</span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveUser(manager.id, manager.email, userRoles.STORE_MANAGER)}
                      disabled={isLoading}
                      title="Remover acesso"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {filteredManagers.length === 0 && (
                  <p className="empty-list">
                    {search.trim()
                      ? 'Nenhum gerente cadastrado com esse email'
                      : 'Nenhum gerente cadastrado'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default UserManagementModal;
