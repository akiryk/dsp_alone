# Changelog

Propose changint how we handle the status property. Discourage or even prevent consumers from changing status — it should be only for internal use. That way, we can know if an item is registered and waiting; fetching; found; or not found.

- In groupMethods fetch, set status to NOT_FOUND if it isn't FOUND
- updateStatusOfItems - only update status if not already FOUND or NOT_FOUND
- in private methods addGroupDataToStore, always set status to FOUND when found.
