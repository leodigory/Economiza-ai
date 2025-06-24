import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import {
  promoteToStoreManager,
  removeStoreManager,
  getStoreManagers,
  userRoles
} from '../config/firestore';

const UserManagement = ({ currentStore, currentUser }) => {
  const [managers, setManagers] = useState([]);
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentStore?.id) {
      loadStoreManagers();
    }
  }, [currentStore]);

  const loadStoreManagers = async () => {
    try {
      const storeManagers = await getStoreManagers(currentStore.id);
      setManagers(storeManagers);
    } catch (error) {
      console.error('Erro ao carregar gerentes:', error);
      setMessage('Erro ao carregar gerentes da loja');
    }
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    if (!newManagerEmail.trim()) {
      setMessage('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const success = await promoteToStoreManager(newManagerEmail, currentStore.id);
      if (success) {
        setMessage('Gerente adicionado com sucesso!');
        setNewManagerEmail('');
        loadStoreManagers(); // Recarregar lista
      } else {
        setMessage('Erro ao adicionar gerente. Verifique se o email existe.');
      }
    } catch (error) {
      console.error('Erro ao adicionar gerente:', error);
      setMessage('Erro ao adicionar gerente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveManager = async (managerId, userId) => {
    if (!window.confirm('Tem certeza que deseja remover este gerente?')) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const success = await removeStoreManager(currentStore.id, userId);
      if (success) {
        setMessage('Gerente removido com sucesso!');
        loadStoreManagers(); // Recarregar lista
      } else {
        setMessage('Erro ao remover gerente');
      }
    } catch (error) {
      console.error('Erro ao remover gerente:', error);
      setMessage('Erro ao remover gerente');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se o usuário atual é admin
  const isAdmin = currentUser?.role === userRoles.ADMIN_SYSTEM;

  if (!isAdmin) {
    return (
      <div className="user-management">
        <div className="access-denied">
          <h3>🔒 Acesso Negado</h3>
          <p>Apenas administradores do sistema podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h3>👥 Gerenciamento de Usuários</h3>
        <p>Loja: {currentStore?.name || 'N/A'}</p>
      </div>

      {/* Formulário para adicionar gerente */}
      <div className="add-manager-section">
        <h4>➕ Adicionar Gerente de Loja</h4>
        <form onSubmit={handleAddManager} className="add-manager-form">
          <div className="form-group">
            <label htmlFor="managerEmail">Email do Usuário:</label>
            <input
              type="email"
              id="managerEmail"
              value={newManagerEmail}
              onChange={(e) => setNewManagerEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="add-manager-btn"
            disabled={isLoading || !newManagerEmail.trim()}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Gerente'}
          </button>
        </form>
      </div>

      {/* Lista de gerentes atuais */}
      <div className="managers-list-section">
        <h4>👨‍💼 Gerentes Atuais</h4>
        {managers.length === 0 ? (
          <p className="no-managers">Nenhum gerente atribuído a esta loja.</p>
        ) : (
          <div className="managers-list">
            {managers.map((manager) => (
              <div key={manager.id} className="manager-item">
                <div className="manager-info">
                  <span className="manager-name">{manager.userName}</span>
                  <span className="manager-email">{manager.userEmail}</span>
                  <span className="manager-date">
                    Adicionado em: {manager.assignedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </span>
                </div>
                <button
                  className="remove-manager-btn"
                  onClick={() => handleRemoveManager(manager.id, manager.userId)}
                  disabled={isLoading}
                >
                  ❌ Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensagens de feedback */}
      {message && (
        <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
