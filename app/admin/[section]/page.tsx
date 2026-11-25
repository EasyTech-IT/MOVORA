import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteFooter } from "@/components/movora/site-footer";
import { SiteHeader } from "@/components/movora/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_ROLE_LABELS, getAdminSection } from "@/lib/admin/roles";
import { requireSectionAccess } from "@/lib/admin/guard";

export default function AdminBereichPage({ params }: { params: Promise<{ section: string }> }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Bereich wird geladen …</p>}>
          <AdminSectionContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function AdminSectionContent({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = getAdminSection(slug);
  if (!section) notFound();

  const role = await requireSectionAccess(section);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{section.label}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {section.description} Ihre Rolle: {ADMIN_ROLE_LABELS[role]}.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Datenbasis</CardTitle>
          <CardDescription>Keine Funktion ohne passende Datenbasis.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{section.dataBasis}</p>
        </CardContent>
      </Card>
    </>
  );
}
