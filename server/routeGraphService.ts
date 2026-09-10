import { eq } from "drizzle-orm";
import { routeEdges, routeNodes } from "../drizzle/schema";
import type { RouteDirection, RouteTransition } from "./authoritativeRouteGraph";
import { getDb } from "./db";

export interface DbRouteNode {
  id: string;
  label: string;
  floor: string;
  kind: string;
  anchorId: string | null;
  ambiguous: boolean;
  reviewNote: string | null;
  buildingSection: string | null;
  roomAnchorId: string | null;
  mainAnchorId: string | null;
}

export interface DbRouteEdge {
  id: string;
  from: string;
  to: string;
  steps: number | null;
  direction: RouteDirection;
  transition?: RouteTransition;
  source: string;
  reversible: boolean;
}

export interface DbShortestRoute {
  nodeIds: string[];
  edges: DbRouteEdge[];
  totalSteps: number;
  directions: string[];
  reviewFlags: string[];
}

function toNode(row: typeof routeNodes.$inferSelect): DbRouteNode {
  return {
    id: row.id,
    label: row.label,
    floor: row.floor,
    kind: row.kind,
    anchorId: row.anchorId ?? null,
    ambiguous: row.ambiguous,
    reviewNote: row.reviewNote ?? null,
    buildingSection: row.buildingSection ?? null,
    roomAnchorId: row.roomAnchorId ?? null,
    mainAnchorId: row.mainAnchorId ?? null,
  };
}

function toEdge(row: typeof routeEdges.$inferSelect): DbRouteEdge {
  return {
    id: row.id,
    from: row.fromNodeId,
    to: row.toNodeId,
    steps: row.steps,
    direction: row.direction,
    transition: row.transition ?? undefined,
    source: row.source,
    reversible: row.reversible,
  };
}

export async function loadRouteGraph() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  const [nodeRows, edgeRows] = await Promise.all([
    db.select().from(routeNodes),
    db.select().from(routeEdges),
  ]);
  return {
    nodes: nodeRows.map(toNode),
    edges: edgeRows.map(toEdge),
  };
}

function expandEdges(edges: DbRouteEdge[]) {
  const byNode = new Map<string, DbRouteEdge[]>();
  for (const routeEdge of edges) {
    const from = byNode.get(routeEdge.from) ?? [];
    from.push(routeEdge);
    byNode.set(routeEdge.from, from);
    if (routeEdge.reversible) {
      const to = byNode.get(routeEdge.to) ?? [];
      to.push({
        ...routeEdge,
        id: `${routeEdge.id}-reverse`,
        from: routeEdge.to,
        to: routeEdge.from,
      });
      byNode.set(routeEdge.to, to);
    }
  }
  return byNode;
}

export function calculateShortestRoute(
  graph: { nodes: DbRouteNode[]; edges: DbRouteEdge[] },
  startId: string,
  endId: string,
): DbShortestRoute | null {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  if (!nodeById.has(startId) || !nodeById.has(endId)) return null;

  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; edge: DbRouteEdge }>();
  const unvisited = new Set(graph.nodes.map((node) => node.id));
  const edgesByNode = expandEdges(graph.edges);

  for (const node of graph.nodes) distances.set(node.id, Number.POSITIVE_INFINITY);
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let current: string | undefined;
    let best = Number.POSITIVE_INFINITY;
    for (const candidate of Array.from(unvisited)) {
      const distance = distances.get(candidate) ?? Number.POSITIVE_INFINITY;
      if (distance < best) {
        best = distance;
        current = candidate;
      }
    }
    if (!current || best === Number.POSITIVE_INFINITY) break;
    unvisited.delete(current);
    if (current === endId) break;

    for (const edge of edgesByNode.get(current) ?? []) {
      if (!unvisited.has(edge.to) || edge.steps === null) continue;
      const candidateDistance = best + edge.steps;
      if (candidateDistance < (distances.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(edge.to, candidateDistance);
        previous.set(edge.to, { nodeId: current, edge });
      }
    }
  }

  if (!previous.has(endId) && startId !== endId) return null;

  const nodeIds: string[] = [endId];
  const edges: DbRouteEdge[] = [];
  let cursor = endId;
  while (cursor !== startId) {
    const step = previous.get(cursor);
    if (!step) return null;
    edges.unshift(step.edge);
    nodeIds.unshift(step.nodeId);
    cursor = step.nodeId;
  }

  const reviewFlags = nodeIds
    .map((id) => nodeById.get(id))
    .filter((node): node is DbRouteNode => Boolean(node?.ambiguous))
    .map((node) => `${node.label}: ${node.reviewNote ?? "Source wording requires review."}`);

  const directions = edges.map((routeEdge, index) => {
    const from = nodeById.get(routeEdge.from)?.label ?? routeEdge.from;
    const to = nodeById.get(routeEdge.to)?.label ?? routeEdge.to;
    const transition = routeEdge.transition ? ` via ${routeEdge.transition}` : "";
    return `${index + 1}. From ${from}, move ${routeEdge.steps ?? "an unstated distance"} steps ${routeEdge.direction}${transition} to reach ${to}. [${routeEdge.source}]`;
  });

  return {
    nodeIds,
    edges,
    totalSteps: distances.get(endId) ?? 0,
    directions,
    reviewFlags,
  };
}

export async function findShortestRouteFromDatabase(startId: string, endId: string) {
  return calculateShortestRoute(await loadRouteGraph(), startId, endId);
}

export async function listRouteNodes() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  const rows = await db.select().from(routeNodes);
  return rows.map(toNode);
}

export async function getRouteNodeById(id: string) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  const rows = await db.select().from(routeNodes).where(eq(routeNodes.id, id)).limit(1);
  return rows[0] ? toNode(rows[0]) : null;
}
