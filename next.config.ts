import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eigenes Build-Verzeichnis für den Playwright-Server ohne Supabase-Variablen,
  // damit beide Dev-Server nicht um dasselbe .next/dev-Lock konkurrieren.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
