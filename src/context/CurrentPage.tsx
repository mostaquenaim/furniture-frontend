'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

interface CurrentPageContextType {
  isAdminOpen: boolean;
  toggleAdminDrawer: () => void;
  setAdminOpen: (open: boolean) => void;
}

const CurrentPageContext = createContext<CurrentPageContextType | undefined>(undefined);

export const CurrentPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(true);

  return (
    <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </CurrentPageContext.Provider>
  );
};

export const useAdminDrawer = () => {
  const context = useContext(CurrentPageContext);
  if (context === undefined) {
    throw new Error('useAdminDrawer must be used within an AdminDrawerProvider');
  }
  return context;
};