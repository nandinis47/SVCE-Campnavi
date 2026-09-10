export interface PlannerNode {
  id: string;
  label: string;
  anchorId?: string | null;
}

export function resolvePlannerNodes(remoteNodes: PlannerNode[] | undefined, fallbackNodes: PlannerNode[]) {
  if (remoteNodes && remoteNodes.length > 0) {
    return { nodes: remoteNodes, source: "database" as const };
  }
  return { nodes: fallbackNodes, source: "local-fallback" as const };
}
