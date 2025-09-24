export default function LoginPage({
  searchParams,
}: { searchParams?: Record<string, string | string[] | undefined> }) {
  const next = typeof searchParams?.next === "string" ? (searchParams.next as string) : "/admin";
  const error = searchParams?.error === "1";

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form
        method="POST"
        action={`/api/login?next=${encodeURIComponent(next)}`}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Masuk Admin</h1>

        <label className="text-sm mb-1 block">Password admin</label>
        <input
          name="password"
          type="password"
          className="w-full border rounded-lg px-3 py-2 mb-2"
          required
          autoFocus
        />

        {error && <p className="text-sm text-red-600 mb-2">Password salah. Coba lagi.</p>}

        <button className="w-full rounded-xl px-4 py-2 bg-black text-white">Masuk</button>
        <a href="/" className="text-sm text-neutral-500 inline-block mt-3">← Kembali ke beranda</a>
      </form>
    </div>
  );
}
