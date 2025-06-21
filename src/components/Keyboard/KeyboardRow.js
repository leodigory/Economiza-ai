import React from 'react';

const KeyboardRow = ({ row, handleKeyClick, startBackspace, stopBackspace, capsLock, activeKey, isDarkMode, iconMap }) => {
  const getKeyClass = (key) => {
    const classes = ['key'];
    
    if (activeKey === key) {
      classes.push('active');
    }
    
    // Classes especiais baseadas no tipo de tecla
    if (['backspace', 'caps', 'enter', '?123', 'abc'].includes(key)) {
      classes.push('function');
    } else if (['space'].includes(key)) {
      classes.push('space');
    } else if (['done'].includes(key)) {
      classes.push('done');
    } else if (['theme'].includes(key)) {
      classes.push('theme');
    } else if (key.length === 1 && /[A-Za-z]/.test(key)) {
      classes.push('letter');
    } else if (key.length === 1 && /[0-9]/.test(key)) {
      classes.push('number');
    } else if (key.length === 1 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(key)) {
      classes.push('symbol');
    }
    
    return classes.join(' ');
  };

  const getKeyContent = (key) => {
    if (iconMap[key]) {
      return typeof iconMap[key] === 'function' ? iconMap[key](isDarkMode) : iconMap[key];
    }
    
    // Para teclas de letras, aplicar caps lock
    if (key.length === 1 && /[a-z]/.test(key)) {
      return capsLock ? key.toUpperCase() : key;
    }
    
    return key;
  };

  const handleKeyDown = (e, key) => {
    e.preventDefault();
    handleKeyClick(key);
    
    // Feedback tátil para mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleMouseDown = (e, key) => {
    if (key === 'backspace') {
      startBackspace();
    }
  };

  const handleMouseUp = (e, key) => {
    if (key === 'backspace') {
      stopBackspace();
    }
  };

  return (
    <div className="keyboard-row">
      {row.map((key, index) => (
        <button
          key={`${key}-${index}`}
          className={getKeyClass(key)}
          onClick={(e) => handleKeyDown(e, key)}
          onMouseDown={(e) => handleMouseDown(e, key)}
          onMouseUp={(e) => handleMouseUp(e, key)}
          onTouchStart={(e) => handleMouseDown(e, key)}
          onTouchEnd={(e) => handleMouseUp(e, key)}
          aria-label={key === 'space' ? 'Espaço' : key === 'backspace' ? 'Apagar' : key === 'enter' ? 'Enter' : key === 'caps' ? 'Caps Lock' : key === 'theme' ? 'Alternar tema' : key === 'done' ? 'Concluir' : key}
          title={key === 'space' ? 'Espaço' : key === 'backspace' ? 'Apagar' : key === 'enter' ? 'Enter' : key === 'caps' ? 'Caps Lock' : key === 'theme' ? 'Alternar tema' : key === 'done' ? 'Concluir' : key}
        >
          {getKeyContent(key)}
        </button>
      ))}
    </div>
  );
};

export default KeyboardRow;