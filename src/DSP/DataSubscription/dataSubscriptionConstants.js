// Item statuses
export const REGISTERED = "registered";
export const FOUND = "found";
export const NOT_FOUND = "not-found";
export const ERROR = "error";
// Group statuses
export const GROUP_FETCH_ERROR = "GROUP_FETCH_ERROR";
export const GROUP_FETCH_SUCCESS = "GROUP_FETCH_SUCCESS";
export const GROUP_FETCH_STARTED = "GROUP_FETCH_STARTED";

export const DEFAULT_GROUP = "default-group";

// error messages
export const MISSING_DISPATCH_UPDATE_ERROR =
  "must provide a dispatchSubscriptionUpdate function when subscribing to DataSubscriptionProvider scope";
export const UNREGISTERED_GROUP_ERROR =
  "cannot use group actions for an unregistered group";
export const MISSING_GROUP_FETCH_ERROR =
  "group is missing group fetch function";
export const MISSING_ID_GENERATOR_ERROR =
  "group is missing an identifier generator function";

export const LOGGER_MESSAGES = {
  MISSING_GROUPS_MAP:
    "[DATA-SUBSCRIPTION-PROVIDER] Cannot get group data because group is not in groupsMap",
  GROUP_FETCH_FAILED: "[DATA-SUBSCRIPTION-PROVIDER] Group fetch failed",
  FETCH_FAILED_AND_MISSING_DATA_MAP:
    "[DATA-SUBSCRIPTION-PROVIDER] Group fetch failed froup group missing from dataGroupsMap"
};

const constants = {
  REGISTERED,
  FOUND,
  NOT_FOUND,
  ERROR,
  DEFAULT_GROUP
};

export default constants;
