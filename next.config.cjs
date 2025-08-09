/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Avoid build failing due to incompatible ESLint runner options in Next 14 + ESLint 9
    ignoreDuringBuilds: true,
  },
  
  // Optimización de imágenes
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimización de producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reducir el tamaño del bundle
  experimental: {
    optimizeCss: true,
  },
  
  webpack: (config, { isServer }) => {
    // For client bundles, hard-block any attempt to include 'undici'
    // This will surface the exact import site during client compilation.
    config.resolve.alias = {
      ...config.resolve.alias,
      ...(isServer ? {} : { undici: false }),
    }
    return config
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig