import { describe, expect, it } from "vitest";
import { lostRouteResponse, nextStudentGuidance, routeHandoffMessages } from "./studentAIGuidance";
import type { ShortestRoute } from "./routeGraph";

const route: ShortestRoute = {
  nodeIds: ["main-gate", "college-bus-parking"],
  edges: [],
  totalSteps: 35,
  directions: ["1. From Main Gate, move 35 steps straight to reach College Bus Parking. [user-confirmed]"],
  reviewFlags: [],
};

describe("Student AI graph-backed guidance", () => {
  it("hands off a calculated route using the destination and first documented instruction", () => {
    const handoff = routeHandoffMessages(route, "College Bus Parking");
    expect(handoff.intro).toContain("College Bus Parking");
    expect(handoff.firstStep).toContain("35 steps straight");
  });

  it("advances only through documented route directions and announces arrival", () => {
    expect(nextStudentGuidance(route, 0, "College Bus Parking")).toContain("35 steps straight");
    expect(nextStudentGuidance(route, 1, "College Bus Parking")).toContain("You have reached");
  });

  it("does not invent guidance when the backend returns no route", () => {
    expect(lostRouteResponse(null, 0, "R Wing 2")).toContain("will not guess");
  });
});
