import { redirect } from "next/navigation";

import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

// Serverseitige Zugriffsprüfung für geschützte Seiten. Der Proxy ist nur
// eine zusätzliche Schicht. Ohne gültige Konfiguration oder Session wird
// immer auf den Login umgeleitet, bevor Seiteninhalte gerendert werden.
export async function requireClaims() {
  if (!hasEnvVars) {
    redirect("/auth/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return data.claims;
}
