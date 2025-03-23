import React from 'react';
import './Key.css';

const Key = ({ label, icon, onClick, wide, extraWide, dark, activatable, active, isDarkMode, onMouseDown, onMouseUp, onMouseLeave }) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className={`key 
        ${wide ? 'wide' : ''} 
        ${extraWide ? 'extraWide' : ''} 
        ${dark ? 'dark' : ''} 
        ${activatable ? 'activatable' : ''} 
        ${active && activatable ? 'active' : ''}`}
      style={{
        background: dark
          ? 'rgba(0, 0, 0, 0.25)'
          : isDarkMode
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.1)',
        color: isDarkMode ? '#ffffff' : '#000000',
      }}
    >
      {icon ? icon : <span>{label}</span>}
    </button>
  );
};

export default Key;