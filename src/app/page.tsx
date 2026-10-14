import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";
import {
  STATUSES,
  STATUS_COLORS,
  summarize,
  type Applicant,
  type Status,
} from "@/lib/applicants";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("rental_data_applicants")
    .select("*")
    .order("created_at", { ascending: false });
  if (status && STATUSES.some((s) => s.value === status))
    query = query.eq("status", status);
  if (q) {
    const term = q.replace(/[%,()]/g, " ");
    query = query.or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }
  const { data, error } = await query;
  const applicants = (data ?? []) as Applicant[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Candidatos de alquiler</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/applicants/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Nuevo
          </Link>
          <form action={logout}>
            <button className="text-sm text-gray-600 hover:underline">
              Salir
            </button>
          </form>
        </div>
      </header>

      <form className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar nombre, email o teléfono"
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
          Filtrar
        </button>
      </form>

      {error && <p className="text-sm text-red-600">Error: {error.message}</p>}

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {applicants.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">
            Sin candidatos todavía.
          </li>
        )}
        {applicants.map((a) => (
          <li key={a.id}>
            <Link
              href={`/applicants/${a.id}`}
              className="flex items-start gap-4 p-4 hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{a.full_name}</p>
                {(a.phone || a.email) && (
                  <p className="truncate text-xs text-gray-400">
                    {[a.phone, a.email].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {summarize(a).map((item, i) => (
                    <span key={item.label}>
                      {i > 0 && " "}
                      <strong className="font-semibold text-gray-900">
                        {item.label}:
                      </strong>{" "}
                      {/[.!?…]$/.test(item.value.trim())
                        ? item.value.trim()
                        : `${item.value.trim()}.`}
                    </span>
                  ))}
                </p>
              </div>
              {a.rating && (
                <span className="text-sm text-amber-500">
                  {"★".repeat(a.rating)}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status as Status]}`}
              >
                {STATUSES.find((s) => s.value === a.status)?.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
