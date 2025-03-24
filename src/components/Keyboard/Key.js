import React from 'react';
import './Key.css';

const Key = ({ 
  label, 
  icon, 
  onClick, 
  wide, 
  extraWide, 
  dark, 
  activatable, 
  active, 
  isDarkMode, 
  onMouseDown, 
  onMouseUp, 
  onMouseLeave, 
  isActive 
}) => {
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
        ${active && activatable ? 'active' : ''} 
        ${isActive ? 'key-active' : ''}`}
      style={{
        background: dark
          ? 'rgba(0, 0, 0, 0.3)'
          : isDarkMode
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.05)',
        color: isDarkMode ? '#ffffff' : '#000000',
        borderRadius: '6px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {icon ? icon : <span>{label}</span>}
    </button>
  );
};

export default Key;