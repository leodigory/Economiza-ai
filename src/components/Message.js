import React from 'react';

const Message = ({ message }) => (
  message ? (
    <div style={{
      position: 'fixed',
      top: '20px',
      background: 'rgba(40, 167, 69, 0.95)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      transition: 'opacity 0.3s ease',
      opacity: message ? 1 : 0,
    }}>
      {message}
    </div>
  ) : null
);

export default Message;