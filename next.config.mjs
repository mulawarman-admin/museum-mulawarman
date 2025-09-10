/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Jangan jalankan ESLint saat build di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Jangan blokir build karena error TS di server (tetap tampilkan di editor)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
