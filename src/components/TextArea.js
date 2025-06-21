import React, { forwardRef } from 'react';
import './TextArea.css'; // Importando o arquivo de estilos

const TextArea = forwardRef(({ value, setValue, setKeyboardVisible, onClearText }, ref) => (
  <div className="text-area-container">
    <header className="text-area-header">
      <h1 className="text-area-title">Teclado Virtual</h1>
      <p className="text-area-subtitle">Digite com conforto e sugestões inteligentes</p>
    </header>
    
    <div className="textarea-wrapper">
      <textarea
        ref={ref} // Passando a referência para o textarea
        className="text-area-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setKeyboardVisible(true)}
        onKeyDown={(e) => {
          // Permitir atalhos de teclado
          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'a') {
              e.preventDefault();
              e.target.select();
            } else if (e.key === 'c') {
              // Permitir cópia
            } else if (e.key === 'v') {
              // Permitir colar
            }
          }
        }}
        placeholder="Digite sua mensagem aqui... Use o teclado virtual abaixo ou seu teclado físico."
        aria-label="Área de texto para digitação"
        aria-describedby="text-area-help"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="sentences"
        spellCheck="true"
        rows={4}
        maxLength={1000}
      />
      
      <div className="text-area-controls">
        {value && (
          <button 
            className="clear-text-button" 
            onClick={onClearText}
            aria-label="Limpar texto"
            title="Limpar texto"
          >
            <span className="clear-icon">×</span>
            Limpar
          </button>
        )}
        
        <div className="text-area-info">
          <span className="char-count" aria-live="polite">
            {value.length}/1000 caracteres
          </span>
        </div>
      </div>
    </div>
    
    <div id="text-area-help" className="text-area-help">
      <p>💡 Dica: Clique na área de texto para abrir o teclado virtual</p>
    </div>
  </div>
));

TextArea.displayName = 'TextArea';

export default TextArea;