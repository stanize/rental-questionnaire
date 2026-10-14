export type Status =
  "nuevo" | "contactado" | "visita" | "aceptado" | "descartado";
export type Tri = "pendiente" | "si" | "no";

export interface Applicant {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: Status;
  rating: number | null;
  contacted_at: string | null;
  visit_at: string | null;
  job: string | null;
  income_monthly_net: string | null;
  documents_ok: Tri;
  occupants: string;
  move_in_date: string | null;
  long_stay: string | null;
  can_afford: Tri;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const STATUSES: { value: Status; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "visita", label: "Visita" },
  { value: "aceptado", label: "Aceptado" },
  { value: "descartado", label: "Descartado" },
];

export const TRI: { value: Tri; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const STATUS_COLORS: Record<Status, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  contactado: "bg-amber-100 text-amber-800",
  visita: "bg-purple-100 text-purple-800",
  aceptado: "bg-green-100 text-green-800",
  descartado: "bg-gray-200 text-gray-600",
};

const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const triText = (v: Tri) =>
  v === "si" ? "Sí" : v === "no" ? "No" : "Pendiente";

export interface SummaryItem {
  label: string;
  value: string;
}

/** Labelled facts about an applicant, rendered as a paragraph (bold label, plain value). */
export function summarize(a: Applicant): SummaryItem[] {
  const items: SummaryItem[] = [];
  const add = (label: string, value: string | null | undefined) => {
    if (value) items.push({ label, value });
  };
  add("Trabajo", a.job);
  add("Ingresos netos mensuales", a.income_monthly_net);
  add("Justificantes", triText(a.documents_ok));
  add("Ocupantes", a.occupants);
  add("Fecha de entrada", a.move_in_date && fmtDate(a.move_in_date));
  add("Duración", a.long_stay);
  add("Capacidad económica (950 €)", triText(a.can_afford));
  add("Origen", a.source);
  add(
    "Visita",
    a.visit_at &&
      new Date(a.visit_at).toLocaleString("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Europe/Madrid",
      })
  );
  add("Notas", a.notes);
  return items;
}
