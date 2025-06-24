import React from 'react';
import ShoppingItemCard from './ShoppingItemCard';
import AddItemModal from './AddItemModal'; // Supondo que você queira usá-lo
import ProgressBar from './ProgressBar';
import './ShoppingList.css';

const ShoppingList = ({
  items,
  onAddItem,
  onRemoveItem,
  onToggleItem,
  onClearList,
  onFinishList,
  currentStore,
  currentUser,
}) => {
  if (!items || items.length === 0) {
    return <p className="empty-list-message">Sua lista de compras está vazia. Adicione itens usando o botão na barra de navegação.</p>;
  }

  // Ordena: comprados (checked/true) em cima, pendentes embaixo
  const sortedItems = [...items].sort((a, b) => {
    // completed deve ser booleano
    return (b.completed === true) - (a.completed === true);
  });

  // Cálculo do valor total da compra
  const getItemTotal = (item) => {
    const v = parseFloat(item.value || 0);
    if (item.unitType === 'weight' || item.unitType === 'meter') {
      const w = parseFloat(item.weight) || 0;
      return v * w;
    } else {
      const q = parseFloat(item.quantity) || 1;
      return v * q;
    }
  };
  const totalValue = sortedItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const completedCount = sortedItems.filter(item => !!item.completed).length;
  const totalCount = sortedItems.length;
  const totalQuantity = sortedItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 1), 0);
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="shopping-list-container">
      <ProgressBar
        percentage={percentage}
        completedCount={completedCount}
        totalCount={totalCount}
        totalQuantity={totalQuantity}
        totalValue={totalValue}
      />
      <div className="items-list">
        {sortedItems.map(item => (
          <ShoppingItemCard
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            onToggleComplete={onToggleItem}
            currentStore={currentStore}
            currentUser={currentUser}
          />
        ))}
      </div>
      <div className="total-purchase-value">
        Total da compra: R$ {totalValue.toFixed(2)}
      </div>
      {items.length > 0 && (
        <>
          <button onClick={onClearList} className="clear-list-btn">
            Limpar Lista
          </button>
          <button onClick={onFinishList} className="finish-list-btn">
            Finalizar Lista
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingList;
