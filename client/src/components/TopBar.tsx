/**
 * TopBar — Minimal top navigation with title and controls
 * Design: Satellite Explorer
 */
import { Compass, RotateCcw, Maximize2, Info } from "lucide-react";

interface TopBarProps {
  onResetView: () => void;
  onFullscreen: () => void;
}

export default function TopBar({ onResetView, onFullscreen }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div
        className="flex items-center justify-between px-4 py-3 mx-4 mt-3 rounded-xl border border-white/10 pointer-events-auto"
        style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <img
              src="/manus-storage/logo-icon_df12e3de.png"
              alt="Logo"
              className="w-5 h-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">
              Campus 3D Explorer
            </h1>
            <p className="text-white/40 text-[10px]">
              Interactive Navigation Map
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetView}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFullscreen}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 flex items-center justify-center text-amber-400 transition-all active:scale-95"
            title="About"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
