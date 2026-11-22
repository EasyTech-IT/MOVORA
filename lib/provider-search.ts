import { DEMO_PROVIDERS, type DemoProvider } from "@/lib/demo-data";

// Demo-Datenmenge ist klein. Produktiv gilt die Standardgröße 20 mit Obergrenze 50.
export const PAGE_SIZE = 2;
const MAX_QUERY_LENGTH = 100;
const MAX_PAGE = 1000;

export type ProviderSearchParams = {
  q?: string;
  verkehrsmittel?: string;
  region?: string;
  seite?: string;
};

export type ProviderSearchResult = {
  items: DemoProvider[];
  total: number;
  page: number;
  pageCount: number;
};

export function parsePage(value: string | undefined): number {
  const page = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, MAX_PAGE);
}

export function searchProviders(params: ProviderSearchParams): ProviderSearchResult {
  const term = (params.q ?? "").trim().slice(0, MAX_QUERY_LENGTH).toLowerCase();
  const transport = params.verkehrsmittel?.trim() ?? "";
  const region = params.region?.trim() ?? "";

  const matches = DEMO_PROVIDERS.filter((provider) => {
    if (transport && !provider.transport.includes(transport)) return false;
    if (region && provider.region !== region) return false;
    if (!term) return true;
    return [provider.name, provider.category, provider.region, ...provider.transport]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(parsePage(params.seite), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: matches.slice(start, start + PAGE_SIZE),
    total: matches.length,
    page,
    pageCount,
  };
}

export function findProviderBySlug(slug: string): DemoProvider | undefined {
  return DEMO_PROVIDERS.find((provider) => provider.slug === slug);
}

export function getFilterOptions() {
  const transports = [...new Set(DEMO_PROVIDERS.flatMap((provider) => provider.transport))].sort();
  const regions = [...new Set(DEMO_PROVIDERS.map((provider) => provider.region))].sort();
  return { transports, regions };
}
