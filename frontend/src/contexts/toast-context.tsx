// toast-context.tsx
import React, { createContext, useContext } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';

interface ToastContextType {
  notify: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = (message: string, options?: ToastOptions) => {
    toast(message, options);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <Toaster /> 
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
