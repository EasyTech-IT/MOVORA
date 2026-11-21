"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapProps = {
  /** Map style URL. Replace with a production tile provider before launch. */
  styleUrl?: string;
  /** [longitude, latitude] */
  center?: [number, number];
  zoom?: number;
  className?: string;
};

/**
 * Reusable MapLibre map component for MOVORA (mobility maps, stops, routes).
 * Prepared for later integration – not yet used on any page.
 */
export function Map({
  styleUrl = "https://demotiles.maplibre.org/style.json",
  center = [10.4515, 51.1657], // Germany
  zoom = 5,
  className,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl());

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className={className ?? "h-96 w-full"} />;
}
