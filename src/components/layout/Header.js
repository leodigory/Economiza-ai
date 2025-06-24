import React from 'react';
import './Header.css';

const Header = ({ title, showBackButton, onBackClick }) => {
  return (
    <header className="app-header">
      {showBackButton && (
        <button onClick={onBackClick} className="back-button" aria-label="Voltar">
          {'<'}
        </button>
      )}
      <h1 className="header-title">{title}</h1>
      {/* Espaçador para manter o título centralizado quando o botão de voltar está presente */}
      {showBackButton && <div className="header-spacer"></div>}
    </header>
  );
};

export default Header;
