import React, { forwardRef, useCallback, useMemo } from 'react';
import './TextArea.css'; // Importando o arquivo de estilos

const TextArea = forwardRef(({ value, setValue, setKeyboardVisible, onClearText }, ref) => {
  const handleFocus = useCallback(() => {
    setKeyboardVisible(true);
  }, [setKeyboardVisible]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  const handleClear = useCallback(() => {
    setValue('');
    if (onClearText) {
      onClearText();
    }
  }, [setValue, onClearText]);

  const characterCount = useMemo(() => value.length, [value]);
  const wordCount = useMemo(() => {
    const words = value.trim().split(/\s+/);
    return value.trim() ? words.length : 0;
  }, [value]);

  const isLimitReached = characterCount >= 500;

  return (
    <div className="textarea-container">
      <div className="textarea-wrapper">
        <textarea
          ref={ref} // Passando a referência para o textarea
          className="textarea"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Digite seu texto aqui... Use o teclado virtual abaixo para uma experiência melhor!"
          maxLength={500}
          aria-label="Área de texto"
          aria-describedby="textarea-info"
        />
        <div className="textarea-actions">
          <div className="textarea-info" id="textarea-info">
            <div className={`character-count ${isLimitReached ? 'limit-reached' : ''}`}>
              <span>📝</span>
              {characterCount}/500
            </div>
            <div className="word-count">
              <span>📊</span>
              {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
            </div>
          </div>
          <button
            className="clear-button"
            onClick={handleClear}
            disabled={!value.trim()}
            aria-label="Limpar texto"
            title="Limpar todo o texto"
          >
            <span className="clear-icon">🗑</span>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;