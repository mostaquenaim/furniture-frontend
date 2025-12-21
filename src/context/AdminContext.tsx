'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

interface AdminDrawerContextType {
  isAdminOpen: boolean;
  toggleAdminDrawer: () => void;
  setAdminOpen: (open: boolean) => void;
}

const AdminDrawerContext = createContext<AdminDrawerContextType | undefined>(undefined);

export const AdminDrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(true);

  const toggleAdminDrawer = () => {
    setIsAdminOpen(prev => !prev);
  };

  const setAdminOpen = (open: boolean) => {
    setIsAdminOpen(open);
  };

  return (
    <AdminDrawerContext.Provider value={{ isAdminOpen, toggleAdminDrawer, setAdminOpen }}>
      {children}
    </AdminDrawerContext.Provider>
  );
};

export const useAdminDrawer = () => {
  const context = useContext(AdminDrawerContext);
  if (context === undefined) {
    throw new Error('useAdminDrawer must be used within an AdminDrawerProvider');
  }
  return context;
};