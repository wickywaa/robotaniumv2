import React from  'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';


interface ConfirmDialog {
  Message:string;
  onHide:()=> void;
  onConfirm:()=>void;
} 

export const ConfirmDialog:React.FC<ConfirmDialog> = ({Message, onHide, onConfirm}) => {
 const footer = (
        <>
            <Button label="Confirm" icon="pi pi-check" onClick={onConfirm} />
            <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={onHide} />
        </>
    );

  return (
    <Card style={{position:'absolute', top:'40%'}} title={Message}  footer={footer}>
      
    </Card>
  )
}