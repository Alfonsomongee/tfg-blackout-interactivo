import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            padding: '0.75rem 1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            duration: 2500,
            style: {
              borderColor: 'var(--nominal)',
              borderWidth: '1px',
            },
            icon: '✓',
          },
          error: {
            duration: 3500,
            style: {
              borderColor: 'var(--alarm)',
              borderWidth: '1px',
            },
            icon: '✗',
          },
          loading: {
            duration: Infinity,
            icon: '⏳',
          },
        }}
      />
      {children}
    </>
  );
};

export default ToastProvider;
