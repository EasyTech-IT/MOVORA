import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sicherheitsrelevant: Ohne beide Variablen gibt es keine verifizierbare Session.
// Proxy und geschützte Seiten leiten dann auf den Login um (fail closed).
function isValidSupabaseConfig(url?: string, key?: string) {
  if (!url || !key || key.trim() === "") {
    return false;
  }
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export const hasEnvVars = isValidSupabaseConfig(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
