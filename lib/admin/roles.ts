// Rollen und Bereiche des Admin-Bereichs. Spiegelt die Matrix und Routen aus
// docs/ADMIN_MODERATION_ARCHITECTURE.md (§3 und §4). Die Liste der erlaubten
// Rollen ist explizit, weil die Rollen keine lineare Hierarchie bilden
// (z. B. hat data_operator keinen Zugriff auf Benutzerdaten).

export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "moderator",
  "data_operator",
  "support",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super-Admin",
  admin: "Administration",
  moderator: "Moderation",
  data_operator: "Datenbetrieb",
  support: "Support",
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}

export type AdminSection = {
  slug: string;
  label: string;
  description: string;
  allowedRoles: readonly AdminRole[];
  dataBasis: string;
};

export const ADMIN_SECTIONS: readonly AdminSection[] = [
  {
    slug: "benutzer",
    label: "Benutzerverwaltung",
    description: "Profile ansehen und Sperren vorbereiten.",
    allowedRoles: ["support", "admin", "super_admin"],
    dataBasis: "Noch keine Benutzerdaten im Admin-Bereich angebunden.",
  },
  {
    slug: "rollen",
    label: "Rollenverwaltung",
    description: "Admin-Rollen einsehen. Vergabe erfolgt nur durch Super-Admins.",
    allowedRoles: ["admin", "super_admin"],
    dataBasis: "Rollenliste folgt, sobald die Migration angewendet ist.",
  },
  {
    slug: "anbieter",
    label: "Anbieterverwaltung",
    description: "Anbieterdaten prüfen und pflegen.",
    allowedRoles: ["moderator", "admin", "super_admin"],
    dataBasis: "Noch keine Anbieterdaten in der Datenbank angebunden.",
  },
  {
    slug: "datenquellen",
    label: "Datenquellen und Importstatus",
    description: "Mobilitätsdatenquellen und Importläufe.",
    allowedRoles: ["data_operator", "admin", "super_admin"],
    dataBasis: "Noch keine Importläufe vorhanden (siehe MOBILITY_DATA_PLAN.md).",
  },
  {
    slug: "moderation",
    label: "Bewertungsmoderation",
    description: "Gemeldete Bewertungen prüfen und Maßnahmen dokumentieren.",
    allowedRoles: ["moderator", "admin", "super_admin"],
    dataBasis: "Noch keine Bewertungen in der Datenbank.",
  },
  {
    slug: "meldungen",
    label: "Meldungen",
    description: "Eingegangene Meldungen zu Bewertungen triagieren.",
    allowedRoles: ["moderator", "admin", "super_admin"],
    dataBasis: "Noch keine Meldungen vorhanden.",
  },
  {
    slug: "scores",
    label: "Score-Monitoring",
    description: "Score-Berechnungen nur lesend beobachten.",
    allowedRoles: ["data_operator", "admin", "super_admin"],
    dataBasis: "Noch keine Scores berechnet (siehe SCORING_ENGINE.md).",
  },
  {
    slug: "abos",
    label: "Abonnement-Status",
    description: "Abo-Status nur lesend einsehen.",
    allowedRoles: ["support", "admin", "super_admin"],
    dataBasis: "Noch keine Abonnements angebunden (siehe PAYMENT_ARCHITECTURE.md).",
  },
  {
    slug: "audit",
    label: "Audit Log",
    description: "Protokoll aller kritischen Admin-Aktionen.",
    allowedRoles: ["admin", "super_admin"],
    dataBasis: "Das Audit Log wird befüllt, sobald Admin-Aktionen existieren.",
  },
];

export function getAdminSection(slug: string): AdminSection | undefined {
  return ADMIN_SECTIONS.find((section) => section.slug === slug);
}
