import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectToastMessage } from '../../../store/selectors';
import { addMessage } from '../../../store/slices';

export const ToastMessages: React.FC = () => {

  const toastMessage = useAppSelector(selectToastMessage);
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {

    if (toastMessage.message.length > 1 && toast !== null) {
      toast.current?.show({ severity: `${toastMessage.severity}` , summary: 'Info', detail: `${toastMessage.message}` });
    }
    dispatch(addMessage({ message: '', severity: 'warn' }))

  }, [toastMessage.message])

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
    </div>
  )
}