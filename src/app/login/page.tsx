"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const err = sp.get("err") === "1";
  const [pw, setPw] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        method="POST"
        action="/api/login"
        className="w-full max-w-sm border rounded-2xl p-6 bg-white space-y-4"
      >
        <h1 className="text-xl font-bold">Masuk Admin</h1>

        {err && (
          <div className="text-sm text-red-600">
            Password salah. Coba lagi.
          </div>
        )}

        <input type="hidden" name="next" value={next} />

        <div>
          <label className="text-sm block mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Masukkan password admin"
            required
          />
        </div>

        <button
          className="w-full rounded-xl bg-black text-white py-2"
          type="submit"
        >
          Masuk
        </button>
      </form>
    </main>
  );
}
