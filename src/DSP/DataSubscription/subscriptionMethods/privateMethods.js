import {
  FOUND,
  REGISTERED,
  GROUP_FETCH_SUCCESS
} from "../dataSubscriptionConstants";

/**
 * Get a subscription key based on groupName and indentifier
 * This function is used only internally, not shared through context.
 *
 * @param {Object} obj
 * @param {string} obj.groupName
 * @param {string} obj.identifier
 * @returns {string}
 */
export const getSubscriptionKey = ({ groupName, identifier }) =>
  `${groupName}::${identifier}`;

/**
 * updateSubscribers
 *
 * Update an individual subscriber by invoking its updater function and passing
 * in the new data. If there are multiple instances of the same subscriber (e.g.
 * the same product is displayed in different views), this will loop through and
 * update them all.
 *
 * @param {Object} obj
 * @param {string} obj.groupName
 * @param {string} obj.identifier
 */
export function updateSubscribers({ groupName, identifier }) {
  const subscriptionKey = getSubscriptionKey({ groupName, identifier });
  if (
    typeof this.subscriptionsMap[subscriptionKey] === "undefined" ||
    this.subscriptionsMap[subscriptionKey] === null
  ) {
    // If the group or item was never registered, it will be undefined.
    // If it was registered and then unsubscribed, it will be nullher
    // Either way, the subscriber can't be found and we should return
    return;
  }
  const item = this.dataMap[subscriptionKey];

  // Loop through every item subscribed to the same data.
  // This enables two or more of the same item on a page to be in sync
  this.subscriptionsMap[subscriptionKey].forEach((subscriptionId) => {
    if (
      this.subscriptions[subscriptionId] &&
      this.subscriptions[subscriptionId].dispatchSubscriptionUpdate
    ) {
      this.subscriptions[subscriptionId].dispatchSubscriptionUpdate(item);
    }
  });
}

export function addGroupDataToStore({ items, groupName }) {
  const group = this.groupsMap[groupName];
  items.forEach((item) => {
    const identifier = group.identifierGenerator(item);
    const subscriptionKey = getSubscriptionKey({
      groupName,
      identifier
    });
    if (!this.dataMap[subscriptionKey]) {
      this.data.push({
        subscriptionKey,
        groupName,
        identifier,
        status: FOUND
      });
      this.dataMap[subscriptionKey] = this.data[this.data.length - 1];
      this.dataGroupsMap[groupName] = [
        ...(this.dataGroupsMap[groupName] || []),
        this.data[this.data.length - 1]
      ];
      // if item subscribes before fetch, there will already be a dataMap[subscriptionKey]
    } else if (this.dataMap[subscriptionKey].status === REGISTERED) {
      this.dataMap[subscriptionKey].status = FOUND;
    }

    const itemDataMap = this.dataMap[subscriptionKey];
    itemDataMap.data = {
      ...itemDataMap.data,
      ...item
    };
    this.updateSubscribers({
      groupName,
      identifier
    });
  });
  this.groupsMap[groupName].status = GROUP_FETCH_SUCCESS;
  return items;
}
