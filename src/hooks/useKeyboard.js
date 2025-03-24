import { useState, useEffect } from 'react';

export const useKeyboard = (setValue, isVisible, setKeyboardVisible, handleDone) => {
  const [capsLock, setCapsLock] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      setActiveKey(key);

      if (/^[a-z0-9.,!?;:'"()$&@/\-\s]$/.test(key) || ['backspace', 'enter', 'escape', 'capslock'].includes(key)) {
        e.preventDefault();
      }

      if (key === 'escape') {
        setKeyboardVisible(false);
      } else if (key === 'backspace') {
        setValue(prev => prev.slice(0, -1));
      } else if (key === 'capslock') {
        setCapsLock(prev => !prev);
      } else if (key === ' ') {
        setValue(prev => prev + ' ');
      } else if (key === 'enter') {
        setValue(prev => prev + '\n');
      } else if (key === 'done') {
        handleDone();
      } else if (/^[a-z0-9.,!?;:'"()$&@/-]$/.test(key)) {
        setValue(prev => prev + (capsLock ? key.toUpperCase() : key));
      }
    };

    const handleKeyUp = () => setActiveKey(null);

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible, capsLock, setValue, setKeyboardVisible, handleDone]);

  return { capsLock, setCapsLock, activeKey };
};