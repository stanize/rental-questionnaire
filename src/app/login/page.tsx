"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    {}
  );
  return (
    <main className="mx-auto mt-24 max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-semibold">Alquiler · Acceso</h1>
      <form action={action} className="space-y-4">
        <input
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="Usuario"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Contraseña"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
