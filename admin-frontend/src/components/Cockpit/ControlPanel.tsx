import React from 'react';
import { Button } from 'primereact/button';
import './styles/control-panel.scss';

export const ControlPanel: React.FC = () => {
  return (
    <div className="cp-control-panel">
      <h3 className="cp-control-panel__title">Control Panel</h3>
      <div className="cp-control-panel__grid">
        <Button 
          label="Forward" 
          icon="pi pi-arrow-up"
          className="p-button-outlined" 
        />
        <Button 
          label="Reverse" 
          icon="pi pi-arrow-down"
          className="p-button-outlined" 
        />
        <Button 
          label="Left" 
          icon="pi pi-arrow-left"
          className="p-button-outlined" 
        />
        <Button 
          label="Right" 
          icon="pi pi-arrow-right"
          className="p-button-outlined" 
        />
      </div>
    </div>
  );
};