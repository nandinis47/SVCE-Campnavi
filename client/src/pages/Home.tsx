/**
 * Home — Main 3D Campus Navigation Page
 * Design: Satellite Explorer — immersive 3D canvas with floating UI
 */
import { useState, useCallback, useMemo } from "react";
import CampusScene from "@/components/CampusScene";
import Sidebar from "@/components/Sidebar";
import LocationPanel from "@/components/LocationPanel";
import TopBar from "@/components/TopBar";
import MiniMap from "@/components/MiniMap";
import HoverTooltip from "@/components/HoverTooltip";
import RoutePanel from "@/components/RoutePanel";
import StudentAI from "@/components/StudentAI";
import { useCampusGeolocation } from "@/hooks/useCampusGeolocation";
import { getRouteNode, getTextRouteSequence, projectRouteToMainAnchors, ROUTE_NODES } from "@/lib/routeGraph";
import type { ShortestRoute } from "@/lib/routeGraph";
import { trpc } from "@/lib/trpc";
import { resolvePlannerNodes } from "@/lib/routePlannerData";
import { getNodeQueryWarning, getRouteQueryErrorMessage } from "@/lib/routePlannerStatus";
import type { CampusLocation } from "@/lib/campusData";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [flyTo, setFlyTo] = useState<CampusLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocation | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [routeOpen, setRouteOpen] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState("main-gate");
  const [routeEnd, setRouteEnd] = useState("college-bus-parking");
  const [routeRequested, setRouteRequested] = useState(true);
  const routeNodesQuery = trpc.campus.nodes.useQuery();
  const plannerNodeData = resolvePlannerNodes(routeNodesQuery.data, ROUTE_NODES);
  const routeNodes = plannerNodeData.nodes;
  const backendRouteQuery = trpc.campus.route.useQuery(
    { startId: currentNodeId, endId: routeEnd },
    { enabled: routeRequested, staleTime: 0 },
  );
  const route = useMemo<ShortestRoute | null>(() => {
    const data = backendRouteQuery.data;
    if (!data) return null;
    return {
      nodeIds: data.nodeIds,
      edges: data.edges,
      totalSteps: data.totalSteps,
      directions: data.directions,
      reviewFlags: data.reviewFlags,
    };
  }, [backendRouteQuery.data]);
  const geolocation = useCampusGeolocation();

  const handleStartChange = useCallback((value: string) => {
    if (!routeNodes.some((node) => node.id === value)) return;
    setCurrentNodeId(value);
    setRouteRequested(false);
  }, [routeNodes]);
  const handleEndChange = useCallback((value: string) => {
    if (!routeNodes.some((node) => node.id === value)) return;
    setRouteEnd(value);
    setRouteRequested(false);
  }, [routeNodes]);
  const handleCalculateRoute = useCallback(() => {
    if (routeRequested) {
      void backendRouteQuery.refetch();
    } else {
      setRouteRequested(true);
    }
  }, [backendRouteQuery, routeRequested]);

  const handleMarkerClick = useCallback((location: CampusLocation) => {
    setSelectedLocation(location);
    setFlyTo(location);
    // Reset flyTo after animation triggers
    setTimeout(() => setFlyTo(null), 1500);
  }, []);

  const handleSidebarSelect = useCallback((location: CampusLocation) => {
    setSelectedLocation(location);
    setFlyTo(location);
    setTimeout(() => setFlyTo(null), 1500);
  }, []);

  const handleHover = useCallback((location: CampusLocation | null) => {
    setHoveredLocation(location);
    if (location) {
      const handleMouseMove = (e: MouseEvent) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);
      // Cleanup after hover ends
      const timeout = setTimeout(() => {
        window.removeEventListener("mousemove", handleMouseMove);
      }, 100);
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedLocation(null);
    setCategoryFilter(null);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#1a1a2e]">
      {/* 3D Canvas — full screen */}
      <div className="absolute inset-0">
        <CampusScene
          onMarkerClick={handleMarkerClick}
          onHover={handleHover}
          flyToLocation={flyTo}
          routePath={route ? { nodeIds: projectRouteToMainAnchors(route.nodeIds) } : null}
          currentLocationNodeId={currentNodeId}
        />
        {/* Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,30,0.4) 100%)'
        }} />
      </div>

      {/* UI Overlays */}
      <TopBar onResetView={handleResetView} onFullscreen={handleFullscreen} />

      <Sidebar
        onSelect={handleSidebarSelect}
        onHover={handleHover}
        selectedId={selectedLocation?.id || null}
        onClearFilter={() => setCategoryFilter(null)}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
      />

      {selectedLocation && (
        <LocationPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      <MiniMap />

      {routeOpen ? (
        <RoutePanel
          startId={currentNodeId}
          endId={routeEnd}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          route={routeRequested ? route : null}
          routeSequence={routeRequested && route ? getTextRouteSequence(currentNodeId, routeEnd, route.nodeIds) : []}
          routeRequested={routeRequested}
          onCalculate={handleCalculateRoute}
          onClear={() => setRouteOpen(false)}
          locationStatus={geolocation.status}
          locationPosition={geolocation.position}
          locationError={geolocation.error}
          onRequestLocation={geolocation.request}
          routeNodes={routeNodes}
          routeLoading={backendRouteQuery.isLoading || backendRouteQuery.isFetching}
          routeError={getRouteQueryErrorMessage(backendRouteQuery.error)}
          routeNodesLoading={routeNodesQuery.isLoading || routeNodesQuery.isFetching}
          routeNodesError={getNodeQueryWarning(routeNodesQuery.error)}
        />
      ) : (
        <button
          onClick={() => setRouteOpen(true)}
          className="fixed left-4 bottom-4 z-40 rounded-xl border border-cyan-300/30 bg-slate-950/90 px-4 py-3 text-xs font-semibold text-cyan-100 shadow-xl backdrop-blur-xl hover:bg-slate-900"
        >
          Open route planner
        </button>
      )}

      <StudentAI
        destinationLabel={routeNodes.find((node) => node.id === routeEnd)?.label ?? getRouteNode(routeEnd)?.label ?? routeEnd}
        route={routeRequested ? route : null}
        routeRequested={routeRequested}
      />

      <HoverTooltip location={hoveredLocation} position={tooltipPos} />
    </div>
  );
}
