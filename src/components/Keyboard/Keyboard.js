import React, { useRef, useState } from 'react';
import Suggestions from './Suggestions';
import KeyboardRow from './KeyboardRow';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useSuggestions } from '../../hooks/useSuggestions';
import useKeyboardLayout from '../../hooks/useKeyboardLayout';
import useTheme from '../../hooks/useTheme';
import useClickOutside from '../../hooks/useClickOutside';
import useMobileDetection from '../../hooks/useMobileDetection';
import useCapsLockDetection from '../../hooks/useCapsLockDetection';
import { iconMap } from './icons';
import './Key.css';

const Keyboard = ({
  setValue,
  isVisible,
  setKeyboardVisible,
  startBackspace,
  stopBackspace,
  handleDone,
  value,
  wordList,
  fuseInstance,
  handleSuggestionClick,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { capsLock, setCapsLock, activeKey } = useKeyboard(setValue, isVisible, setKeyboardVisible, handleDone);
  const { suggestions } = useSuggestions(value, wordList, fuseInstance);
  const isMobile = useMobileDetection();
  const keyboardRef = useRef(null);
  const [isNumeric, setIsNumeric] = useState(false);
  const keyLayout = useKeyboardLayout(capsLock, isNumeric);

  useClickOutside(keyboardRef, () => setKeyboardVisible(false));
  useCapsLockDetection(setCapsLock);

  console.log('Sugestões no componente Keyboard:', suggestions);

  const handleKeyClick = (key) => {
    if (key === 'backspace') {
      setValue((prev) => prev.slice(0, -1));
    } else if (key === 'caps') {
      setCapsLock((prev) => !prev);
    } else if (key === 'space') {
      setValue((prev) => prev + ' ');
    } else if (key === 'enter') {
      setValue((prev) => prev + '\n');
    } else if (key === 'theme') {
      toggleTheme();
    } else if (key === '?123' || key === 'abc') {
      setIsNumeric((prev) => !prev);
    } else if (key === 'done') {
      handleDone();
    } else {
      setValue((prev) => prev + (capsLock ? key.toUpperCase() : key.toLowerCase()));
    }
  };

  return (
    <div
      ref={keyboardRef}
      className="keyboard"
      style={{
        position: 'fixed',
        left: 0,
        bottom: isVisible ? 0 : '-100%',
        width: '100%',
        padding: isMobile ? '5px 0' : '10px 0',
        background: isDarkMode ? '#1a1a1a' : '#f1f3f4',
        boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.2)',
        userSelect: 'none',
        transition: 'bottom 0.4s, background 0.4s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Suggestions
        suggestions={suggestions}
        handleSuggestionClick={handleSuggestionClick}
        isDarkMode={isDarkMode}
      />
      {keyLayout.map((row, rowIndex) => (
        <KeyboardRow
          key={rowIndex}
          row={row}
          handleKeyClick={handleKeyClick}
          startBackspace={startBackspace}
          stopBackspace={stopBackspace}
          capsLock={capsLock}
          activeKey={activeKey}
          isDarkMode={isDarkMode}
          iconMap={iconMap}
        />
      ))}
    </div>
  );
};

export default Keyboard;