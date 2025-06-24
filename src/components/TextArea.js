import React, {
  forwardRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import './TextArea.css'; // Importando o arquivo de estilos

const TextArea = forwardRef(
  (
    {
      value,
      setValue,
      onClearText,
      quantity,
      setQuantity,
      price,
      setPrice,
      unitType,
      setUnitType,
      weight,
      setWeight,
      onTotalChange,
    },
    ref
  ) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    useEffect(() => {
      // Auto-growing textarea logic
      if (ref && ref.current) {
        ref.current.style.height = 'auto'; // Reseta a altura
        ref.current.style.height = `${ref.current.scrollHeight}px`; // Ajusta para a altura do conteúdo
      }
    }, [value, ref]);

    const handleFocus = useCallback(() => {
      // setKeyboardVisible(true);
    }, []);

    const handleChange = useCallback(
      e => {
        const upper = e.target.value.toUpperCase();
        setValue(upper);
        if (upper.length > 1) {
          fetchSuggestions(upper);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
        setHighlightedIndex(-1);
      },
      [setValue]
    );

    const handleKeyDown = e => {
      if (showSuggestions && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(
            prev => (prev - 1 + suggestions.length) % suggestions.length
          );
        } else if (e.key === 'Enter') {
          if (highlightedIndex >= 0) {
            e.preventDefault();
            setValue(suggestions[highlightedIndex]);
            setShowSuggestions(false);
          }
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
        }
      }
    };

    const handleClear = useCallback(() => {
      setValue('');
      if (onClearText) {
        onClearText();
      }
    }, [setValue, onClearText]);

    const handleQuantityChange = e => {
      const val = e.target.value;
      if (val === '' || (Number(val) > 0 && !val.includes('.'))) {
        setQuantity(val);
      }
    };

    const handleUnitTypeChange = e => {
      setUnitType(e.target.value);
      if (e.target.value === 'unit') {
        setWeight('');
      }
    };

    // Novo: lógica para aceitar peso em gramas ou kg
    const handleWeightChange = e => {
      let val = e.target.value.replace(',', '.');
      // Aceita apenas números e ponto
      val = val.replace(/[^\d.]/g, '');
      // Remove pontos extras
      const parts = val.split('.');
      if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
      setWeight(val);
    };

    // Peso convertido para kg para cálculo
    const weightInKg = useMemo(() => {
      if (!weight) return 0;
      const num = parseFloat(weight);
      if (isNaN(num)) return 0;
      // Se for inteiro >= 10, interpreta como gramas
      if (unitType === 'weight') {
        if (Number.isInteger(num) && num >= 10) {
          return num / 1000;
        }
        return num;
      }
      if (unitType === 'meter') {
        return num; // metros
      }
      return 0;
    }, [weight, unitType]);

    // Novo: formatação de valor tipo moeda (centavos)
    const handlePriceChange = e => {
      let val = e.target.value.replace(/\D/g, ''); // só números
      if (!val) val = '0';
      // Limita a 9 dígitos (até 9.999.999,99)
      if (val.length > 9) val = val.slice(0, 9);
      // Converte para float com duas casas
      const num = parseFloat(val) / 100;
      setPrice(num.toFixed(2));
    };

    // Exibe valor formatado no input
    const displayPrice = useMemo(() => {
      let num = parseFloat(price);
      if (isNaN(num)) num = 0;
      return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }, [price]);

    // Cálculo do valor total
    const total = useMemo(() => {
      const v = parseFloat(price);
      if (unitType === 'weight' || unitType === 'meter') {
        const w = weightInKg;
        if (!isNaN(v) && !isNaN(w)) return v * w;
        return 0;
      } else {
        const q = parseFloat(quantity);
        if (!isNaN(v) && !isNaN(q)) return v * q;
        return 0;
      }
    }, [price, quantity, unitType, weightInKg]);

    const displayTotal = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    useEffect(() => {
      if (onTotalChange) {
        onTotalChange(displayTotal);
      }
    }, [displayTotal, onTotalChange]);

    const characterCount = useMemo(() => value.length, [value]);
    const wordCount = useMemo(() => {
      const words = value.trim().split(/\s+/);
      return value.trim() ? words.length : 0;
    }, [value]);

    const isLimitReached = characterCount >= 500;

    // Busca sugestões na API/Firebase
    const fetchSuggestions = async query => {
      setLoadingSuggestions(true);
      // Exemplo: buscar no Firebase ou API
      // const result = await fetch(`/api/suggestions?query=${query}`);
      // const data = await result.json();
      // setSuggestions(data);
      // MOCK:
      setSuggestions([
        'ARROZ 5KG',
        'FEIJÃO PRETO 1KG',
        'MACARRÃO',
        'ÓLEO DE SOJA',
        'AÇÚCAR',
      ]);
      setLoadingSuggestions(false);
    };

    const handleSuggestionClick = suggestion => {
      setValue(suggestion);
      setShowSuggestions(false);
    };

    return (
      <div className='textarea-container'>
        <div className='textarea-wrapper'>
          <div className='main-input-wrapper' style={{ position: 'relative' }}>
            <textarea
              ref={ref}
              value={value}
              onChange={handleChange}
              onFocus={() => value.length > 1 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder='Digite o nome do item...'
              className='textarea-input'
              rows='1'
              style={{ textTransform: 'uppercase' }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className='autocomplete-suggestions'>
                {loadingSuggestions ? (
                  <li>Carregando...</li>
                ) : (
                  suggestions.map((s, i) => (
                    <li
                      key={i}
                      style={{ listStyle: 'none', padding: 0, margin: 0 }}
                    >
                      <button
                        type='button'
                        className={`autocomplete-suggestion-btn${
                          highlightedIndex === i ? ' highlighted' : ''
                        }`}
                        onClick={() => handleSuggestionClick(s)}
                        tabIndex={-1}
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        {s}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
            {value && (
              <div className='textarea-actions'>
                <div className='textarea-info' id='textarea-info'>
                  <div
                    className={`character-count ${
                      isLimitReached ? 'limit-reached' : ''
                    }`}
                  >
                    <span>📝</span>
                    {characterCount}/500
                  </div>
                  <div className='word-count'>
                    <span>📊</span>
                    {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
                  </div>
                </div>
                <button
                  className='clear-button'
                  onClick={handleClear}
                  disabled={!value.trim()}
                  aria-label='Limpar texto'
                  title='Limpar todo o texto'
                >
                  <span className='clear-icon'>🗑</span>
                  Limpar
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='additional-inputs'>
          <div className='input-group'>
            <select
              id='unitType'
              value={unitType}
              onChange={handleUnitTypeChange}
              className='additional-input'
            >
              <option value='unit'>Unidade</option>
              <option value='weight'>Peso (kg)</option>
              <option value='meter'>Metro</option>
            </select>
          </div>
          {unitType === 'meter' && (
            <div className='input-group'>
              <label htmlFor='meterValue'>Metros</label>
              <input
                type='number'
                id='meterValue'
                value={weight}
                onChange={handleWeightChange}
                onFocus={handleFocus}
                className='additional-input'
                min='0.01'
                step='0.01'
                placeholder='0,00'
              />
            </div>
          )}
          <div className='input-group'>
            <label htmlFor='quantity'>Quantidade</label>
            <input
              type='number'
              id='quantity'
              value={quantity}
              onChange={handleQuantityChange}
              onFocus={handleFocus}
              className='additional-input'
              min='1'
              disabled={unitType === 'weight' || unitType === 'meter'}
            />
          </div>
          {unitType === 'weight' && (
            <div className='input-group'>
              <label htmlFor='weight'>Peso (kg ou g)</label>
              <input
                type='text'
                id='weight'
                value={weight}
                onChange={handleWeightChange}
                onFocus={handleFocus}
                className='additional-input'
                placeholder='Ex: 300g ou 1,5kg'
              />
            </div>
          )}
          <div className='input-group'>
            <label htmlFor='itemValue'>Valor (R$)</label>
            <input
              type='text'
              id='itemValue'
              value={displayPrice}
              onChange={handlePriceChange}
              onFocus={handleFocus}
              placeholder='0,00'
              className='additional-input'
              inputMode='decimal'
              maxLength={15}
            />
          </div>
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
