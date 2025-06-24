import React, { useState, useEffect } from 'react';
import './ShoppingItemCard.css';
import ToggleSwitch from './common/ToggleSwitch';
import { getLatestPrice } from '../config/firestore'; // Ajuste o caminho se necessário

const ShoppingItemCard = ({
  item,
  onRemove,
  onToggleComplete,
  currentStore,
  currentUser,
}) => {
  const [latestPrice, setLatestPrice] = useState(null);

  useEffect(() => {
    if (currentStore && item.name) {
      getLatestPrice(item.name, currentStore).then(priceData => {
        if (priceData) {
          setLatestPrice(priceData);
        }
      });
    }
  }, [item.name, currentStore]);

  const formatPrice = price => {
    if (isNaN(price)) return 'R$ 0,00';
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  // Cálculo do valor total do item
  const getTotal = () => {
    const v = parseFloat(item.value || latestPrice?.latestPrice || 0);
    if (item.unitType === 'weight' || item.unitType === 'meter') {
      const w = parseFloat(item.weight) || 0;
      return v * w;
    } else {
      const q = parseFloat(item.quantity) || 1;
      return v * q;
    }
  };

  // Unidade amigável
  const getUnitLabel = () => {
    if (item.unitType === 'weight') return 'kg';
    if (item.unitType === 'meter') return 'm';
    return 'un';
  };

  // Detecta modo escuro
  const isDarkMode = document.body.classList.contains('dark');
  // Cor do nome do item
  const getItemNameColor = () => {
    if (item.completed) {
      return isDarkMode ? '#aaa' : '#888';
    }
    return isDarkMode ? '#fff' : '#232b3b';
  };

  return (
    <div
      className={`shopping-item-card${item.completed ? ' checked' : ''}`}
      style={{
        opacity: item.completed ? 0.8 : 1,
        borderLeft: item.completed ? '5px solid #28a745' : '5px solid #8e44ad',
        filter: 'none',
        transition: 'all 0.3s',
      }}
    >
      <div className='card-main-content'>
        <ToggleSwitch
          isToggled={!!item.completed}
          onToggle={() => onToggleComplete(item.id)}
        />
        <div className='item-info'>
          <span className='item-name' style={{ color: getItemNameColor() }}>
            {item.name || item.text}
          </span>
          <span className='item-details'>
            Qtd: {item.quantity} {getUnitLabel()}{' '}
            {item.weight && item.unitType !== 'unit'
              ? `| Peso: ${item.weight}${getUnitLabel()}`
              : ''}
          </span>
        </div>
        <div className='item-pricing' style={{ minWidth: 90 }}>
          <span className='item-unit-price'>
            {formatPrice(item.value || latestPrice?.latestPrice)}
          </span>
          <span className='item-total-price'>{formatPrice(getTotal())}</span>
        </div>
        <div className='card-actions'>
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className='remove-btn'
            aria-label={`Remover ${item.name} da lista`}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingItemCard;
