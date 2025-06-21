import React, { useCallback } from 'react';
import './Suggestions.css';

const Suggestions = ({ suggestions, onSuggestionClick, isVisible }) => {
  const handleSuggestionClick = useCallback((suggestion) => {
    onSuggestionClick(suggestion);
  }, [onSuggestionClick]);

  if (!isVisible || !suggestions || suggestions.length === 0) {
    return null;
  }

  const getSuggestionClass = (suggestion) => {
    const classes = ['suggestion-item'];
    
    if (suggestion.frequent) {
      classes.push('frequent');
    }
    
    if (suggestion.exact) {
      classes.push('exact');
    }
    
    return classes.join(' ');
  };

  const getSuggestionBadge = (suggestion) => {
    if (suggestion.frequent) {
      return <span className="suggestion-badge frequent">Frequente</span>;
    }
    if (suggestion.exact) {
      return <span className="suggestion-badge exact">Exata</span>;
    }
    return null;
  };

  return (
    <div className="suggestions-container">
      <ul className="suggestions-list">
        {suggestions.slice(0, 8).map((suggestion, index) => (
          <li key={`${suggestion.text}-${index}`}>
            <button
              className={getSuggestionClass(suggestion)}
              onClick={() => handleSuggestionClick(suggestion.text)}
              aria-label={`Sugestão: ${suggestion.text}`}
              title={suggestion.text}
            >
              {suggestion.text}
              {getSuggestionBadge(suggestion)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;