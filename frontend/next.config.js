/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 在生產建置中忽略 ESLint 錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在生產建置中忽略 TypeScript 錯誤
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
