/**
 * HoverTooltip — Floating tooltip that follows the hovered marker
 * Design: Satellite Explorer
 */
import { CATEGORY_COLORS, type CampusLocation } from "@/lib/campusData";

interface HoverTooltipProps {
  location: CampusLocation | null;
  position: { x: number; y: number };
}

export default function HoverTooltip({ location, position }: HoverTooltipProps) {
  if (!location) return null;

  const color = CATEGORY_COLORS[location.category];

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 12,
        top: position.y - 12,
        transform: "translateY(-100%)",
      }}
    >
      <div
        className="rounded-lg border border-white/10 px-3 py-2 shadow-lg"
        style={{
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {location.number}
          </div>
          <span className="text-white text-xs font-medium">
            {location.name}
          </span>
        </div>
        <p className="text-white/40 text-[10px] mt-0.5">
          Click to navigate
        </p>
      </div>
    </div>
  );
}
