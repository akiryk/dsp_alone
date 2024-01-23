import { createContext, useContext } from "react";

const DataSubscriptionContext = createContext();

const {
  Provider: DataSubscriptionContextProvider,
  Consumer: DataSubscriptionContextConsumer
} = DataSubscriptionContext;

DataSubscriptionContext.displayName = "DataSubscriptionContext";

export default DataSubscriptionContext;
export { DataSubscriptionContextProvider, DataSubscriptionContextConsumer };

// export a convenience method for accessing DataSubscriptionContext
export const useDataSubscriptionContext = () => {
  const libContext = useContext(DataSubscriptionContext);

  if (!libContext) {
    throw new Error(
      "'useDataSubscriptionContext' must be contained by 'DataSubscriptionContext.Provider'"
    );
  }

  return libContext;
};
