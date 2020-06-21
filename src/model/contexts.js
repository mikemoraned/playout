import React from "react";
import { useLocalStore } from "mobx-react";

export const StoreContext = React.createContext(null);

export const StoreProvider = ({ initialStore, children }) => {
  const mobXStore = useLocalStore(() => initialStore);

  return (
    <StoreContext.Provider value={{ store: mobXStore }}>
      {children}
    </StoreContext.Provider>
  );
};
