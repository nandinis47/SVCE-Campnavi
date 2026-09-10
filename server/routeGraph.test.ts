import { describe, expect, it } from "vitest";
import { AUTHORITATIVE_ROUTE_EDGES, AUTHORITATIVE_ROUTE_NODES } from "./authoritativeRouteGraph";
import { calculateShortestRoute } from "./routeGraphService";

const graph = {
  nodes: AUTHORITATIVE_ROUTE_NODES.map((node) => ({
    ...node,
    anchorId: node.anchorId ?? null,
    ambiguous: node.ambiguous ?? false,
    reviewNote: node.reviewNote ?? null,
    buildingSection: node.buildingSection ?? null,
    roomAnchorId: node.roomAnchorId ?? null,
    mainAnchorId: node.mainAnchorId ?? null,
  })),
  edges: AUTHORITATIVE_ROUTE_EDGES,
};

describe("server-side campus Dijkstra", () => {
  it("chooses the direct 35-step Main Gate to College Bus Parking route", () => {
    const route = calculateShortestRoute(graph, "main-gate", "college-bus-parking");

    expect(route?.nodeIds).toEqual(["main-gate", "college-bus-parking"]);
    expect(route?.totalSteps).toBe(35);
    expect(route?.edges[0]?.source).toBe("user-confirmed");
  });

  it("uses reversible graph edges for reverse navigation", () => {
    const route = calculateShortestRoute(graph, "college-bus-parking", "main-gate");

    expect(route?.nodeIds).toEqual(["college-bus-parking", "main-gate"]);
    expect(route?.totalSteps).toBe(35);
    expect(route?.edges[0]?.id).toBe("main-bus-parking-reverse");
  });

  it("preserves the confirmed Face Detection Junction to Amphitheatre route", () => {
    const route = calculateShortestRoute(graph, "face-detection-junction", "amphitheatre");

    expect(route?.nodeIds).toEqual(["face-detection-junction", "amphitheatre"]);
    expect(route?.totalSteps).toBe(63);
    expect(route?.directions[0]).toContain("63 steps straight");
  });

  it("follows the new Student Community Centre to Admission Section sequence", () => {
    const route = calculateShortestRoute(graph, "student-community-centre-main-area", "admission-section-counters");

    expect(route?.nodeIds).toEqual([
      "student-community-centre-main-area",
      "delegates-lounge-approach",
      "delegates-lounge-principal-chamber",
      "admission-section-start",
      "admission-section-counters",
    ]);
    expect(route?.totalSteps).toBe(31);
    expect(route?.directions.some((direction) => direction.includes("18 steps straight"))).toBe(true);
  });

  it("preserves the new Center Dome branches and review-only range", () => {
    const leftRoute = calculateShortestRoute(graph, "center-dome", "l-wing-1");
    const rightRoute = calculateShortestRoute(graph, "center-dome", "r-wing-1");
    const unresolvedRoute = calculateShortestRoute(graph, "center-dome", "route-xerox");

    expect(leftRoute?.totalSteps).toBe(18);
    expect(leftRoute?.edges[0]?.direction).toBe("left");
    expect(rightRoute?.totalSteps).toBe(18);
    expect(rightRoute?.edges[0]?.direction).toBe("right");
    expect(unresolvedRoute).toBeNull();
  });

  it("follows the new R Wing 1 laboratory sequence through EB122", () => {
    const route = calculateShortestRoute(graph, "r-wing-junction", "eb122ab");

    expect(route?.nodeIds).toEqual([
      "r-wing-junction",
      "r-wing-1-laboratory-block",
      "eb124ab1",
      "eb123ab",
      "eb122ab",
    ]);
    expect(route?.totalSteps).toBe(42);
  });

  it("does not traverse an edge whose source distance is unresolved", () => {
    const route = calculateShortestRoute(
      {
        nodes: [
          { id: "start", label: "Start", floor: "ground", kind: "location", anchorId: null, ambiguous: false, reviewNote: null, buildingSection: null, roomAnchorId: null, mainAnchorId: null },
          { id: "target", label: "Target", floor: "ground", kind: "location", anchorId: null, ambiguous: false, reviewNote: null, buildingSection: null, roomAnchorId: null, mainAnchorId: null },
        ],
        edges: [
          { id: "unresolved", from: "start", to: "target", steps: null, direction: "straight", source: "review-required", reversible: true },
        ],
      },
      "start",
      "target",
    );

    expect(route).toBeNull();
  });
});
