import React from 'react';
import { Button } from 'primereact/button';
import './styles/layout-controls.scss';

export type LayoutType = 'single' | 'dual' | 'quad';

interface LayoutControlsProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  currentLayout,
  onLayoutChange
}) => {
  return (
    <div className="cp-layout-controls">
      <Button 
        icon="pi pi-window-maximize" 
        onClick={() => onLayoutChange('single')}
        className={currentLayout === 'single' ? 'p-button-highlighted' : ''}
      />
      <Button 
        icon="pi pi-columns" 
        onClick={() => onLayoutChange('dual')}
        className={currentLayout === 'dual' ? 'p-button-highlighted' : ''}
      />
      <Button 
        icon="pi pi-table" 
        onClick={() => onLayoutChange('quad')}
        className={currentLayout === 'quad' ? 'p-button-highlighted' : ''}
      />
    </div>
  );
};