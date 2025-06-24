import React, { useState } from 'react';
import './StoreSelector.css'; // Reutiliza o visual dos cards de loja

const ItemDetailCard = ({ item }) => {
  const total = (
    parseFloat(item.value || 0) * parseFloat(item.quantity || 1)
  ).toFixed(2);
  return (
    <div
      className='store-card-glass'
      style={{
        width: '100%',
        maxWidth: 700,
        margin: '0.25rem auto',
        borderRadius: 10,
        padding: '0.5rem 0.7rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4,
        minHeight: 0,
        boxShadow: '0 1px 6px rgba(102, 126, 234, 0.04)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: 500,
            display: 'block',
            marginBottom: 2,
          }}
        >
          Nome
        </span>
        <span
          style={{ fontWeight: 600, fontSize: 14, wordBreak: 'break-word' }}
        >
          {item.text || item.name}
        </span>
      </div>
      <div style={{ flex: 0.7, minWidth: 0, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: 500,
            display: 'block',
            marginBottom: 2,
          }}
        >
          Qtd
        </span>
        <span style={{ fontSize: 14 }}>
          <b>{item.quantity || 1}</b>{' '}
          {item.unitType === 'weight'
            ? 'kg'
            : item.unitType === 'meter'
            ? 'm'
            : 'un'}
        </span>
      </div>
      <div style={{ flex: 0.8, minWidth: 0, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: 500,
            display: 'block',
            marginBottom: 2,
          }}
        >
          Unitário
        </span>
        <span style={{ fontSize: 14 }}>R$ {Number(item.value).toFixed(2)}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: 500,
            display: 'block',
            marginBottom: 2,
          }}
        >
          Total
        </span>
        <span style={{ fontWeight: 700, color: '#4CAF50', fontSize: 15 }}>
          R$ {total}
        </span>
      </div>
    </div>
  );
};

// Funções utilitárias para logo igual StoreSelector
const getLogoUrl = store => {
  if (store && store.logoUrl) return store.logoUrl;
  if (store && store.website) {
    try {
      const domain = new URL(store.website).hostname.replace('www.', '');
      return `https://logo.clearbit.com/${domain}`;
    } catch {}
  }
  return null;
};
const generateInitials = text => {
  if (!text) return '?';
  const words = text.split(' ').filter(word => word.length > 0);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return words.map(word => word[0]).join('').toUpperCase().substring(0, 3);
};
const generateColor = text => {
  const colors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B',
    '#795548', '#E91E63', '#00BCD4', '#8BC34A', '#FF5722',
    '#3F51B5', '#009688', '#FFC107', '#673AB7', '#FFEB3B',
  ];
  const hash = text.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & a, 0);
  return colors[Math.abs(hash) % colors.length];
};

const HistoryView = ({ history }) => {
  const [selectedList, setSelectedList] = useState(null);

  // Calcula o valor total da compra
  const getTotal = items => {
    return (items || []).reduce((sum, item) => {
      const v = parseFloat(item.value || 0);
      const q = parseFloat(item.quantity || 1);
      return sum + v * q;
    }, 0);
  };

  if (!history || history.length === 0) {
    return (
      <div className='shopping-list-container'>
        <p className='empty-list-message'>
          Nenhum histórico de compra anterior encontrado.
        </p>
      </div>
    );
  }

  // Página de detalhamento de uma compra
  if (selectedList) {
    const total = getTotal(selectedList.items);
    return (
      <div
        className="store-selector-container"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setSelectedList(null)}
          style={{
            margin: '1rem 0',
            padding: '0.6rem 1.2rem',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.13)',
            alignSelf: 'flex-start',
          }}
        >
          ← Voltar ao Histórico
        </button>
        <div
          className="store-card-glass history-rect-card"
          style={{
            width: '100%',
            maxWidth: 700,
            margin: '0 auto 1.5rem auto',
            borderRadius: 10,
            padding: '0.5rem 0.7rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            minHeight: 0,
            boxShadow: '0 1px 6px rgba(102, 126, 234, 0.04)',
          }}
        >
          <span className="store-logo-container" style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}>
            {getLogoUrl(selectedList) ? (
              <img
                src={getLogoUrl(selectedList)}
                alt={selectedList.store}
                className="store-logo-img"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
                onError={e => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.store-initials').style.display = 'flex'; }}
              />
            ) : null}
            <div
              className="store-initials"
              style={{ backgroundColor: generateColor(selectedList.store), fontSize: 13, borderWidth: 1, display: getLogoUrl(selectedList) ? 'none' : 'flex' }}
            >
              {generateInitials(selectedList.store)}
            </div>
          </span>
          <div style={{ flex: 1.2, minWidth: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontSize: 10, color: '#888', fontWeight: 500, marginBottom: 0 }}>Nome do Estabelecimento</span>
            <span className="store-name" style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{selectedList.store}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontSize: 10, color: '#888', fontWeight: 500, marginBottom: 0 }}>Data da Compra</span>
            <span className="store-address" style={{ fontSize: 13, color: '#e0e0e0', fontWeight: 500, letterSpacing: 0.2 }}>{new Date(selectedList.date).toLocaleDateString()}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontSize: 10, color: '#888', fontWeight: 500, marginBottom: 0 }}>Valor Total</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#4CAF50' }}>R$ {total.toFixed(2)}</span>
          </div>
        </div>
        <h3 style={{ margin: '1.5rem 0 1rem 0', fontSize: 18, color: '#764ba2', fontWeight: 700, alignSelf: 'flex-start' }}>Itens da Compra</h3>
        <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
          {selectedList.items.map(item => (
            <ItemDetailCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  // Página de cards de compras
  return (
    <div className='store-selector-container'>
      <div className='history-list-vertical'>
        {history.map(list => {
          const total = getTotal(list.items);
          return (
            <div
              key={list.id}
              className={`store-card-glass history-rect-card`}
              onClick={() => setSelectedList(list)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedList(list);
                }
              }}
              role='button'
              tabIndex={0}
              aria-label={`Ver detalhes da compra em ${list.store}`}
              style={{
                cursor: 'pointer',
                marginBottom: 10,
                width: '100%',
                maxWidth: 1000,
                marginLeft: 0,
                marginRight: 0,
                borderRadius: 10,
                boxShadow: '0 1px 6px rgba(102, 126, 234, 0.04)',
                padding: '0.5rem 0.7rem',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                className='store-logo-container'
                style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
              >
                <div
                  className='store-initials'
                  style={{
                    backgroundColor: '#764ba2',
                    fontSize: 13,
                    borderWidth: 1,
                  }}
                >
                  {list.store
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 3)}
                </div>
              </span>
              <div
                style={{
                  flex: 1.2,
                  minWidth: 0,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: '#888',
                    fontWeight: 500,
                    marginBottom: 0,
                  }}
                >
                  Nome do Estabelecimento
                </span>
                <span
                  className='store-name'
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 120,
                  }}
                >
                  {list.store}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: '#888',
                    fontWeight: 500,
                    marginBottom: 0,
                  }}
                >
                  Data da Compra
                </span>
                <span
                  className='store-address'
                  style={{
                    fontSize: 13,
                    color: '#e0e0e0',
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  {new Date(list.date).toLocaleDateString()}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: '#888',
                    fontWeight: 500,
                    marginBottom: 0,
                  }}
                >
                  Valor Total
                </span>
                <span
                  style={{ fontWeight: 700, fontSize: 14, color: '#4CAF50' }}
                >
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
