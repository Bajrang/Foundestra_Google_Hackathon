import React, { createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from './ui/sonner';

// Create a toast context to manage toast state centrally
const ToastContext = createContext<{
  isReady: boolean;
}>({
  isReady: false
});

interface ToastProviderProps {
  children?: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure toast is ready after mount with minimal delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ isReady }}>
      {children}
      {/* Always render Toaster but only mark as ready after timeout */}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}