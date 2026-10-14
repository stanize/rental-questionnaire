export type Status = "nuevo" | "contactado" | "visita" | "aceptado" | "descartado";
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
