import React, { useState, useEffect } from 'react';
import './PWAUpdatePrompt.css';

const PWAUpdatePrompt = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showReload, setShowReload] = useState(false);

  const onSWUpdate = registration => {
    const waiting = registration.waiting;
    if (waiting) {
      waiting.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
      setWaitingWorker(waiting);
      setShowReload(true);
    }
  };

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  if (!showReload) {
    return null;
  }

  return (
    <div className='pwa-update-prompt'>
      <div className='pwa-update-content'>
        <div className='pwa-update-icon'>🔄</div>
        <div className='pwa-update-text'>
          <h3>Nova versão disponível!</h3>
          <p>
            Uma nova versão do Economiza AI está disponível. Clique para
            atualizar.
          </p>
        </div>
        <button className='pwa-update-button' onClick={reloadPage}>
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
