import React, { useState, useCallback } from 'react';
import './ToDoList.css';

const ToDoList = ({ items, onEdit, onDelete, isKeyboardVisible, onEditStart }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = useCallback((index, text) => {
    if (onEditStart) {
      onEditStart(text);
    }
    setEditIndex(index);
    setEditText(text);
  }, [onEditStart]);

  const handleEditSave = useCallback((index) => {
    if (editText.trim()) {
      onEdit(index, editText);
      setEditIndex(null);
      setEditText('');
    }
  }, [editText, onEdit]);

  const handleEditCancel = useCallback(() => {
    setEditIndex(null);
    setEditText('');
  }, []);

  const handleKeyPress = useCallback((e, index) => {
    if (e.key === 'Enter') {
      handleEditSave(index);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  const handleDelete = useCallback((index) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(index);
    }
  }, [onDelete]);

  if (items.length === 0) {
    return (
      <div className="todo-list-container empty">
        <div className="todo-empty-state">
          <div className="todo-empty-icon">📝</div>
          <h3>Nenhuma tarefa ainda</h3>
          <p>Use o botão "Done" no teclado virtual para adicionar sua primeira tarefa!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-list-container ${isKeyboardVisible ? 'keyboard-visible' : ''}`}>
      <div className="todo-header">
        <h2 className="todo-title">Minhas Tarefas</h2>
        <span className="todo-count" aria-live="polite">
          {items.length} {items.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>
      
      <div className="todo-list">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="todo-item"
            aria-label={`Tarefa ${index + 1}: ${item}`}
          >
            {editIndex === index ? (
              <div className="todo-edit-mode">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  className="todo-edit-input"
                  aria-label="Editar tarefa"
                  autoFocus
                  maxLength={200}
                />
                <div className="todo-edit-actions">
                  <button
                    onClick={() => handleEditSave(index)}
                    className="todo-btn todo-btn-save"
                    aria-label="Salvar edição"
                    title="Salvar (Enter)"
                  >
                    <span className="btn-icon">✓</span>
                    Salvar
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="todo-btn todo-btn-cancel"
                    aria-label="Cancelar edição"
                    title="Cancelar (Esc)"
                  >
                    <span className="btn-icon">✕</span>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="todo-display-mode">
                <span className="todo-text" title={item}>
                  {item}
                </span>
                <div className="todo-actions">
                  <button
                    onClick={() => handleEditStart(index, item)}
                    className="todo-btn todo-btn-edit"
                    aria-label={`Editar tarefa: ${item}`}
                    title="Editar tarefa"
                  >
                    <span className="btn-icon">✎</span>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="todo-btn todo-btn-delete"
                    aria-label={`Excluir tarefa: ${item}`}
                    title="Excluir tarefa"
                  >
                    <span className="btn-icon">🗑</span>
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;