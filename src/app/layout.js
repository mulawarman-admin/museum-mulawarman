export const metadata = { title: "Museum Mulawarman" }; // <- judul default

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

