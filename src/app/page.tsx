export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-left justify-left bg-cover bg-left text-black"
      style={{ backgroundImage: "url('/museumm.jpg')" }}
    >
      <div className="bg-opacity-50 p-8 rounded-lg text-left">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di</h1>
        <h2 className="text-5xl font-extrabold mb-6">Museum Mulawarman</h2>
        <p className="text-lg max-w-xl mb-8">
          Katalog Benda Koleksi
        </p>
        <div className="flex gap-4">
          <a
            href="/koleksi"
            className="px-6 py-3 bg-white border border-bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Lihat Koleksi
          </a>
          <a
            href="/admin"
            className="px-6 py-3 bg-white border border-black rounded-lg hover:bg-white hover:text-black transition"
          >
            Masuk Admin
          </a>
        </div>
      </div>
    </main>
  );
}

