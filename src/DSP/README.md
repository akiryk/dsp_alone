# Data Subscription Provider

The Data Subscription Provider creates a store of data.
The store is called the dataMap, `this.dataMap`, and it's an object in the following shape:

```js
{
  [NAME_OF_SUBSCRIPTION_KEY]: {
    subscriptionKey: NAME_OF_SUBSCRIPTION_KEY,
    groupName: GROUP_NAME,
    identifier: UNIQUE_IDENTIFIER, // e.g. sku.options
    dispatchSubscriptionUpdate(){}, // a function that calls back to a subscriber for updates
    status: 'registered', // or fetching, or error
    data: null, // null or an object with arbitrary fields
  },
  [NAME_OF_ANOTHER_SUBSCRIPTION_KEY]: {
    // same as above
  }
}
```

In practice, it's often more convenient to access a group's data using `this.dataGroupsMap`, which organizes subscribers by group.
