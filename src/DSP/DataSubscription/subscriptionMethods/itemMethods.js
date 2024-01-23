import {
  DEFAULT_GROUP,
  FOUND,
  GROUP_FETCH_ERROR,
  GROUP_FETCH_SUCCESS,
  NOT_FOUND,
  ERROR,
  REGISTERED
} from "../dataSubscriptionConstants";
import { getSubscriptionKey } from "./privateMethods";

/**
 * Subscribe
 * Subscribe only adds subscribers and updates them once they are added
 *
 * @param {string} groupName
 * @param {string} identifier
 * @param {function} dispatchSubscriptionUpdate - to be invoked by the Data Provider when updating the subscriber with new data
 * @param {object} data - data associated with the subscriber
 * @param {boolean} linkExistingSubscription
 */
export function subscribe({
  groupName: name,
  identifier: id,
  dispatchSubscriptionUpdate
}) {
  const groupName = name || DEFAULT_GROUP;
  const identifier = id || window.performance.now();
  const subscriptionKey = getSubscriptionKey({
    groupName,
    identifier
  });
  const subscriptionId = this.subscriptions.length;
  const groupFetchStatus = this.groupsMap[groupName]?.status;
  this.subscriptions.push({
    subscriptionKey,
    groupName,
    identifier,
    dispatchSubscriptionUpdate
  });
  this.subscriptionsMap[subscriptionKey] = [
    ...(this.subscriptionsMap[subscriptionKey] || []),
    subscriptionId
  ];
  // If this item does not already have an entry in the store (that is, the dataMap), we should add it.
  // There are three reasons an item won't be in the store, and we should set its status accordingly:
  // 1. data has been fetched, but this item wasn't included in that data (status should be "not-found")
  // 2. there was error fetching the data (status should be "error")
  // 3. data has not yet been fetched (status should be "registered")
  if (!this.dataMap[subscriptionKey]) {
    let status;
    if (groupFetchStatus === GROUP_FETCH_SUCCESS) {
      // Data was fetched; this item isn't in the store because it wasn't found.
      status = NOT_FOUND;
    } else if (groupFetchStatus === GROUP_FETCH_ERROR) {
      // Data fetching failed for some reason; set status to 'error'
      status = ERROR;
    } else {
      // Fetching is either underway or hasn't yet started; set status to 'registered'
      status = REGISTERED;
    }
    const dataLength = this.data.push({
      subscriptionKey,
      groupName,
      identifier,
      status,
      data: null
    });
    this.dataMap[subscriptionKey] = this.data[dataLength - 1];
    this.dataGroupsMap[groupName] = [
      ...(this.dataGroupsMap[groupName] || []),
      this.data[dataLength - 1]
    ];
  }
  this.updateSubscribers({ groupName, identifier });
  return subscriptionId;
}

/**
 * unsubscribe
 *
 * @param {number} subscriptionId - the index of the subscribed item
 */
export function unsubscribe(subscriptionId) {
  const key = this.subscriptions[subscriptionId]?.subscriptionKey;
  const indexOfIdInMap = this.subscriptionsMap[key]?.indexOf(subscriptionId);
  if (key && indexOfIdInMap !== -1) {
    this.subscriptionsMap[key] = [
      ...this.subscriptionsMap[key].slice(0, indexOfIdInMap),
      ...this.subscriptionsMap[key].slice(indexOfIdInMap + 1)
    ];
  }
  // keep the null item in the array so that indices for other items remains as they have been
  // i.e. [itemAt0, null, itemAt2, etc]
  this.subscriptions[subscriptionId] = null;
}

/**
 * Update state for a subscriber
 *
 * This function is called by a subscriber when the data changes. This is how
 * a subscriber can mutate its state. Note that only the data object should change,
 * not 'status' or any other property of the dataMap.
 *
 * @param {string} - groupName
 * @param {string} - identifier
 * @param {object} - data.
 */
export function updateStateOfOneItem({ groupName }) {
  return ({ identifier, data = null }) => {
    const dataMap = this.dataMap[`${groupName}::${identifier}`];
    if (!dataMap) {
      // if the group isn't registered or the identifier isn't subscribed,
      // the dataMap key won't exist and we should just return
      return;
    }
    if (data !== null) {
      dataMap.data = {
        ...dataMap.data,
        ...data
      };
    }
    this.updateSubscribers({
      groupName,
      identifier
    });
  };
}

/**
 * Update subscriber status
 *
 * This function is called by a subscriber when it is added to or removed from a group and needs
 * its status changed to FOUND or to NOT_FOUND.
 *
 * @param {string} - groupName
 * @param {string} - identifier
 */
export function updateItemIsFound({ groupName }) {
  return ({ identifier, isFound = true }) => {
    const dataMap = this.dataMap[`${groupName}::${identifier}`];
    if (!dataMap) {
      // if the group isn't registered or the identifier isn't subscribed,
      // the dataMap key won't exist and we should just return
      return;
    }
    dataMap.status = isFound ? FOUND : NOT_FOUND;
    this.updateSubscribers({
      groupName,
      identifier
    });
  };
}

/**
 * getItemData returns data for a specified item
 *
 * @param {string} identifier
 * @return {object} data object for a given item
 */
export function getItemData({ groupName }) {
  return ({ identifier }) =>
    this.dataMap[`${groupName}::${identifier}`]
      ? this.dataMap[`${groupName}::${identifier}`].data
      : null;
}

/**
 * getItemActions
 * Return an object containing references to functions that can be used by a single subsriber
 *
 * @param {string} groupName - the name of the group
 * @return {object} functions that can be used by the individual subscriber
 */
export function getItemActions({ groupName }) {
  return {
    getItemData: this.getItemData({ groupName }),
    updateStateOfOneItem: this.updateStateOfOneItem({ groupName }),
    updateItemIsFound: this.updateItemIsFound({ groupName })
  };
}
