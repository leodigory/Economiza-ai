import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({
  percentage,
  completedCount,
  totalCount,
  totalQuantity,
  totalValue,
}) => {
  return (
    <div className='progress-bar-container'>
      <div className='progress-info'>
        <div className='progress-stats'>
          <span className='progress-text'>
            {completedCount}/{totalCount} itens
          </span>
          <span className='progress-percentage'>{Math.round(percentage)}%</span>
        </div>
        <div className='progress-details'>
          <span className='detail-item'>📦 {totalQuantity} un</span>
          <span className='detail-item'>💰 R$ {totalValue.toFixed(2)}</span>
        </div>
      </div>
      <div className='liquid-progress-bar-wrapper'>
        <div className='liquid-progress-bar-glow'></div>
        <div
          className={`liquid-progress-bar-fill${percentage >= 99.5 ? ' full' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          <span className='liquid-progress-bar-text'>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <div className='progress-indicators'>
        <div className='indicator completed'>
          <span className='indicator-dot'></span>
          <span className='indicator-label'>Concluído</span>
        </div>
        <div className='indicator pending'>
          <span className='indicator-dot'></span>
          <span className='indicator-label'>Pendente</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
