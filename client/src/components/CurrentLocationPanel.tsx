/**
 * CurrentLocationPanel — Google Maps-like current-position controls.
 * Design: Satellite Explorer — blue-dot status with explicit indoor confirmation.
 */
import { LocateFixed, Navigation, ShieldAlert } from "lucide-react";
import { ROUTE_NODES } from "@/lib/routeGraph";
import type { GeolocationStatus, CampusGeoPosition } from "@/hooks/useCampusGeolocation";

interface CurrentLocationPanelProps {
  status: GeolocationStatus;
  position: CampusGeoPosition | null;
  error: string | null;
  currentNodeId: string;
  onRequestLocation: () => void;
  onManualNodeChange: (nodeId: string) => void;
}

const anchoredNodes = ROUTE_NODES.filter((node) => node.anchorId);
const statusLabel: Record<GeolocationStatus, string> = {
  idle: "Location not requested",
  requesting: "Checking outdoor position…",
  active: "GPS position received",
  denied: "Location permission denied",
  error: "Location unavailable",
  unsupported: "GPS unavailable in this browser",
};

export default function CurrentLocationPanel({ status, position, error, currentNodeId, onRequestLocation, onManualNodeChange }: CurrentLocationPanelProps) {
  return (
    <div className="fixed left-4 bottom-4 z-40 w-[min(330px,calc(100vw-2rem))] rounded-2xl border border-blue-300/20 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/20"><LocateFixed className="h-4 w-4 text-blue-300" /></span><div><p className="text-sm font-semibold">Current position</p><p className="text-[10px] text-white/45">{statusLabel[status]}</p></div></div><button onClick={onRequestLocation} className="rounded-lg border border-blue-300/30 bg-blue-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-blue-100 hover:bg-blue-400/20" disabled={status === "requesting"}>{status === "requesting" ? "Locating…" : "Use my location"}</button></div>
      {position && <p className="mb-3 text-[10px] text-blue-100/60">Outdoor accuracy ±{Math.round(position.accuracy)} m. GPS does not provide a reliable indoor floor position.</p>}
      {error && <p className="mb-3 flex items-start gap-2 text-[10px] leading-relaxed text-amber-200/80"><ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" />{error}</p>}
      <label className="block"><span className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40"><Navigation className="h-3 w-3" />Confirm current block / floor</span><select value={currentNodeId} onChange={(event) => onManualNodeChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white outline-none focus:border-blue-300/60">{anchoredNodes.map((node) => <option key={node.id} value={node.id} className="bg-slate-900">{node.label}</option>)}</select></label>
      <p className="mt-2 text-[10px] leading-relaxed text-white/40">The blue dot marks the confirmed campus node used as the route start. Choose a node manually when GPS is blocked indoors or the outdoor reading cannot be calibrated to this image.</p>
    </div>
  );
}
