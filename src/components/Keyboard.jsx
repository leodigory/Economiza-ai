import React, { useState, useEffect } from 'react';
import Key from './Key';

const Keyboard = ({ 
  setValue, 
  isVisible, 
  playClickSound, 
  startBackspace, 
  stopBackspace, 
  handleDone, 
  value, 
  getSuggestions, 
  handleSuggestionClick 
}) => {
  const [capsLock, setCapsLock] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNumeric, setIsNumeric] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleNumeric = () => setIsNumeric(prev => !prev);

  const handleKeyClick = (key) => {
    playClickSound();
    if (key === 'backspace') {
      setValue(prev => prev.slice(0, -1));
    } else if (key === 'caps') {
      setCapsLock(prev => !prev);
    } else if (key === 'space') {
      setValue(prev => prev + ' ');
    } else if (key === 'enter') {
      setValue(prev => prev + '\n');
    } else if (key === 'theme') {
      toggleTheme();
    } else if (key === '?123' || key === 'abc') {
      toggleNumeric();
    } else if (key === 'done') {
      handleDone();
    } else {
      setValue(prev => prev + (capsLock ? key.toUpperCase() : key.toLowerCase()));
    }
  };

  const alphaLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
    ['done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'],
    ['?123', 'space', 'theme'],
  ];

  const numericLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', "'", 'backspace'],
    ['abc', 'space', 'enter'],
  ];

  const keyLayout = isNumeric ? numericLayout : alphaLayout;
  const suggestions = getSuggestions();

  return (
    <div
      className="keyboard"
      style={{
        position: 'fixed',
        left: 0,
        bottom: isVisible ? 0 : '-100%',
        width: '100%',
        padding: isMobile ? '5px 0' : '10px 0',
        background: isDarkMode ? '#121212' : '#f1f3f4',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        userSelect: 'none',
        transition: 'bottom 0.4s, background 0.4s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {suggestions.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            background: isDarkMode ? '#1e1e1e' : '#e0e0e0',
            padding: '5px 10px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            borderBottom: `1px solid ${isDarkMode ? '#333' : '#ccc'}`,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              style={{
                padding: '5px 15px',
                borderRadius: '15px',
                background: isDarkMode ? '#333' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {keyLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '5px',
            width: '100%',
          }}
        >
          {row.map((key, keyIndex) => {
            const isBackspace = key === 'backspace';
            return (
              <Key
                key={keyIndex}
                label={key}
                icon={iconMap[key]}
                onClick={() => handleKeyClick(key)}
                onMouseDown={isBackspace ? startBackspace : undefined}
                onMouseUp={isBackspace ? stopBackspace : undefined}
                onMouseLeave={isBackspace ? stopBackspace : undefined}
                wide={key === 'backspace' || key === 'caps' || key === 'enter' || key === 'done' || key === '?123' || key === 'abc'}
                extraWide={key === 'space'}
                dark={key === 'done'}
                activatable={key === 'caps'}
                active={capsLock}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const iconMap = {
  backspace: <span className="material-icons">backspace</span>,
  caps: <span className="material-icons">keyboard_capslock</span>,
  enter: <span className="material-icons">keyboard_return</span>,
  space: <span className="material-icons">space_bar</span>,
  done: <span className="material-icons">check_circle</span>,
  theme: (isDarkMode) => isDarkMode ? (
    <span className="material-icons">wb_sunny</span>
  ) : (
    <span className="material-icons">brightness_3</span>
  ),
};

export default Keyboard;