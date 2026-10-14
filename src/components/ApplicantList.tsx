"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  STATUSES,
  STATUS_COLORS,
  summarize,
  type Applicant,
  type Status,
} from "@/lib/applicants";

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function ApplicantList({
  applicants,
}: {
  applicants: Applicant[];
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const visible = useMemo(() => {
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    return applicants.filter((a) => {
      if (status && a.status !== status) return false;
      const haystack = normalize(
        [a.full_name, a.email, a.phone, a.job, a.source, a.notes, a.occupants]
          .filter(Boolean)
          .join(" ")
      );
      return terms.every((t) => haystack.includes(t));
    });
  }, [applicants, q, status]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar nombre, email, teléfono, trabajo, notas…"
          autoFocus
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-2 text-xs text-gray-500">
        {visible.length} de {applicants.length} candidatos
      </p>

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {visible.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">
            {applicants.length === 0
              ? "Sin candidatos todavía."
              : "Ningún candidato coincide con la búsqueda."}
          </li>
        )}
        {visible.map((a) => (
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
    </>
  );
}
