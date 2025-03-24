import React, { useState } from 'react';

const ToDoList = ({ items, onEdit, onDelete }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const handleEditSave = (index) => {
    onEdit(index, editText);
    setEditIndex(null);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      marginTop: '1px',
      paddingBottom:'1px',
      padding: items.length ? '20px' : '0', // Remove padding se não houver itens
      background: items.length ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      borderRadius: '16px',
      boxShadow: items.length ? '0 8px 32px rgba(0, 0, 0, 0.2)' : 'none',
      backdropFilter: items.length ? 'blur(10px)' : 'none',
      minHeight: items.length ? '80px' : '0', // Evita barra de rolagem quando vazio
    }}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          {editIndex === index ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#fff',
                  color: '#2c3e50',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
              <button
                onClick={() => handleEditSave(index)}
                style={{
                  marginLeft: '12px',
                  padding: '8px 16px',
                  background: '#00b894',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.background = '#00a37f'}
                onMouseLeave={(e) => e.target.style.background = '#00b894'}
              >
                Salvar
              </button>
            </>
          ) : (
            <>
              <span style={{ 
                flex: 1, 
                color: '#e0e0e0', 
                fontSize: '0.95rem', 
                fontFamily: "'Poppins', sans-serif",
                wordBreak: 'break-word',
              }}>
                {item}
              </span>
              <button
                onClick={() => handleEditStart(index, item)}
                style={{
                  marginRight: '10px',
                  padding: '8px 16px',
                  background: '#0984e3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.background = '#0773c4'}
                onMouseLeave={(e) => e.target.style.background = '#0984e3'}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(index)}
                style={{
                  padding: '8px 16px',
                  background: '#d63031',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.background = '#b92b2b'}
                onMouseLeave={(e) => e.target.style.background = '#d63031'}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToDoList;