import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteFooter } from "@/components/movora/site-footer";
import { SiteHeader } from "@/components/movora/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminRole } from "@/lib/admin/guard";
import { ADMIN_ROLE_LABELS, ADMIN_SECTIONS } from "@/lib/admin/roles";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Bereich wird geladen …</p>}>
          <AdminOverview />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function AdminOverview() {
  const role = await getAdminRole();
  const sections = ADMIN_SECTIONS.filter((section) => section.allowedRoles.includes(role));

  if (sections.length === 0) notFound();

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Administration</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ihre Rolle: {ADMIN_ROLE_LABELS[role]}. Alle Aktionen werden protokolliert.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.slug} href={`/admin/${section.slug}`} className="block">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-lg">{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
