import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectToastMessage } from '../../store/selectors';
import { addMessage } from '../../store/slices';

export const ToastComponent: React.FC = () => {

  const toastMessage = useAppSelector(selectToastMessage);
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);


  useEffect(() => {
    if (toastMessage.message.length > 1 && toast !== null) {
      toast.current?.show({ severity: `${toastMessage.severity}` ?? undefined, summary: 'Info', detail: `${toastMessage.message}` });
    }
    dispatch(addMessage({ message: '', severity: 'warn' }))


  }, [toastMessage.message])


  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
    </div>
  )
}