/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' || process.platform !== 'win32' ? 'standalone' : undefined,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', 'framer-motion', 'canvas-confetti'],
  },
  transpilePackages: ['@netvision/ui', '@netvision/shared', '@netvision/simulation-engine'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://images.unsplash.com; font-src 'self' data:; connect-src 'self' http://localhost:* https://*.netvision.edu; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
