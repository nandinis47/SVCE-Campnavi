export interface PlannerNode {
  id: string;
  label: string;
  anchorId?: string | null;
}

export function resolvePlannerNodes(remoteNodes: PlannerNode[] | undefined, fallbackNodes: PlannerNode[]) {
  // Always use fallback nodes to ensure all 218 rooms/locations are available
  // Database may have incomplete data, so we prioritize the complete local list
  return { nodes: fallbackNodes, source: "local-fallback" as const };
}
