import { InfoIcon } from "lucide-react";
import { requireClaims } from "@/lib/supabase/require-claims";
import { Suspense } from "react";

// Der Inhalt wird erst gerendert, wenn die serverseitige Session geprüft wurde.
// Ohne gültige Session leitet requireClaims() zum Login um.
async function ProtectedContent() {
  const claims = await requireClaims();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Diese Seite ist nur für angemeldete Nutzerinnen und Nutzer sichtbar.
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Deine Kontodaten</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(claims, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense>
      <ProtectedContent />
    </Suspense>
  );
}
