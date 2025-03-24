// src/hooks/useKeyboardLayout.js
import { useMemo } from 'react';




const useKeyboardLayout = (capsLock, isNumeric) => {
  return useMemo(() => {
    const alphaLayoutBase = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace'],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
      ['done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'],
      ['?123', 'space', 'theme'],
    ];

    const alphaLayout = alphaLayoutBase.map(row =>
      row.map(key => (/^[a-z]$/.test(key) ? (capsLock ? key.toUpperCase() : key.toLowerCase()) : key))
    );

    const numericLayout = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
      ['.', ',', '?', '!', "'", 'backspace'],
      ['abc', 'space', 'enter'],
    ];

    return isNumeric ? numericLayout : alphaLayout;
  }, [capsLock, isNumeric]);
};

export default useKeyboardLayout; // Exportação padrão