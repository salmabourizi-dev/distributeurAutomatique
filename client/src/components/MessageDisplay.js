import React, { useEffect, useState } from 'react';
import './MessageDisplay.css';

const MessageDisplay = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      if (message.type !== 'info') {
        setVisible(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`message-display ${message.type} ${visible ? 'visible' : 'hidden'}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default MessageDisplay;