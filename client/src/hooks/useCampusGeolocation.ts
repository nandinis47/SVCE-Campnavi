/**
 * useCampusGeolocation — browser GPS access for approximate outdoor positioning.
 * Design: Satellite Explorer — transparent status, explicit indoor fallback.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export type GeolocationStatus = "unsupported" | "idle" | "requesting" | "active" | "denied" | "error";

export interface CampusGeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useCampusGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [position, setPosition] = useState<CampusGeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      setError("This browser does not provide location services.");
      return;
    }
    stop();
    setStatus("requesting");
    setError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (next) => {
        setPosition({ latitude: next.coords.latitude, longitude: next.coords.longitude, accuracy: next.coords.accuracy, timestamp: next.timestamp });
        setStatus("active");
      },
      (nextError) => {
        setStatus(nextError.code === nextError.PERMISSION_DENIED ? "denied" : "error");
        setError(nextError.message || "Unable to read the current location.");
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 },
    );
  }, [stop]);

  useEffect(() => () => stop(), [stop]);
  return { status, position, error, request, stop };
}
