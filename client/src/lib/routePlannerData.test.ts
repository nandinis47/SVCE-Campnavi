import { describe, expect, it } from "vitest";
import { resolvePlannerNodes } from "./routePlannerData";

const fallback = [{ id: "main-gate", label: "Main Gate", anchorId: "main-gate" }];

describe("resolvePlannerNodes", () => {
  it("uses database nodes when the backend returns a non-empty list", () => {
    const remote = [{ id: "r-wing-2", label: "R Wing 2", anchorId: "r-wing-2" }];
    expect(resolvePlannerNodes(remote, fallback)).toEqual({ nodes: remote, source: "database" });
  });

  it("uses the existing local nodes when the backend returns no usable list", () => {
    expect(resolvePlannerNodes(undefined, fallback)).toEqual({ nodes: fallback, source: "local-fallback" });
    expect(resolvePlannerNodes([], fallback)).toEqual({ nodes: fallback, source: "local-fallback" });
  });
});
