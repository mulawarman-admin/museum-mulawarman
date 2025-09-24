// src/app/layout.js
export const metadata = { title: "Museum Mulawarman" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
