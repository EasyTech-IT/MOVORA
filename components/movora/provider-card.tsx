import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoProvider } from "@/lib/demo-data";
import { DemoBadge } from "./demo-badge";

export function ProviderCard({ provider }: { provider: DemoProvider }) {
  return (
    <Card className="h-full transition-shadow duration-300 hover:shadow-md motion-reduce:transition-none">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {provider.isDemo ? <DemoBadge /> : null}
          <span className="text-xs text-muted-foreground">{provider.category}</span>
        </div>
        <CardTitle className="text-lg">{provider.name}</CardTitle>
        <CardDescription>
          {provider.region} · {provider.transport.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Noch keine Bewertung. Für einen Score fehlt die Datengrundlage.
        </p>
      </CardContent>
    </Card>
  );
}
