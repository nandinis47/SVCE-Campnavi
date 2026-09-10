import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a2e]">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
            <AlertCircle className="relative h-16 w-16 text-red-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white/70 mb-4">Page Not Found</h2>
        <p className="text-white/40 mb-8 leading-relaxed">
          The page you are looking for doesn't exist.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Campus Map
        </Button>
      </div>
    </div>
  );
}
