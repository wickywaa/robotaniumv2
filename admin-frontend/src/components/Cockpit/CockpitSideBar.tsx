import React from 'react';
import { ControlPanel } from './ControlPanel';
import { ChatPanel } from './ChatPanel';
import './styles/cockpit-sidebar.scss';

export const CockpitSidebar: React.FC = () => {
  return (
    <div className="cp-sidebar">
      <ControlPanel />
      <ChatPanel />
    </div>
  );
};