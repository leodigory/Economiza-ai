// src/hooks/useCapsLockDetection.js
import { useState, useEffect } from 'react';

const useCapsLockDetection = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleCapsLock = (event) => {
      if (event.getModifierState && event.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
      } else {
        setIsCapsLockOn(false);
      }
    };

    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);

  return { isCapsLockOn };
};

export default useCapsLockDetection;
