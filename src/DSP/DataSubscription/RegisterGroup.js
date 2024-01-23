import { useEffect, useContext } from "react";
import DataSubscriptionContext from "./DataSubscriptionContext";

/**
 * RegisterGroup - register a group of subscribers to the DataSubscribptionProvider
 *
 * @param {Object} obj
 * @param {string} obj.groupName - the name of the group
 * @param {function} obj.fetchItems - a function that fetches more than one item
 * @param {function} obj.identifierGenerator - a function that returns a unique identifier for an individual subscriber
 */
const RegisterGroup = ({ groupName, fetchItems, identifierGenerator }) => {
  const context = useContext(DataSubscriptionContext);
  useEffect(() => {
    context.registerGroup({
      groupName,
      fetchItems,
      identifierGenerator
    });
  }, [groupName, fetchItems, identifierGenerator, context]);

  return null;
};

export default RegisterGroup;
