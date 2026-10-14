import Link from "next/link";
import { notFound } from "next/navigation";
import ApplicantForm from "@/components/ApplicantForm";
import { createClient } from "@/lib/supabase/server";
import type { Applicant } from "@/lib/applicants";

export default async function EditApplicant({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("rental_data_applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Volver
      </Link>
      <h1 className="my-4 text-2xl font-semibold">{(data as Applicant).full_name}</h1>
      <ApplicantForm applicant={data as Applicant} />
    </main>
  );
}
