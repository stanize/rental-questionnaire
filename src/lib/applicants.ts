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

const sentence = (s: string) => {
  const t = s.trim();
  return /[.!?…]$/.test(t) ? t : `${t}.`;
};

const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

/** Spanish prose summary of everything known about an applicant. */
export function summarize(a: Applicant): string {
  const parts: string[] = [];
  if (a.job) parts.push(`Trabajo: ${a.job}`);
  if (a.income_monthly_net)
    parts.push(`Ingresos netos mensuales: ${a.income_monthly_net}`);
  if (a.documents_ok === "si") parts.push("Puede aportar los justificantes");
  else if (a.documents_ok === "no")
    parts.push("No puede aportar los justificantes");
  else parts.push("Justificantes pendientes de confirmar");
  if (a.occupants) parts.push(`Ocupantes: ${a.occupants}`);
  if (a.move_in_date)
    parts.push(`Fecha de entrada deseada: ${fmtDate(a.move_in_date)}`);
  if (a.long_stay) parts.push(`Duración: ${a.long_stay}`);
  if (a.can_afford === "si") parts.push("Le encaja el alquiler de 950 €");
  else if (a.can_afford === "no")
    parts.push("No le encaja el alquiler de 950 €");
  else parts.push("Capacidad económica pendiente de confirmar");
  if (a.source) parts.push(`Origen: ${a.source}`);
  if (a.visit_at)
    parts.push(
      `Visita: ${new Date(a.visit_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Madrid" })}`
    );
  if (a.notes) parts.push(`Notas: ${a.notes}`);
  return parts.map(sentence).join(" ");
}
