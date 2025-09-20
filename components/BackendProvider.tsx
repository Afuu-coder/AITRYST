"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useBackend } from '@/hooks/useBackend';
import { UseBackendHook } from '@/hooks/useBackend';

// Create the context
const BackendContext = createContext<UseBackendHook | undefined>(undefined);

// Provider component
export const BackendProvider = ({ children }: { children: ReactNode }) => {
  const backend = useBackend();
  
  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
};

// Hook to use the backend context
export const useBackendContext = () => {
  const context = useContext(BackendContext);
  
  if (context === undefined) {
    throw new Error('useBackendContext must be used within a BackendProvider');
  }
  
  return context;
};