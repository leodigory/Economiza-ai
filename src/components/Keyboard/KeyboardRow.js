import React from 'react';
import Key from './Key';

const KeyboardRow = ({ 
  row, 
  handleKeyClick, 
  startBackspace, 
  stopBackspace, 
  capsLock, 
  activeKey, 
  isDarkMode, 
  iconMap 
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px', width: '100%' }}>
      {row.map((key, keyIndex) => {
        const isBackspace = key === 'backspace';
        return (
          <Key
            key={keyIndex}
            label={key}
            icon={iconMap[key]} // Usando iconMap para passar o ícone
            onClick={() => handleKeyClick(key.toLowerCase())}
            onMouseDown={isBackspace ? startBackspace : undefined}
            onMouseUp={isBackspace ? stopBackspace : undefined}
            onMouseLeave={isBackspace ? stopBackspace : undefined}
            wide={key === 'backspace' || key === 'caps' || key === 'enter' || key === 'done' || key === '?123' || key === 'abc'}
            extraWide={key === 'space'}
            dark={key === 'done'}
            activatable={key === 'caps'}
            active={capsLock}
            isDarkMode={isDarkMode}
            isActive={activeKey === key.toLowerCase() || (key === 'space' && activeKey === ' ')}
          />
        );
      })}
    </div>
  );
};

export default KeyboardRow;