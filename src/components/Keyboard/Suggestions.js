import React from 'react';
import './Suggestions.css';


const Suggestions = ({ suggestions, handleSuggestionClick, isDarkMode }) => {
  console.log('Sugestões recebidas no componente 2:', suggestions);

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      background: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(224, 224, 224, 0.9)',
      padding: '8px 10px',
      display: suggestions.length > 0 ? 'flex' : 'none', // Exibe apenas se houver sugestões
      justifyContent: 'center',
      gap: '12px',
      borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: isDarkMode ? '#e0e0e0' : '#333',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            transition: 'background 0.3s ease, transform 0.2s ease',
          }}
          onClick={() => handleSuggestionClick(suggestion)}
          onMouseEnter={(e) => e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default Suggestions;