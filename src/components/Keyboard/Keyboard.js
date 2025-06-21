import React, { useRef, useState, useCallback } from 'react';
import Suggestions from './Suggestions';
import KeyboardRow from './KeyboardRow';
import { useKeyboard } from '../../hooks/useKeyboard';
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
  suggestions,
  handleSuggestionClick,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { capsLock, setCapsLock, activeKey } = useKeyboard(setValue, isVisible, setKeyboardVisible, handleDone);
  const isMobile = useMobileDetection();
  const keyboardRef = useRef(null);
  const [isNumeric, setIsNumeric] = useState(false);
  const keyLayout = useKeyboardLayout(capsLock, isNumeric);

  useClickOutside(keyboardRef, () => setKeyboardVisible(false));
  useCapsLockDetection(setCapsLock);

  const handleKeyClick = useCallback((key) => {
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
  }, [setValue, setCapsLock, capsLock, toggleTheme, handleDone]);

  const onSuggestionClick = useCallback((suggestion) => {
    handleSuggestionClick(suggestion);
  }, [handleSuggestionClick]);

  return (
    <div
      ref={keyboardRef}
      className={`keyboard-container ${isVisible ? 'keyboard-visible' : 'keyboard-hidden'}`}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        userSelect: 'none',
      }}
    >
      <div className="keyboard">
        <Suggestions
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
          isVisible={isVisible && suggestions && suggestions.length > 0}
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
    </div>
  );
};

export default Keyboard;