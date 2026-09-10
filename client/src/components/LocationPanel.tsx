/**
 * LocationPanel — Detail popup when a marker is clicked
 * Design: Satellite Explorer — glassmorphic floating panel
 */
import { X, Navigation, MapPin, Clock, Users, Phone } from "lucide-react";
import { CATEGORY_COLORS, type CampusLocation } from "@/lib/campusData";

interface LocationPanelProps {
  location: CampusLocation;
  onClose: () => void;
}

export default function LocationPanel({ location, onClose }: LocationPanelProps) {
  const color = CATEGORY_COLORS[location.category];

  return (
    <div
      className="fixed top-20 right-4 z-40 w-72 animate-in slide-in-from-right-4 fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <div
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Color accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: color,
                    color: "white",
                  }}
                >
                  {location.number}
                </span>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {location.category}
                </span>
              </div>
              <h3 className="text-white text-lg font-bold">{location.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {location.description}
          </p>

          {/* Info rows */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Campus Location</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Open: 8:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Users className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Accessible to all students</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all active:scale-95"
              style={{
                backgroundColor: color,
              }}
              onClick={onClose}
            >
              <Navigation className="w-3 h-3" />
              Navigate
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-all active:scale-95"
            >
              <Phone className="w-3 h-3" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
