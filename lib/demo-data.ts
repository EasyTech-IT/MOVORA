// Ausschließlich Demo-Daten für Oberfläche und Tests. Keine echten Anbieter,
// keine Scores, keine Bewertungen. Echte Daten kommen später aus Supabase.
export type DemoProvider = {
  id: string;
  slug: string;
  name: string;
  category: string;
  region: string;
  transport: string[];
  isDemo: true;
};

export const DEMO_PROVIDERS: DemoProvider[] = [
  {
    id: "demo-nord",
    slug: "beispiel-verkehrsverbund-nord",
    name: "Beispiel Verkehrsverbund Nord",
    category: "Verkehrsverbund",
    region: "Beispielregion Nord",
    transport: ["Bus", "Straßenbahn"],
    isDemo: true,
  },
  {
    id: "demo-sued",
    slug: "beispiel-regionalbahn-sued",
    name: "Beispiel Regionalbahn Süd",
    category: "Regionalverkehr",
    region: "Beispielregion Süd",
    transport: ["Regionalzug"],
    isDemo: true,
  },
  {
    id: "demo-stadt",
    slug: "beispiel-stadtwerke-mitte",
    name: "Beispiel Stadtwerke Mitte",
    category: "Stadtverkehr",
    region: "Beispielstadt Mitte",
    transport: ["Bus", "U-Bahn"],
    isDemo: true,
  },
];
