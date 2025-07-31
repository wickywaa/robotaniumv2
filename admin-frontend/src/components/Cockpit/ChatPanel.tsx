import React from 'react';
import './styles/chat-panel.scss';

export const ChatPanel: React.FC = () => {
  return (
    <div className="cp-chat">
      <h3 className="cp-chat__title">Chat</h3>
      <div className="cp-chat__messages">
        <div className="cp-chat__message">
          <span className="cp-chat__user">User 1:</span>
          <span className="cp-chat__text">Hello</span>
        </div>
        <div className="cp-chat__message">
          <span className="cp-chat__user">User 2:</span>
          <span className="cp-chat__text">Hi there</span>
        </div>
      </div>
    </div>
  );
};