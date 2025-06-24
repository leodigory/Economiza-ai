import React from 'react';
import './BottomNav.css';

const BottomNav = ({ currentView, onViewChange }) => {
  return (
    <footer className="bottom-nav">
      <button className={`nav-btn ${currentView === 'home' ? 'active' : ''}`} onClick={() => onViewChange('home')}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>
      <button
        className={`nav-btn ${currentView === 'catalog' ? 'active' : ''}`}
        onClick={() => onViewChange('catalog')}
      >
        <span className="nav-icon">🛒</span>
        <span className="nav-label">Catálogo</span>
      </button>
      <button className={`nav-btn ${currentView === 'history' ? 'active' : ''}`} onClick={() => onViewChange('history')}>
        <span className="nav-icon">🕒</span>
        <span className="nav-label">Histórico</span>
      </button>
      <button className={`nav-btn ${currentView === 'account' ? 'active' : ''}`} onClick={() => onViewChange('account')}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Conta</span>
      </button>
    </footer>
  );
};

export default BottomNav;
