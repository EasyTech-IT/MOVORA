"use client";

import dynamic from "next/dynamic";
import { DemoBadge } from "./demo-badge";

const MapView = dynamic(() => import("@/components/map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-muted" />,
});

export function MapPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <DemoBadge />
        <span className="text-xs text-muted-foreground">Kartenstil: Platzhalter, keine Haltestellendaten</span>
      </div>
      <div className="h-72 w-full overflow-hidden rounded-xl border md:h-96">
        <MapView className="h-full w-full" />
      </div>
    </div>
  );
}
