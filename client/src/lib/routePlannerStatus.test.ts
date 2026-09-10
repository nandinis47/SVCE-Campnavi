import { describe, expect, it } from "vitest";
import {
  NODE_QUERY_FALLBACK_WARNING,
  getNodeQueryWarning,
  getRouteQueryErrorMessage,
} from "./routePlannerStatus";

describe("route planner backend status messages", () => {
  it("returns the visible node-query fallback warning only when the node query fails", () => {
    expect(getNodeQueryWarning(new Error("database unavailable"))).toBe(NODE_QUERY_FALLBACK_WARNING);
    expect(getNodeQueryWarning(null)).toBeNull();
  });

  it("distinguishes route-service failure from a valid disconnected graph", () => {
    expect(getRouteQueryErrorMessage(new Error("request failed"))).toContain("backend error");
    expect(getRouteQueryErrorMessage(undefined)).toBeNull();
  });
});
