// SalespersonContext.js
import React, { createContext, useContext, useState } from 'react';

const SalesPersonContext = createContext();

export const SalespersonProvider  = ({ children }) => {
  const [salespersonID, setSalespersonID] = useState("");
  const [salespersonName, setSalespersonName] = useState("");

  return (
    <SalesPersonContext.Provider value={{salespersonID, setSalespersonID, salespersonName, setSalespersonName }}>
      {children}
    </SalesPersonContext.Provider>
  );
};

export const useSalesperson = () => useContext(SalesPersonContext);
