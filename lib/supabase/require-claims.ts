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

  // redirect() wirft intern, daher bleibt es außerhalb des try-Blocks.
  let claims = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    claims = error ? null : (data?.claims ?? null);
  } catch {
    claims = null;
  }

  if (!claims) {
    redirect("/auth/login");
  }

  return claims;
}
