// Ausschließlich Demo-Daten für Oberfläche und Tests. Keine echten Anbieter,
// keine Scores, keine Bewertungen. Echte Daten kommen später aus Supabase.
export type DemoProvider = {
  id: string;
  name: string;
  category: string;
  region: string;
  transport: string[];
  isDemo: true;
};

export const DEMO_PROVIDERS: DemoProvider[] = [
  {
    id: "demo-nord",
    name: "Beispiel Verkehrsverbund Nord",
    category: "Verkehrsverbund",
    region: "Beispielregion Nord",
    transport: ["Bus", "Straßenbahn"],
    isDemo: true,
  },
  {
    id: "demo-sued",
    name: "Beispiel Regionalbahn Süd",
    category: "Regionalverkehr",
    region: "Beispielregion Süd",
    transport: ["Regionalzug"],
    isDemo: true,
  },
  {
    id: "demo-stadt",
    name: "Beispiel Stadtwerke Mitte",
    category: "Stadtverkehr",
    region: "Beispielstadt Mitte",
    transport: ["Bus", "U-Bahn"],
    isDemo: true,
  },
];
