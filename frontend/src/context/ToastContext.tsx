import { Toast } from 'primereact/toast';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { IToastMessage } from '../models/toastMessage';

interface ToastContextType {
  showToastMessage: (toastMessage: IToastMessage) => void;
  toastMessage: IToastMessage;
}

const initialState: IToastMessage = {
  message: '',
  severity: 'success'
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const Toastprovider = ({ children }: { children: ReactNode }) => {

  const [toastMessage, setToastMessage] = useState<IToastMessage>(initialState);
  const toast = useRef<Toast>(null);

  const showToastMessage = (tmessage: IToastMessage) => {

    console.log('hello toast message', toastMessage)
    setToastMessage({
      severity: tmessage.severity,
      message: tmessage.message
    })
  }

  useEffect(() => {
    if (toastMessage.message.length > 1 && toast !== null) {
      console.log('should updat here too')
      toast.current?.show({ severity: `${toastMessage.severity ?? undefined}`, summary: 'Info', detail: `${toastMessage.message}` });
    }
    console.log('taoat', toast)
    console.log('helo', toastMessage)

    setToastMessage({ message: '', severity: 'warn' })
  }, [toastMessage.message])

  return (
    <ToastContext.Provider value={{ toastMessage, showToastMessage }}  >
      <div style={{ position: 'absolute', top: 20, right: 100, zIndex: 20 }} className="card  flex justify-content-center">
        <Toast ref={toast} />
      </div>
      {children}
    </ToastContext.Provider>
  )
}


export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};