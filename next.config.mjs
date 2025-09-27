/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure only one instance of Yjs is loaded
      config.resolve.alias = {
        ...config.resolve.alias,
        'yjs': config.resolve.alias.yjs || 'yjs'
      };
    }
    return config;
  }
};

export default nextConfig;
