/**
 * RoutePanel — document-faithful route controls with integrated current position.
 * Design: Satellite Explorer — compact bottom-left glass navigation drawer.
 */
import { ArrowRight, Footprints, LocateFixed, MapPin, Navigation, Route as RouteIcon, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { MISSING_ROUTE_CONNECTIONS, ROUTE_NODES, type ShortestRoute } from "@/lib/routeGraph";
import type { GeolocationStatus, CampusGeoPosition } from "@/hooks/useCampusGeolocation";

interface RoutePanelProps {
  startId: string;
  endId: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  route: ShortestRoute | null;
  routeSequence: string[];
  routeRequested: boolean;
  onCalculate: () => void;
  onClear: () => void;
  locationStatus: GeolocationStatus;
  locationPosition: CampusGeoPosition | null;
  locationError: string | null;
  onRequestLocation: () => void;
  routeNodes: Array<{ id: string; label: string; anchorId?: string | null }>;
  routeLoading: boolean;
  routeError: string | null;
  routeNodesLoading: boolean;
  routeNodesError: string | null;
}

const statusLabel: Record<GeolocationStatus, string> = {
  idle: "Location not requested",
  requesting: "Checking outdoor position…",
  active: "GPS position received",
  denied: "Location permission denied",
  error: "Location unavailable",
  unsupported: "GPS unavailable in this browser",
};

export default function RoutePanel({ startId, endId, onStartChange, onEndChange, route, routeSequence, routeRequested, onCalculate, onClear, locationStatus, locationPosition, locationError, onRequestLocation, routeNodes, routeLoading, routeError, routeNodesLoading, routeNodesError }: RoutePanelProps) {
  const anchoredNodes = routeNodes.filter((node) => node.anchorId);
  return (
    <div className="fixed left-4 bottom-4 z-40 w-[min(390px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/90 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2"><RouteIcon className="h-4 w-4 text-cyan-300" /><span className="text-sm font-semibold tracking-wide">Campus Route Planner</span></div>
        <button onClick={onClear} className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Close route planner"><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3 overflow-y-auto p-4 scrollbar-thin">
        <section className="rounded-xl border border-blue-300/20 bg-blue-300/5 p-3">
          <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/20"><LocateFixed className="h-4 w-4 text-blue-300" /></span><div><p className="text-xs font-semibold">Current position</p><p className="text-[10px] text-white/45">{statusLabel[locationStatus]}</p></div></div><button onClick={onRequestLocation} className="rounded-lg border border-blue-300/30 bg-blue-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-blue-100 hover:bg-blue-400/20" disabled={locationStatus === "requesting"}>{locationStatus === "requesting" ? "Locating…" : "Use my location"}</button></div>
          {locationPosition && <p className="mb-2 text-[10px] text-blue-100/60">Outdoor accuracy ±{Math.round(locationPosition.accuracy)} m. GPS does not provide a reliable indoor floor position.</p>}
          {locationError && <p className="mb-2 flex items-start gap-2 text-[10px] leading-relaxed text-amber-200/80"><ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" />{locationError}</p>}
          <label className="block"><span className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40"><Navigation className="h-3 w-3" />Confirm block / floor if unavailable</span><select value={startId} onChange={(event) => onStartChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none focus:border-blue-300/60">{anchoredNodes.map((node) => <option key={node.id} value={node.id} className="bg-slate-900">{node.label}</option>)}</select></label>
          <p className="mt-2 text-[10px] leading-relaxed text-white/45">This confirmed position is used automatically as the route Start.</p>
        </section>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <label className="min-w-0"><span className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">Start · choose a node</span><select value={startId} onChange={(event) => onStartChange(event.target.value)} className="w-full rounded-lg border border-blue-300/20 bg-blue-300/10 px-2 py-2 text-xs text-blue-50 outline-none focus:border-blue-300/60">{routeNodes.map((node) => <option key={node.id} value={node.id} className="bg-slate-900">{node.label}</option>)}</select></label>
          <ArrowRight className="mb-2 h-4 w-4 text-cyan-300/70" />
          <label className="min-w-0"><span className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">Destination</span><select value={endId} onChange={(event) => onEndChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-white outline-none focus:border-cyan-300/60">{routeNodes.map((node) => <option key={node.id} value={node.id} className="bg-slate-900">{node.label}</option>)}</select></label>
        </div>
        <button type="button" onClick={onCalculate} disabled={routeLoading || routeNodesLoading} className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-3 py-2.5 text-xs font-semibold tracking-wide text-cyan-100 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-200/70 hover:bg-cyan-300/25 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"><RouteIcon className="h-3.5 w-3.5" />{routeLoading ? "Calculating…" : "Find Route"}</button>
        {routeNodesLoading && <p className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 px-3 py-2 text-[10px] text-cyan-100/75">Loading navigation nodes from the campus database…</p>}
        {routeNodesError && <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[10px] leading-relaxed text-amber-100/80">The database node list is unavailable. The existing local node list is being used as a safe fallback; route calculation may still require the backend.</p>}
        <details className="rounded-xl border border-amber-300/20 bg-amber-300/5"><summary className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-amber-200">Graph review · {MISSING_ROUTE_CONNECTIONS.length} missing measurements</summary><div className="max-h-56 space-y-2 overflow-y-auto border-t border-amber-300/10 px-3 py-2">{MISSING_ROUTE_CONNECTIONS.map((connection) => { const from = ROUTE_NODES.find((node) => node.id === connection.from)?.label ?? connection.from; const to = ROUTE_NODES.find((node) => node.id === connection.to)?.label ?? connection.to; return <div key={connection.edgeId} className="rounded-lg border border-white/10 bg-black/10 p-2 text-[10px] leading-relaxed text-white/70"><p className="font-semibold text-amber-100">{from} → {to}</p><p>Direction: <span className="text-white/90">{connection.direction}</span></p><p>Location: {connection.routePosition}</p><p>Required: {connection.requiredConfirmation}</p></div>; })}</div></details>
        {routeLoading ? <p className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 px-3 py-2 text-xs text-cyan-100/75">Calculating the shortest documented route…</p> : routeError ? <p className="rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs leading-relaxed text-red-100/85">The route service could not be reached. Please try Find Route again. This is a backend error, not a confirmed graph disconnection.</p> : route ? <>
          <div className="flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2"><Footprints className="h-4 w-4 text-cyan-200" /><div><p className="text-sm font-semibold text-cyan-100">{route.totalSteps} documented steps</p><p className="text-[10px] text-white/50">Shortest weighted route from the source graph</p></div></div>
          <div className="space-y-2"><p className="text-[10px] uppercase tracking-wider text-white/40">Route sequence</p><div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2"><ol className="space-y-1">{routeSequence.map((nodeId, index) => { const node = routeNodes.find((candidate) => candidate.id === nodeId); return <li key={`${nodeId}-${index}`} className="flex items-start gap-2 text-[11px] leading-relaxed text-white/75"><span className="mt-0.5 min-w-4 text-[10px] font-semibold text-cyan-300/75">{index + 1}</span><span>{node?.label ?? nodeId}</span></li>; })}</ol></div></div>
          <div className="space-y-2"><p className="text-[10px] uppercase tracking-wider text-white/40">Turn-by-turn directions</p>{route.directions.length ? route.directions.map((direction) => <p key={direction} className="text-xs leading-relaxed text-white/75">{direction}</p>) : <p className="text-xs text-white/50">Start and destination are the same node.</p>}</div>
          {route.reviewFlags.length > 0 && <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3"><div className="mb-1 flex items-center gap-2 text-amber-200"><TriangleAlert className="h-3.5 w-3.5" /><span className="text-[10px] font-semibold uppercase tracking-wider">Review required</span></div>{route.reviewFlags.slice(0, 5).map((flag) => <p key={flag} className="text-[10px] leading-relaxed text-amber-100/75">{flag}</p>)}</div>}
          {route.nodeIds.some((id) => !ROUTE_NODES.find((node) => node.id === id)?.anchorId) && <div className="flex items-start gap-2 text-[10px] text-white/45"><MapPin className="mt-0.5 h-3 w-3 shrink-0" />Some documented rooms or junctions have no confirmed 3D anchor; the highlighted line shows only confirmed campus anchors.</div>}
        </> : <p className="text-xs leading-relaxed text-white/50">{routeRequested ? "No document-supported route connects these nodes. No shortcut or guessed connection is used." : "Choose a destination, confirm your current position if needed, then select Find Route."}</p>}
      </div>
    </div>
  );
}
