import Link from "next/link";
import ApplicantForm from "@/components/ApplicantForm";

export default function NewApplicant() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Volver
      </Link>
      <h1 className="my-4 text-2xl font-semibold">Nuevo candidato</h1>
      <ApplicantForm />
    </main>
  );
}
