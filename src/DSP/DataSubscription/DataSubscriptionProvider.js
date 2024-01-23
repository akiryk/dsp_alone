import React, { Component } from "react";
import PropTypes from "prop-types";
import { DataSubscriptionContextProvider } from "./DataSubscriptionContext";
import {
  getItemActions,
  subscribe,
  unsubscribe,
  updateStateOfOneItem,
  registerGroup,
  fetch,
  updateStatusOfItems,
  getItemData,
  getGroupData,
  getGroupActions,
  updateSubscribers,
  addDataToStore,
  addGroupDataToStore,
  updateItemIsFound
} from "./subscriptionMethods";

class DataSubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    logger: PropTypes.object.isRequired
  };

  shouldComponentUpdate() {
    /* istanbul ignore next: no need to test simple react lifecyle */
    return false;
  }

  // subscriptions is an array of objects representing items use the data subscription context
  subscriptions = [];
  // the subscriptionsMap is an object where keys are the named after subscriber keys, e.g. 'some-group::some-identifier'
  // and values are arrays comprised of numbers — the indices of subscribers in the subscriptions array, e.g, [0, 6];
  subscriptionsMap = {};

  // groups is an array of objects representing groups of subscribers that share methods for fetching data
  groups = [];
  groupsMap = {};

  // data is an array of objects representing state for all subscribers
  data = [];
  dataMap = {};

  // dataGroupsMap is an object whose keys are the names of registered groups and whose
  // values are arrays with information about every subscriber in each group.
  // dataGroupsMap can be used to update every subscriber in a group at once
  dataGroupsMap = {};

  // Public methods shared through context used by individual items
  subscribe = subscribe.bind(this);
  unsubscribe = unsubscribe.bind(this);
  updateStateOfOneItem = updateStateOfOneItem.bind(this);
  getItemActions = getItemActions.bind(this);
  updateItemIsFound = updateItemIsFound.bind(this);

  // Public methods shared through context and used by groups
  registerGroup = registerGroup.bind(this);
  updateStatusOfItems = updateStatusOfItems.bind(this);
  getGroupData = getGroupData.bind(this);
  getItemData = getItemData.bind(this);
  fetch = fetch.bind(this);
  addDataToStore = addDataToStore.bind(this);
  getGroupActions = getGroupActions.bind(this);

  // Private methods not made available through context or through getItemActions or getGroupActions
  updateSubscribers = updateSubscribers.bind(this);
  addGroupDataToStore = addGroupDataToStore.bind(this);

  value = {
    registerGroup: this.registerGroup,
    subscribe: this.subscribe,
    unsubscribe: this.unsubscribe,
    getGroupActions: this.getGroupActions,
    getItemActions: this.getItemActions
  };

  render() {
    return (
      <DataSubscriptionContextProvider value={this.value}>
        {this.props.children}
      </DataSubscriptionContextProvider>
    );
  }
}

export default DataSubscriptionProvider;
