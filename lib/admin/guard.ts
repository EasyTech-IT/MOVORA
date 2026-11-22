import { notFound } from "next/navigation";

import { isAdminRole, type AdminRole, type AdminSection } from "@/lib/admin/roles";
import { requireClaims } from "@/lib/supabase/require-claims";
import { createClient } from "@/lib/supabase/server";

// Die Rolle wird aus der Tabelle user_roles gelesen, nicht aus dem JWT.
// Ohne Rolle, bei Fehlern oder bei ungültigem Wert antwortet der Server mit
// 404, damit der Admin-Bereich für Nicht-Admins nicht sichtbar ist.
export async function getAdminRole(): Promise<AdminRole> {
  const claims = await requireClaims();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (error || !data || !isAdminRole(data.role)) {
    notFound();
  }

  return data.role;
}

export async function requireSectionAccess(section: AdminSection): Promise<AdminRole> {
  const role = await getAdminRole();

  if (!section.allowedRoles.includes(role)) {
    notFound();
  }

  return role;
}
