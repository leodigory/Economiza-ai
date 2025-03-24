// src/hooks/useCapsLockDetection.js
import { useEffect } from 'react';


const useCapsLockDetection = (setCapsLock) => {
  useEffect(() => {
    const handleCapsLock = (event) => {
      if (event.getModifierState && event.getModifierState('CapsLock')) {
        setCapsLock(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleCapsLock);
    return () => {
      window.removeEventListener('keydown', handleCapsLock);
    };
  }, [setCapsLock]);
};

export default useCapsLockDetection; // Exportação padrão