import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import Keyboard from './components/Keyboard';

function App() {
  const [value, setValue] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [wordList, setWordList] = useState([]);
  const textareaRef = useRef(null);
  const backspaceTimeout = useRef(null);
  const backspaceInterval = useRef(null);

  // Carrega o dicionário de palavras em português
  useEffect(() => {
    fetch('/portuguese-words.json')
      .then(response => response.json())
      .then(data => setWordList(data))
      .catch(error => console.error('Erro ao carregar dicionário:', error));
  }, []);

  // Configuração do Fuse.js
  const fuse = new Fuse(wordList, {
    shouldSort: true,
    threshold: 0.2,
    minMatchCharLength: 1,
  });

  const getSuggestions = () => {
    const lastWord = value.split(/\s+/).pop().toLowerCase();
    if (lastWord && wordList.length > 0) {
      const results = fuse.search(lastWord);
      return results.map(result => result.item).slice(0, 3);
    }
    return [];
  };

  const playClickSound = () => {
    const audio = new Audio('/key-click.mp3');
    audio.play();
  };

  const startBackspace = () => {
    backspaceTimeout.current = setTimeout(() => {
      backspaceInterval.current = setInterval(() => {
        setValue(prev => prev.slice(0, -1));
        playClickSound();
      }, 100);
    }, 300);
  };

  const stopBackspace = () => {
    clearTimeout(backspaceTimeout.current);
    clearInterval(backspaceInterval.current);
  };

  const handleDone = () => {
    setMessage('Sua mensagem foi confirmada');
    setKeyboardVisible(false);
    textareaRef.current.blur();
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    const words = value.split(/\s+/);
    words.pop();
    setValue([...words, suggestion].join(' ') + ' ');
    playClickSound();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '40px',
        }}
      >
        <h1 style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}>
          Teclado Virtual
        </h1>
        <textarea
          ref={textareaRef}
          style={{
            width: '100%',
            height: '150px',
            padding: '15px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.1rem',
            resize: 'none',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            color: '#333',
            transition: 'all 0.3s ease',
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setKeyboardVisible(true)}
          placeholder="Digite algo..."
        />
      </div>

      {message && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            background: 'rgba(0, 255, 0, 0.9)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'opacity 0.3s ease',
            opacity: message ? 1 : 0,
          }}
        >
          {message}
        </div>
      )}

      <Keyboard
        setValue={setValue}
        isVisible={isKeyboardVisible}
        playClickSound={playClickSound}
        startBackspace={startBackspace}
        stopBackspace={stopBackspace}
        handleDone={handleDone}
        value={value}
        getSuggestions={getSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
}

export default App;