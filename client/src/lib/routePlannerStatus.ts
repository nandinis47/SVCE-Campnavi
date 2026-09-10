export const NODE_QUERY_FALLBACK_WARNING =
  "The database node list is unavailable. The existing local node list is being used as a safe fallback; route calculation may still require the backend.";

export function getNodeQueryWarning(nodeQueryError: unknown) {
  return nodeQueryError ? NODE_QUERY_FALLBACK_WARNING : null;
}

export function getRouteQueryErrorMessage(routeQueryError: unknown) {
  return routeQueryError
    ? "The route service could not be reached. Please try Find Route again. This is a backend error, not a confirmed graph disconnection."
    : null;
}
