"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveApplicant, deleteApplicant, type FormState } from "@/app/actions";
import { STATUSES, TRI, type Applicant } from "@/lib/applicants";

const input =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
      {hint && <span className="mb-1 block text-xs text-gray-500">{hint}</span>}
      {children}
    </label>
  );
}

const TABS = [
  { key: "cuestionario", label: "Cuestionario" },
  { key: "valoracion", label: "Valoración" },
  { key: "contacto", label: "Contacto" },
] as const;
type Tab = (typeof TABS)[number]["key"];

const toLocalInput = (iso: string | null) => (iso ? iso.slice(0, 16) : "");

export default function ApplicantForm({ applicant }: { applicant?: Applicant }) {
  const id = applicant?.id ?? null;
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveApplicant.bind(null, id),
    {},
  );
  const a = applicant;
  const [tab, setTab] = useState<Tab>("cuestionario");
  const show = (t: Tab) => (tab === t ? "" : "hidden");

  return (
    <form
      action={action}
      className="space-y-6"
      onInvalidCapture={(e) => {
        const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-tab]");
        if (panel) setTab(panel.dataset.tab as Tab);
      }}
    >
      <div role="tablist" className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section data-tab="contacto" className={`space-y-4 ${show("contacto")}`}>
        <h2 className="text-lg font-semibold">Contacto</h2>
        <Field label="Nombre *">
          <input name="full_name" required defaultValue={a?.full_name} className={input} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teléfono">
            <input name="phone" type="tel" defaultValue={a?.phone ?? ""} className={input} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" defaultValue={a?.email ?? ""} className={input} />
          </Field>
        </div>
        <Field label="Origen" hint="Dónde vio el anuncio (Idealista, Fotocasa, ...)">
          <input name="source" defaultValue={a?.source ?? ""} className={input} />
        </Field>
      </section>

      <section data-tab="valoracion" className={`space-y-4 ${show("valoracion")}`}>
        <h2 className="text-lg font-semibold">Valoración</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Estado">
            <select name="status" defaultValue={a?.status ?? "nuevo"} className={input}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Valoración (1-5)">
            <select name="rating" defaultValue={a?.rating ?? ""} className={input}>
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha de contacto">
            <input
              name="contacted_at"
              type="date"
              defaultValue={a?.contacted_at ?? ""}
              className={input}
            />
          </Field>
        </div>
        <Field label="Visita">
          <input
            name="visit_at"
            type="datetime-local"
            defaultValue={toLocalInput(a?.visit_at ?? null)}
            className={input}
          />
        </Field>
        <Field label="Notas personales">
          <textarea name="notes" rows={5} defaultValue={a?.notes ?? ""} className={input} />
        </Field>
      </section>

      <section data-tab="cuestionario" className={`space-y-4 ${show("cuestionario")}`}>
        <h2 className="text-lg font-semibold">Cuestionario</h2>
        <Field label="Trabajo" hint="¿A qué te dedicas actualmente y cuánto tiempo llevas trabajando allí?">
          <textarea name="job" rows={2} defaultValue={a?.job ?? ""} className={input} />
        </Field>
        <Field label="Ingresos" hint="Ingresos netos mensuales aproximados en total">
          <input
            name="income_monthly_net"
            defaultValue={a?.income_monthly_net ?? ""}
            className={input}
          />
        </Field>
        <Field label="Justificantes" hint="¿Puede aportar nóminas y documentación laboral?">
          <select name="documents_ok" defaultValue={a?.documents_ok ?? "pendiente"} className={input}>
            {TRI.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ocupantes" hint="¿Quiénes vivirían en el piso?">
          <input name="occupants" defaultValue={a?.occupants ?? "Una persona"} className={input} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha de entrada">
            <input
              name="move_in_date"
              type="date"
              defaultValue={a?.move_in_date ?? ""}
              className={input}
            />
          </Field>
          <Field label="Duración del alquiler" hint="¿Busca vivienda de larga estancia?">
            <input name="long_stay" defaultValue={a?.long_stay ?? ""} className={input} />
          </Field>
        </div>
        <Field label="Capacidad económica" hint="¿Le encaja el alquiler de 950 €/mes más gastos y suministros?">
          <select name="can_afford" defaultValue={a?.can_afford ?? "pendiente"} className={input}>
            {TRI.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </section>


      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          Cancelar
        </Link>
        {id && (
          <button
            type="submit"
            formAction={async () => {
              if (confirm("¿Eliminar este candidato?")) await deleteApplicant(id);
            }}
            formNoValidate
            className="ml-auto text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
