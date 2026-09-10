/**
 * MiniMap — Bottom-right compass and mini-map indicator
 * Design: Satellite Explorer
 */
import { Compass } from "lucide-react";

export default function MiniMap() {
  return (
    <div className="fixed bottom-4 right-4 z-20">
      <div
        className="rounded-xl border border-white/10 p-3 flex flex-col items-center gap-2"
        style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        {/* Mini drone image preview */}
        <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 relative">
          <img
            src="/manus-storage/1000087507_1e3231b3.jpg"
            alt="Campus overview"
            className="w-full h-full object-cover"
          />
          {/* Camera position indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Compass */}
        <div className="flex items-center gap-2 text-white/40">
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[9px] font-medium">N</span>
        </div>
      </div>

      {/* Controls hint */}
      <div
        className="mt-2 rounded-lg border border-white/10 px-3 py-2"
        style={{
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-white/30 text-[9px] leading-relaxed">
          <span className="text-white/50">Drag</span> to orbit ·{" "}
          <span className="text-white/50">Scroll</span> to zoom ·{" "}
          <span className="text-white/50">Click</span> markers
        </p>
      </div>
    </div>
  );
}
