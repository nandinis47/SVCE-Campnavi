import type { ShortestRoute } from "./routeGraph";

export function nextStudentGuidance(route: ShortestRoute | null, stepIndex: number, destinationLabel: string) {
  if (!route) return `I can guide you using only the documented campus route, but there is no confirmed connection to ${destinationLabel} yet.`;
  if (stepIndex >= route.directions.length) return `You have reached ${destinationLabel}. Nice work — you made it.`;
  return route.directions[stepIndex];
}

export function routeHandoffMessages(route: ShortestRoute, destinationLabel: string) {
  const intro = `Hey my friend, I’m here to guide you to reach your ${destinationLabel} faster.`;
  return { intro, firstStep: nextStudentGuidance(route, 0, destinationLabel) };
}

export function lostRouteResponse(route: ShortestRoute | null, stepIndex: number, destinationLabel: string) {
  return route
    ? `No worries. Use the mapped nodes around you as landmarks, then follow this documented instruction: ${nextStudentGuidance(route, stepIndex, destinationLabel)}`
    : `No worries. I do not have a confirmed route to ${destinationLabel}, so I will not guess. Please choose a documented destination or confirm your current node.`;
}
