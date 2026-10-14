import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";
import ApplicantList from "@/components/ApplicantList";
import type { Applicant } from "@/lib/applicants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rental_data_applicants")
    .select("*")
    .order("created_at", { ascending: false });

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

      {error && <p className="text-sm text-red-600">Error: {error.message}</p>}

      <ApplicantList applicants={(data ?? []) as Applicant[]} />
    </main>
  );
}
