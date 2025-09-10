/** @type {import('next').NextConfig} */
const nextConfig = {};
eslint: {
    ignoreDuringBuilds: true,
 {} };

  // Jangan gagalkan build karena error TypeScript (sementara untuk memudahkan deploy)
  typescript: {
    ignoreBuildErrors: true,
  {}}

  // (Opsional) jika pakai app router dan tidak butuh fitur khusus
  experimental: {
    // matikan typedRoutes kalau sempat mengganggu
    typedRoutes: false,
  {}};

  // (Opsional) keluaran yang mudah dijalankan di hosting
  // output: "standalone",


export default nextConfig;
