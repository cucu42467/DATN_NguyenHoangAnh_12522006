import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 使用 webpack 以使 serverExternalPackages 生效
  transpilePackages: ['lucide-react'],
  allowedDevOrigins: ['172.26.83.68', '192.168.1.11', 'localhost'],
  turbopack: {
    root: '.',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  serverExternalPackages: [
    'tailwindcss',
    '@nodelib/fs.scandir',
    'fast-glob',
    'globby',
    'chokidar',
    'picocolors',
    'postcss',
    'autoprefixer'
  ],
};

export default nextConfig;
