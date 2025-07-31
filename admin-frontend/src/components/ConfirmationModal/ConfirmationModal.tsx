import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './ConfirmationModal.scss';

interface ConfirmationModal {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModal> = ({message,onClose, onConfirm}) => {  

  const footer = () => {
    return(
      <div>
        <Button onClick={onClose} label='close'/>
        <Button onClick={onConfirm} label='confirm'/>
      </div>
    )
  }
 
  return(
    <Card className='' style={{position:'absolute',height:'50%'}} footer={footer}>
      <p>{message} </p>
    </Card>
    )

} 