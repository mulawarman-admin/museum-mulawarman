"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm({ next }: { next: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-bold">Masuk Admin</h1>

      <form
        action="/api/login"
        method="POST"
        onSubmit={() => setLoading(true)}
        className="space-y-3"
      >
        <input type="hidden" name="next" value={next} />

        <label className="block text-sm">Password admin</label>
        <input
          name="password"
          type="password"
          className="w-full rounded-xl border px-3 py-2"
          required
        />

        <button
          className="w-full rounded-xl bg-black py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <div className="text-sm text-neutral-500">
        ← <Link href="/">Kembali ke beranda</Link>
      </div>
    </main>
  );
}
