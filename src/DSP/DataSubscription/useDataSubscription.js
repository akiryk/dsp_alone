import { useContext, useEffect } from "react";
import DataSubscriptionContext from "./DataSubscriptionContext";

const useDataSubscription = ({
  groupName,
  dispatchSubscriptionUpdate,
  identifier
}) => {
  const context = useContext(DataSubscriptionContext);

  useEffect(() => {
    const subscriptionId = context.subscribe({
      groupName,
      identifier,
      dispatchSubscriptionUpdate
    });
    return () => {
      context.unsubscribe(subscriptionId);
    };
    // We don't want this effect to re-run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemActions = context.getItemActions({ groupName });
  const groupActions = context.getGroupActions({ groupName });
  return {
    ...itemActions,
    ...groupActions
  };
};

export default useDataSubscription;
