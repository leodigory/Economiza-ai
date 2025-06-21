import React, { useEffect, useState } from 'react';
import './Message.css';

const Message = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className={`message-container ${isAnimating ? 'message-visible' : 'message-hiding'}`}>
      <div className="message-content">
        <span className="message-icon">✅</span>
        <span className="message-text">{message}</span>
      </div>
    </div>
  );
};

export default Message;