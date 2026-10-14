"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface FormState {
  error?: string;
}

const str = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
};

function parseApplicant(fd: FormData) {
  const rating = str(fd, "rating");
  const visit = str(fd, "visit_at");
  return {
    full_name: str(fd, "full_name"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    source: str(fd, "source"),
    status: str(fd, "status") ?? "nuevo",
    rating: rating ? Number(rating) : null,
    contacted_at: str(fd, "contacted_at"),
    visit_at: visit ? new Date(visit).toISOString() : null,
    job: str(fd, "job"),
    income_monthly_net: str(fd, "income_monthly_net"),
    documents_ok: str(fd, "documents_ok") ?? "pendiente",
    occupants: str(fd, "occupants") ?? "Una persona",
    move_in_date: str(fd, "move_in_date"),
    long_stay: str(fd, "long_stay"),
    can_afford: str(fd, "can_afford") ?? "pendiente",
    notes: str(fd, "notes"),
  };
}

// Allow a plain username (e.g. "rental"): Supabase needs an email, so map it to a fixed internal domain.
const toLoginEmail = (input: string) => {
  const v = input.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@kaminolabs.dev`;
};

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: toLoginEmail(String(fd.get("username") ?? "")),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: "Email o contraseña incorrectos." };
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveApplicant(
  id: string | null,
  _: FormState,
  fd: FormData
): Promise<FormState> {
  const data = parseApplicant(fd);
  if (!data.full_name) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("rental_data_applicants").update(data).eq("id", id)
    : await supabase.from("rental_data_applicants").insert(data);
  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}

export async function deleteApplicant(id: string) {
  const supabase = await createClient();
  await supabase.from("rental_data_applicants").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}
