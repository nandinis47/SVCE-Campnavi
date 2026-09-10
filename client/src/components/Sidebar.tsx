/**
 * Sidebar — Glassmorphic building list with search
 * Design: Satellite Explorer
 */
import { useState, useMemo } from "react";
import { Search, MapPin, X, ChevronRight, GraduationCap, FlaskConical, BookOpen, Building2, Library, Trees, TreePine, DoorOpen, ParkingCircle, Shield, Dumbbell, CircleDot, Store, Fence, Bus, Phone, Home, Coffee, Theater, Utensils, Printer, UtensilsCrossed, Play, DoorClosed, Landmark, HeartPulse } from "lucide-react";
import {
  CAMPUS_LOCATIONS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type CampusLocation,
} from "@/lib/campusData";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  FlaskConical,
  BookOpen,
  Building2,
  Library,
  Trees,
  TreePine,
  DoorOpen,
  ParkingCircle,
  Shield,
  Dumbbell,
  CircleDot,
  Store,
  Fence,
  Bus,
  Phone,
  Home,
  Coffee,
  Theater,
  Utensils,
  Printer,
  UtensilsCrossed,
  Play,
  DoorClosed,
  Landmark,
  HeartPulse,
};

interface SidebarProps {
  onSelect: (location: CampusLocation) => void;
  onHover: (location: CampusLocation | null) => void;
  selectedId: string | null;
  onClearFilter: () => void;
  categoryFilter: string | null;
  onCategoryFilter: (cat: string | null) => void;
}

export default function Sidebar({
  onSelect,
  onHover,
  selectedId,
  onClearFilter,
  categoryFilter,
  onCategoryFilter,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() => {
    let results = CAMPUS_LOCATIONS;
    if (categoryFilter) {
      results = results.filter((l) => l.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      );
    }
    return results;
  }, [search, categoryFilter]);

  return (
    <div
      className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ${
        collapsed ? "w-12" : "w-80"
      }`}
    >
      {/* Glassmorphic panel */}
      <div
        className="h-full flex flex-col bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10"
        style={{ boxShadow: "4px 0 30px rgba(0,0,0,0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm tracking-wide">
                  Campus Map
                </h2>
                <p className="text-white/40 text-[10px]">
                  {CAMPUS_LOCATIONS.length} locations
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Search */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              <button
                onClick={() => onCategoryFilter(null)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                  !categoryFilter
                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-transparent"
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onCategoryFilter(key === categoryFilter ? null : key)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all flex items-center gap-1`}
                  style={{
                    backgroundColor:
                      categoryFilter === key
                        ? `${CATEGORY_COLORS[key]}30`
                        : "rgba(255,255,255,0.05)",
                    color: categoryFilter === key ? CATEGORY_COLORS[key] : "rgba(255,255,255,0.5)",
                    border: `1px solid ${
                      categoryFilter === key
                        ? `${CATEGORY_COLORS[key]}50`
                        : "transparent"
                    }`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[key] }}
                  />
                  {label}
                </button>
              ))}
            </div>

            {/* Building list */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">No locations found</p>
                </div>
              )}
              {filtered.map((loc) => {
                const IconComp = ICON_MAP[loc.icon] || MapPin;
                const isSelected = selectedId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => onSelect(loc)}
                    onMouseEnter={() => onHover(loc)}
                    onMouseLeave={() => onHover(null)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg mb-1.5 transition-all duration-150 group ${
                      isSelected
                        ? "bg-amber-500/15 border border-amber-500/30"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[loc.category]}20`,
                        }}
                      >
                        <IconComp
                          className="w-4 h-4"
                          style={{ color: CATEGORY_COLORS[loc.category] }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[loc.category] }}
                          >
                            {loc.number}
                          </span>
                          <p className="text-white text-sm font-medium truncate">
                            {loc.name}
                          </p>
                        </div>
                        <p className="text-white/40 text-[10px] truncate">
                          {loc.description}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 ml-auto shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
