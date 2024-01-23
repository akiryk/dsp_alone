import {
  REGISTERED,
  NOT_FOUND,
  ERROR,
  UNREGISTERED_GROUP_ERROR,
  MISSING_GROUP_FETCH_ERROR,
  MISSING_ID_GENERATOR_ERROR,
  LOGGER_MESSAGES,
  GROUP_FETCH_ERROR,
  GROUP_FETCH_STARTED
} from "../dataSubscriptionConstants";

/**
 * registerGroup
 * Return a function for registering a group of subscribers
 *
 * @param {string} groupName
 * @param {function} fetchItems - an async function for fetching items
 * @param {function} identifierGenerator - a function for creating an ID
 */
export function registerGroup({ groupName, fetchItems, identifierGenerator }) {
  if (!this.groupsMap[groupName]) {
    this.groups.push({
      groupName,
      fetchItems,
      identifierGenerator
    });
    this.groupsMap[groupName] = this.groups[this.groups.length - 1];
  }
}

/**
 * updateStatusOfItems
 *
 * a curried function that takes an object with groupName
 * and returns a function that takes a string representing the new state.
 * The returned function will change the status of every subscriber in the group.
 *
 * Note the regular function is needed so that `this` can be bound to the DataSubscriptionProvider class
 *
 * @param {string} groupName - the name of the group to which the items belong
 * @param {string} newState
 */
export function updateStatusOfItems({ groupName }) {
  // use an arrow function so that the `this` keyward refers to scope bound to containing function.
  return (newState) => {
    if (!this.groupsMap[groupName] || !this.dataGroupsMap[groupName]) {
      return;
    }
    this.dataGroupsMap[groupName].forEach((subscriber, index) => {
      this.dataGroupsMap[groupName][index].status = newState;
      this.updateSubscribers({
        groupName,
        identifier: subscriber.identifier
      });
    });
  };
}

/**
 * getGroupData
 *
 * Get data for every item in a group
 *
 * @param {string} groupName
 * @return {array} - an array of objects
 */
export function getGroupData({ groupName }) {
  return () => {
    if (!this.groupsMap[groupName]) {
      this.logger.info({
        message: LOGGER_MESSAGES.MISSING_GROUPS_MAP,
        additionalInformation: {
          groupName
        }
      });
      throw new Error(UNREGISTERED_GROUP_ERROR);
    }

    return this.dataGroupsMap[groupName]?.length > 0
      ? this.dataGroupsMap[groupName]
          .filter((item) => !!item.data)
          .map((item) => item.data)
      : [];
  };
}

/**
 * fetch
 *
 * Fetch data, add it to the store, and update subscribers
 * Note the regular function is needed so that `this` can be bound to the DataSubscriptionProvider class
 *
 * @param {string} groupName - the name of the group to which the items belong
 * @param {*} options - options used by the group's fetch function
 */
export function fetch({ groupName }) {
  // use an arrow function so that the `this` keyward refers to scope bound to containing function.
  return (options) => {
    const group = this.groupsMap[groupName];
    if (!group) {
      return Promise.reject({ error: UNREGISTERED_GROUP_ERROR });
    }
    if (!group.fetchItems) {
      return Promise.reject({ error: MISSING_GROUP_FETCH_ERROR });
    }
    if (!group.identifierGenerator) {
      return Promise.reject({ error: MISSING_ID_GENERATOR_ERROR });
    }
    // Set the group status to 'group-fetch-started' and begin fetching.
    // If fetch is successful, update group status in the addGroupDataToStore function
    this.groupsMap[groupName].status = GROUP_FETCH_STARTED;
    return group
      .fetchItems(options)
      .then((items) => {
        return this.addGroupDataToStore({ items, groupName });
      })
      .then((items) => {
        this.dataGroupsMap?.[groupName]?.forEach((item, index) => {
          if (item.status === REGISTERED) {
            this.dataGroupsMap[groupName][index].status = NOT_FOUND;
            this.updateSubscribers({
              groupName,
              identifier: this.dataGroupsMap[groupName][index].identifier
            });
          }
        });
        return items;
      })
      .catch((error) => {
        this.groupsMap[groupName].status = GROUP_FETCH_ERROR;
        this.dataGroupsMap?.[groupName]?.forEach((item, index) => {
          if (item.status === REGISTERED) {
            this.dataGroupsMap[groupName][index].status = ERROR;
            this.dataGroupsMap[groupName][index].error = error;
            this.updateSubscribers({
              groupName,
              identifier: this.dataGroupsMap[groupName][index].identifier
            });
          }
        });
      });
  };
}

// expose fetch's method for adding data to the store, which useful for consumers that don't need to fetch
export function addDataToStore({ groupName }) {
  return (items) => {
    const addedItems = this.addGroupDataToStore({ groupName, items });
    return Promise.resolve(addedItems);
  };
}

/**
 * getGroupActions
 * Return an object containing references to functions that can be used by a group of subscribers
 *
 * Note the regular function is needed so that `this` can be bound to the DataSubscriptionProvider class
 *
 * @param {string} groupName - the name of the group
 * @return {object} functions that can be used by the group
 */
export function getGroupActions({ groupName }) {
  return {
    fetch: this.fetch({ groupName }),
    getGroupData: this.getGroupData({ groupName }),
    addDataToStore: this.addDataToStore({ groupName })
  };
}
