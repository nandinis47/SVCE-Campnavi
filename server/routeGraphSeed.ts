import { count } from "drizzle-orm";
import { routeEdges, routeNodes } from "../drizzle/schema";
import { AUTHORITATIVE_ROUTE_EDGES, AUTHORITATIVE_ROUTE_NODES } from "./authoritativeRouteGraph";
import { getDb } from "./db";

export async function seedAuthoritativeRouteGraph() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");

  const [{ nodeCount: previousNodeCount }] = await db.select({ nodeCount: count() }).from(routeNodes);
  const [{ edgeCount: previousEdgeCount }] = await db.select({ edgeCount: count() }).from(routeEdges);
  await db.transaction(async (tx) => {
    // These tables contain only the derived authoritative graph, so refresh both
    // tables atomically to remove stale route IDs while preserving user data.
    await tx.delete(routeEdges);
    await tx.delete(routeNodes);

    await tx.insert(routeNodes).values(
    AUTHORITATIVE_ROUTE_NODES.map((node) => ({
      id: node.id,
      label: node.label,
      floor: node.floor,
      kind: node.kind,
      anchorId: node.anchorId,
      ambiguous: node.ambiguous ?? false,
      reviewNote: node.reviewNote,
      buildingSection: node.buildingSection,
      roomAnchorId: node.roomAnchorId,
      mainAnchorId: node.mainAnchorId,
    })),
    );

    await tx.insert(routeEdges).values(
    AUTHORITATIVE_ROUTE_EDGES.map((edge) => ({
      id: edge.id,
      fromNodeId: edge.from,
      toNodeId: edge.to,
      steps: edge.steps,
      direction: edge.direction,
      transition: edge.transition,
      source: edge.source,
      reversible: edge.reversible,
    })),
    );
  });

  return {
    seeded: true,
    replaced: previousNodeCount > 0 || previousEdgeCount > 0,
    nodeCount: AUTHORITATIVE_ROUTE_NODES.length,
    edgeCount: AUTHORITATIVE_ROUTE_EDGES.length,
  };
}
