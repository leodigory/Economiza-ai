import React, { useState } from 'react';
import Key from './Key';
import '../css/Keyboard.css';

const Keyboard = () => {
  const [input, setInput] = useState('');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isSymbolsMode, setIsSymbolsMode] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleKeyClick = (key) => {
    if (key === 'Enter') {
      setInput(input + '\n');
      setIsShiftActive(false);
    } else if (key === 'Backspace') {
      setInput(input.slice(0, -1));
      setIsShiftActive(false);
    } else if (key === 'Space') {
      setInput(input + ' ');
      setIsShiftActive(false);
    } else if (key === 'Shift') {
      setIsShiftActive(!isShiftActive);
    } else if (key === '?123' || key === 'ABC') {
      setIsSymbolsMode(!isSymbolsMode);
      setIsShiftActive(false);
    } else if (key === 'Theme') {
      setIsDarkTheme(!isDarkTheme);
    } else {
      const charToAdd = isShiftActive ? key.toUpperCase() : key.toLowerCase();
      setInput(input + charToAdd);
      setIsShiftActive(false);
    }
  };

  const letterRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Backspace'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '!', '?', 'Shift'],
    ['?123', 'US', 'Space', ',', '.', 'Theme'],
  ];

  const symbolRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '#', '$', '%', '^', '&', '*', '(', ')', 'Backspace'],
    ['-', '+', '=', '/', ';', ':', '"', '\'', 'Enter'],
    ['Shift', '[', ']', '{', '}', '|', '<', '>', '!', '?', 'Shift'],
    ['ABC', 'US', 'Space', ',', '.', 'Theme'],
  ];

  const currentRows = isSymbolsMode ? symbolRows : letterRows;

  return (
    <div className={`keyboard-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="keyboard-input"
        placeholder="Digite aqui..."
      />
      <div className="keyboard">
        {currentRows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, keyIndex) => (
              <Key
                key={keyIndex}
                label={key}
                onClick={handleKeyClick}
                isSpecial={
                  key === 'Backspace' ||
                  key === 'Enter' ||
                  key === 'Shift' ||
                  key === 'Space' ||
                  key === '?123' ||
                  key === 'ABC' ||
                  key === 'US' ||
                  key === ',' ||
                  key === '.' ||
                  key === 'Theme'
                }
                isShiftActive={key === 'Shift' && isShiftActive}
                isDarkTheme={isDarkTheme}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;