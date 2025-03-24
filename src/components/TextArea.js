import React, { forwardRef } from 'react';
import './TextArea.css'; // Importando o arquivo de estilos

const TextArea = forwardRef(({ value, setValue, setKeyboardVisible, onClearText }, ref) => (
  <div className="text-area-container">
    <h1 className="text-area-title">Teclado Virtual</h1>
    <div className="textarea-wrapper">
      <textarea
        ref={ref} // Passando a referência para o textarea
        className="text-area-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setKeyboardVisible(true)}
        placeholder="Digite sua mensagem..."
      />
      {value && (
        <button className="clear-text-button" onClick={onClearText}>
          Limpar
        </button>
      )}
    </div>
  </div>
));

export default TextArea;